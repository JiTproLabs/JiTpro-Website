#!/usr/bin/env bash
#
# Regenerate a lead-magnet publication cover from its approved PDF.
#
# Design System §20.2.1 requires the cover to be a MECHANICAL RENDER of page 1
# of the approved, committed PDF. It is never recreated, redrawn, or
# approximated in HTML, which is what keeps §48.8 satisfied by construction:
# the image is not a fabrication presented as a capture, it is the publication.
#
# WHEN TO RUN THIS: whenever a new version of an asset's PDF is committed. The
# registry consistency test fails if the cover files named in
# `supabase/functions/_shared/lead-magnet/registry.ts` are missing, so a stale
# or absent cover cannot reach production silently.
#
# DEPENDENCIES ARE DELIBERATELY OUTSIDE THE PROJECT. `pdftocairo` (poppler) and
# Python's Pillow are developer tooling on the machine that runs this script;
# nothing is added to package.json or the lockfile (CLAUDE.md, dependency
# governance).
#
# Usage:
#   scripts/generate-guide-cover.sh <pdf-path> <output-basename>
#
# Example (the Field Guide, version 2026-09):
#   scripts/generate-guide-cover.sh \
#     public/guides/jitpro-construction-procurement-field-guide-2026-09.pdf \
#     field-guide-cover-2026-09

set -euo pipefail

PDF="${1:?usage: generate-guide-cover.sh <pdf-path> <output-basename>}"
BASENAME="${2:?usage: generate-guide-cover.sh <pdf-path> <output-basename>}"
OUT_DIR="public/assets/guides"

[ -f "$PDF" ] || { echo "error: no such PDF: $PDF" >&2; exit 1; }
command -v pdftocairo >/dev/null || { echo "error: pdftocairo (poppler) not found" >&2; exit 1; }

mkdir -p "$OUT_DIR"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# Render page 1 only, at the larger of the two widths, preserving aspect.
pdftocairo -f 1 -l 1 -png -scale-to-x 1600 -scale-to-y -1 "$PDF" "$TMP/page"

SRC="$TMP/page-01.png"
[ -f "$SRC" ] || SRC="$TMP/page-1.png"

SRC="$SRC" OUT_DIR="$OUT_DIR" BASENAME="$BASENAME" python - <<'PY'
import os
from PIL import Image

src, out_dir, basename = os.environ['SRC'], os.environ['OUT_DIR'], os.environ['BASENAME']
image = Image.open(src).convert('RGB')

# The two widths the site's responsive-image convention uses (srcSet 800w/1600w,
# matching HomeHero and MethodSection).
for width in (800, 1600):
    height = round(image.height * width / image.width)
    path = os.path.join(out_dir, f'{basename}-{width}.webp')
    image.resize((width, height), Image.LANCZOS).save(path, 'WEBP', quality=88, method=6)
    print(f'{path}  {width}x{height}  {os.path.getsize(path)} bytes')
PY

echo "Done. Commit the files above, and check registry.ts names them."
