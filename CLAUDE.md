# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

JITpro marketing website — a React SPA built with Vite, TypeScript, and Tailwind CSS. Deployed to GitHub Pages via GitHub Actions on push to `main`.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — production build (output: `dist/`)
- `npm run preview` — preview production build locally
- `npm run lint` — run ESLint (flat config, `eslint.config.js`)
- `npm run typecheck` — run TypeScript type checking (`tsc --noEmit -p tsconfig.app.json`)

## Architecture

- **Framework:** React 18 + React Router v7 (BrowserRouter) + TypeScript
- **Styling:** Tailwind CSS 3 with PostCSS/Autoprefixer
- **Icons:** lucide-react
- **Build:** Vite 5 with `base: '/JiTpro-Website/'` (GitHub Pages subpath)
- **Entry:** `index.html` → `src/main.tsx` → `src/App.tsx`

### Routing

All routes are defined in `src/App.tsx`. Pages live in `src/pages/` and shared layout components (Navigation, Footer) wrap all routes.

Routes: `/`, `/product`, `/how-it-works`, `/roles`, `/why`, `/documentation`, `/about`, `/demo`

### Backend

A Supabase Edge Function (`supabase/functions/submit-demo-request/index.ts`) handles demo request form submissions. It runs on Deno, stores requests in a `demo_requests` table via Supabase REST API, and sends email notifications via Resend. Required env vars: `RESEND_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and deploys to GitHub Pages. Node 20 is used in CI.
