import { existsSync, readFileSync, statSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { GUIDE_COVER_WIDTHS, LEAD_MAGNET_ASSETS, LEAD_MAGNET_IDS, guideCoverPath } from './leadMagnets';

/**
 * Sprint 1b consistency checks (lead-gen plan, Decisions D5.1, D5.2, D5.10).
 *
 * The registry, the committed PDF, `public/_redirects`, and `public/_headers`
 * must agree, and drift must fail CI rather than surface as a broken guide
 * link after a release. These read the repository files directly, so they also
 * catch a file that was renamed or removed by hand.
 */

const REDIRECTS = readFileSync('public/_redirects', 'utf8');
const HEADERS = readFileSync('public/_headers', 'utf8');

function redirectLines(): string[][] {
  return REDIRECTS.split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '' && !line.startsWith('#'))
    .map((line) => line.split(/\s+/));
}

describe.each(LEAD_MAGNET_IDS)('asset consistency: %s', (id) => {
  const asset = LEAD_MAGNET_ASSETS[id];
  const filePath = `public/guides/${asset.fileName}`;

  it('has its versioned PDF committed under public/guides/', () => {
    expect(existsSync(filePath), `${filePath} is missing`).toBe(true);
    expect(statSync(filePath).size).toBeGreaterThan(10_000);
    expect(readFileSync(filePath).subarray(0, 5).toString('latin1')).toBe('%PDF-');
  });

  it('routes the stable path to exactly that file with a 302', () => {
    const rule = redirectLines().find((parts) => parts[0] === asset.publicPath);
    expect(rule, `no _redirects rule for ${asset.publicPath}`).toBeDefined();
    expect(rule?.[1]).toBe(`/guides/${asset.fileName}`);
    expect(rule?.[2]).toBe('302');
  });

  it('places the stable route above the SPA catch-all', () => {
    const order = redirectLines().map((parts) => parts[0]);
    const guideIndex = order.indexOf(asset.publicPath);
    const catchAllIndex = order.indexOf('/*');
    expect(guideIndex).toBeGreaterThanOrEqual(0);
    expect(catchAllIndex).toBeGreaterThanOrEqual(0);
    expect(guideIndex).toBeLessThan(catchAllIndex);
  });

  it('serves the PDF inline, under the clean filename, unindexed, and cached hard', () => {
    const block = HEADERS.split(/\n(?=\S)/).find((section) =>
      section.startsWith(`/guides/${asset.fileName}`),
    );
    expect(block, `no _headers block for /guides/${asset.fileName}`).toBeDefined();
    expect(block).toContain(`Content-Disposition: inline; filename="${asset.downloadFileName}"`);
    expect(block).toContain('X-Robots-Tag: noindex');
    expect(block).toMatch(/Cache-Control: public, max-age=31536000, immutable/);
  });

  /**
   * Design System §20.2.1: the offer band shows a mechanical render of page 1
   * of THIS version of the PDF. These three assertions are what make a stale
   * or missing cover a CI failure instead of a silent visual bug, so a future
   * asset version cannot ship without regenerating the cover
   * (`scripts/generate-guide-cover.sh`).
   */
  it('has both committed cover widths for the publication object', () => {
    for (const width of GUIDE_COVER_WIDTHS) {
      const coverPath = `public/${guideCoverPath(asset, width)}`;
      expect(existsSync(coverPath), `${coverPath} is missing; regenerate the cover`).toBe(true);
      expect(statSync(coverPath).size).toBeGreaterThan(5_000);
      // RIFF....WEBP, so the committed file really is what the srcSet claims.
      const header = readFileSync(coverPath).subarray(0, 12).toString('latin1');
      expect(header.startsWith('RIFF')).toBe(true);
      expect(header.slice(8, 12)).toBe('WEBP');
    }
  });

  /**
   * This is what makes a version bump fail CI. Shipping a new PDF means a new
   * `version`, which means a new `fileName` AND a new `coverBaseName`; the
   * existence test above then fails until the cover is regenerated under the
   * new name. (Modification times cannot carry this: git does not preserve
   * mtimes, so on a fresh CI checkout every file is written at once and their
   * relative order is arbitrary.)
   */
  it('names its cover with the same version label as the PDF', () => {
    expect(
      asset.coverBaseName.includes(asset.version),
      `coverBaseName "${asset.coverBaseName}" does not carry version "${asset.version}"`,
    ).toBe(true);
    expect(
      asset.fileName.includes(asset.version),
      `fileName "${asset.fileName}" does not carry version "${asset.version}"`,
    ).toBe(true);
  });

  it('keeps the SPA catch-all intact for every other route', () => {
    const catchAll = redirectLines().find((parts) => parts[0] === '/*');
    expect(catchAll?.[1]).toBe('/index.html');
    expect(catchAll?.[2]).toBe('200');
  });
});
