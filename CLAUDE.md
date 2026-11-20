# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Design Standards

**Before making any visual change, read `docs/design/JiTpro_Design_System_v1.0.md`.**

That document is the authoritative source of truth for:

- colors and design tokens
- typography
- spacing
- motion and animation
- visual hierarchy
- component styling and consistency
- interaction states
- accessibility expectations

It is not a collection of suggestions. Sections marked **APPROVED** — including all of Part II (Sections 45–49) and Sections 7.7, 8.1.1, 8.8, and 8.9 — are binding on production code.

### Non-negotiable rules

- **Colors come from tokens, never literals.** Production components must not contain Tailwind color utilities (`amber-500`, `text-amber-400`, …), hex values, or `rgba()` color literals — including inside SVG `fill`/`stroke` attributes and inline styles. Reference the approved CSS custom properties instead (§8.8, §8.9, §45).
- **The two approved ambers are** `--jp-brand-amber` (`#F59E0B`, the static brand color) and `--jp-brand-amber-active` (`#FDE68A`, for animated, illuminated, and interactive active states — hover included, per §8.1.1). No third amber exists.
- **Never invent a visual convention inside a React component.** If a needed standard does not exist, update the Design System first, record it in the Decision Log, then write the code (§49).
- **If implementation conflicts with the Design System, fix the implementation.** Do not amend the document to match what the code happens to do, and do not silently introduce a new convention to resolve the conflict (§49.3).
- **A TODO in the document is not permission.** Stop and ask rather than inferring a value from existing code (§41, Appendix C).
- **Animation must communicate, never decorate**, and every element of one animated idea must derive from a single shared animation state (§46).

Existing code predates these standards and does not fully conform. That is a scheduled migration, not a licence to add new violations — new and modified code must conform immediately (§45.5, §49.4).

## Project Overview

JITpro marketing website — a React SPA built with Vite, TypeScript, and Tailwind CSS. Deployed by Cloudflare Pages on push to `main` (see Deployment).

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — production build (output: `dist/`)
- `npm run preview` — preview production build locally
- `npm run lint` — run ESLint (flat config, `eslint.config.js`)
- `npm run typecheck` — run TypeScript type checking (`tsc --noEmit -p tsconfig.app.json`)
- `npm test` — run the Vitest unit tests (`vitest.config.ts`; pure-logic tests under `src/**/*.test.ts` and `supabase/functions/_shared/**/*.test.ts`)

## Dependencies: report only, never correct

**Dependabot maintains this repository's dependencies. Claude does not.** Vulnerability advisories, version bumps, and lockfile changes are handled through Dependabot's own pull requests, which Jeff reviews and merges.

When you encounter a dependency problem, **report it and stop**. Do not fix it. Specifically:

- Do not run `npm audit fix`, `npm update`, `npm install <package>@<version>`, or any command whose purpose is to change an existing dependency's version.
- Do not hand-edit `package.json` or `package-lock.json` to bump, pin, or override a version.
- Do not add exceptions or allowlist entries to `audit-ci.jsonc` to make an advisory pass.
- Do not commit a "chore(deps)" patch, even a lockfile-only one, even when the advisory is pre-existing, even when it blocks the `audit-ci` step in CI.

If `npx audit-ci` or `npm audit` fails, or a build or test failure traces back to a dependency, report: the package, the installed and fixed versions, the advisory identifier, what it blocks, and whether a Dependabot PR already exists (`gh pr list --author app/dependabot`). Then wait for Jeff. If CI is red for this reason, say so; do not work around it.

**The only exception, narrowly.** Adding a *new* dependency is permitted only when it is genuinely required to implement an explicitly approved task. This exception does not permit upgrading, downgrading, replacing, patching, pinning, or otherwise changing existing dependencies to resolve advisories, vulnerabilities, CI failures, audits, compatibility issues, or maintenance concerns. Those remain exclusively with Dependabot. Before adding a new dependency, call it out in the implementation report with the package name and why it was required.

## Architecture

- **Framework:** React 18 + React Router v7 (BrowserRouter) + TypeScript
- **Styling:** Tailwind CSS 4 with CSS-first configuration (`@import 'tailwindcss'` and `@theme` blocks in `src/index.css`; no `tailwind.config.js`). Processed via `@tailwindcss/postcss`.
- **Design tokens:** the approved `--jp-*` custom properties are declared once in `:root` in `src/index.css`, with `@theme inline` aliases (`--color-jp-*`) exposing them as Tailwind utilities. Hex values belong in that `:root` block and nowhere else (Design System §8.8, §45.2).
- **Icons:** lucide-react
- **Build:** Vite 5. Base path is env-driven: `VITE_BASE_PATH` (defaults to `/`). Cloudflare Pages hosts the site at the root, so production and local dev both use the default `/`. (The `/JiTpro-Website/` subpath belonged to the retired GitHub Pages deployment; see Deployment.)
- **Entry:** `index.html` → `src/main.tsx` → `src/App.tsx`

### Routing

All routes are defined in `src/App.tsx`. Pages live in `src/pages/` and shared layout components (Navigation, Footer) wrap all routes.

Routes: `/`, `/product`, `/how-it-works`, `/roles`, `/why`, `/documentation`, `/about`, `/demo`

### Backend

A Supabase Edge Function (`supabase/functions/submit-demo-request/index.ts`) handles demo request form submissions. It runs on Deno, stores requests in a `demo_requests` table via Supabase REST API, and sends email notifications via Resend. Required env vars: `RESEND_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.

## Deployment

**Current (updated 2026-11-20):** the site is hosted on **Cloudflare Pages**.

- **Production:** pushing or merging to `main` triggers a Cloudflare Pages build and deploy. It shows on the commit as the "Cloudflare Pages" check.
- **Previews:** each pull request gets a Cloudflare Pages preview build, reported as a check on the PR.
- **Build settings:** these live in the Cloudflare dashboard, not in this repository. There is no `wrangler` config. Hosting rules ship from `public/_headers` and `public/_redirects`.
- **CI:** `.github/workflows/ci.yml` ("Marketing Site CI", job `build-and-test`) runs on every pull request to `main`: security audit, typecheck, lint, unit tests, build, and a link and image check. It does not deploy. Node comes from `.nvmrc`, currently 24.
- **Merging:** merge pull requests with a squash merge once CI and the Cloudflare Pages preview both pass.

**Deprecated (do not follow):** older guidance said pushing to `main` triggered `.github/workflows/deploy.yml`, which built and deployed to GitHub Pages under the `/JiTpro-Website/` base path, with Node 20 in CI. That workflow was deleted on 2026-07-28 (`c6a0405`, #21), and GitHub Pages no longer serves this site. Kept here for history only.
