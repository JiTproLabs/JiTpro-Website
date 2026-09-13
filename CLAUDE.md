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

JITpro marketing website — a React SPA built with Vite, TypeScript, and Tailwind CSS. Deployed to GitHub Pages via GitHub Actions on push to `main`.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — production build (output: `dist/`)
- `npm run preview` — preview production build locally
- `npm run lint` — run ESLint (flat config, `eslint.config.js`)
- `npm run typecheck` — run TypeScript type checking (`tsc --noEmit -p tsconfig.app.json`)
- `npm test` — run the Vitest unit tests (`vitest.config.ts`; pure-logic tests under `src/**/*.test.ts` and `supabase/functions/_shared/**/*.test.ts`)

## Architecture

- **Framework:** React 18 + React Router v7 (BrowserRouter) + TypeScript
- **Styling:** Tailwind CSS 4 with CSS-first configuration (`@import 'tailwindcss'` and `@theme` blocks in `src/index.css`; no `tailwind.config.js`). Processed via `@tailwindcss/postcss`.
- **Design tokens:** the approved `--jp-*` custom properties are declared once in `:root` in `src/index.css`, with `@theme inline` aliases (`--color-jp-*`) exposing them as Tailwind utilities. Hex values belong in that `:root` block and nowhere else (Design System §8.8, §45.2).
- **Icons:** lucide-react
- **Build:** Vite 5. Base path is env-driven: `VITE_BASE_PATH` (defaults to `/`). The GitHub Pages workflow builds with `VITE_BASE_PATH=/JiTpro-Website/` because that deployment lives at a repo subpath; root hosting and local dev use the default.
- **Entry:** `index.html` → `src/main.tsx` → `src/App.tsx`

### Routing

All routes are defined in `src/App.tsx`. Pages live in `src/pages/` and shared layout components (Navigation, Footer) wrap all routes.

Routes: `/`, `/product`, `/how-it-works`, `/roles`, `/why`, `/documentation`, `/about`, `/demo`

### Backend

A Supabase Edge Function (`supabase/functions/submit-demo-request/index.ts`) handles demo request form submissions. It runs on Deno, stores requests in a `demo_requests` table via Supabase REST API, and sends email notifications via Resend. Required env vars: `RESEND_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and deploys to GitHub Pages. Node 20 is used in CI.
