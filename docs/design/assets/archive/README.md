# Design asset archive

Superseded and unused JiTpro artwork, kept for future pages, marketing, presentations and design experiments. Nothing here is served by the website or built into the application: the archive sits outside `public/` and `src/`. Files are stored with their original bytes and filenames.

Before reusing anything, record the decision in the Design System (`docs/design/JiTpro_Design_System_v1.0.md`, Section 49).

## Homepage

- `homepage/one-project-path.png`: the first artwork supplied for the homepage section *Start with one project. Build a better company.* (2026-11-17), superseded the same day by the approved `docs/design/assets/homepage-one-project/one-project-golden-path.png`. Never served.
- **The previous homepage hero image** (not copied here, to avoid a duplicate): the amber night render of the residence, used in the homepage hero until 2026-11-17, when the sunset residence photograph (`public/assets/hero/luxury-glass-house-at-sunset-*.webp`, source `docs/design/assets/homepage-cinematic-hero/luxury-glass-house-at-sunset.png`) replaced it (commit `0237f70`). The original, `public/assets/hero/house-render.png`, and its served derivatives, `house-render-800.webp` and `house-render-1600.webp`, remain in `public/assets/hero/`, tracked in Git since commit `783b391` (last changed in `f4ca0c9`), because other components still use them (`HomeHero.tsx`, the demo shell and the mobile hero sequence). The hero's previous treatment is preserved in `src/components/home/HomeHero.tsx`.
