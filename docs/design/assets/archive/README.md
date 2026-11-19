# Design asset archive

Superseded and unused JiTpro artwork is kept for future pages, marketing, presentations and design experiments. **Since 2026-11-18 the images themselves are not stored in this repository.** They are in the external JiTpro design archive: the folder `JiTpro_Website_Design_Archive` in the JiTpro OneDrive. Its `Archive_Manifest.md` lists every file with its original repository path, archive path, size and SHA-256 checksum. Every file can also be recovered from Git history at commit `a8c2d5a`, for example `git show a8c2d5a:docs/design/assets/archive/homepage/one-project-path.png > one-project-path.png`.

Only source code and this index remain here. None of it is served by the website or built into the application, because this folder sits outside `public/` and `src/`.

Before reusing anything, record the decision in the Design System (`docs/design/JiTpro_Design_System_v1.0.md`, Section 49).

## Homepage

- **`one-project-path.png`**: the first artwork supplied for the homepage section *Start with one project. Build a better company.* (2026-11-17). The same day, the approved `one-project-golden-path.png` superseded it. It was never served.
  - Formerly `docs/design/assets/archive/homepage/one-project-path.png`.
  - Now in the external archive at `Retired_Concepts/homepage/one-project-path.png`.
- **The previous homepage hero image**: the amber night render of the residence, used in the homepage hero until 2026-11-17.
  - The sunset residence photograph replaced it in commit `0237f70`.
  - The original, `public/assets/hero/house-render.png`, and its WebP versions `house-render-800.webp` and `house-render-1600.webp` remain in `public/assets/hero/`, tracked in Git since commit `783b391`, because other components still use them (`HomeHero.tsx`, the demo shell and the mobile hero sequence).
  - The hero's previous treatment is preserved in `src/components/home/HomeHero.tsx`.

## Architects & engineers page

- **`architects/when-complexity-turns-into-chaos/WhenComplexityTurnsIntoChaos.tsx`**: the section *When Complexity Turns Into Chaos* (the consequences). It was built 2026-11-17 for `/roles/architects-engineers` and removed from the page before review, because its message overlapped the section before it. Archived 2026-11-18 (Design System Section 63).
  - The component source stays here; it was formerly in `src/components/sections/`.
  - Its images are in the external archive, under `Retired_Concepts/architects/when-complexity-turns-into-chaos/`:
    - `production/`: the five illustrations it served, formerly `public/assets/roles/architect-consequences-*.webp`.
    - `reference/`: the approved mockup and clean artwork, formerly `docs/design/assets/architect-consequences/`.
  - The component's header explains how to restore it.
