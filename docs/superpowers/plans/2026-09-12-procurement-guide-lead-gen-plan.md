# Procurement Field Guide Lead-Generation System: Project Plan

| | |
|---|---|
| Status | **Sprint 1a complete and CI-verified on draft PR #52 (2026-09-13). Sprint 1b complete 2026-09-15: the approved 31-page PDF is committed and the stable route, headers, and consistency test are verified on the preview (L-8 done). Sprint 2 targets `jitpro_website`, the website's only Supabase project (G-8, D5.11 as amended 2026-09-14). All four Sprint 2 migrations are **applied to `jitpro_website` and verified** (2026-09-14 and 2026-09-15, records under Sprint 2 in §22), including the sequence-privilege fix `20260914000004`. `submit-lead-magnet-request` is implemented and CI-verified (S2-11 to S2-17); the four `LEAD_MAGNET_*` test-period secrets were set on 2026-09-15 (Step 1). Step 2 is complete: the function is deployed (v1, `ACTIVE`, `verify_jwt: false`) and verified with read-only checks and no-data probes. Step 3, the single controlled integration run `20260915s3`, passed all 19 cases; its 5 contacts, 9 requests, and 11 IP-activity rows remain in place pending Jeff's approval of the cleanup. **Sprint 2 is complete (2026-09-15):** migrations applied and verified, the function deployed (v2) and verified across all 19 cases, the recovery-alert sender corrected (S2-19, S2-20) with delivery to `info@jit-pro.com` manually confirmed by Jeff, and the test contacts and requests removed under the approved guarded cleanup. The 12 IP-activity rows expire on their own. Test mode and the test secrets stay set until go-live (L-6). **Sprint 3 is complete and formally closed (2026-09-16):** the fulfilment and internal-notification email is implemented and deployed (`submit-lead-magnet-request` **v5**, `ACTIVE`, `verify_jwt: false`), controlled run `20260916s3f` passed 9/9, the email presentation was redesigned and approved by Jeff in Outlook desktop as the baseline, S3-2 added an authenticated test-mode-only cooldown bypass, and the approved guarded cleanup ran after a passing read-only gate, leaving `contacts` and `lead_magnet_requests` empty. **Sprints 1 to 5 are complete and closed. Sprint 6 is in progress and the backend is now in PRODUCTION MODE.** L-6 ran successfully on 2026-09-16: the three test secrets removed (15 to 12), `LEAD_MAGNET_IP_SALT` retained, all nine Edge Functions version-bumped with identical bundles and configuration, and the database untouched. Production Turnstile was proven by the dummy token now returning 403, and one real fulfilment to `jeffk@kaufmanbuilding.com` returned `email_status: sent`, with the internal notification delivered to `info@jit-pro.com` and **Jeff confirming receipt of the external email**. **Resumed on the MacBook Pro (2026-09-16): repository and deployed state verified against the break-point record; the `20260916l6prod` verification request and contact removed under the approved guarded cleanup after the gate passed exactly; the Mac `.env` reconciled against the Cloudflare Pages Production values and `.env.local` removed. The database holds no lead-magnet data; the backend stays in production mode with 9 Edge Functions and 12 secrets.** **PR #52 is still a draft and has NOT been merged; the production website does not yet have the feature and no post-merge smoke test has occurred.** The branch is clean, pushed, current with `main`, and CI is green. **Jeff's 21:09 UTC manual browser test from the dev server stored one contact and one request; both were removed under an approved guarded cleanup (21:43 UTC) and the database again holds no lead-magnet data. That test recorded no funnel events; the read-only diagnosis established the root cause (the `sendBeacon` transport's credentialed preflight fails against a CORS helper that grants no credentials, so no event POST is ever sent, and production would lose every event the same way) and the client-only fix shipped in `7097e9d` (keepalive `fetch` with the submission path's headers, no beacon, no query-string key), CI green, verified at 22:22 UTC in a real browser on the MacBook Pro: two preflights and two POSTs answered 204 and exactly the two predicted `lead_magnet_cta_view` rows stored. The two verification events were removed under the approved guarded cleanup at 22:27 UTC and the database again holds no lead-magnet data. The stale Windows PC dev server is retired by Jeff's ruling and `/Users/jeffkaufman/Developer/JiTpro-Website` is the only development working copy. At `898dae1` both checks are green, the branch is synchronized and 0 behind `main`, and every technical prerequisite for marking PR #52 ready is satisfied. Next: mark PR #52 ready on Jeff's instruction, then his explicit merge approval. Do not merge without it.** Dependencies are Dependabot-only (G-6).** |
| Owner / approver | Jeff Kaufman |
| Document created | 2026-09-12 |
| Last updated | 2026-09-16 (**verification events cleaned up; PR-ready prerequisites verified.** The two `lead_magnet_cta_view` rows from the transport verification removed under the approved guarded cleanup at 22:27 UTC; database holds no lead-magnet data; backend unchanged and in production mode; both checks green at `898dae1`; the Windows PC's stale dev server retired and the Developer clone declared the only working copy; PR #52 still draft and unmerged; the production website does not yet have the feature) |
| Working branch | `feature/navigation-simplification-lead-gen-guide` (decision G-1, 2026-09-12) |
| Source of truth | This document. When a decision is made it is recorded here and not revisited without cause. |

This document is the durable plan for turning the JiTpro Field Guide PDF into the first asset of a reusable website lead-magnet system. It is updated throughout the project: decisions go into the Decision Log, architecture changes go into Section 4, sprint completions go into Section 22, and new questions go into Section 21.

---

## 1. Project objective

JiTpro has produced a downloadable lead magnet:

**What Will Stop Work Six Months From Now?**
**The JiTpro Field Guide to Construction Procurement Control**

The website will offer the guide in exchange for an email address. The business objective is to convert anonymous visitors into identifiable prospects, record where each lead came from, fulfil the guide immediately and by email, and measure the funnel.

The system is built as a reusable capability, not a one-off form:

**Lead magnet → Lead capture → Fulfilment → Attribution → Follow-up → Conversion**

The Field Guide is the first asset. Future assets (worksheets, self-assessments, checklists, templates, other guides) should be addable by configuration plus a PDF, without rebuilding the pipeline.

Version 1 is deliberately small. It must not close off reuse, and it must not over-engineer for reuse that has not been requested.

## 2. Business outcome (definition of success)

The project succeeds when all of the following are true:

1. A visitor can clearly discover the Field Guide on the site.
2. The value proposition is understandable without reading the PDF.
3. The visitor can request it with minimal friction (email only).
4. JiTpro reliably records the request.
5. JiTpro captures useful attribution (placement, page, source, campaign).
6. The visitor receives immediate access to the PDF.
7. The visitor receives a reliable email containing a stable link to the guide.
8. The experience works on desktop, tablet, and mobile.
9. The experience is accessible (keyboard, screen reader, contrast, focus).
10. Failures are handled intelligently; the visitor is never left unsure whether the request succeeded.
11. The funnel is measurable: CTA, page, source, and downstream conversion.
12. A second lead magnet can be added by configuration and a PDF.
13. Existing website functionality (contact form, navigation, homepage, Learn More) is not disrupted.
14. Another engineer can understand and maintain the system from this document and the code.

Out of scope unless explicitly approved (from the brief, Section 35): CRM implementation, marketing-automation migration, lead scoring, multi-touch attribution, personalised content, accounts or authentication, DRM, one-time PDF tokens, download protection, a complete nurture campaign, website redesign, rewriting the guide, unrelated contact-form or email-system changes.

---

## 3. Current-state architecture (repository discovery, 2026-09-12)

Everything below was verified against the working tree at `8a111f3` on `feature/navigation-simplification-lead-gen-guide`, `origin/main` at `fa25e24`, the live site, the GitHub ruleset, and the linked Supabase project. Where CLAUDE.md disagrees with reality, reality is recorded and the discrepancy is noted.

### 3.1 Framework and application

- React 18, TypeScript (strict, `noUnusedLocals`, `noUnusedParameters`), Vite 8, Tailwind CSS 4 in CSS-first mode (`@import 'tailwindcss'` and `@theme` in `src/index.css`, no `tailwind.config.js`), React Router 7 `BrowserRouter`, lucide-react icons, framer-motion present in dependencies, `@supabase/supabase-js` present but forms call edge functions with plain `fetch`.
- Entry: `index.html` → `src/main.tsx` → `src/App.tsx`. All routes are declared in `src/App.tsx`. Main-site routes are wrapped by `MainLayout` (Navigation, `<main>`, Footer). The catch-all `*` route renders `Home`; there is no 404 page.
- Design tokens: `--jp-*` custom properties declared once in `:root` in `src/index.css`, exposed to Tailwind via `@theme inline` aliases (`bg-jp-surface`, `text-jp-text-muted`, and so on). Approved tokens: `--jp-brand-amber`, `--jp-brand-amber-active`, `--jp-success`, `--jp-background`, `--jp-surface`, `--jp-text-primary`, `--jp-text-secondary`, `--jp-text-muted`, `--jp-border`, `--jp-surface-light`, `--jp-ink-secondary`. **No error, warning, or info token is approved** (Design System §8.3; the contact form's error box uses neutral tokens for this reason).
- Fonts: Inter Tight (headings), Inter (body), JetBrains Mono (eyebrows and data), loaded from Google Fonts in `src/index.css`.

### 3.2 Hosting and deployment

- **Cloudflare Pages** project `jitpro-website` serves **https://jit-pro.com** and deploys automatically from `main`. Every PR gets a preview deployment. This is documented in `docs/CONTRIBUTING.md` and confirmed by live response headers (`server: cloudflare`).
- `public/_redirects` contains the SPA fallback `/*  /index.html  200`. `public/_headers` sets `X-Robots-Tag: noindex, nofollow` on `/review/*`. Both are Cloudflare Pages conventions and are the available mechanism for host-level redirects and headers.
- **CLAUDE.md is stale on deployment.** `.github/workflows/deploy.yml` (GitHub Pages) was deleted in PR #21. There is no GitHub Actions deploy. `VITE_BASE_PATH` still exists in `vite.config.ts` but production uses the default `/`.
- No `functions/` directory exists, so Cloudflare Pages Functions are not in use. Server-side capability today is entirely Supabase Edge Functions.
- Rollback: revert the PR on GitHub (preferred) or roll back in the Cloudflare dashboard as a stopgap (CONTRIBUTING.md).
- Uptime monitoring: Pulsetic, alerts to Tech@jit-pro.com.
- No `robots.txt` and no `sitemap.xml` exist in `public/`.

### 3.3 Backend: Supabase project `jitpro_website` (ref `pynjyrvnokfexyudimsn`)

Deployed edge functions (verified with `supabase functions list`, 2026-09-12):

| Function | Purpose | Notes |
|---|---|---|
| `submit-contact` | Contact form intake | Verifies Turnstile server-side, inserts the request body into `leads` with the service-role key. No server-side field validation, no honeypot check, no rate limit. `verify_jwt: false`. |
| `send-contact-notification` | Triggered by a **database webhook** on `leads` INSERT | Sends an internal email to `info@jit-pro.com` and a visitor confirmation email via Resend. The webhook itself is configured in the Supabase dashboard, not in the repository. |
| `submit-investor-request`, `approve-investor`, `verify-investor-token`, `revoke-investor`, `list-investor-requests` | Investor access system | Investor intake includes a server-side honeypot check and Turnstile. |

**Not deployed:** `supabase/functions/submit-demo-request/index.ts` exists in the repo and is described in CLAUDE.md, but it is not deployed. The `/demo` page posts to it, so that form is very likely non-functional in production. This is outside this project's scope and is recorded here so it is not lost.

Edge-function conventions worth reusing: `crypto.randomUUID()` request id in every log line, CORS preflight handling, generic error strings to the client with detail only in logs, `Promise.allSettled` for parallel email sends, HTML-escaping of user input via `jsr:@std/html/entities` before it enters an email.

### 3.4 Data storage

| Table | Migration in repo | Schema (as known) |
|---|---|---|
| `leads` | **No** (created outside the repo) | `id` (integer), `created_at`, `role`, `first_name`, `last_name`, `email`, `message`, `intent`, `source`, `page`, plus legacy nullable qualification columns (`phone`, `company`, `has_project`, `project_*`, `user_role`, `procurement_method`, `schedule_call`, `timestamp`). RLS enabled; only the service role writes. |
| `demo_requests` | Yes (2026-01-26) | `id` uuid, `name`, `company`, `email`, `phone`, `role`, `status`, `created_at`. RLS enabled, anonymous insert policy removed. |
| `investor_access` | Yes (2026-04-02) | `id` uuid, `name`, `email`, `company`, `investment_interest`, `status`, `access_token`, timestamps. RLS enabled. |
| `profiles` | **No** (created outside the repo; found in the 2026-09-14 inspection) | `id` uuid, `email`, `name`, `company`, `role`, `created_at`. RLS enabled with own-profile SELECT and UPDATE policies. |

*Correction from the 2026-09-14 inspection (§22, Sprint 2):* `demo_requests` does **not** exist in `jitpro_website` even though its migrations are in the repository, and the project has no migration history table at all.

There is no contacts or people table, no unique constraint on email anywhere, and no consent or suppression columns. The contact form stores hard-coded attribution: `source='website'`, `page='/contact'`, `intent='contact'`.

### 3.5 Transactional email

- Provider: **Resend**, called directly with `fetch` from edge functions using `RESEND_API_KEY`.
- Senders in use: `JiTpro <info@jit-pro.com>` (visitor-facing confirmation), `JITpro Leads <jeff@jit-pro.com>` (internal contact notification), `JITpro Demo Requests <jeff@jit-pro.com>` (undeployed demo function), `JiTpro Investor Requests <noreply@mail.jit-pro.com>` (investor). Both `jit-pro.com` and `mail.jit-pro.com` therefore appear to be verified sending domains; this should be confirmed in the Resend dashboard before relying on it. **Corrected 2026-09-15:** only `jit-pro.com` is verified in the marketing-site Resend account. Resend rejected a `noreply@mail.jit-pro.com` send with 403 *Domain not verified* during Step 3, so the investor functions' senders are affected too (F-8).
- Visitor email template pattern: a 600px table layout, logo at `https://jit-pro.com/assets/logo/jitpro-logo-email.png`, sans-serif, signed by Jeff. HTML only; no plain-text part; no unsubscribe link (all current email is transactional).
- No test-address convention exists in code. Nothing prevents development sends from reaching real addresses other than care.

### 3.6 Environment variables and secrets (existing)

| Name | Where | Purpose | Status |
|---|---|---|---|
| `VITE_SUPABASE_URL` | Browser build (Cloudflare Pages env, local `.env.local`) | Edge-function base URL | Exists |
| `VITE_SUPABASE_ANON_KEY` | Browser build | Sent as `apikey`/bearer to functions | Exists |
| `VITE_TURNSTILE_SITE_KEY` | Browser build | Turnstile widget | Exists. Per CONTRIBUTING.md the widget only works on the live hostname, so the site key's allowed hostnames likely exclude `*.jitpro-website.pages.dev`. |
| `RESEND_API_KEY` | Supabase secrets | Email sending | Exists |
| `TURNSTILE_SECRET_KEY` | Supabase secrets | Server-side Turnstile verification | Exists |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`, `SUPABASE_DB_URL` | Supabase (platform-provided) | Function access to the database | Exists |
| `ADMIN_PASSWORD`, `SITE_URL` | Supabase secrets | Investor admin flow; `SITE_URL` defaults to `https://jit-pro.com` | Exists |

`.env.local` is git-ignored. No secrets are committed. GitHub secret scanning and push protection are on.

### 3.7 Analytics and attribution

- **There is no analytics of any kind.** No Google Analytics, Tag Manager, Plausible, PostHog, Fathom, or Cloudflare Web Analytics beacon appears in the source or in the live HTML. There are no event-naming conventions to follow.
- No UTM parameter handling, no first-landing-page capture, no referrer capture exists anywhere in the site.
- Cloudflare Web Analytics can be enabled on the Pages project from the Cloudflare dashboard without a code change; it is not currently enabled (no beacon in the served HTML).

### 3.8 Privacy, consent, and compliance

- **No privacy policy page exists.** `/privacy` returns the homepage via the catch-all route. No form on the site carries consent or data-use language. No unsubscribe mechanism exists because no marketing email is sent today.
- The footer carries no legal links. The only external link is LinkedIn.

### 3.9 Forms, validation, bot protection, error handling

- Contact form (`src/pages/contact/Contact.tsx`, `submitContact.ts`): client-side `required` and `type="email"`; a client-only honeypot input; Cloudflare Turnstile rendered as a visible dark-theme widget via `src/components/Turnstile.tsx` (`render=explicit`, script loaded in `index.html`); submit disabled until a token exists; errors shown in a `role="alert"` box using neutral tokens; success navigates to `/thank-you`.
- Server-side: Turnstile verification is the only protection. No email-format validation, no rate limiting, no duplicate handling, no server honeypot on `submit-contact` (the investor function has one).
- `/demo` form has an inline `submitted` success state (a second pattern, but its backend is not deployed).

### 3.10 Reusable UI patterns

- **Dialog:** `src/components/demo/DemoLightbox.tsx` uses a native `<dialog>` opened with `showModal()`. The platform provides focus trapping, background inertness, Escape handling (routed through `cancel` so focus restores), and top-layer stacking. It adds backdrop-click close, body scroll lock, and returns focus to the trigger (in `DemoScreenFrame.tsx`). Its styles are scoped to the demo system (`jpd-lightbox*` in `src/components/demo/tokens.css`). There is no general-purpose modal component, and **Design System §28 (Modals) is entirely TODO.**
- **Buttons:** there is no shared Button component. The primary amber action is repeated inline in `HomeHero`, `HomeFinalCTA`, `LearnMoreShell.PrimaryAction`, `Contact`, and `ThankYou` with a consistent class recipe: `rounded-xl bg-jp-brand-amber text-jp-background hover:bg-jp-brand-amber-active focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-jp-text-primary motion-reduce:transition-none`. The quiet text-link secondary treatment is specified in the Decision Log entry of 2026-09-03 (ChevronRight 15px, underline, `--jp-text-secondary` at rest, hover to `--jp-brand-amber-active`).
- **Form fields:** the contact form's input recipe (`rounded-lg border border-jp-border/30 bg-jp-surface ... focus:border-jp-brand-amber focus:ring-2 focus:ring-jp-brand-amber-active/30`) is the only field convention in production. **§24 (Forms) is TODO.**
- **Sections:** `px-6 sm:px-8 lg:px-10`, `max-w-7xl`, `py-20 sm:py-24 lg:py-28`; hairlines `border-jp-border/12`; surfaces carry narrative acts (§48.6, §50.7).
- **Cards:** §27.1 default card is approved: `--jp-surface` on `--jp-background`, 1px `--jp-border` at 15%, `rounded-2xl`, padding 24/32/40px.

### 3.11 Responsive and accessibility conventions

- Tailwind breakpoints `sm md lg xl`. Design System §35.1 requires desktop-first design and review at 1920, 1440, 1280, tablet landscape and portrait, mobile landscape and portrait.
- Accessibility conventions in use: `role="alert"` for form errors, `sr-only` prefixes on ordinals, `aria-labelledby` on sections, `aria-hidden` on decorative icons, `--jp-text-primary` focus outlines with offset, `prefers-reduced-motion` handling everywhere motion exists, `<meta name="robots">` on unlisted pages.
- **Open TODOs that affect this project:** §36 WCAG target (AA is implied by §8.7), minimum touch target (§34/§36, noted as unresolved in the 2026-09-03 log entry), form accessibility standard (§24), error style (§33), loading style (§32).

### 3.12 Testing and CI

- **At discovery, no test framework was installed.** No Vitest, Jest, Playwright, or Testing Library, and no `test` script. *(Superseded in Sprint 1a, 2026-09-12: Vitest 5 is installed, `npm test` runs `vitest run`, and CI runs it between lint and build. See Section 22, Sprint 1a.)*
- CI (`.github/workflows/ci.yml`, job `build-and-test`, PR-only): `npm ci` → `audit-ci` (high/critical) → `npm run typecheck` → `npm run lint` → (`npm test`, added in Sprint 1a) → `npm run build` → lychee offline link and asset check over `dist/`. Because the workflow is PR-only, CI does not run on pushes to the feature branch; it first runs when a pull request is opened.
- Baseline on this branch: typecheck clean; lint 0 errors and 4 pre-existing `react-refresh/only-export-components` warnings.
- Local tooling: Node 24.19 (`.nvmrc` = 24), Google Chrome, Playwright Chromium headless shells cached (used for reduced-motion verification), the gstack `browse` skill. **Deno is not installed**, so edge functions cannot be executed locally without adding it. **Wrangler is not installed.** The Supabase CLI (v2.116) is installed as a dev dependency and is authenticated to the linked project.

### 3.13 Git and GitHub governance

- Repository `JiTproLabs/JiTpro-Website`, public, default branch `main`.
- Ruleset **"Protect Main Branch"** (active, no bypass actors): pull request required; **squash merge only**; required status check `build-and-test` with the strict policy (the branch must be up to date with `main` before merging); all review threads must be resolved; extra approval required for unattributed changes; no force pushes; no deletion. Zero approving reviews are required.
- Branch prefixes (CONTRIBUTING.md): `feature/`, `fix/`, `chore/`, `docs/`.
- Current state: `feature/navigation-simplification-lead-gen-guide` is checked out, clean, in sync with its upstream, and one commit ahead of `main` (`8a111f3 WIP: update homepage method section`, which deletes a figcaption in `MethodSection.tsx` and is unrelated to lead generation). `main` equals `origin/main`. No open PRs at discovery. Draft PR #52 was opened 2026-09-13 (G-7).
- Squash merging means the eventual PR lands as one commit on `main` regardless of how commits are organised on the branch. Commit hygiene on the branch still matters for review.

### 3.14 Design System constraints that directly govern this project

| Rule | Effect on this project |
|---|---|
| §20.1 Homepage messaging | The word **"procurement"** may not appear in homepage-facing copy. The guide's subtitle contains it. Homepage CTA and any modal copy shown on the homepage must lead with the main title, *What Will Stop Work Six Months From Now?*, or an exception must be approved. |
| §50.2 | §20.1 applies in full to `/learn-more`. |
| §48.1 | One primary amber action per surface. A guide CTA on a surface that already has one must be quiet, or live in its own surface. |
| §50.5 | On `/learn-more`, every primary action must carry the same label and destination, and the page carries at most one secondary action (already used by *Start the guide*). **Any guide CTA on Learn More requires an approved amendment to §50.5.** |
| §7.7 | Sentence case; no em dashes in customer-facing copy (Decision Log 2026-09-03); 52 to 62 character measure; left-aligned body copy. |
| §8.3, §8.8, §8.9 | No error color exists. Errors must be carried by text, icon, and placement using neutral tokens, or a semantic error token must be approved first. |
| §28, §24, §32, §33, §34, §36 | Modals, forms, loading, errors, touch targets, and WCAG target are TODO. Per §41 stop conditions the relevant conventions must be **proposed and approved in the Design System before the component is written** (§49.1). |
| §46 | Any animation (dialog entrance, submitting state) must communicate, derive from one state, and respect reduced motion. |
| §48.7 | Amber is scarce per surface. The CTA band and the dialog each get a small amber budget. |
| Standing homepage constraints (Jeff, 2026-08) | No nav CTA; plan-then-approve for every homepage change; the homepage composition is itself "compression in progress" with slots 04 and 05 served by stand-ins. |

---

## 4. Architecture (DECIDED across Rounds 1 to 6; no item in this section remains pending)

### 4.1 Overview

```
Visitor on jit-pro.com
  │
  ├─ sees LeadMagnetCTA (homepage band / Learn More band / footer link)   [funnel: cta_view, cta_click]
  │
  ├─ LeadMagnetDialog (native <dialog>, lazy-loaded)                      [form_view]
  │     └─ LeadCaptureForm: email + honeypot + Turnstile (interaction-only)
  │           └─ submitLeadMagnetRequest() → POST /functions/v1/submit-lead-magnet-request
  │                                                                        [form_submit]
  ├─ Edge function
  │     1. validate (JSON, honeypot, email syntax, asset id, Turnstile)
  │     2. rate-limit (recent requests per email and per IP hash)
  │     3. upsert contact (by normalised email)
  │     4. insert lead_magnet_request (attribution, asset version)
  │     5. send fulfilment email via Resend; record send status on the row
  │     6. optional internal notification
  │     7. respond { ok, request_id, email_sent, guide_url }
  │
  ├─ Success state in the dialog: "Your guide is ready." + Download button  [request_success]
  │     └─ opens the stable guide URL in a new tab                         [download_click]
  │
  └─ Email: "Your JiTpro Construction Procurement Field Guide" → stable guide URL

Stable guide URL  /guides/procurement  ──(Cloudflare _redirects 302)──►  /guides/<versioned-file>.pdf
```

### 4.2 Frontend (React)

Proposed files, following existing folder conventions (`src/components/<feature>/`, `src/content/` for copy and configuration):

| File | Responsibility |
|---|---|
| `src/content/leadMagnets.ts` | Client-side registry: id, version label, display title, short title, description, CTA label, dialog copy, success copy, public guide path, analytics key. One entry per asset. All visitor-facing copy lives here (copy governance in one place, per the Learn More precedent). |
| `src/components/lead-magnet/LeadMagnetCTA.tsx` | The offer as a band (homepage, Learn More) or as a text link (footer). Takes `asset` and `placement`. Opens the dialog. |
| `src/components/lead-magnet/LeadMagnetDialog.tsx` | Native `<dialog>` with `showModal()`, following `DemoLightbox` behaviour (Escape via `cancel`, backdrop click, scroll lock, focus return). Lazy-loaded so the homepage bundle does not grow until a CTA is clicked. |
| `src/components/lead-magnet/LeadCaptureForm.tsx` | Email field, honeypot, Turnstile, submit; owns the state machine `idle → submitting → success | error`; inline success and error states. Reusable inside the dialog or on a landing page. |
| `src/components/lead-magnet/useAttribution.ts` | Captures UTM parameters, referrer, and first landing path on first load into `sessionStorage`; exposes the attribution object plus current page and placement at submit time. |
| `src/components/lead-magnet/submitLeadMagnetRequest.ts` | API client (mirrors `submitContact.ts`). |
| `src/components/lead-magnet/funnel.ts` | Thin analytics helper (D4.1, D4.2): sends one of the seven funnel events to `record-lead-magnet-event` with `navigator.sendBeacon` (fetch keepalive fallback); deduplicates `cta_view` per placement per session with a `sessionStorage` flag that never leaves the browser; never sends identifiers or personal data. |
| `src/pages/FieldGuide.tsx` (route `/field-guide`, decided D1.1) | Campaign landing route rendering the same form inline. Also the no-JavaScript fallback destination for CTAs. Sets its own title and meta description (Section 25.4). |
| `src/pages/Privacy.tsx` (route `/privacy`, decided D3.7) | The privacy notice (Section 27), linked from the form's fine print and the footer. |
| `src/content/consentTexts.ts` | Versioned consent sentences (D3.10). A used version is never edited; a wording change adds a new version id. Mirrored by the server registry. |

Turnstile: reuse `src/components/Turnstile.tsx`, extended to accept `appearance: 'interaction-only'` so the widget is invisible unless Cloudflare needs a challenge. This keeps the dialog to one visible field.

### 4.3 Backend (Supabase Edge Function)

`supabase/functions/submit-lead-magnet-request/index.ts` (Deno), plus `supabase/functions/_shared/lead-magnet/` for pure, testable logic (validation, normalisation, attribution parsing, email template rendering, asset registry). The shared modules use no Deno-specific APIs so Vitest can test them from the Node toolchain.

Registry (as built in Sprint 1a, superseding the two-registry design): `supabase/functions/_shared/lead-magnet/registry.ts` is the **single** source of truth for asset id, version, versioned filename, stable public path, clean download filename, landing path, page count, titles, email subject and preheader, and the placement list. The site imports that module directly from `src/content/leadMagnets.ts` (Vite and `tsc` follow the import; the module uses no Deno-specific or browser-specific APIs), so client and server agree by construction rather than by a test. The site module adds the visitor-facing copy. Versioned consent texts live beside it in `consentTexts.ts` with a site-side re-export. Tests cover the registry's invariants, the approved copy, the §20.1 and §7.7 governance rules, and frozen copies of every released consent text.

Why an edge function rather than a Cloudflare Pages Function (DECIDED D5.9): the secrets, database access, Resend integration, logging conventions, and the team's operational familiarity all already live in Supabase. Adding a second serverless platform for one endpoint creates a second place to manage secrets and deploys. Cloudflare Pages Functions are not introduced.

**Fail-open ordering inside the function (D5.6):** the guide URL is known from the registry before any I/O, so the response can always include it. The function attempts persistence, then email, and reports each outcome honestly in the response; a persistence failure produces an internal failure alert and still returns the guide URL.

**Backend environment (G-8, D5.11 as amended 2026-09-14):**

> **The JiTpro marketing website uses `jitpro_website` as its only Supabase project. JiTpro product-application Supabase projects are separate infrastructure and must not be used for website development, testing, migrations, functions, or storage.**

- There is **no website staging project** and none is created. This is a deliberate simplification: website backend changes are infrequent, and a second project would add cost, configuration, environment syncing, and a promotion workflow that the website does not need.
- `jitpro-staging`, `jitpro-sandbox`, and every other product-application project are out of bounds for this work. They are not inspected or modified unless Jeff explicitly asks.
- All lead-magnet backend work is introduced into `jitpro_website` **additively and in isolation**: new tables (`contacts`, `lead_magnet_requests`, `lead_magnet_ip_activity`, later `lead_magnet_events`) and new functions (`submit-lead-magnet-request`, later `record-lead-magnet-event`) only. The existing `leads` table, its database webhook, `submit-contact`, `send-contact-notification`, the investor functions, `demo_requests`, `investor_access`, and all existing data are not touched without Jeff's explicit approval. No destructive migration, and no rename, drop, truncate, rewrite, or repurposing of an existing object.
- Testing happens on that same project under the safeguards in Section 15.2: inspection before any migration, Jeff's approval of each exact change set, `LEAD_MAGNET_TEST_MODE` while testing, identifiable test data, and no visitor-facing CTA in production until the backend is verified. There is no staging-to-production promotion step.

A second, deliberately tiny function `supabase/functions/record-lead-magnet-event/index.ts` (D4.1) accepts one funnel event, validates the event name, asset, placement, and page path against fixed allow-lists, truncates strings, inserts one row into `lead_magnet_events`, and returns 204. It stores no identifiers and reads nothing back.

### 4.4 Storage (DECIDED, Round 2, 2026-09-12)

Two new tables, created by migrations in this repository. The conceptual model is fixed and must stay clear throughout implementation:

| Table | Answers | Rule |
|---|---|---|
| `contacts` | **Who is this person?** | One row per normalised unique email (the Edge Function normalises before writing; the database enforces uniqueness and rejects a non-normalised value, S2-2). Identity, first/last seen, first-touch attribution, consent and subscriber state. Designed to carry identity and consent state as the system grows. |
| `lead_magnet_requests` | **What did this person request or do?** | One row per valid request. Asset id and version, request time, placement, approved attribution, fulfilment and email outcome, repeat-request state, and the foreign key to `contacts`. |
| `leads` (existing) | The current contact and conversation-form pipeline | **Separate and unchanged in V1.** Guide requests never touch it. Its database webhook and email behaviour must not be disturbed. |

Identity and events are never collapsed into one table. Example of one contact over time:

```
john@abccontracting.com  (contacts, one row)
    ├─ requested the Field Guide from the homepage           (lead_magnet_requests)
    ├─ requested it again later from a LinkedIn link          (lead_magnet_requests, is_repeat)
    └─ later submitted a JiTpro conversation request          (leads; correlated by normalised email in V1)
```

Downstream conversion in V1 is a **join on normalised email** between `contacts` and `leads`. The contact form is not modified to write into `contacts` (D2.6); unifying that identity later is recorded as a future architectural improvement (F-6).

`lead_magnet_events` (DECIDED, Round 4) holds the seven first-party funnel events as anonymous counts (Section 6.4).

Abuse data is kept apart from prospect data: the salted IP hash used for rate limiting lives in a short-lived `lead_magnet_ip_activity` table and never on a `contacts` or `lead_magnet_requests` row (D2.7, recommendation documented in Section 9.1).

### 4.5 Email (DECIDED, Rounds 2 and 3; final copy in Round 6)

Resend only (D3.1); no second provider. Sent synchronously from the edge function so the response can truthfully tell the visitor whether the email went out. HTML plus a plain-text part. The link in the email is the stable guide URL, never the versioned filename. Copy in Section 7 is a draft for approval.

**Visitor-facing fulfilment email (D3.2, D3.3):**

- From: **`JiTpro <info@jit-pro.com>`**. Already the visitor-facing sender for the contact confirmation; DNS shows `jit-pro.com` verified in Resend (DKIM at `resend._domainkey.jit-pro.com`, bounce subdomain `send.jit-pro.com`, root SPF including `amazonses.com`, DMARC `p=quarantine`). No email or domain configuration change is required.
- Reply-To: **`info@jit-pro.com`, set explicitly** even though it matches today's default behaviour.
- `info@jit-pro.com` is the monitored visitor-facing address. Whether Microsoft 365 routing for that mailbox is correctly configured cannot be verified from the repository and is a **launch checklist item** (Section 15.1), not an assumption.
- **`jeff@jit-pro.com` must never be exposed through the lead-generation workflow** as a sender, reply-to, or visible address. It is the repository's git identity only (G-5).
- Primarily transactional: its purpose is to deliver the guide the recipient explicitly requested. It is not a sales email. The footer states why the recipient received it and gives the contact address. **No postal address (S3-1, 2026-09-15).**
- Every send carries Resend `tags` (`asset`, `environment`) and an `Idempotency-Key` derived from the request id so a retry cannot double-send (D3.9).

**Internal notification (D3.8 as amended by S2-19):** one per valid request, To `info@jit-pro.com`, From **`JiTpro Notifications <info@jit-pro.com>`**, the verified marketing-site identity. `mail.jit-pro.com` is not verified in the marketing-site Resend account and is not used anywhere in this workflow. Never From `jeff@`.

**Test safety (D3.9):** `LEAD_MAGNET_TEST_MODE` restricts recipients to `@resend.dev` and `@jit-pro.com` while it is set on `jitpro_website` during testing (there is no separate non-production project, G-8), and is removed before the production CTA goes live; Resend's documented test recipients (`delivered@`, `bounced@`, `complained@`, `suppressed@resend.dev`) are used for development and automated checks.

### 4.6 PDF delivery and versioning (DECIDED, Round 5, 2026-09-12)

- **Asset (D5.1):** the approved **31-page** PDF, *What Will Stop Work Six Months From Now? The JiTpro Field Guide to Construction Procurement Control*, committed to `public/guides/` under a versioned filename, for example `jitpro-construction-procurement-field-guide-2026-09.pdf`, and served by Cloudflare Pages. Obtaining and placing that exact file is an **implementation prerequisite** (L-8); none of the older PDFs is substituted.
- **Stable route (D5.2):** **`/guides/procurement-field-guide`**, establishing the reusable convention `/guides/<asset-slug>` where the slug equals the asset id. It is a **302** rule in `public/_redirects` to the current versioned file, placed **above** the SPA catch-all because Cloudflare evaluates rules top to bottom and follows redirects regardless of asset matches. Replacing the guide later is: add the new file, change one line, bump the registry version. Previously distributed links keep working.
- **Headers (D5.1, D5.10):** a `public/_headers` rule targeting the actual PDF path sets `Content-Disposition: inline; filename="JiTpro-Construction-Procurement-Field-Guide.pdf"` (opens in the browser, saves under a clean name), `X-Robots-Tag: noindex`, and a long `Cache-Control` because the filename is versioned. Headers cannot target the redirect path (Cloudflare applies redirects before headers), which is why the PDF file carries them.
- **Consistency check (D5.2):** a Vitest test reads `_redirects`, the client registry, and the server registry and asserts that the stable route points at the file the registry names, that the file exists, and that versions agree. Drift fails CI.
- The registry records which version is current; each request row stores it, so JiTpro can always tell which version a lead received.
- `/field-guide` (the capture and landing page) remains indexable and sets its own title and meta description. No `robots.txt` or sitemap work in this project (F-5).

### 4.7 Analytics (DECIDED, Round 4, 2026-09-12)

- **Cloudflare Web Analytics** for site and page-level traffic and performance (page views, visits, referrers, paths, countries, devices, Core Web Vitals). Included on the Pages plan; enabled with one click in the project's Metrics tab; the beacon is injected automatically on the next deployment; tracks single-page-app route changes; supports no custom events. Enablement is launch item L-9.
- **Supabase `lead_magnet_events`** for the seven fixed funnel events (Section 8.1), stored as anonymous counts with asset, placement, and page path only.
- **Supabase remains the system of record** for contacts, requests, consent, fulfilment outcomes, attribution, and downstream conversion.
- **`sessionStorage`** carries first-touch UTMs, referrer, and landing path for the current browsing session only.
- **Not used:** visitor or session ids in the event table, email or any personal information in events, analytics cookies, GA4, Plausible (V1).
- **Reporting:** the saved Supabase queries in Section 8.3 plus the Cloudflare dashboard.
- **Downstream conversion:** normalised-email correlation between `contacts` and the existing `leads` table.
- The no-cookie and no-consent-banner assumptions are recorded as requiring final legal and privacy review (Section 10), not as legal conclusions.

### 4.8 Deployment

Frontend changes ship through PR → preview → squash merge → Cloudflare. Backend changes go to `jitpro_website` only (G-8), each after a read-only inspection and Jeff's approval of the exact change set (Section 15.2). Migrations are added as new files in `supabase/migrations/` and applied by the method the inspection shows to be safe: `supabase db push` only if the remote migration history matches the repository, otherwise each new file applied individually; `supabase migration repair` and any reset are never run against `jitpro_website`. New functions ship with `supabase functions deploy <new-function-name>`, always naming the single new function (never a bare `functions deploy`, which would redeploy the existing functions). Both are manual steps that must be verified **before** the frontend that depends on them is merged. Section 15 has the ordered plan.

---

## 5. User journey (detailed)

1. **Arrival.** The visitor lands on any page, possibly with UTM parameters from LinkedIn or email. `useAttribution` stores `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `document.referrer`, and the first landing path in `sessionStorage` if not already present. Nothing is sent anywhere yet.
2. **CTA impression.** The visitor scrolls to a placement carrying the offer. A `lead_magnet_cta_view` event is recorded once per placement per session, with no identifier (D4.2).
3. **CTA click.** The dialog chunk loads (if not already), the dialog opens with `showModal()`, focus moves to the email field, the page behind is inert, body scroll is locked. Escape or the Close control closes it and returns focus to the CTA.
4. **Entry.** The visitor types an email. Client validation runs on submit only (not on every keystroke): required, syntactically plausible. Turnstile runs invisibly; if Cloudflare needs an interactive challenge it appears inside the dialog.
5. **Submit.** The button enters the submitting state (label changes, control disabled, layout stable). The request carries email, asset id, placement, current page, landing page, referrer, UTMs, Turnstile token, honeypot value.
6. **Server.** Validates, rate-limits, records the contact and request, sends the email, returns the result.
7. **Success.** The dialog swaps to the success state: "Your guide is ready." with the primary **Download** action opening the stable guide URL in a new tab, and a line confirming the email was sent. If the email failed or the address is suppressed, the line instead says the emailed copy could not be sent and the download still works (D5.6).
8. **Errors.** Invalid email: inline message beneath the field, field marked invalid, focus moved to it; nothing is sent. Every other failure **fails open for guide access** (D5.6): the visitor is given the guide and told, in one calm sentence, that the emailed copy could not be sent and how to get one (D6.10). The cause stays in logs, request outcomes, analytics, and internal notifications; the visitor is never told about databases, rate limits, verification, or networks. Approved wording is in Section 25.6.
9. **Email.** Arrives from JiTpro with the stable link. Clicking it opens the current PDF.
10. **Later.** If the same person submits the contact form, the join on email connects the guide lead to the conversation.

---

## 6. Data model (proposed)

### 6.1 `contacts` (who is this person?)

| Column | Type | Why |
|---|---|---|
| `id` | uuid pk | Stable identity |
| `email` | text, `unique (email)` plus a check that the stored value equals `lower(btrim(email))` and is 3 to 254 characters (S2-2) | The one identifier the visitor gives; normalised by the Edge Function before persistence. A plain column constraint (rather than an expression index) is what the REST upsert `on_conflict=email` requires |
| `first_seen_at`, `last_seen_at` | timestamptz | History without duplicate rows |
| `first_source`, `first_medium`, `first_campaign`, `first_landing_path`, `first_referrer` | text | First-touch attribution, written once |
| `consent_status` | text (`transactional_only` / `marketing_opt_in` / `unsubscribed`) | Current lead vs subscriber state (D2.5, D3.4). A guide request alone never produces `marketing_opt_in`; only the checked opt-in checkbox does. `unsubscribed` is never overwritten by a later unchecked request. |
| `consent_text_version`, `consent_recorded_at`, `consent_method`, `consent_placement`, `consent_page_path`, `consent_asset_id` | text / timestamptz / text (`checkbox`) / text / text / text | Consent evidence for the most recent consent-bearing event (D3.10). The full per-event record is on the request row. |
| `marketing_opt_in_at`, `unsubscribed_at`, `unsubscribe_source` | timestamptz / timestamptz / text | Subscriber lifecycle. Unsubscribe mechanism is a prerequisite for any future nurture (D3.6), not built in V1. |
| `email_suppressed_at`, `email_suppression_reason` | timestamptz / text (`bounce` / `complaint` / `manual` / `provider`) | Deliverability suppression, distinct from consent. Set in V1 only when the Resend send API itself reports suppression; webhook mirroring is deferred (F-7). |
| `created_at`, `updated_at` | timestamptz | |

### 6.2 `lead_magnet_requests` (what did this person request or do?)

| Column | Type | Why |
|---|---|---|
| `id` | uuid pk | |
| `contact_id` | uuid fk → contacts | Identity |
| `email` | text | Denormalised for simple reporting |
| `asset_id` | text | `procurement-field-guide` |
| `asset_version` | text | Which PDF version was current |
| `placement` | text | `home-band`, `learn-more-band`, `footer-link`, `landing-page` (CTA conversion). **No database constraint**: validated server-side against the lead-magnet registry (S2-6) |
| `page_path` | text | Where the form was submitted (page conversion) |
| `landing_path` | text | First page of the session |
| `referrer` | text | |
| `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` | text | Source conversion |
| `is_repeat` | boolean | Same email already requested this asset |
| `marketing_opt_in_checked` | boolean | The checkbox state at this request (D3.4) |
| `consent_text_version`, `consent_method` | text / text | Per-event consent evidence (D3.10): which sentence version was shown and how consent was expressed |
| `turnstile_passed` | boolean | Audit |
| `fulfilment_status` | text (`delivered_inline`) | Whether the visitor was shown the download |
| `email_status` | text (`sent` / `failed` / `skipped_cooldown` / `suppressed`), **nullable** | Outcome of the fulfilment send. `NULL` means no send has been attempted yet (S2-3); no placeholder status is invented |
| `email_provider_id` | text | Resend message id for tracing |
| `email_error` | text | Provider error summary, no secrets |
| `created_at` | timestamptz | Request time |

### 6.3 `lead_magnet_ip_activity` (abuse control only; recommended, D2.7)

| Column | Type | Why |
|---|---|---|
| `id` | bigint identity pk (S2-5) | Row identity |
| `ip_hash` | text | Salted hash; salt is a secret combined with the UTC date so hashes cannot be linked across days |
| `activity_kind` | text (`request` / `event`) (S2-4) | Keeps the 10-request and 100-event ceilings (D5.5) from consuming each other |
| `created_at` | timestamptz | Window for rate limiting |

Rows older than 24 hours are deleted opportunistically by the edge function on each request. No foreign key to `contacts` or `lead_magnet_requests`, so IP-derived data never becomes prospect or profile information.

### 6.4 `lead_magnet_events` (anonymous funnel counts; DECIDED, Round 4)

| Column | Type | Why |
|---|---|---|
| `id` | bigint identity pk | |
| `event_name` | text, constrained to the seven names in Section 8.1 | The funnel step |
| `asset_id` | text | Which lead magnet |
| `placement` | text, constrained to the fixed placement values | CTA placement performance |
| `page_path` | text | Page conversion |
| `error_kind` | text, nullable | Only for `lead_magnet_request_error` (`network`, `validation`, `verification`, `rate_limited`, `server`) |
| `created_at` | timestamptz | |

**No** session id, visitor id, email, IP, IP hash, user agent, or any other identifier. Rows are counts with context. Write-only from the `record-lead-magnet-event` function; nothing reads from the browser.

**Deliberately not captured (Round 2):** user agent, raw IP address, name, company, phone number, job title, geolocation, enrichment data. The principle is to collect what is needed for funnel performance, attribution, fulfilment, and abuse prevention, and nothing because it is technically possible.

RLS is enabled on all tables, no policies are created, and `anon` and `authenticated` privileges are explicitly revoked on each new table (S2-1), because `jitpro_website`'s default privileges would otherwise grant them full table access. Only the service role (the Edge Functions) reads or writes; website visitors never access these tables directly.

---

## 7. Email behaviour

### 7.1 Fulfilment email (APPROVED, Round 6; wording in Section 25.7)

- From: `JiTpro <info@jit-pro.com>` (D3.2)
- Reply-To: `info@jit-pro.com`, set explicitly (D3.2)
- Subject: **Your JiTpro Construction Procurement Field Guide**
- Preheader: *What Will Stop Work Six Months From Now? Your link is inside.*
- Body, button (*Open the Field Guide* → `https://jit-pro.com/guides/procurement-field-guide`), closing, and footer exactly as approved in Section 25.7. The existing 600px template and logo header are reused.
- Footer (D3.3 as amended by S3-1): the reason-for-receipt line and *Questions? info@jit-pro.com*. **No business or personal mailing address anywhere in this workflow.** No marketing unsubscribe link: the message is transactional (D3.6).
- The message stays primarily transactional. Its job is to deliver the guide; it must not grow into a sales email.
- A matching plain-text part is approved and generated from the same content.
- **Legal review before launch:** the transactional-vs-commercial classification of this message and its final footer wording.

### 7.2 Internal notification (APPROVED, Round 6; format in Section 25.8)

One per valid request. From `JiTpro Notifications <info@jit-pro.com>` To `info@jit-pro.com`. Subject pattern *New Field Guide request · [placement]*. Body: requester email, placement, page, landing page, source, repeat request yes/no, **marketing opt-in yes/no (kept, useful internally)**, fulfilment email status, request id, timestamp. **No IP address, no IP hash.**

### 7.2.1 Persistence-failure recovery alert (APPROVED, Round 6; format in Section 25.9)

Sent only when a request could not be saved. Same sender and recipient. Subject *Field Guide request could not be saved*. Body: timestamp, request id, placement, page, concise error summary, and the **full requester email address, deliberately**, so JiTpro can recover a lead that was not persisted. This recovery alert is not an application log: ordinary function logs continue to mask email addresses (D5.7).

### 7.3 Consent model and what each state permits (DECIDED, D3.4, D3.5)

The capture form is one typed field (email) plus **one quiet optional checkbox, unchecked by default**. Approved wording (Round 6; consent text version `v1`; subject to legal review before launch):

> Also send me occasional JiTpro insights on keeping projects ahead of the field. I can unsubscribe at any time.

| Checkbox | `consent_status` | May receive in V1 | May receive later |
|---|---|---|---|
| Unchecked | `transactional_only` | The requested guide fulfilment email, cooldown-gated re-sends, and necessary service communication directly related to the requested asset (for example a corrected link) | Nothing else without a new, explicit opt-in |
| Checked | `marketing_opt_in` | Everything above | An approved JiTpro marketing or nurture sequence, **only** once that separate functionality, its content, and an unsubscribe mechanism are approved and built |
| (later action) | `unsubscribed` | No marketing. A person who explicitly requests the guide again may still receive the transactional fulfilment email unless suppression rules prohibit delivery | Nothing marketing unless they opt in again |
| (deliverability) | suppressed (`email_suppressed_at` set) | **No delivery attempt at all** for bounce, complaint, or similar reasons | Same |

Requesting the guide alone never silently creates `marketing_opt_in`. Prospects outside the United States are assumed plausible, so the architecture is explicit opt-in and does not rely on a US-only notice-based model. **No marketing sequence is implemented in this project unless separately approved.**

### 7.4 Unsubscribe and suppression in V1 (DECIDED, D3.6)

- No tokenised unsubscribe endpoint is built in V1. **Before any marketing or nurture email is ever sent, a proper unsubscribe mechanism must exist** (recorded as nurture prerequisite N-1 in Section 22).
- The `contacts` schema already carries unsubscribe and suppression state.
- The privacy notice explains how to contact JiTpro about consent and data choices; `info@jit-pro.com` is the visitor-facing contact address. Until N-1 exists, withdrawal is handled manually by setting `consent_status = unsubscribed`.
- Resend's automatic suppression list (hard bounces and complaints, account-wide) is relied upon. When the send API reports suppression or failure, the request row records `email_status = suppressed` or `failed`, the visitor still receives immediate on-screen access, and the dialog shows a calm message that the guide is available now even though the email could not be sent.
- A Resend webhook receiver for `email.bounced`, `email.complained`, and `email.suppressed` is **deferred** to the future nurture and email-hardening project (F-7).

### 7.5 Consent evidence (DECIDED, D3.10)

Retained per consent-bearing event and mirrored as current state on the contact: consent text version id, timestamp, method, placement, page path, asset requested, resulting status. The actual sentence for every historical version lives in version-controlled code (`src/content/consentTexts.ts` or the equivalent shared module the server also reads). **A used version is never edited in place**; a wording change creates a new version id so old records stay interpretable.

---

## 8. Analytics and conversion measurement (DECIDED, Round 4, 2026-09-12)

### 8.1 The event vocabulary (fixed; implementation and reporting must use these names exactly)

Seven events. Each carries only `asset_id`, `placement`, `page_path`, and (for errors) `error_kind`. No identifiers, no personal data.

| Event name | Definition | Fired |
|---|---|---|
| `lead_magnet_cta_view` | A CTA placement became visible in the viewport | Once per placement per browsing session (deduplicated in the browser with a `sessionStorage` flag) |
| `lead_magnet_cta_click` | A CTA was activated by click, tap, or keyboard | Every activation |
| `lead_magnet_form_view` | The capture form rendered (dialog opened, or landing page form mounted) | Every render |
| `lead_magnet_form_submit` | Submit was pressed with an email that passed client validation | Every submit attempt that reaches the network |
| `lead_magnet_request_success` | The server returned success (lead recorded; access granted) | Once per successful response |
| `lead_magnet_request_error` | The request failed: `network`, `validation`, `verification`, `rate_limited`, or `server` | Once per failed response |
| `lead_magnet_download_click` | The Download or open-guide action was pressed in the success state or on the landing page | Every activation |

`lead_magnet_request_success` duplicates information in `lead_magnet_requests` and exists so the funnel can be read from one table.

**Fixed placement values:** `home-band`, `learn-more-band`, `footer-link`, `landing-page`. A new placement requires adding it to the allow-list in both the client registry and the server function.

### 8.2 Metric definitions

| Metric | Formula | Source |
|---|---|---|
| CTA click-through | `cta_click` ÷ `cta_view`, per placement | events |
| CTA conversion | `request_success` ÷ `cta_click`, per placement | events |
| Form completion | `request_success` ÷ `form_view`, per placement | events |
| Page conversion | requests with `page_path` = P ÷ Cloudflare page views of P | requests + Cloudflare |
| Source conversion | requests grouped by `utm_source`, `utm_medium`, `utm_campaign` (and `utm_content`, `utm_term` where present) | requests |
| Access rate | `download_click` ÷ `request_success` | events |
| Repeat rate | requests with `is_repeat` ÷ all requests | requests |
| Opt-in rate | requests with `marketing_opt_in_checked` ÷ all requests | requests |
| Email outcome | requests grouped by `email_status` | requests |
| Downstream conversion | contacts with at least one request whose normalised email later appears in `leads`, by original placement and first source, with days between | contacts + requests + leads |

### 8.3 Saved reporting queries (created in Sprint 6, kept in the repository under `supabase/queries/` so they are versioned)

1. Requests per day and per week.
2. Requests by placement.
3. Requests by UTM source, medium, and campaign.
4. Placement funnel: views → clicks → form views → submits → successes → downloads, with the ratios above.
5. Repeat-request rate.
6. Email outcome distribution (`sent`, `skipped_cooldown`, `failed`, `suppressed`).
7. Consent opt-in rate.
8. Downstream conversions: guide requesters who later submitted the contact form.

Page views, visits, referrers, countries, devices, and Core Web Vitals are read from the Cloudflare Web Analytics dashboard. Cloudflare retains unsampled data for 7 days and aggregated data for six months, so the monthly review records the page-view denominators in the review notes.

### 8.4 Privacy posture of the analytics design (assumptions flagged for review)

- No cookies are set by any part of this design. `sessionStorage` is first-party, session-scoped, and holds only UTMs, referrer, landing path, and impression-deduplication flags.
- The event endpoint sees each request's IP transiently, as any web request does, and stores nothing from it.
- Cloudflare states that Web Analytics collects the minimum timing information and does not track individuals across sites. Its visit-counting mechanism is described in the privacy notice by reference to Cloudflare's documentation, not by JiTpro's own claim.
- **The assumption that no consent banner is required under this design is a legal and privacy review item (L-3), not a conclusion of this plan.**

Do not act on small samples. The first weeks establish a baseline (Section 23).

---

## 9. Security and abuse

- Server-side validation of everything the client sends: JSON shape, email syntax and length, allowed `asset_id`, allowed `placement`, string length caps on attribution fields, UTM values truncated.
- **Bot protection (DECIDED D5.4):** Turnstile rendered with `appearance: "interaction-only"` (invisible unless Cloudflare decides interaction is necessary), verified server-side on every request; a server-checked honeypot that silently succeeds without storing (matching the investor function); server-side validation of every field. The normal visitor sees no challenge. An expired token (300-second lifetime) is handled by resetting the widget and asking the visitor to submit again. Preview-hostname allow-listing for the widget is an external testing requirement (G-4, L-5).
- **Rate limiting (DECIDED D5.5):** guide requests are limited to **10 attempts per salted IP hash per 10 minutes**, chosen because contractor offices and project teams often share one outbound IP. The events endpoint allows **100 events per hash per 10 minutes**. Both counts use the 24-hour `lead_magnet_ip_activity` table (D2.7). Exceeding the request limit returns a **calm 429**. Both limits are single named constants in the shared module so they can be tuned from production behaviour. Turnstile, the honeypot, validation, and the one-hour per-email cooldown provide the rest of the protection.
- Repeat handling (DECIDED D2.2): for every valid request the function normalises the email, upserts the single `contacts` row, inserts a new `lead_magnet_requests` row, marks `is_repeat` when that contact already requested the asset, and always grants immediate access. The fulfilment email is re-sent only if the last **successful** fulfilment email to that address is more than **one hour** old; inside the hour the request is recorded with `email_status = skipped_cooldown` and no email is sent. The request is never rejected and no duplicate contact is created.

### 9.1 Salted IP hash: purpose and retention (recommendation, D2.7)

- **Purpose:** rate limiting and abuse investigation only. It is never used for attribution, profiling, or reporting.
- **Where:** a separate `lead_magnet_ip_activity` table (Section 6.3), not on request or contact rows.
- **Salt:** `LEAD_MAGNET_IP_SALT` (secret) combined with the current UTC date, so the same address produces a different hash each day and cannot be correlated across days even inside the table.
- **Retention:** **24 hours.** The rate-limit window is 10 minutes; 24 hours leaves room to look at a burst after the fact. The function deletes rows older than 24 hours on each invocation, so no scheduler is needed and the table cannot grow.
- **Logging:** the raw IP is never written to function logs by this code, and the hash itself is not logged unnecessarily. (Supabase's own platform request logs are outside this project's control and are covered by Supabase's retention.)

### 9.2 Logging and observability (DECIDED D5.7)

Proportionate to a lead magnet, using only infrastructure that already exists:

| Signal | Mechanism |
|---|---|
| Per-request diagnostics | Function logs correlated by a `requestId`, following the existing edge-function convention. **Email addresses are masked** in logs (for example `jo***@abccontracting.com`); the durable row already holds the full address. Raw IPs and IP hashes are not logged unnecessarily. |
| "It is working" | The internal notification per successful request (D3.8). |
| Persistence failure | A failure alert From `JiTpro Notifications <info@jit-pro.com>` To `info@jit-pro.com` sent by the function when the request could not be saved, so the lead can be followed up manually. |
| Broken guide link | A Pulsetic HTTP monitor on `https://jit-pro.com/guides/procurement-field-guide` following the redirect (external configuration, L-11). |
| Unusual volume | Saved query 1 (requests per day) plus the internal notifications; the rate limiter's 429 count appears in `lead_magnet_events` as `rate_limited` errors. |
| Log retention | Depends on the Supabase plan (Free 1 day, Pro 7 days, Team 28 days). The actual plan is confirmed and recorded as launch item **L-10**; it is not guessed. |
- Secrets stay in Supabase secrets. The browser sees only the anon key and the Turnstile site key, as today.
- Error responses to the browser are generic; detail goes to function logs with a request id.
- No raw IP addresses or user agents in logs beyond what Supabase records by default.
- The PDF is public by design. No tokens, no DRM.

---

## 10. Privacy and compliance (DECIDED where marked; flags, not legal advice)

**Operating principle (Jeff, 2026-09-12):** wherever this project touches privacy, consent, CAN-SPAM, CASL, GDPR, or similar requirements, design the technical system conservatively, document the actual behaviour, flag final language and legal classification for appropriate legal review, and never present implementation decisions as legal advice.

1. **Privacy notice: IN SCOPE (D3.7); complete draft in Section 27 (Round 6).** A `/privacy` page is added in this project, linked from the lead-capture form's fine print and from the site footer. Plain English, written from the actual implemented behaviour rather than boilerplate, covering the full list Jeff specified. **Subject to legal review before production launch.** No Terms page in V1.
2. **Consent model: DECIDED (D3.4).** Explicit unchecked checkbox. Prospects outside the United States are assumed plausible, so the design does not depend on a US-only notice-based assumption. **Legal review of the final wording before launch.**
3. **Unsubscribe and suppression: DECIDED (D3.6).** Not required for the transactional fulfilment email; required before any marketing email; schema ready from day one; manual withdrawal via `info@` until the mechanism exists.
4. **Turnstile.** Cloudflare positions the site operator as the data controller for Turnstile signals; the notice names Turnstile and links Cloudflare's Turnstile privacy notice.
5. **Data retention.** Request and contact rows are kept for attribution history; IP hashes 24 hours (D2.7). Stated in the notice.
6. **Cookies and storage.** `sessionStorage` for attribution is first-party and session-scoped; no consent banner is implied. Any third-party analytics decision in Round 4 must be re-checked against this.
7. **Fulfilment email classification.** Primarily transactional: the recipient explicitly requested the guide and this message fulfils that request. It carries the reason-for-receipt line and the contact address, and **no postal address** (S3-1). Marketing stays separately controlled by the explicit unchecked opt-in and any future marketing implementation. **Legal review before launch.**

---

## 11. Accessibility requirements

- Native `<dialog>` with `showModal()`: focus moves into the dialog on open, is trapped by the platform, and returns to the triggering control on close. Escape closes it. The dialog carries `aria-labelledby` pointing at its heading.
- The form uses a visible `<label>` for the email field; no placeholder-as-label. Error text is associated with the field via `aria-describedby` and the field carries `aria-invalid` when invalid. The error region is `role="alert"` (or `aria-live="polite"` for non-blocking states) so screen readers announce it.
- The submitting state changes the button label text (not only a spinner) and keeps the button's size stable.
- The success state moves focus to its heading so the change is announced.
- All controls have visible focus using the `--jp-text-primary` outline convention. Contrast meets WCAG AA on `--jp-surface` and `--jp-background`.
- Errors are never communicated by colour alone (there is no error colour anyway): icon plus text plus position.
- Touch targets are at least 44 by 44 CSS pixels for the CTA, Close, Submit, and Download controls (a minimum must be recorded in the Design System; see D6.x).
- Any entrance animation is a short opacity change that respects `prefers-reduced-motion`.
- No ARIA is added where native semantics already carry the meaning.

---

## 12. Responsive requirements

Designed desktop-first per §35.1, then reviewed at tablet landscape, tablet portrait, mobile landscape, mobile portrait.

- **Desktop (1280 and up):** dialog centred, fixed maximum width around 32 to 36rem, one column: heading, one sentence, email field, submit, fine print.
- **Tablet:** same dialog, narrower; the CTA band's two-column composition may collapse to one column with the action beneath the copy.
- **Mobile portrait (about 360 to 430 px):** dialog fills the width with a 16px gutter, sits high enough that the software keyboard does not cover the field, uses `100dvh` for height limits, scrolls internally if needed. Submit and Download are full-width. No horizontal overflow. Text does not clip. The success state and Download button remain visible without scrolling on a 667px-tall viewport.
- The CTA remains readable and tappable at every width; the footer link wraps like other footer links.

---

## 13. Failure modes and the failure matrix (DECIDED D5.6, 2026-09-12)

### 13.1 Governing principle: fail open for guide access

**A failure in JiTpro infrastructure must not prevent a legitimate visitor from receiving the free guide.** The guide is a free distribution asset; withholding it when the backend is unavailable does not recover the lead and creates a worse prospect experience. The system never pretends a request was saved when it was not, and never claims an email was sent when it was not.

The four required cases:

| Case | What happened | Visitor sees | Guide access | Recorded | Alert |
|---|---|---|---|---|---|
| 1 | Request stored; fulfilment email sent | Success | **Yes** | Yes | Internal notification |
| 2 | Request stored; fulfilment email failed | Success; the guide is available now but the emailed copy could not be delivered | **Yes** | Yes, `email_status = failed` | Internal notification shows the failure |
| 3 | Address suppressed or otherwise cannot receive email | Success; calm note that the emailed copy could not be sent | **Yes** | Yes, `email_status = suppressed` | Internal notification shows the status |
| 4 | Request persistence failed | The guide is available now, but JiTpro could not save or send the request; `info@jit-pro.com` offered as the fallback for an emailed copy | **Yes** | Logged (no row) | **Failure alert** to `info@` |

Operations, in order: (1) validate, (2) determine the guide URL (always possible), (3) record request, (4) send fulfilment email, (5) respond with honest outcomes, (6) record analytics.

### 13.2 Visitor-facing failure language (APPROVED, Round 6, D6.10)

The visitor needs to know three things: the guide is available, whether an email is coming, and what to do if they want help. Nothing more. The internal matrix below keeps every cause distinct for logs, request outcomes, analytics, and notifications, but the visitor sees one of only **three** access-granting states:

| Visitor state | Heading | Body | Used for |
|---|---|---|---|
| Success | Your guide is ready. | We've also emailed a link to **name@company.com** so you can return to it later. | Case 1 |
| Repeat within the hour | Your guide is ready. | We emailed a link to **name@company.com** within the last hour, so we haven't sent another. You can open the guide below. | Cooldown |
| Email not sent | Your guide is ready. | We couldn't email your copy just now, but you can open the guide below. If you'd like an emailed copy, write to info@jit-pro.com. | Email failure, suppressed address, persistence failure, network failure or timeout, rate limiting, browser-verification failure, and any other server error |

A quiet *Try again* link appears beneath the third state **only** for the network-failure and timeout conditions, where retrying is genuinely useful. No visitor-facing text mentions databases, rate limits, verification, networks, or any other backend detail.

### 13.3 Full internal matrix

| Failure | Technically | Visitor state (Section 13.2) | Guide access | Retry offered | Logged | JiTpro notified |
|---|---|---|---|---|---|---|
| Empty or malformed email | Client validation fails; nothing sent | Inline field error, focus on the field | No (not a request yet) | Immediate | No | No |
| Server rejects email format | 400 | Same inline error | No | Immediate | Yes (request id) | No |
| Honeypot filled | 200, nothing stored, nothing sent | Success | Yes (bots do not matter) | n/a | Yes | No |
| Turnstile fails, expires, or the script never loaded | 403 | Email not sent | **Yes** | No (widget reset silently for a later attempt) | Yes | No |
| Repeat within the one-hour email cooldown | 200, `email_status = skipped_cooldown` | Repeat within the hour | **Yes** | n/a | Yes | No |
| Rate-limited (IP) | **calm 429** | Email not sent | **Yes** | No | Yes; `rate_limited` event | Only if sustained (saved query) |
| Network error or timeout | fetch rejects or 30-second hard timeout | Email not sent, **with** the quiet *Try again* link | **Yes** | Yes | Client console; `network` event | No |
| **Lead storage fails** | 200 with `stored: false` (function fails open) or 500 | Email not sent | **Yes** | No | Yes, error level, masked email | **Recovery alert** to `info@` with the full email (Section 7.2.1) |
| Email send fails, lead stored | 200 with `email_status = failed` | Email not sent | **Yes** | No (one automatic retry inside the function, same idempotency key) | Yes, provider error summary | Internal notification shows the status |
| Resend reports the address as suppressed | 200 with `email_status = suppressed` | Email not sent | **Yes** | No | Yes | Internal notification shows the status |
| Contact already `email_suppressed_at` | 200, no send attempted | Email not sent | **Yes** | No | Yes | Same |
| Internal notification or recovery alert itself fails | Swallowed after logging | Unaffected | Yes | No | Yes | No |
| PDF route unavailable (bad redirect, missing file) | 404 on click | Browser 404 | No | n/a | CI consistency test and lychee prevent merge; production smoke test verifies | Pulsetic monitor (L-11) |
| Duplicate submission (double click) | Second request in flight | Button disabled while submitting; a second request is treated as a repeat server-side | Yes | n/a | Yes | No |
| Visitor closes the dialog mid-submit | Request continues | Nothing; reopening shows the idle form (or the result if the response arrived) | Via email | n/a | Yes | No |
| Slow network | Long submitting state | *Getting your guide…* persists; after 15 seconds *Still working…*; hard timeout at 30 seconds becomes the network case above | **Yes** after timeout | Yes | Yes | No |
| JavaScript disabled or errored | Dialog cannot open | The CTA is a real link to `/field-guide`, which renders the form as a normal page (D1.1) | Depends | n/a | n/a | No |

The visitor is never left wondering, and is never burdened with a cause they cannot act on.

---

## 14. Testing plan

Testing is built into every sprint, not deferred.

### 14.1 Automated (DECIDED D5.8: Vitest 5 on the repository's Vite 8)

`vitest` is added as a dev dependency, `npm test` runs `vitest run`, and CI runs it **before the build step**. Tests target pure logic without browser simulation; **jsdom is not added** unless a component test genuinely requires it, and no abstraction is introduced solely to make tests possible. Reusable logic is extracted into plain modules (shared by the client and the edge functions where sensible) for:

- email validation and normalisation
- attribution parsing (UTMs, referrer, landing path; truncation; missing values)
- consent decisions (checkbox state → `consent_status`, never overwriting `unsubscribed`)
- re-send cooldown decision (one hour, last successful send)
- rate-limit decision (10 per 10 minutes; 100 events per 10 minutes; single constants)
- template rendering (subject, stable link, footer, escaping, plain-text part)
- lead-magnet registry (client and server agree on ids and versions)
- redirect and asset consistency (`_redirects` target = registry file; file exists)
- failure-state decisions (which visitor state each server outcome maps to, including fail-open)
- analytics event construction (the seven names, allowed placements)
- the capture form's state reducer, as a pure function

### 14.2 Edge function and integration testing (DECIDED D5.11)

Deno is not installed locally and is not added. Pure logic is tested with Vitest as above. The functions themselves are exercised **against `jitpro_website`, the website's only Supabase project** (G-8), under the safeguards in Section 15.2: the project is inspected read-only before any migration; each migration and each function is applied or deployed only after Jeff approves the exact change set; `LEAD_MAGNET_TEST_MODE` is set for the whole test period; `curl` cases cover every matrix row using identifiable test data; Resend test recipients cover the email paths; and the draft PR's Cloudflare preview exercises the full browser flow, explicitly calling the live website project with test mode on. Test cases that would require changing a secret shared with the existing contact-form functions (for example an invalid `RESEND_API_KEY` or a Cloudflare test `TURNSTILE_SECRET_KEY`) are not run that way; see §21 item 1. No production visitor-facing CTA exists until this verification is complete.

### 14.3 Browser (Chrome via the Claude in Chrome tools or the gstack browse skill; Playwright headless shells for screenshots)

Desktop: CTA renders; opens dialog; mouse and keyboard; Tab order; Escape; backdrop click; validation; valid submission; submitting state; success; Download opens the PDF; focus returns to the CTA on close; layout matches the design system.

Mobile (360, 390, 430 widths) and tablet (768, 1024): dialog fits; keyboard does not hide the field; success and Download visible; no horizontal overflow; no clipped text.

Accessibility: labels, keyboard, visible focus, focus trap, Escape, error announcement, button names, ARIA minimalism, contrast, non-colour error cues. Reduced motion verified with `--force-prefers-reduced-motion` (see memory note on tooling).

Failure paths: empty email; malformed email; server 500 (point the client at a failing function or intercept the request); Turnstile failure; repeat submission; slow network throttling; missing PDF; unexpected response body.

### 14.4 Email (DECIDED, D3.9)

- Development and automated checks use Resend's documented test recipients: `delivered@resend.dev`, `bounced@resend.dev`, `complained@resend.dev`, `suppressed@resend.dev` (the first three accept `+label` suffixes). These consume sending quota, so they are used deliberately.
- While the lead-magnet functions are being tested on `jitpro_website`, `LEAD_MAGNET_TEST_MODE` is set, which makes the function refuse any recipient outside `@resend.dev` and `@jit-pro.com`. Development emails never reach real prospects. A JiTpro-owned address is used only when a real mailbox check is necessary. Test mode is removed only at go-live (L-6), after verification.
- Every send carries tags `asset` and `environment` (`test` while test mode is set, otherwise `production`) so test traffic is filterable in the Resend dashboard, and an `Idempotency-Key` derived from the request id so retries cannot double-send.
- Real-mailbox verification uses a JiTpro-owned address: sender name and address, explicit Reply-To, subject, preheader, body copy, footer line, link target, logo, plain-text part, mobile and desktop rendering (Gmail web and iOS Mail at minimum), one-hour cooldown behaviour, suppressed and failed paths, failure logging.
- No secrets or environment-specific credentials are hard-coded; configuration follows the existing `VITE_*` (browser) and Supabase-secrets (server) conventions.

### 14.5 Production smoke test

Listed in Section 15.

---

## 15. Deployment plan

1. Merge order matters. The migrations and the edge functions must be live and verified on `jitpro_website` before the frontend PR that calls them is merged (G-8, D5.11 as amended). There is one Supabase project and **no staging-to-production promotion step**.
2. **Inspect, propose, approve, apply (per change set):** read-only inspection of `jitpro_website` (Section 15.2); Jeff receives the exact migration files or function change and approves it; only then is the migration applied or the new function deployed, by the method in Section 4.8. Secrets (`LEAD_MAGNET_IP_SALT`, `LEAD_MAGNET_TEST_MODE`, any other new one) are set only with Jeff's approval (L-13).
3. **Backend verification in test mode:** with `LEAD_MAGNET_TEST_MODE` set, run the `curl` matrix and the Resend test-recipient cases against `jitpro_website` using identifiable test data; confirm the existing contact form still works and that `leads` and its webhook are unaffected.
4. **Preview:** the existing draft PR #52 builds a Cloudflare preview on every push. Verify the CTA, dialog, stable route redirect, headers, and (with L-5 done) a real submission. Preview submissions call the live `jitpro_website` project; this is deliberate, and test mode stays on while they do (L-14).
5. **Go-live switch (before the merge):** only after steps 3 and 4 pass and Jeff approves: remove `LEAD_MAGNET_TEST_MODE` and any test-only override (L-6), confirm the function in production mode with one `curl` using a JiTpro-owned address, and clean up test rows only if Jeff approves a deliberate, targeted cleanup of the new tables.
6. **Merge:** squash merge once `build-and-test` passes and review threads are resolved. Ask Jeff before the final merge. The merge is what makes the visitor-facing CTA live.
7. **Production verification (smoke test):** production CTA renders; dialog opens; test submission succeeds; `contacts` and `lead_magnet_requests` rows exist with attribution; email arrives; email link opens the correct 31-page PDF; inline Download works; analytics events appear; contact form, navigation, homepage, and Learn More still work.
8. **Rollback:** revert the PR on GitHub. The edge functions and tables can stay deployed harmlessly; the CTA simply disappears. If a function itself misbehaves, redeploy the previous version or disable the CTA. Removing the new backend objects entirely follows the removal strategy recorded with each approved change set (Section 15.2) and touches only objects this project created.
9. Record the result in Section 22.

### 15.1 Launch checklist: items that must be verified outside the repository

These cannot be confirmed from code and are not assumed. Each is checked off, with who verified it and when, before production launch.

| # | Item | Owner | Status |
|---|---|---|---|
| L-1 | `info@jit-pro.com` Microsoft 365 mailbox exists, is monitored, and receives external mail (visitor replies and internal notifications land there) | Jeff / admin | Open |
| ~~L-2~~ | ~~JiTpro business mailing address supplied for the email footer~~ | Jeff | **Withdrawn 2026-09-15 (S3-1).** Jeff will not include a business or personal mailing address in this workflow. No longer a prerequisite for Sprint 3, Sprint 5, or production launch. |
| L-3 | Legal review completed: consent checkbox wording, privacy notice, fulfilment-email classification and wording | Jeff / counsel | Open |
| L-4 | Resend dashboard confirms `jit-pro.com` verified (`mail.jit-pro.com` is **not** verified and is not used by this project, S2-19) | Jeff / assistant with dashboard access | **Done 2026-09-15 (Jeff).** `jit-pro.com` confirmed working; the `mail.` subdomain's 403 is recorded in the Step 3 diagnosis and F-8. |
| L-5 | Turnstile widget hostnames include the Cloudflare preview URLs so submit can be tested on previews (G-4) | Jeff / admin | **Open, deliberately deferred (Jeff, 2026-09-16).** No Turnstile configuration change is to be made for previews. Sprint 4 submit testing ran on localhost with Cloudflare's published test site key through `.env.local` (S4-2); previews serve visual, responsive, dialog, keyboard and reduced-motion review only. Blocks nothing; Sprint 6 production smoke testing is the final verification. |
| L-6 | Go-live switch on `jitpro_website`: `LEAD_MAGNET_TEST_MODE`, `LEAD_MAGNET_TURNSTILE_TEST_SECRET`, and `LEAD_MAGNET_TEST_FAULT_SECRET` **removed** (disabling every test hook); `LEAD_MAGNET_IP_SALT` and optional `LEAD_MAGNET_NOTIFY_TO` present; production-mode `curl` with a JiTpro-owned address passes | Assistant via CLI with Jeff's approval | **Done 2026-09-16.** The three test secrets removed with Jeff's approval (15 to 12); `LEAD_MAGNET_IP_SALT` retained with its digest unchanged; `LEAD_MAGNET_NOTIFY_TO` deliberately unset. All nine Edge Functions version-bumped by one with every bundle hash and configuration identical (S2-18), and the database unchanged. Production-mode proof: the Cloudflare dummy token now returns 403 `verification_failed` with no footprint, and one real request to `jeffk@kaufmanbuilding.com`, outside the former test-mode allow-list, returned `email_status: sent`. |
| L-7 | All lead-magnet migrations applied and both new functions deployed to `jitpro_website`, each after Jeff approved its exact change set, and verified in test mode before the frontend PR merges | Assistant via CLI with Jeff's approval | **Done 2026-09-16 (status corrected; the work itself closed earlier).** All five migrations (`20260914000001` to `20260914000004`, `20260916000005`) applied and verified (Sprint 2 and Sprint 6 records in §22); `submit-lead-magnet-request` deployed and verified in test mode across 19 cases in Sprint 2 and re-verified through Sprints 3 and 4; `record-lead-magnet-event` deployed and verified by the Sprint 6 controlled probes; both confirmed `ACTIVE` in production mode after L-6. The row had read Open by omission. |
| L-8 | The approved 31-page PDF is obtained from Jeff and is the file committed (page count and title verified) | Jeff supplies; assistant verifies | **Done 2026-09-15.** Placed by Jeff, verified (31 pages, approved title and subtitle, amber brand cover), committed in `04991ad`. |
| L-9 | Cloudflare Web Analytics enabled on the Pages project (Metrics → Enable) | Jeff / admin | Open |
| L-10 | Supabase production plan confirmed and the actual function-log retention period recorded here (not guessed) | Jeff / assistant with dashboard access | Open |
| L-11 | Pulsetic HTTP monitor added for `https://jit-pro.com/guides/procurement-field-guide`, following the redirect | Jeff | Open |
| L-12 | `jitpro_website` inspected read-only per Section 15.2 before the first migration, and the Sprint 2 change set approved by Jeff | Assistant inspects; Jeff approves | **Inspected and change set approved 2026-09-14** (report and S2-1 to S2-9 under Sprint 2 in §22). **Complete 2026-09-15:** all four Sprint 2 migrations applied and verified, including the sequence-privilege fix `20260914000004` (records in §22). *(Replaces the former `jitpro-staging` confirmation item, closed 2026-09-14 by G-8.)* |
| L-13 | New lead-magnet secrets set on `jitpro_website`: `LEAD_MAGNET_IP_SALT`, `LEAD_MAGNET_TEST_MODE` (testing only), optional `LEAD_MAGNET_NOTIFY_TO`. Existing secrets (`RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `SITE_URL`) are shared with the existing functions and are **not changed** | Assistant via CLI with Jeff's approval | **Done 2026-09-15.** All four `LEAD_MAGNET_*` secrets set with Jeff's approval in Sprint 2 Step 1 and verified (digests recorded); the existing 11 secrets were unchanged. Supabase version-bumped the seven existing Edge Functions as they picked up the changed environment, with bundles and configuration unchanged, recorded as expected platform behaviour (S2-18). `LEAD_MAGNET_NOTIFY_TO` is deliberately **not set**: the function already defaults to `info@jit-pro.com` and a secret restating the default would be one more thing to keep true (Jeff, 2026-09-16). Three of the four are removed at go-live (L-6); `LEAD_MAGNET_IP_SALT` stays. *(This row read Open until 2026-09-16; corrected then.)* |
| L-14 | Cloudflare Pages preview environment confirmed to reference `jitpro_website` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`), no separate staging values, with Jeff's explicit acknowledgement that preview submissions write to the live website project while test mode is on | Jeff / admin | **Decided 2026-09-16 (Jeff), by a different route.** Sprint 4 QA ran on localhost, not on previews (S4-2), and Jeff approved local development submissions writing test records to the lead-magnet tables in `jitpro_website` under test mode and the approved recipient restrictions, for the new lead-magnet workflow only. Preview-submission confirmation is no longer required; Sprint 6 production smoke testing is the final verification. |

None of the dashboard or account changes above is performed silently. Each is requested from Jeff, or performed with his explicit approval, when the sprint reaches it.

### 15.2 Single-project safeguards for `jitpro_website` (G-8, D5.11 as amended 2026-09-14)

The website has one Supabase project, so every backend change lands on the project that serves the live contact form. The objective is not a staging-to-production system; it is small, isolated, reviewable, additive changes with enough safeguards that the existing website is never at risk.

**Project boundary.** Only `jitpro_website` (ref `pynjyrvnokfexyudimsn`) is used. `jitpro-staging`, `jitpro-sandbox`, and all other product-application projects are not inspected, modified, or used unless Jeff explicitly asks. No website staging project is created.

**Migration discipline.** Before applying any migration, the assistant inspects `jitpro_website` read-only and reports to Jeff:

1. the current remote migration versions, compared with `supabase/migrations/`;
2. the existing relevant tables;
3. the existing relevant functions (database and edge);
4. any naming collisions with the proposed objects;
5. the exact new SQL migration files proposed;
6. what each migration creates;
7. whether each migration is additive only;
8. every index, constraint, RLS policy, trigger, and function it adds;
9. the rollback or removal strategy for the newly created objects.

No migration is applied until Jeff approves that change set, and then gives final authorisation of the written migration diff. Migrations are additive only: no `drop`, `rename`, `truncate`, `alter` of an existing object, data rewrite, or repurposing. `supabase db reset`, `supabase migration repair`, and any other reset or history-rewriting operation are never run against `jitpro_website`.

**Apply method (S2-7).** `jitpro_website` has no migration history table, so `supabase db push` is not used: it would attempt every repository migration, creating `demo_requests` and failing on the pre-existing `investor_access`. Each approved file is applied individually with `supabase db query --linked --project-ref pynjyrvnokfexyudimsn -f <file>`, followed by read-only verification.

**Sequence privileges (S2-10, approved 2026-09-15).** `jitpro_website`'s default privileges grant `anon` and `authenticated` `USAGE, SELECT, UPDATE` on every new sequence in `public`, and a table-level `revoke` does not cover them. Any migration for this project that creates an identity column or a serial-backed sequence must explicitly review that sequence's privileges and `revoke all on sequence <name> from anon, authenticated` wherever those roles should not have access, and post-apply verification must check `has_sequence_privilege` for both roles. This applies to `lead_magnet_events` from its first migration.

**Secret changes version-bump existing Edge Functions (S2-18, approved 2026-09-15).** Observed in this project on 2026-09-15 and accepted as expected Supabase platform behaviour: changing project Edge Function secrets (`supabase secrets set`) gave every existing deployed Edge Function a new version number, while bundle hashes, code, configuration, `verify_jwt`, status, entrypoints, and other relevant properties stayed unchanged. Any future proposal to set or remove secrets on `jitpro_website` (including the L-6 go-live removal of the test secrets) must disclose that Supabase may version-bump the existing Edge Functions as they pick up the changed environment. Verification compares bundle hashes, configuration, and functionality; a version-number-only change is not treated as a code deployment and does not need to be reversed.

*Extended 2026-09-15 (Jeff):* deploying an Edge Function was also observed to refresh the `updated_at` metadata of the platform-injected `SUPABASE_*` secrets (`SUPABASE_ANON_KEY`, `SUPABASE_DB_URL`, `SUPABASE_JWKS`, `SUPABASE_PUBLISHABLE_KEYS`, `SUPABASE_SECRET_KEYS`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL`) to the deploy time, while their digests and values stayed unchanged. Future verification compares digests for those platform-injected secrets and does not treat a timestamp-only change as a secret-value change. Project-managed secrets are still compared on digest and `updated_at`.

**No rollback migrations; recovery is proposed, not executed (S2-8).** No rollback migration containing `DROP` statements is created or committed; the project stays additive-only. If a problem during testing might justify removing a new object, work stops and Jeff receives the exact proposed recovery operation before anything runs. No `DROP`, `TRUNCATE`, migration repair, reset, or destructive cleanup is executed without his explicit approval. Once real lead data exists, removal additionally requires a data-preservation or export decision first. The conceptual removal path for the three Sprint 2 tables is dropping `lead_magnet_requests`, `lead_magnet_ip_activity`, and `contacts` (nothing else references them), recorded here as a strategy only.

**Edge Function discipline.** Before deploying a function, Jeff is shown: the function name; what it does; which tables it reads and writes; which secrets it uses; its test-mode behaviour; its failure behaviour; how it is isolated from the existing contact-form workflow; and how it will be tested before any public CTA calls it. Only the new lead-magnet functions are deployed, always by explicit name. Existing functions are not altered or redeployed without Jeff's explicit approval.

**Email and fulfilment test safety.** `LEAD_MAGNET_TEST_MODE` is set for the entire test period and restricts recipients to `@resend.dev` and `@jit-pro.com`. Resend's test recipients are the default; a JiTpro-owned mailbox is used only when a real mailbox check is necessary. No test email may reach a real prospect.

**Database test safety.** Test data is clearly identifiable (Resend test recipients or `@jit-pro.com` addresses, and a recognisable marker such as `utm_campaign = lm-test`). Production lead records are never copied or modified. Test rows in the new tables are removed only by a deliberate, targeted `delete` that Jeff approves, never by a truncate or reset. Cleanup is never automatic: the exact `DELETE` criteria are brought to Jeff before the first cleanup (S2-9).

**Frontend test safety.** The draft PR and its Cloudflare preview are used for frontend and CI verification. The production visitor-facing CTA stays inactive (nothing merges to `main`) until the backend is verified. When preview submissions call the live website project, that is stated explicitly and test mode stays on. The full flow is verified before normal visitors see the feature.

**Unchanged by this amendment:** fail-open guide access, the one-hour email cooldown, Turnstile behaviour, rate limiting, consent handling, sender identity, attribution, analytics, privacy design, CTA placement, and visitor-facing copy.

---

## 16. Environment variables and secrets (required by this project)

| Variable | Purpose | Used in | Exists? | Environments |
|---|---|---|---|---|
| `VITE_SUPABASE_URL` | Function base URL | Browser | Yes | Local, preview, production |
| `VITE_SUPABASE_ANON_KEY` | Function auth header | Browser | Yes | Local, preview, production |
| `VITE_TURNSTILE_SITE_KEY` | Turnstile widget | Browser | Yes | Local, preview, production. **Action:** add preview hostname(s) to the widget's allowed domains in Cloudflare if preview testing of submit is wanted (G-4). |
| `RESEND_API_KEY` | Sending | Edge function | Yes | Supabase |
| `TURNSTILE_SECRET_KEY` | Verification | Edge function | Yes | Supabase |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Database writes | Edge function | Yes (platform) | Supabase |
| `SITE_URL` | Building the absolute guide URL for the email | Edge function | Yes (`https://jit-pro.com`) | Supabase |
| `LEAD_MAGNET_IP_SALT` | Secret half of the daily-rotating salt for IP hashing (D2.7) | Edge function | **New** | Supabase |
| `LEAD_MAGNET_NOTIFY_TO` | Internal notification recipient | Edge function | **New**, optional (default `info@jit-pro.com`) | Supabase |
| `LEAD_MAGNET_TEST_MODE` | When set, the function refuses recipients outside `@resend.dev` and `@jit-pro.com` (D3.9) | Edge function | **New** | Supabase `jitpro_website`, set only for the test period; removed at go-live (L-6) and never left set once the visitor-facing CTA is live |
| `LEAD_MAGNET_TURNSTILE_TEST_SECRET` | Cloudflare's published always-pass Turnstile test secret, so command-line tests can use Cloudflare's dummy token. Honoured **only** when `LEAD_MAGNET_TEST_MODE=true`; the shared `TURNSTILE_SECRET_KEY` is never changed (S2-11) | Edge function | **New** | Supabase `jitpro_website`, test period only; removed at go-live (L-6) |
| `LEAD_MAGNET_TEST_FAULT_SECRET` | Random value of at least 32 characters. Gates the simulated faults (`persistence`, `email`, `email_suppressed`) and the development cooldown bypass (S2-12, S3-2): each needs test mode, its own explicit header, **and** a constant-time match of this secret in `x-lead-magnet-test-fault-secret`. Never logged, never returned | Edge function | **New** | Supabase `jitpro_website`, test period only; removed at go-live (L-6) |

No secrets in source. New secrets are set with `supabase secrets set` and listed here when added. Production readiness is not claimed until this table is verified against the dashboards.

---

## 17. PDF versioning

- Asset id: `procurement-field-guide` (stable forever); stable route `/guides/procurement-field-guide` (D5.2).
- Version label: date-based, for example `2026-09`, stored in the registry and on every request row.
- Filename (D5.1): `public/guides/jitpro-construction-procurement-field-guide-<version>.pdf`. Visitors who save the file receive `JiTpro-Construction-Procurement-Field-Guide.pdf` through the `Content-Disposition` header. Previous versions may remain in the folder so any link that captured a versioned path still works; the stable path always points at the current one.
- Publication date and page count recorded in the registry for reference.
- The public experience never shows the version: "Construction Procurement Field Guide" only.
- **Approved asset (G-3, decided 2026-09-12):** the new **31-page** PDF, *What Will Stop Work Six Months From Now? The JiTpro Field Guide to Construction Procurement Control*. It has not yet been placed in the repository or in the Downloads folder. The 12-, 18-, and 29-page files found locally are earlier drafts and **must not be used**. Adding the approved file to the repository is a Sprint 1 task and depends on Jeff supplying it.

---

## 18. Content governance

- The approved PDF is the lead magnet; it is not rewritten here.
- Website and email copy describe what the guide contains and make no promises of guaranteed schedule performance, margin improvement, savings, or elimination of risk. Claim strength follows §20.1: prevent preventable disruption, manage legitimate change, preserve cause and effect, direct attention to the right work at the right time, find future field problems while options still exist.
- §20.1's retired vocabulary applies to the homepage and Learn More surfaces, including the dialog when opened from them (D1.7).
- All visitor-facing strings live in `src/content/leadMagnets.ts` and are presented together for approval in Decision Round 6 before implementation.

---

## 19. CTA placement strategy (recommendation for Decision Round 1)

| Placement | Visitor intent | Why the guide belongs there | Working CTA wording | Funnel role | Recommendation |
|---|---|---|---|---|---|
| **Homepage, new band between the final CTA and the footer** | Has read the whole argument; did not click "Protect your next project" | Catches the reader who is convinced but not ready to talk. Sits after the commercial CTA so it cannot pre-empt it, and it is the only action in its own surface (§48.1 satisfied without a second amber in an existing section) | Eyebrow *Free field guide* · Heading *What will stop work six months from now?* · One sentence · Button *Get the free field guide* | Primary lead-gen placement; expected highest volume | **Yes** |
| **Learn More, same band after section 11** | Deep reader, high intent, not yet ready | Same logic; this reader has invested ten minutes and is the best guide prospect on the site | Same component | Second-highest volume, highest intent | **Yes, with a §50.5 amendment** permitting one lead-magnet offer after the close |
| **Footer text link (all pages)** | Any | Low-friction, always available, costs nothing in hierarchy | *Free field guide: What will stop work six months from now?* | Long-tail | **Yes** (button styled as a footer link, opens the dialog) |
| **Navigation** | Any | Persistent visibility | *Free guide* | | **No.** Standing "no nav CTA" constraint; nav simplification is separate work; adds hierarchy noise for a modest gain |
| **Homepage hero or Problem section** | Early reader | The title matches the Problem section's argument | | | **No.** Interrupts Act One; the hero already has two doors; §48.7 amber budget is spent |
| **Other pages (/product, /how-it-works, /why, roles, FAQ)** | Varies | Most are candidates for removal in the simplification pass | | | **Not in V1.** Revisit after simplification |
| **Campaign landing route** (`/field-guide`, decided D1.1) | Arrived from LinkedIn or email with UTMs | A shareable URL that is the offer itself; the only place page conversion is clean | Page renders the same form inline | Paid and social entry point | **Yes** (decided D1.1; same form component) |

---

## 20. Decision Log

Status values: **OPEN** (needs Jeff), **RECOMMENDED** (recommendation made, awaiting Jeff), **DECIDED**, **DEFERRED**.

### Governance

| ID | Question | Options | Recommendation | Decision | Date | Notes |
|---|---|---|---|---|---|---|
| G-1 | Which branch carries this work? | (a) Continue on `feature/navigation-simplification-lead-gen-guide`. (b) New `feature/procurement-guide-lead-gen` from `main`. | (b) was recommended for scope isolation. | **DECIDED: (a).** The branch was created deliberately for the current website-simplification and lead-generation guide work, and Jeff does not want overlapping homepage and CTA work split across parallel branches. All work, including this plan, is committed here. | 2026-09-12 | Jeff Kaufman. Commits stay logically scoped within the branch; the eventual PR squashes to one commit on `main`. |
| G-2 | Where does this plan live? | `docs/superpowers/plans/` (existing plans folder) vs a new `docs/projects/` tree | `docs/superpowers/plans/2026-09-12-procurement-guide-lead-gen-plan.md`, matching the dated-plan convention already in the repo | **DECIDED** as recommended (accepted with the Round 1 batch). | 2026-09-12 | |
| G-3 | Which PDF is the approved final asset? | The 29-, 18-, or 12-page files found locally, or a file not yet supplied | Jeff to confirm; the brief says 31 pages and no local file matched | **DECIDED: the new 31-page PDF**, *What Will Stop Work Six Months From Now? The JiTpro Field Guide to Construction Procurement Control*. Not yet in the repository or Downloads. The older 12-, 18-, and 29-page files must not be used. Adding the approved file is part of this project (Sprint 1). | 2026-09-12 | Jeff Kaufman. Sprint 1's asset commit waits on the file. |
| G-4 | Extend the Turnstile widget's allowed hostnames to Cloudflare preview URLs? | Yes / No | **Yes**: enables end-to-end testing on PR previews, which CONTRIBUTING notes is impossible today. Cloudflare dashboard change; no code. | **DECIDED (with D5.4): recorded as an external testing requirement**, launch item L-5. Performed by Jeff or an admin when Sprint 4 needs it; fallback is the production smoke test. | 2026-09-12 | Jeff Kaufman |
| G-5 | Git identity for commits in this repository | Configured global identity (`JiTpro-Dev <jeffk@kaufmanbuilding.com>`) vs `Jeff Kaufman <jeff@jit-pro.com>` | Use whichever Jeff designates | **DECIDED: `Jeff Kaufman <jeff@jit-pro.com>`, set repository-locally** (`git config --local`), not globally. Commit `aabcf7e` is left as-is and is not rewritten for author identity. **This identity is repository metadata only.** It is not a visitor-facing address and must never be used as the sender or reply-to of the Field Guide workflow. | 2026-09-12 | Jeff Kaufman. Applied 2026-09-12. |
| G-6 | Keep or drop the js-yaml lockfile patch `fbd6c0d` made during Sprint 1a? | (a) Keep. (b) Revert and wait for Dependabot. | None; recorded as an open item at the end of Sprint 1a. | **DECIDED: (a) keep `fbd6c0d`.** The audit identified the advisory, the lockfile-only patch resolved it, and the required checks passed. **This must not recur.** Dependency maintenance belongs exclusively to Dependabot: Claude reports dependency and audit problems and stops, and never upgrades, downgrades, replaces, patches, pins, or allowlists an existing dependency for advisories, vulnerabilities, CI failures, audits, compatibility, or maintenance. The rule is written in CLAUDE.md ("Dependencies: report only, never correct", commit `0c59e50`). The one narrow exception is a genuinely new dependency that an explicitly approved task requires, called out in the implementation report with the package name and reason. | 2026-09-12 | Jeff Kaufman. Rule written and tightened 2026-09-14. |
| G-7 | When to open the pull request? | (a) One PR at the end of Sprint 6 (§22 as first written). (b) A draft PR now so `build-and-test` and Cloudflare Pages previews run on every push. | (b) offered as an open item at the end of Sprint 1a. | **DECIDED: (b).** Draft PR #52 opened 2026-09-13 from the working branch into `main` (https://github.com/JiTproLabs/JiTpro-Website/pull/52). It stays in draft and is **not merged without Jeff's explicit approval**. `build-and-test` passed on its first run at `38f0447`; Cloudflare Pages builds a preview per push (branch alias `https://feature-navigation-simplific.jitpro-website.pages.dev`). | 2026-09-12 | Jeff Kaufman. The PR description records the project state and is kept accurate as sprints complete. |
| G-8 | Which Supabase project(s) may website work use? | (a) A website staging project plus production. (b) `jitpro_website` only. | None; decided by Jeff after the `jitpro-staging` inspection. | **DECIDED: (b).** **The JiTpro marketing website uses `jitpro_website` as its only Supabase project. JiTpro product-application Supabase projects are separate infrastructure and must not be used for website development, testing, migrations, functions, or storage.** No website staging project is created; `jitpro-staging` and `jitpro-sandbox` are not used, inspected, or modified unless Jeff explicitly asks. The 2026-09-13 inspection is retained as the evidence that `jitpro-staging` belongs to the product application. | 2026-09-14 | Jeff Kaufman. Deliberate simplification: website changes are infrequent and a second project's cost, configuration, syncing, and promotion workflow is not wanted. Safeguards in Section 15.2. |

### Round 1: Visitor experience

| ID | Question | Options | Recommendation | Decision | Date | Notes |
|---|---|---|---|---|---|---|
| D1.1 | Modal, dedicated landing page, or both? | (a) Modal only. (b) Landing page only. (c) Modal for on-site CTAs plus a lightweight landing route using the same form. | **(c)**. The modal keeps on-site readers in context (lowest friction); the landing route gives campaigns a shareable URL with clean page conversion and is the no-JavaScript fallback. Same form component, so the cost is one small page. | **DECIDED: (c).** Build the on-site modal and a lightweight `/field-guide` landing route on the same form and system. | 2026-09-12 | Jeff Kaufman |
| D1.2 | Where do CTAs appear in V1? | See Section 19 | Homepage post-final-CTA band, Learn More post-close band (§50.5 amendment), footer link, landing route. No nav, no hero, no other pages. | **DECIDED as recommended.** V1 placements: homepage band after the existing final commercial CTA; Learn More after the existing close; footer text link; `/field-guide`. **No navigation CTA at this time.** | 2026-09-12 | Jeff Kaufman. The homepage band still needs its Design System Decision Log entry (D6.6) when the band's composition is approved in Round 6. |
| D1.3 | Fields collected from the visitor | Email only vs email plus name/company | **Email only.** Anonymous → known email is the whole objective; every extra field costs conversions and nothing in V1 uses the data. | **DECIDED: email address only.** | 2026-09-12 | Jeff Kaufman |
| D1.4 | CTA and dialog naming under §20.1 | (a) Use the full title including *Construction Procurement Control* everywhere and approve an exception for quoting a publication title. (b) Lead with *What Will Stop Work Six Months From Now?* and describe it as *the JiTpro field guide* on the homepage, Learn More, and in the dialog; use the full title in the email and on the landing route. | **(b)**. Complies with §20.1 without an amendment, and the main title is the stronger hook for the growth-stage GC the homepage is written for. | **DECIDED: (b).** On the homepage and Learn More use the main publication title, *What Will Stop Work Six Months From Now?*, and describe it as the JiTpro Field Guide. Use the full *Construction Procurement Control* title where the Design System restriction does not apply (email, `/field-guide`, the PDF route). | 2026-09-12 | Jeff Kaufman. Exact strings in Round 6. |
| D1.5 | Immediate access or inbox verification first? | Immediate vs double opt-in | **Immediate.** Verification halves conversion and the brief's default is immediate. Bounce data from Resend is enough hygiene for V1. | **DECIDED: immediate access after successful submission; no inbox verification.** | 2026-09-12 | Jeff Kaufman |
| D1.6 | Open PDF in browser or force download? | Inline in a new tab vs `download` attribute | **Inline in a new tab.** Works on every device, the browser viewer offers Save, and mobile Safari handles inline PDFs better than forced downloads. | **DECIDED: open inline in a new browser tab** so the visitor can read it or save it from the browser. | 2026-09-12 | Jeff Kaufman |
| D1.7 | Amend §50.5 to allow one lead-magnet offer on `/learn-more` after the close? | Yes / No (then no Learn More CTA) | **Yes**, scoped: exactly one lead-magnet offer, placed after the closing section, quieter than the primary offer, same component as the homepage. | **DECIDED: yes.** Narrow amendment permitting exactly one lead-magnet offer on Learn More after the existing close, visually subordinate to the primary commercial offer. | 2026-09-12 | Jeff Kaufman. The amendment text is written into the Design System and its Decision Log in Sprint 1. |

### Round 2: Lead storage and attribution

| ID | Question | Options | Recommendation | Decision | Date | Notes |
|---|---|---|---|---|---|---|
| D2.1 | Where do leads live? | (a) Reuse `leads` with `intent='guide'`. (b) One `lead_magnet_requests` event table. (c) `contacts` identity table plus `lead_magnet_requests` events. | **(c)** (Section 6). Identity without duplicates, full request history, consent and suppression ready for nurture, no pollution of the contact-form table. | **DECIDED: (c).** Two new Supabase tables: `contacts` (durable identity, one row per normalised email, "who is this person?") and `lead_magnet_requests` (one row per valid request, "what did this person request or do?"). The separation is preserved; the two are never collapsed. **The existing `leads` table stays separate and unchanged in V1**; guide requests are never routed through it and the contact-form pipeline is not modified or put at risk. | 2026-09-12 | Jeff Kaufman |
| D2.2 | Duplicate requests from the same email | Reject / always new contact / one contact, many request rows | One contact, many request rows, `is_repeat` flagged, email re-send throttled (24 h proposed) | **DECIDED with one change: a one-hour fulfilment-email cooldown, not 24 hours.** Every valid request: normalise email, upsert the single contact, insert a request event, record repeat state, grant immediate access, re-send the email only if the last successful fulfilment email is more than one hour old. Within the hour: no rejection, no duplicate contact, event recorded, access granted, no second email. Turnstile and rate limiting are the primary abuse controls. | 2026-09-12 | Jeff Kaufman |
| D2.3 | Attribution fields | Section 6.2 list | Capture placement, page, landing path, referrer, five UTMs, asset version, statuses. Drop `user_agent` unless Jeff wants it. | **DECIDED as proposed.** Captured: CTA placement, page path at submission, first landing path, referrer, UTM source/medium/campaign/content/term, asset id, asset version, Turnstile outcome, email-send status, Resend message id, salted IP hash strictly for abuse control. **Not stored: user agent, raw IP.** Still excluded: name, company, phone, job title, geolocation, enrichment. The IP hash must not become profile data; a short retention period is recommended in D2.7 and documented before implementation. | 2026-09-12 | Jeff Kaufman |
| D2.4 | CRM or contact-system integration | None exists | None in V1; export is a SQL query or CSV from the Supabase dashboard | **DECIDED: no CRM in V1.** Supabase is the source of truth. Reporting and export via Supabase queries or CSV. The `contacts` design must leave a clean path to a CRM later; no CRM dependency is introduced. | 2026-09-12 | Jeff Kaufman |
| D2.5 | What is a lead vs a marketing subscriber? | | A guide requester is a **lead** (transactional relationship). They become a **subscriber** only when `consent_status = marketing_opt_in`. | **DECIDED.** A guide requester is a lead/contact with a transactional relationship (JiTpro owes them the requested asset). That does not make them a marketing subscriber. Subscriber status arises only when the approved consent mechanism records `consent_status = marketing_opt_in`. Requesting the guide does not authorise future marketing by itself. Round 3 decides the consent language, whether opt-in is explicit, the state recorded for guide-only requests, unsubscribe and suppression behaviour, privacy-policy requirements, consent evidence to retain, and what future email may be sent under which state. | 2026-09-12 | Jeff Kaufman |
| D2.6 | Should the existing contact form also write to `contacts` in V1? | Yes (foreign-key correlation) / No (email join) | No: avoid regression risk in a separately working pipeline | **DECIDED: no.** The contact form is not modified. A later conversation-form submission is correlated with an earlier guide requester by normalised email. Unifying the identities is recorded as a potential future architectural improvement (F-6), not part of this implementation. | 2026-09-12 | Jeff Kaufman |
| D2.7 | Retention and handling of the salted IP hash | Column on request rows with scheduled clearing / separate short-lived table / no IP data at all | **Separate `lead_magnet_ip_activity` table, 24-hour retention, daily-rotating salt, deleted opportunistically by the function** (Section 9.1). Meets "abuse control only, never profile data" without a scheduler. | **DECIDED (with Round 3): approved as documented in Section 9.1.** Separate short-lived abuse storage; 24-hour retention; daily-rotating salt; no raw IP; never part of the durable prospect or contact profile; automatic expiry after the retention period. | 2026-09-12 | Jeff Kaufman |

### Round 3: Email and consent

| ID | Question | Options | Recommendation | Decision | Date | Notes |
|---|---|---|---|---|---|---|
| D3.1 | Provider | Resend (existing) | Resend | **DECIDED: Resend.** No other email provider is introduced. | 2026-09-12 | Jeff Kaufman. DNS confirms both sending domains; dashboard confirmation is launch item L-4. |
| D3.2 | From name/address and reply-to | (a) omit reply-to; (b) explicit `reply_to: info@jit-pro.com`; (c) another address | (b) | **DECIDED: (b).** From `JiTpro <info@jit-pro.com>`; Reply-To `info@jit-pro.com` set explicitly. `jeff@jit-pro.com` is never exposed anywhere in the visitor-facing workflow. `info@` is the intended monitored address; Microsoft 365 routing is verified as launch item L-1, not assumed. | 2026-09-12 | Jeff Kaufman |
| D3.3 | Fulfilment copy | Section 7.1 draft plus footer additions | Draft plus reason-for-receipt line and business mailing address | **DECIDED.** Footer line: *You received this email because you requested the JiTpro Field Guide at jit-pro.com.* **AMENDED 2026-09-15 (S3-1): no business or personal mailing address appears in the fulfilment email, the capture experience, or anywhere else in this project, and none is required for Sprint 3, Sprint 5, or production launch.** The footer is the reason-for-receipt line plus *Questions? info@jit-pro.com*. Message stays primarily transactional and short. Final classification and wording get legal review before launch (L-3). Final copy approved in Round 6. | 2026-09-12 | Jeff Kaufman |
| D3.4 | Consent mechanism at capture | (A) transactional only; (B) notice-based opt-out; (C) explicit unchecked checkbox; (D) success-state opt-in | (C) | **DECIDED: (C).** Email field plus one quiet optional checkbox, unchecked by default. Working wording: *Also send me occasional JiTpro insights on construction procurement and keeping projects ahead of the field. I can unsubscribe at any time.* (not final; presented in Round 6). Unchecked → `transactional_only`; checked → `marketing_opt_in`. Recorded: status, method, text version, timestamp, placement, page path, asset. A guide request alone never silently creates `marketing_opt_in`. Prospects outside the US are assumed plausible, so no US-only notice model. Final wording to legal review (L-3). | 2026-09-12 | Jeff Kaufman |
| D3.5 | Nurture in V1 and permissions by state | | No nurture; permissions per state | **DECIDED.** No nurture sequence in V1. Permissions recorded in Section 7.3: `transactional_only` (fulfilment, cooldown-gated re-send, asset-related service messages); `marketing_opt_in` (the above, plus a future approved sequence once separately approved and built); `unsubscribed` (no marketing; transactional fulfilment still allowed on an explicit new request unless suppressed); suppressed (no delivery attempt). No marketing sequence is implemented in this project unless separately approved. | 2026-09-12 | Jeff Kaufman |
| D3.6 | Unsubscribe and suppression | (a) tokenised unsubscribe endpoint now; (b) defer until before the first marketing send | (b) | **DECIDED: (b).** No unsubscribe endpoint in V1 unless a later scope decision requires it; a proper mechanism is mandatory before any marketing email (nurture prerequisite N-1). Fulfilment email carries no marketing unsubscribe link. Schema supports unsubscribe and suppression now. Privacy notice explains how to contact JiTpro about consent and data choices via `info@`. Resend's automatic suppression is relied upon; API-reported suppression or failure is recorded as the email status; the visitor still gets immediate on-screen access with a calm message. Resend webhook receiver deferred to the nurture and email-hardening project (F-7). | 2026-09-12 | Jeff Kaufman |
| D3.7 | Add a privacy notice page to scope? | Yes / No | Yes | **DECIDED: yes.** `/privacy` added to this project, linked from the capture form's fine print and the footer. Plain English, scoped to actual behaviour, minimum contents listed in Section 10 item 1. No Terms page in V1. Legal review before production launch (L-3). | 2026-09-12 | Jeff Kaufman |
| D3.8 | Internal notification per request | Per request / daily digest / none; sender choice | Per request; From `info@` | **DECIDED with modification.** One notification per valid request To `info@jit-pro.com`, From `JiTpro Notifications <info@jit-pro.com>` (**amended 2026-09-15, S2-19**: the original `noreply@mail.jit-pro.com` sender was rejected by Resend with 403 because `mail.jit-pro.com` is not verified in the marketing-site account; the "not From `info@` to itself" preference is withdrawn). `jeff@` stays out of the workflow. Concise content: requester email, CTA placement, page, source/UTM summary, repeat flag, fulfilment email status. No IP hashes or unnecessary technical data. | 2026-09-12 | Jeff Kaufman |
| D3.9 | Development and test safety | | Resend test recipients, tags, idempotency key, test mode | **DECIDED as recommended.** Test recipients `delivered@`, `bounced@`, `complained@`, `suppressed@resend.dev`; tags `asset` and `environment`; `Idempotency-Key` from the request or event id; `LEAD_MAGNET_TEST_MODE` restricting non-production recipients to `@resend.dev` and `@jit-pro.com`; existing env-var conventions; no hard-coded secrets. | 2026-09-12 | Jeff Kaufman |
| D3.10 | Consent evidence retained | | Version id, timestamp, method, placement, page, asset, resulting status; versioned sentences in code | **DECIDED as recommended.** Historical sentence text kept in version-controlled code (`consentTexts.ts` or equivalent); a used version is never edited in place; wording changes create a new version. | 2026-09-12 | Jeff Kaufman |
| D3.11 | Legal and compliance operating principle | | | **DECIDED.** Design conservatively, document actual behaviour, flag final language and legal classification for appropriate legal review, never present implementation decisions as legal advice. | 2026-09-12 | Jeff Kaufman |

### Round 4: Analytics

| ID | Question | Options | Recommendation | Decision | Date | Notes |
|---|---|---|---|---|---|---|
| D4.1 | Analytics system | (A) first-party events in Supabase plus Cloudflare Web Analytics; (B) Plausible; (C) GA4; (A-minus) no event table | (A) | **DECIDED: (A).** Cloudflare Web Analytics for site and page-level traffic and performance; Supabase `lead_magnet_events` for the seven funnel events; Supabase the system of record for contacts, requests, consent, fulfilment, attribution, downstream conversion. No GA4; no Plausible in V1; no analytics cookies. Enablement is launch item L-9. | 2026-09-12 | Jeff Kaufman |
| D4.2 | Funnel events | Section 8.1 | Seven named events, counts only | **DECIDED.** The seven event names and definitions in Section 8.1 are the fixed vocabulary for implementation and future reporting. No visitor or session ids; no email or personal information in events. | 2026-09-12 | Jeff Kaufman |
| D4.3 | CTA placement measurement | | Fixed `placement` on events and requests | **DECIDED.** Fixed placement values `home-band`, `learn-more-band`, `footer-link`, `landing-page` stamped on every event and request row; per-placement funnel query. | 2026-09-12 | Jeff Kaufman |
| D4.4 | UTM persistence | `sessionStorage` vs 30-day first-party cookie | `sessionStorage` | **DECIDED: `sessionStorage`** for first-touch UTMs, referrer, and landing path during the current browsing session. No cookie. | 2026-09-12 | Jeff Kaufman |
| D4.5 | Distinguishing homepage, Learn More, footer, and `/field-guide` conversions | | `placement` plus `page_path` | **DECIDED** as proposed (Section 8.2 page conversion; footer link records the page it was clicked from). | 2026-09-12 | Jeff Kaufman |
| D4.6 | What lives in analytics vs Supabase | | Split as proposed | **DECIDED.** Supabase: contacts, requests, consent, fulfilment outcomes, attribution, funnel counts, downstream conversion. Cloudflare: page views, visits, referrers, countries, devices, performance. Nothing personal to any third party. | 2026-09-12 | Jeff Kaufman |
| D4.7 | Connecting a guide request to a later conversation | Email join vs contact-form integration | Email join | **DECIDED.** Normalised-email correlation between `contacts` and the existing `leads` table (saved query 8). F-6 remains the future improvement. | 2026-09-12 | Jeff Kaufman |
| D4.8 | Privacy and cookie implications | | No cookies, no identifiers | **DECIDED as designed, with the no-cookie and no-consent-banner assumptions recorded as requiring final legal and privacy review (L-3)**, not treated as legal conclusions. | 2026-09-12 | Jeff Kaufman |
| D4.9 | Reporting | SQL in Supabase vs an admin page | Saved SQL queries for V1 | **DECIDED.** The eight saved queries in Section 8.3, versioned in the repository, plus the Cloudflare dashboard. An internal report page is a possible later scope decision, not V1. | 2026-09-12 | Jeff Kaufman |
| D4.10 | Smallest useful V1 | | As in Section 4.7 | **DECIDED.** One table, one small function, seven events, fixed placements, `sessionStorage` UTMs, Cloudflare Web Analytics on, eight saved queries. | 2026-09-12 | Jeff Kaufman |

### Round 5: Technical and security behaviour

| ID | Question | Options | Recommendation | Decision | Date | Notes |
|---|---|---|---|---|---|---|
| D5.1 | PDF hosting | (a) `public/guides/` on Cloudflare Pages; (b) Supabase Storage | (a) | **DECIDED: (a).** The approved 31-page PDF committed under `public/guides/` with a versioned filename and served by Cloudflare Pages; clean visitor-facing filename via `Content-Disposition: inline; filename=...` in `_headers`. No older PDF is substituted; obtaining the exact approved file is an implementation prerequisite (L-8). | 2026-09-12 | Jeff Kaufman |
| D5.2 | Stable route | (a) `/guides/procurement`; (b) `/guides/procurement-field-guide`; (c) `/field-guide/download` | (b) | **DECIDED: (b) `/guides/procurement-field-guide`**, establishing `/guides/<asset-slug>`. A `_redirects` 302 to the current versioned file, placed above the SPA catch-all. Asset replaceable without changing distributed links. Automated consistency check between `_redirects` and the registry. | 2026-09-12 | Jeff Kaufman |
| D5.3 | Repeat requests | | Round 2 behaviour | **CONFIRMED.** Always grant immediate access; one-hour email cooldown; never reject legitimate repeats. | 2026-09-12 | Jeff Kaufman |
| D5.4 | Bot protection | (a) visible Turnstile; (b) Turnstile interaction-only plus server honeypot plus server validation; (c) honeypot and rate limit only | (b) | **DECIDED: (b).** Interaction-only Turnstile, server-side verification, server-checked honeypot, server validation. No challenge unless Cloudflare requires it. Expired tokens handled gracefully. Preview-hostname configuration recorded as an external testing requirement (G-4, L-5). | 2026-09-12 | Jeff Kaufman |
| D5.5 | Rate limiting | 5 vs 10 requests per hash per 10 minutes; events ceiling | 5 / 100 | **DECIDED with modification: 10 request attempts per salted IP hash per 10 minutes** (shared office IPs must not be blocked), **100 events per hash per 10 minutes**, both in the 24-hour abuse table, both single configurable constants. Calm 429 when exceeded. | 2026-09-12 | Jeff Kaufman |
| D5.6 | Failure behaviour | Fail closed vs fail open on persistence failure | Fail closed on persistence failure | **DECIDED with modification: FAIL OPEN FOR GUIDE ACCESS.** JiTpro infrastructure failure never withholds the guide. Cases 1 to 4 in Section 13.1; persistence failure still grants access, tells the visitor honestly that the request could not be saved or sent, offers `info@jit-pro.com`, logs, and triggers the internal failure alert. | 2026-09-12 | Jeff Kaufman |
| D5.7 | Logging and observability | | As proposed plus masking and plan check | **DECIDED.** Request-id logs; internal notification per successful request; failure alert From `JiTpro Notifications <info@jit-pro.com>` to `info@` on persistence failure (S2-19); sanitised Resend outcome logging (S2-20); Pulsetic monitor on the stable URL following the redirect (L-11); saved volume query. **Email addresses masked in logs**; no raw IPs or unnecessary IP hashes in logs. Supabase plan and log retention confirmed as L-10, not guessed. | 2026-09-12 | Jeff Kaufman |
| D5.8 | Test framework | (a) Vitest; (b) none; (c) Deno test | (a) | **DECIDED: (a) Vitest 5** on Vite 8; `npm test` in CI before build; pure-logic tests for the list in Section 14.1; no jsdom unless genuinely required; no abstraction solely for testability. | 2026-09-12 | Jeff Kaufman |
| D5.9 | Server platform | Supabase Edge Functions vs Cloudflare Pages Functions | Supabase | **CONFIRMED: Supabase Edge Functions.** No Cloudflare Pages Functions for this workflow. | 2026-09-12 | Jeff Kaufman |
| D5.10 | SEO and indexing | | noindex the PDF; index `/field-guide` | **DECIDED.** `X-Robots-Tag: noindex` on the actual PDF via `_headers`; `/field-guide` indexable with its own title and meta description; no `robots.txt` or sitemap work unless later approved. | 2026-09-12 | Jeff Kaufman |
| D5.11 | Backend test environment | (a) production with test mode; (b) `jitpro-staging` first | (b) if available | **AMENDED 2026-09-14: `jitpro_website` only, with single-project safeguards (G-8).** Backend work is additive and isolated on `jitpro_website`; read-only inspection before any migration; each migration and function applied only after Jeff approves the exact change set; `LEAD_MAGNET_TEST_MODE` and identifiable test data replace staging promotion; the draft PR's Cloudflare preview for frontend verification; production CTA inactive until the backend is verified; no destructive operation ever. Full rules in Section 15.2. *(Original 2026-09-12 decision: (b), `jitpro-staging` first subject to inspection, with staging secrets, a preview pointed at staging, and promotion to production. Superseded; the inspection found `jitpro-staging` to be the product application's database.)* | 2026-09-12, amended 2026-09-14 | Jeff Kaufman |
| D5.12 | External configuration governance | | | **DECIDED.** No account or dashboard change requiring Jeff's approval or credentials is performed silently. The assistant states what is needed and guides Jeff through it when the step is reached (L-5, L-9 to L-14). | 2026-09-12 | Jeff Kaufman |

### Round 6: Final UX, content, and Design System amendments

| ID | Question | Recommendation | Decision | Date | Notes |
|---|---|---|---|---|---|
| D6.1 | All visitor-facing copy (bands, footer, landing page, dialog, states, email, notifications) | One recommended version per string | **DECIDED.** Approved with Jeff's edits: the band's supporting sentence and the landing-page intro reworded; the band's reassurance line removed and not replaced; the success button is *Open the field guide*. Full specification in Section 25. | 2026-09-12 | Jeff Kaufman |
| D6.2 | §28 Modals: marketing lead-capture dialog | Amendment A1 | **APPROVED (A1).** Text in Section 26. | 2026-09-12 | Jeff Kaufman |
| D6.3 | §24 Forms: marketing capture field, checkbox, fine print | Amendment A2 | **APPROVED (A2).** | 2026-09-12 | Jeff Kaufman |
| D6.4 | §33 / §32: marketing form error, status, and submit-in-progress | Amendments A3, A4 | **APPROVED (A3, A4).** No new semantic error colour is introduced. | 2026-09-12 | Jeff Kaufman |
| D6.5 | §34 / §36 minimum touch target | Amendment A5 | **APPROVED (A5): 44 by 44 CSS px.** Resolves the 2026-09-03 open TODO. | 2026-09-12 | Jeff Kaufman |
| D6.6 | Homepage composition: lead-magnet offer band after the final CTA | Amendment A7 | **APPROVED (A7).** After the final commercial CTA, before the footer, never in the hero, at most one per page. | 2026-09-12 | Jeff Kaufman |
| D6.7 | Consent checkbox wording and fine print | Section 25.5 | **DECIDED.** Checkbox: *Also send me occasional JiTpro insights on keeping projects ahead of the field. I can unsubscribe at any time.* Unchecked by default. Fine print: *We'll email you a link to the guide. Read our privacy notice.* Both subject to legal review (L-3). | 2026-09-12 | Jeff Kaufman |
| D6.8 | Fulfilment email, internal notification, and recovery alert copy | Sections 25.7 to 25.9 | **DECIDED**, **amended 2026-09-15 (S3-1): the mailing-address element is removed entirely, not deferred.** Plain-text part approved. Classification and footer wording to legal review (L-3). | 2026-09-12 | Jeff Kaufman |
| D6.9 | Privacy notice | Draft timing | **DECIDED: complete draft written now (Section 27), before Sprint 1**, from the actual architecture, no boilerplate. Marked SUBJECT TO LEGAL REVIEW BEFORE PRODUCTION LAUNCH. **Amended 2026-09-15 (S3-1): no mailing address; the contact line is the email address alone.** | 2026-09-12 | Jeff Kaufman |
| D6.10 | Visitor-facing failure language | Per-cause messages vs one calm shared state | One calm shared state | **DECIDED: simplify.** Three access-granting visitor states only (Section 13.2). Causes stay internal. No mention of databases, rate limits, verification, or networks to visitors. Quiet *Try again* only where genuinely useful (network, timeout). | 2026-09-12 | Jeff Kaufman |
| D6.11 | Secondary sales CTA in the success state | Yes / No | No | **DECIDED: NO.** No *Start with one project*, contact, scheduling, or other commercial CTA in the guide-success state. The guide itself carries JiTpro's commercial path. | 2026-09-12 | Jeff Kaufman |
| D6.12 | Marketing opt-in line in the internal notification | Include / omit | Include | **DECIDED: keep it.** | 2026-09-12 | Jeff Kaufman |
| D6.13 | Full requester email in the persistence-failure recovery alert | Include / mask | Include | **DECIDED: include the full address, deliberately**, for lead recovery. Ordinary logs stay masked. | 2026-09-12 | Jeff Kaufman |
| D6.14 | §26 / §48.1 hairline secondary button; §20.2 offer band; §50 amendment; §20.1 and §7.7 non-amendments | Amendments A6 to A10 | **APPROVED (A6 to A10).** Text in Section 26. | 2026-09-12 | Jeff Kaufman |
| D6.15 | Footer changes | Add items vs redesign | Add two items only | **DECIDED.** *Free field guide* in the Company column (established footer-link appearance, opens the dialog); *Privacy* in the bottom legal area. No other footer redesign. | 2026-09-12 | Jeff Kaufman |

---

## 21. Open questions (require Jeff)

**The Sprint 2 integration-test target is decided** (G-8, D5.11 as amended 2026-09-14: `jitpro_website` only). All six decision rounds are recorded in Section 20. Everything else is external to the repository and is consolidated in Section 28:

1. **Testing cases that shared secrets make unsafe on a single project** (raised 2026-09-14 by the G-8 amendment; decided with the Sprint 2 and Sprint 3 function change sets, not before). `TURNSTILE_SECRET_KEY` and `RESEND_API_KEY` are shared with the live contact-form functions, so they cannot be swapped for a Cloudflare always-pass test key or an invalid Resend key to exercise the valid-`curl`, simulated-persistence-failure, and email-failure cases. The options (for example a real browser token from the preview, or a test-only override honoured only while `LEAD_MAGNET_TEST_MODE` is set and removed at go-live) are presented to Jeff with the function proposal. Nothing is changed until he chooses. **Resolved for Sprint 2 on 2026-09-15 (S2-11, S2-12):** a Turnstile test secret and a secret-gated persistence-fault hook, both honoured only in test mode and removed at go-live. The Sprint 3 email-failure case is still to be decided with the Sprint 3 change set.
2. The approved 31-page PDF file (L-8).
3. ~~JiTpro's business mailing address (L-2).~~ **Withdrawn 2026-09-15 (S3-1): no mailing address is used anywhere in this project, and nothing waits on one.**
4. Legal review of the consent wording, fine print, privacy notice, and email classification (L-3); it can run in parallel with implementation and must complete before production launch.
5. Dashboard and account configuration (L-1, L-4, L-5, L-9 to L-14), each requested when its sprint reaches it.
6. Optional context: whether a paid or scheduled LinkedIn campaign is planned for launch. It changes nothing in scope; it only raises the priority of testing `/field-guide` with UTM links.

### 21.1 Follow-up items outside this project's scope (recorded 2026-09-12)

These were found during discovery. They are tracked here so they are not lost. **None of them expands this project's implementation scope unless Jeff explicitly approves it.**

| # | Finding | Evidence | Suggested follow-up |
|---|---|---|---|
| F-1 | **CLAUDE.md's Deployment section is stale.** It describes a GitHub Pages deploy via `.github/workflows/deploy.yml`; that workflow was deleted in PR #21 and Cloudflare Pages is the only deployment. The Project Overview line also still says "Deployed to GitHub Pages via GitHub Actions". | `git log` for `c6a0405`; `docs/CONTRIBUTING.md`; live response headers | A small `docs:` PR correcting CLAUDE.md to match CONTRIBUTING.md. |
| F-2 | **The `/demo` form is very likely dead in production.** `src/pages/Demo.tsx` posts to `submit-demo-request`, but that function is not among the seven deployed functions in the Supabase project. CLAUDE.md describes it as the backend. | `supabase functions list` (2026-09-12) | Decide whether `/demo` should remain; either deploy the function or retire the page. **Not part of this project.** |
| F-3 | **Outdated Field Guide drafts exist in Downloads.** `JiTpro_What_Will_Stop_Work_Six_Months_From_Now_FINAL.pdf` (12 pp), `Construction_Procurement_Field_Guide.pdf` (18 pp), and `JiTpro_Construction_Procurement_Field_Guide.pdf` (29 pp) are all superseded by the approved 31-page asset. | File metadata, 2026-09-12 | Archive or delete the drafts so the wrong file is never committed. Only the approved 31-page file enters the repository. |
| F-4 | `submit-contact` performs no server-side field validation or honeypot check and no rate limiting; the client is trusted after Turnstile. | `supabase/functions/submit-contact/index.ts` | Consider hardening in a separate contact-form pass; the lead-magnet function's shared validation modules could be reused. |
| F-5 | No `robots.txt`, `sitemap.xml`, meta description, or Open Graph tags exist (the last three were already recorded in `docs/handoff/2026-08-25-contact-conversion-and-metadata-defects.md`). | `public/`, `index.html` | Separate metadata pass. Relevant to `/field-guide` sharing on LinkedIn, so the landing route should at least set its own title and description when built. |
| F-6 | **Contact-form identity is not unified with `contacts`.** In V1 a conversation request is correlated with a guide requester by normalised email only. | Decision D2.6 | Potential future architectural improvement: have the contact pipeline upsert `contacts` as well, turning the correlation into a foreign key. Requires its own plan and regression testing of the contact form and its webhook. |
| F-8 | **Investor emails use the unverified `mail.jit-pro.com` sender.** `submit-investor-request` (From `JiTpro Investor Requests <noreply@mail.jit-pro.com>` to `info@`) and `approve-investor` (From `JiTpro <noreply@mail.jit-pro.com>` to the investor) will be rejected by Resend with the same 403 *Domain not verified* seen in Step 3. `approve-investor` also tells the investor to "reply to this email" while setting no Reply-To. | Step 3 diagnosis, 2026-09-15; `supabase/functions/approve-investor/index.ts:85`, `supabase/functions/submit-investor-request/index.ts:124` | A separate change to the investor functions, if Jeff wants that flow working: either move them to the verified `jit-pro.com` identity or verify `mail.jit-pro.com`. **Not part of this project**, and nothing was changed. |
| F-7 | **No Resend webhook receiver.** Bounces, complaints, and suppressions after the API accepts a send are visible only in the Resend dashboard and are not mirrored into `contacts`. | Decision D3.6 | Future nurture and email-hardening project: an edge function receiving `email.bounced`, `email.complained`, `email.suppressed` (signature-verified) that sets `email_suppressed_at` and `email_suppression_reason`. |

### 21.2 Prerequisites for any future marketing or nurture email (recorded 2026-09-12)

None of these is built in this project. All must exist before the first marketing send.

| # | Prerequisite | Source |
|---|---|---|
| N-1 | A working unsubscribe mechanism (tokenised link or Resend Audiences/Broadcasts equivalent) that sets `consent_status = unsubscribed` and is honoured by every send path | D3.6 |
| N-2 | Suppression mirroring from Resend (F-7) so suppressed addresses are never attempted | D3.6 |
| N-3 | Approved sequence content and cadence, with claim strength governed by Design System §20.1 and the brief's content-governance rules | Brief §8, §28 |
| N-4 | Sends restricted to `consent_status = marketing_opt_in` contacts whose consent evidence (D3.10) is present | D3.4, D3.5 |
| N-5 | CAN-SPAM-required elements on every marketing message (identification, physical address, functioning opt-out) and CASL/GDPR-appropriate handling for non-US recipients; legal review | D3.11 |
| N-6 | Privacy notice updated to describe the marketing programme | D3.7 |

---

## 22. Sprint plan (FINAL, 2026-09-12; execution awaits Jeff's explicit go-ahead)

Organised by working capability. The persistence API is built **before** the visitor UI so that the UI sprint is verified end to end against the real contract rather than a mock. Each sprint follows the execution protocol in the brief: state the objective, review dependencies, confirm repository state, explain what will change, implement in focused commits, test, browser-QA where applicable, update this document, summarise, and stop if a material new decision appears.

**Implementation order:** 1a → 1b (when the PDF arrives; may run alongside 2) → 2 → 3 → 4 → 5 → 6. Sprint 1b is the only step gated on an external deliverable; nothing else waits on it until Sprint 4's browser QA needs the real PDF behind the route.

**Git expectations for every sprint** (from the brief, Section 18): work stays on `feature/navigation-simplification-lead-gen-guide`; before each commit review `git status` and the diff, confirm only intended files changed, run `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, and `npx audit-ci --config ./audit-ci.jsonc`, fix failures rather than committing broken work unless Jeff approves a WIP checkpoint, write a descriptive message, and report the hash. A failure caused by a dependency is the exception: report it and stop, never patch, because dependency maintenance is Dependabot's alone (CLAUDE.md, G-6). Push only to this branch with Jeff's knowledge. One PR to `main`: draft PR #52, opened early per G-7 so CI and previews run on every push; merge only on Jeff's explicit word after `build-and-test` passes.

### Sprint 0: Discovery and architecture (COMPLETE 2026-09-12)

- **Objective:** existing infrastructure understood; architecture and decisions approved.
- **Delivered:** repository discovery (Section 3), this plan, six decision rounds (Section 20), Design System amendment texts (Section 26), privacy notice draft (Section 27), approved copy (Section 25), sprint plan, external prerequisites (Section 28).
- **Exit criteria met:** no architectural or product question blocks implementation. Remaining items are external (Section 28).
- **Commits:** `aabcf7e` (plan), `6f4834a` (Round 2), `dde8c67` (Round 3), `953575b` (Round 4), `ea14571` (Round 5), `2227b19` (Round 6 and final sprint plan), `684288f` (privacy-draft revisions; Sprint 1a authorised). Branch pushed to origin at `684288f`.

### Sprint 1a: Foundation without the asset

- **Objective:** the tooling, registries, and Design System standards exist so every later sprint builds on approved conventions.
- **Scope:** Vitest 5 installed; `npm test` added and wired into CI before the build step; client registry `src/content/leadMagnets.ts` (id, version, titles, approved copy, stable route, placements); server registry in `supabase/functions/_shared/lead-magnet/`; `src/content/consentTexts.ts` with version `v1`; Design System amendments A1 to A10 written into `docs/design/JiTpro_Design_System_v1.0.md` with Decision Log entries; registry consistency tests (client and server agree; consent versions immutable).
- **Out of scope:** the PDF, the route, UI, API, email.
- **Dependencies:** Jeff's go-ahead. No external prerequisite.
- **Tasks:** add Vitest and config; add `test` script; CI step; registries; consent texts; DS edits; tests.
- **Acceptance criteria:** `npm test` passes locally and in CI; typecheck, lint, build unchanged; the Design System contains A1 to A10 with dated Decision Log rows; registries typed and tested.
- **Tests:** registry agreement; consent-text immutability; a trivial smoke test proving the runner works in CI.
- **Risks:** CI time increases slightly; Vitest config must exclude `supabase/functions` Deno entry points from type checking (only `_shared` pure modules are imported).
- **Decision dependencies:** none outstanding.
- **Definition of done:** CI green with the new step; DS amendments merged into the document; plan updated with commits.
- **Commit boundaries:** (1) test tooling and CI; (2) registries and consent texts with tests; (3) Design System amendments.

**Completion record (2026-09-12).**

| Item | Result |
|---|---|
| Commits | `94dfaf5` test tooling and CI · `fbd6c0d` chore: js-yaml 4.3.2 (see deviations) · `3581038` shared registry, consent texts, approved copy, tests · `1e71a17` Design System amendments A1 to A10 · plus the docs commit recording this table |
| Tests run before each commit | `npm run typecheck` (clean), `npm run lint` (0 errors, the 4 pre-existing warnings), `npm test` (3 files, 16 tests, all passing), `npm run build` (ok), `npx audit-ci` (passing after the js-yaml patch) |
| Acceptance criteria | Met locally: `npm test` passes; typecheck, lint, and build unchanged; the Design System contains 20.2, 24.1, 26.1, 28.1, 32.1, 33.1, 34.1, the §50.5 amendment, and the §20.1 and §7.7 notes with seven dated Decision Log rows covering A1 to A10; registries typed and tested. **CI verified 2026-09-13 on draft PR #52:** `build-and-test` passed on its first run at `38f0447` (run 34736987818) and Cloudflare Pages deployed the preview. |
| Deviations from plan | (a) One shared registry imported by the site instead of two registries plus an agreement test; stronger guarantee, recorded in §4.3. (b) A pre-existing high-severity advisory (GHSA-2883-xcg3-v3hh, js-yaml 4.3.1 via eslint) surfaced in `audit-ci` during the sprint; it predates the Vitest install and would fail the required check on any PR, so it was patched to 4.3.2 as its own lockfile-only chore commit on this branch. Dependabot had not opened a PR at the time. (c) The runner smoke test lives at `src/testing/runner.test.ts` so it is type-checked with the rest of `src`. (d) The Decision Log records A3 with A4, A7 with A8, and A9 with A10 as combined rows. |
| Unresolved | None for this sprint. Sprint 1b waits on L-8. |

### Sprint 1b: The asset and the stable route (gated on L-8)

- **Objective:** the site serves the approved Field Guide at a stable URL.
- **Scope:** commit the approved 31-page PDF as `public/guides/jitpro-construction-procurement-field-guide-2026-09.pdf` (version label adjusted to the file's actual date if Jeff prefers); `_redirects` rule `/guides/procurement-field-guide` → the versioned file, 302, above the SPA catch-all; `_headers` rule for the PDF path: `Content-Disposition: inline; filename="JiTpro-Construction-Procurement-Field-Guide.pdf"`, `X-Robots-Tag: noindex`, long `Cache-Control`; redirect-and-asset consistency test.
- **Out of scope:** everything else.
- **Dependencies:** the approved 31-page PDF supplied by Jeff (L-8); Sprint 1a registries.
- **Acceptance criteria:** page count and title of the committed file verified as the approved asset; on a Cloudflare preview the stable route returns 302 to the file; the file opens inline and saves under the clean filename; `X-Robots-Tag` present; lychee passes; consistency test passes.
- **Tests:** consistency test; manual preview verification with `curl -I`.
- **Risks:** file not yet supplied; redirect ordering (verified on preview).
- **Definition of done:** preview verified; plan updated.
- **Commit boundaries:** (1) asset, redirect, headers, test in one commit (they are one working capability).

**Completion record (2026-09-15). Sprint 1b complete.**

| Item | Result |
|---|---|
| Asset | Jeff placed the approved PDF at `public/guides/jitpro-construction-procurement-field-guide-2026-09.pdf` (145,208 bytes, SHA-256 `c65050d2…e8de2ce`). Verified before committing: valid PDF (header `%PDF-1.4`, correct trailer), **31 pages**, document title *What Will Stop Work Six Months From Now?*, subject *The JiTpro Field Guide to Construction Procurement Control*, author JiTpro, letter size, unencrypted; cover text matches the approved title, subtitle, and standfirst; the rendered cover carries the approved brand amber `#F59E0B` (2,673 px in the logo and rule) over the dark ground. Not renamed or modified. |
| Route (D5.2) | `public/_redirects` gains `/guides/procurement-field-guide → /guides/jitpro-construction-procurement-field-guide-2026-09.pdf 302`, placed above the SPA catch-all, which is unchanged. |
| Headers (D5.1, D5.10) | `public/_headers` gains a block on the PDF path: `Content-Disposition: inline; filename="JiTpro-Construction-Procurement-Field-Guide.pdf"`, `X-Robots-Tag: noindex`, `Cache-Control: public, max-age=31536000, immutable`. The existing `/review/*` rule is untouched. |
| Consistency test | `src/content/leadMagnets.consistency.test.ts` (5 checks per asset) ties the registry to the committed file, the redirect target and order, and the header block; the SPA catch-all is asserted intact. Drift was proven to fail: changing the 302 to 301 and `noindex` to `index` produced two failures, and the files were restored. |
| Local checks | Typecheck clean; lint 0 errors (4 pre-existing warnings); **144 tests across 15 files**; build OK with the PDF, `_redirects`, and `_headers` emitted into `dist/` (the built PDF is byte-identical); `audit-ci` passed; package files unchanged. |
| Commit and CI | `04991ad`. PR #52 `build-and-test` passed (run 35033549602) and Cloudflare Pages deployed the preview. |
| Preview verification | On `https://feature-navigation-simplific.jitpro-website.pages.dev`: the stable route returns **302** to the versioned file; the PDF returns **200** with `Content-Type: application/pdf`, the approved `Content-Disposition`, `x-robots-tag: noindex`, and the immutable cache header; following the route downloads 145,208 bytes whose SHA-256 matches the committed file exactly; `/product` still returns the SPA (200, `text/html`). |
| Acceptance criteria | All met, apart from the visual inline-open and save-as check, which is Jeff's to do in a browser if he wants it. |
| Not touched | Sprint 2 backend work, test mode, test secrets, and the Step 3 and delivery-test records all left as they were. |

### Sprint 2: Lead persistence and attribution (API, on `jitpro_website` in test mode)

- **Objective:** a valid request is safely recorded with approved attribution; abuse controls work; the function fails open.
- **Scope:** read-only inspection of `jitpro_website` (Section 15.2) and report, **before any migration**; the proposed migration change set presented to Jeff and applied only on his approval; new secrets (L-13) with Jeff's approval; migrations for `contacts`, `lead_magnet_requests`, `lead_magnet_ip_activity`; `submit-lead-magnet-request` with validation, server honeypot, Turnstile verification, 10-per-10-minute IP rate limit (single constant), contact upsert, repeat detection, one-hour cooldown decision, consent recording, **fail-open response shape** (`stored`, `email_status`, `guide_url`, `request_id`), persistence-failure recovery alert (Section 7.2.1), masked logging, `LEAD_MAGNET_TEST_MODE`; shared pure modules; the function proposal (Section 15.2 Edge Function discipline) presented to Jeff and deployed to `jitpro_website` only on his approval; `curl`-level verification against `jitpro_website` **in test mode with identifiable test data**. The existing `leads` table, its webhook, `submit-contact`, `send-contact-notification`, and all existing data are not touched.
- **Out of scope:** email sending (Sprint 3, though the function's send step is stubbed to return `skipped` so the response shape is complete), UI, any change to the contact-form pipeline, the go-live switch (Sprint 6). There is no staging project and no promotion step (G-8).
- **Dependencies:** Sprint 1a; L-12 (inspection reported and Sprint 2 change set approved); L-13; §21 item 1 for the cases that shared secrets constrain.
- **Tasks:** inspect `jitpro_website` and report; propose and, on approval, apply migrations; shared modules; function; propose and, on approval, deploy the function; `curl` script documented in the repo; tests.
- **Acceptance criteria:** documented `curl` cases (valid, malformed, honeypot, repeat inside and outside the hour, rate-limited, bad or missing Turnstile, simulated persistence failure by the method Jeff approves under §21 item 1) behave per Section 13.3 against `jitpro_website` in test mode; rows appear with attribution and consent fields and are identifiable as test data; `lead_magnet_ip_activity` rows expire; the recovery alert arrives at a JiTpro mailbox with the full email; the existing contact form still submits and `leads` and its webhook are unaffected.
- **Tests:** Vitest on validation, normalisation, attribution parsing, consent decisions, cooldown, rate limit, failure-state mapping, payload validation; manual function tests on `jitpro_website` in test mode.
- **Risks:** remote migration history differing from the repository (the inspection decides the apply method; history is never repaired or rewritten); `db push` needs the database password; a test case needing a shared secret changed (not done; §21 item 1); Deno-only APIs must stay out of `_shared`.
- **Decision dependencies:** Jeff's approval of the migration change set and of the function change set.
- **Definition of done:** all `curl` cases pass on `jitpro_website` in test mode; existing contact form verified unaffected; tests green; plan updated with the inspection report.
- **Commit boundaries:** (1) migrations; (2) shared modules with tests; (3) edge function and `curl` script.

**`jitpro_website` inspection report (2026-09-14, read-only, before any migration).**

| Item | Finding |
|---|---|
| Project | `jitpro_website`, ref `pynjyrvnokfexyudimsn` (the repository's linked project), Postgres 17.6. Every command carried an explicit `--project-ref`. |
| Method | `supabase db query --linked` with SELECT statements only; `supabase functions list`; `supabase secrets list` (names recorded, values not). No schema, data, function, secret, or configuration change. Side effect disclosed: the CLI's login step creates or refreshes the platform-managed `cli_login_postgres` role. |
| 1. Migration history | **None.** The `supabase_migrations` schema does not exist. Of the repository's three migrations, the two `demo_requests` migrations were never applied (the table is absent) and `investor_access` exists but was created outside any recorded history. Consequence: `supabase db push` is unsafe (S2-7). |
| 2. Relevant tables | `public.leads` (58 rows, latest 2026-09-09, RLS on, INSERT policy for the `public` role), `public.investor_access` (RLS on), `public.profiles` (RLS on, not in this repository). Schemas: `auth`, `extensions`, `graphql`, `graphql_public`, `net`, `public`, `realtime`, `storage`, `supabase_functions`, `vault`. No `cron`. |
| 3. Relevant functions and configuration | Database: `public.rls_auto_enable`, run by event trigger `ensure_rls`, which enables RLS on every new table in `public`. One database-webhook trigger on `leads` INSERT calling `send-contact-notification`. Default privileges grant `anon` and `authenticated` full privileges on new `public` tables (hence S2-1). Extensions: `pg_net`, `pg_stat_statements`, `pgcrypto`, `plpgsql`, `supabase_vault`, `uuid-ossp`; `gen_random_uuid()` is native. Edge Functions: the same seven recorded in §3.3 (`submit-demo-request` still not deployed). Secrets: `ADMIN_PASSWORD`, `RESEND_API_KEY`, `SITE_URL`, `TURNSTILE_SECRET_KEY`, plus platform-provided `SUPABASE_*`. |
| 4. Naming collisions | None. No relation, function, or type named `contacts` or `lead_magnet%` in any schema; no `LEAD_MAGNET_*` secret. |
| Outside this project's scope (no action) | The `leads` INSERT policy for the `public` role lets the anon key insert rows directly without Turnstile (related to F-4). The dashboard-created webhook trigger stores the service-role key in its definition, which is the platform's normal behaviour; the value is not recorded anywhere in this repository. |

**Sprint 2 database approvals (Jeff, 2026-09-14).**

| ID | Decision |
|---|---|
| S2-1 | **Approved:** three additive migrations, `20260914000001_create_contacts.sql`, `20260914000002_create_lead_magnet_requests.sql`, `20260914000003_create_lead_magnet_ip_activity.sql`. Each creates new lead-magnet objects only, enables RLS, creates no policy, and revokes all `anon` and `authenticated` privileges on its table. The tables are accessed by the new server-side Edge Function, never directly by visitors. `leads`, `investor_access`, `profiles`, the `leads` webhook, existing database functions, existing Edge Functions, and existing data are not modified. |
| S2-2 | Departure 1 approved: `unique (email)` on `contacts` plus a check that the stored value is already normalised. The Edge Function normalises email before persistence; this supports the REST upsert `on_conflict=email`. |
| S2-3 | Departure 2 approved: `lead_magnet_requests.email_status` is `NULL` until an email send is attempted. No misleading status is invented. |
| S2-4 | Departure 3 approved: `lead_magnet_ip_activity.activity_kind` (`request` / `event`), so the request and event rate limits do not interfere. |
| S2-5 | Departure 4 approved: bigint identity primary key on `lead_magnet_ip_activity`. |
| S2-6 | Departure 5 approved: no database constraint on request `placement`; validated server-side against the registry. `lead_magnet_events` keeps its separately approved constraints. |
| S2-7 | Apply method: each file individually via `supabase db query --linked --project-ref pynjyrvnokfexyudimsn -f <file>`; never `db push`, `migration repair`, or `db reset`. Migrations are applied only after Jeff's final authorisation of the written diff. |
| S2-8 | Rollback: strategy approved conceptually; **no rollback migration with `DROP` is created or committed**. Any recovery is brought to Jeff as an exact operation first; nothing destructive runs without explicit approval; real lead data requires a preservation or export decision first. |
| S2-9 | Test-data cleanup: acceptable in principle for clearly identified test rows in the new tables only; never automatic, never `TRUNCATE`; the exact `DELETE` criteria go to Jeff before the first cleanup. |

Sequence from here: migration files written and reviewed → Jeff's final authorisation → applied and verified → full `submit-lead-magnet-request` proposal per §15.2 → deployment only on approval. `LEAD_MAGNET_*` secrets are not set before Jeff approves them.

**Break-point record: Sprint 2 migrations applied (2026-09-14; recorded 2026-09-15 before a pause).**

| Item | Result |
|---|---|
| Authorisation | Jeff authorised applying the three committed files (`82cba06`) after PR #52 CI passed on that commit (`build-and-test` run 34906438437; Cloudflare Pages preview deployed). |
| Method | Each file applied individually with `supabase db query --linked --project-ref pynjyrvnokfexyudimsn -f <file>`, in order 1, 2, 3; each ran as one transaction with no error. A read-only baseline of existing objects was taken first and compared after every migration. |
| `contacts` | 23 columns as approved; `contacts_pkey`, `contacts_email_key` (unique), `contacts_email_normalised`, and the `consent_status`, `consent_method`, `email_suppression_reason` checks; RLS on (not forced), 0 policies, no anon or authenticated privileges, 0 triggers, 0 rows, table comment present. |
| `lead_magnet_requests` | 24 columns as approved (`email_status` nullable, no `placement` check); `lead_magnet_requests_pkey`, FK to `contacts` `ON DELETE RESTRICT`, `email_status`, `fulfilment_status`, `consent_method` checks; index `(contact_id, asset_id, created_at desc)`; RLS on, 0 policies, no anon or authenticated privileges, 0 triggers, 0 rows, comment present. |
| `lead_magnet_ip_activity` | 4 columns, `id` is `GENERATED ALWAYS` identity; pkey and `activity_kind` check; indexes `(ip_hash, activity_kind, created_at)` and `(created_at)`; RLS on, 0 policies, no anon or authenticated **table** privileges, 0 triggers, 0 rows, comment present. |
| Existing objects | Unchanged against the baseline after every migration: `leads`, `investor_access`, `profiles` columns, constraints, indexes, RLS, grants, and row counts (58, 10, 0); latest `leads` row; all 3 public policies; triggers including the `leads` webhook (definition hash); public database functions; event triggers; no migration-history schema; all 7 Edge Functions (versions, bundle hashes, `updated_at`, `verify_jwt`, status). |
| **Open finding** | The identity column created sequence `public.lead_magnet_ip_activity_id_seq`. `jitpro_website`'s default privileges grant anon and authenticated `USAGE, SELECT, UPDATE` on new sequences, and the migration revoked on the table only, so both roles still hold privileges on the sequence (ACL `{postgres=rwU, anon=rwU, authenticated=rwU, service_role=rwU}`). This differs from S2-1. Practical risk is low (the REST and GraphQL APIs do not expose `nextval`/`setval` to the anon key; misuse could only disturb rate-limit inserts, never guide access), but it is not the approved design. `leads_id_seq` carries the same default ACL today (outside this project's scope). The proposal missed this: the inspection recorded sequence default privileges but only table revokes were written. |
| Proposed fix (awaiting Jeff) | New additive migration `20260914000004_revoke_lead_magnet_ip_activity_sequence.sql` containing only `revoke all on sequence public.lead_magnet_ip_activity_id_seq from anon, authenticated;` in a transaction. Service role keeps access. Process on approval: write, commit, push, CI, apply by the same per-file method, confirm `has_sequence_privilege` is false for both roles, rerun the baseline comparison. Also proposed: a §15.2 rule that any migration creating an identity or serial column revokes on its sequence, so `lead_magnet_events` includes it from the start. |
| Not done | Plan result for S2-1 not closed; sequence fix not written or applied; no `LEAD_MAGNET_*` secret set; `submit-lead-magnet-request` not written, proposed, or deployed; no test data; no existing object changed. |
| Resume point | Jeff's decision on `20260914000004`. After it is applied and verified: record the final result here, then bring Jeff the complete `submit-lead-magnet-request` proposal required by §15.2 before any deployment. *(Resolved 2026-09-15; see the next record.)* |

**Sequence fix applied and Sprint 2 database work complete (2026-09-15).**

| Item | Result |
|---|---|
| Approval | Jeff approved migration `20260914000004_revoke_lead_magnet_ip_activity_sequence.sql` and rule S2-10 (§15.2) on 2026-09-15. |
| Commit and CI | `7291b3d` (migration plus S2-10); local typecheck, lint (0 errors, 4 pre-existing warnings), 16 tests, build, and `audit-ci` passed; PR #52 `build-and-test` passed at `7291b3d` (run 35011218693) and Cloudflare Pages deployed the preview. |
| Apply | Only this file, by the S2-7 method (`supabase db query --linked --project-ref pynjyrvnokfexyudimsn -f …`); one transaction; no error. The committed file was confirmed identical to HEAD immediately before applying. |
| Sequence verification | `public.lead_magnet_ip_activity_id_seq` ACL changed from `{postgres=rwU, anon=rwU, authenticated=rwU, service_role=rwU}` to `{postgres=rwU, service_role=rwU}`. `has_sequence_privilege` for `USAGE`, `SELECT`, and `UPDATE` is false for `anon` and `authenticated`; `service_role` `USAGE` true. `leads_id_seq` unchanged (outside scope). Public sequences: `lead_magnet_ip_activity_id_seq`, `leads_id_seq` only. |
| New tables re-verified | `contacts` (23 columns, 6 constraints, 2 indexes), `lead_magnet_requests` (24, 5, 2), `lead_magnet_ip_activity` (4, 2, 3): column, constraint, and index names match the approved design exactly; RLS on, 0 policies, no `anon` or `authenticated` table privileges, 0 triggers, 0 rows, comments present. |
| Existing objects re-verified | Unchanged against the pre-migration baseline: `leads`, `investor_access`, `profiles` columns, constraints, indexes, RLS, grants, row counts (58, 10, 0), latest `leads` row; 3 public policies; triggers including the `leads` webhook (definition hash); public database functions; event triggers; no migration-history schema; all 7 Edge Functions (versions, bundle hashes, `updated_at`, `verify_jwt`, status). |
| Status | **S2-1 closed: the Sprint 2 database change set is applied and matches the approved design.** No `LEAD_MAGNET_*` secret set; no Edge Function written or deployed; no test data. Next: the complete `submit-lead-magnet-request` proposal to Jeff per §15.2, then deployment only on his approval. |

**`submit-lead-magnet-request` implementation approvals (Jeff, 2026-09-15).** The §15.2 proposal was approved for writing and local testing only. Setting secrets, deploying, integration testing against `jitpro_website`, creating test rows, and activating the CTA each still need separate approval.

| ID | Decision |
|---|---|
| S2-11 | Decision 1A: `LEAD_MAGNET_TURNSTILE_TEST_SECRET` (Cloudflare's always-pass test secret) honoured only when `LEAD_MAGNET_TEST_MODE=true`; `TURNSTILE_SECRET_KEY` never changed; removed at go-live. |
| S2-12 | Decision 1B: the simulated persistence failure requires test mode **and** `x-lead-magnet-test-fault: persistence` **and** `x-lead-magnet-test-fault-secret` matching `LEAD_MAGNET_TEST_FAULT_SECRET` (minimum 32 characters, constant-time comparison). The header alone never activates it; the secret is never logged or returned; the test-fault headers are not in the CORS allow-list; removed at go-live. |
| S2-13 | Decision 2: in test mode, recipients outside `@resend.dev` and `@jit-pro.com` (exact domains) are refused **before** persistence with `test_mode_refused` and the guide URL; nothing stored, nothing sent. |
| S2-14 | Decision 3: `email_status` is `null` in every Sprint 2 response and row; no `skipped` status. |
| S2-15 | Decision 4: CORS allows only `https://jit-pro.com`, `https://<one-label>.jitpro-website.pages.dev`, and `http://localhost:5173`; other origins are never reflected; disallowed preflights get 403. **AMENDED 2026-09-18 by S6-3 (Issue #54): `https://www.jit-pro.com` is now also an allowed production origin.** Everything else in this decision stands unchanged. |
| S2-16 | Decision 5: rate limiting fails open (missing salt, unknown client IP, hashing or database failure), logged without the IP or hash; Turnstile, honeypot, and validation stay active. |
| **S6-3** | **Canonical host and CORS allowlist (approved 2026-09-18, Issue #54). AMENDS S2-15 / Decision 4.** Two production hostnames served the site: `jit-pro.com` and `www.jit-pro.com` were both active Cloudflare Pages custom domains, and `www` did not redirect. A visitor who reached the site at `www` loaded a fully working page whose lead-magnet preflight was answered 403, so the POST was never sent, no lead was stored and no email was sent, while the visitor still received the fail-open outcome. The contact-form functions did not exhibit this because `submit-contact` uses a wildcard `Access-Control-Allow-Origin`, which is why the mismatch went unnoticed until the lead magnet shipped. **The primary control is a Cloudflare Redirect Rule, deployed and production-verified by Jeff on 2026-09-18: `https://www.jit-pro.com/*` → `https://jit-pro.com/${1}`, 301, preserve query string. That redirect remains the canonical-host control and is not replaced by this amendment.** As a secondary control behind it, `https://www.jit-pro.com` is added to `EXACT_ALLOWED_ORIGINS` so that a future loss or misordering of the redirect cannot silently break lead capture a second time. **The allowed production origins are therefore `https://jit-pro.com` and `https://www.jit-pro.com`.** `http://localhost:5173` and single-label `*.jitpro-website.pages.dev` preview origins are unchanged. **The bare `https://jitpro-website.pages.dev` remains disallowed** (deliberately: it is not a hostname visitors are directed to, and the project has no reason to accept it). Every other element of Decision 4 stands: no origin is ever reflected unless it matches exactly, and a disallowed preflight still returns 403 with no `Access-Control-Allow-Origin` header. Rejected preflight origins are now logged server-side, because the silent rejection is what made this defect cost a full investigation. |
| S2-19 | **Sender standardisation (approved 2026-09-15, after the Step 3 403).** The lead-magnet workflow uses only the verified marketing-site identity: visitor-facing fulfilment email From `JiTpro <info@jit-pro.com>` with Reply-To `info@jit-pro.com`; internal notifications and recovery alerts From `JiTpro Notifications <info@jit-pro.com>` To `info@jit-pro.com`. **`noreply@mail.jit-pro.com` is not used anywhere in the lead-magnet workflow**, and `mail.jit-pro.com` is neither added nor verified for this project. Supersedes the sender element of D3.8 and D5.7. The existing contact-form functions are not changed; the investor functions are recorded as F-8, outside this project. |
| S2-20 | **Resend diagnostics (approved 2026-09-15).** Every lead-magnet Resend call logs a marker immediately before the call and then, on completion: HTTP status with the Resend message id and elapsed time on success; HTTP status with a sanitised error name and message and elapsed time on rejection; a sanitised error type and message with elapsed time when no response arrives. Email addresses are masked, key-like (`re_…`) and long token-like values are redacted, messages are capped at 200 characters, and unparsable bodies are never logged. The request body, headers, recipients, API key, Turnstile token, fault secret, and idempotency key are never logged. Implemented in `_shared/lead-magnet/resendDiagnostics.ts` with tests; Sprint 3's fulfilment send reuses it. |
| S2-17 | Decisions 6 and 7: query strings and fragments stripped from `referrer`, `page_path`, and `landing_path` before storage; `supabase/functions/_shared` added to `tsconfig.app.json` `include`. Consent behaviour and table isolation approved as proposed. |

Where it lives: the handler in `supabase/functions/submit-lead-magnet-request/index.ts`, pure logic in `supabase/functions/_shared/lead-magnet/`, and the integration script and expected rows in `scripts/lead-magnet/`.

**Implementation record (2026-09-15).** Commits `965e41b` (pure shared modules and tests; `tsconfig.app.json` include), `51053e5` (handler, `curl` script, README), `df264a1` (approvals). Local: typecheck clean, lint 0 errors (4 pre-existing warnings), 13 test files / 131 tests, build, `audit-ci`; the handler type-checked against a throwaway Deno type shim and exercised in a throwaway simulation of Supabase, Turnstile, and Resend (8 scenarios, including the full 19-case sequence and its exact expected rows). PR #52 `build-and-test` passed at `df264a1` (run 35014566313) and the Cloudflare preview deployed.

**Step 1: test-period secrets set (2026-09-15, Jeff's approval).**

| Item | Result |
|---|---|
| Procedure | As proposed: the fault secret generated as 32 random bytes (64 hex characters) into `~/.jitpro/lead-magnet-test-fault-secret`, outside the repository; the IP salt generated inline; all four written to a temporary env file in `~/.jitpro/`, applied with `supabase secrets set --project-ref pynjyrvnokfexyudimsn --env-file …`, and the env file deleted immediately. Neither generated value was printed, logged, or committed; the fault secret appears in no tracked or working-tree file. |
| Secrets | Exactly four expected names added: `LEAD_MAGNET_IP_SALT`, `LEAD_MAGNET_TEST_FAULT_SECRET`, `LEAD_MAGNET_TEST_MODE`, `LEAD_MAGNET_TURNSTILE_TEST_SECRET` (15 secrets in total). The existing 11 names, digests, and `updated_at` values are identical to the pre-change snapshot. |
| Existing Edge Functions | All seven received a new version number from Supabase (`send-contact-notification` 20→21, `submit-contact` 5→6, `submit-investor-request` 7→8, `approve-investor` 7→8, `verify-investor-token` 5→6, `revoke-investor` 5→6, `list-investor-requests` 5→6). Bundle hashes, `updated_at`, `verify_jwt`, status, entrypoints, ids, and names unchanged; a CORS preflight to `submit-contact` returned 204. Recorded as expected platform behaviour (S2-18); not reversed. |
| Database | Existing objects unchanged against the baseline (`leads` 58, `investor_access` 10, `profiles` 0 rows; policies; triggers including the `leads` webhook; database functions; event triggers; webhook call history 51). The three lead-magnet tables unchanged and empty; the identity-sequence ACL still excludes `anon` and `authenticated`. |
| Not done | No test data created; `submit-lead-magnet-request` not deployed; no integration test run. |

**Step 2: `submit-lead-magnet-request` deployed and verified without data (2026-09-15, Jeff's approval).**

| Item | Result |
|---|---|
| Deploy | `npx supabase functions deploy submit-lead-magnet-request --project-ref pynjyrvnokfexyudimsn --no-verify-jwt --use-api`, run after the documentation commit `9736eff` with `supabase/functions` identical to HEAD. Uploaded only the handler and the 12 shared modules it imports (no test files, `cooldown.ts` not yet imported, no other function). CLI: "Deployed Functions." for `submit-lead-magnet-request` only. |
| A. Functions | Exactly 8 deployed. `submit-lead-magnet-request` v1, `ACTIVE`, `verify_jwt: false`, no import map. The original seven are identical to the post-Step-1 baseline in id, name, version, status, `verify_jwt`, import map, entrypoint, bundle hash, `created_at`, and `updated_at` (the deploy did not version-bump them). |
| A. Secrets | Same 15 names; every digest identical. The eight project-managed secrets (`ADMIN_PASSWORD`, `RESEND_API_KEY`, `SITE_URL`, `TURNSTILE_SECRET_KEY`, and the four `LEAD_MAGNET_*`) are identical including `updated_at`. **Observed platform behaviour:** the seven platform-injected `SUPABASE_*` secrets (`SUPABASE_ANON_KEY`, `SUPABASE_DB_URL`, `SUPABASE_JWKS`, `SUPABASE_PUBLISHABLE_KEYS`, `SUPABASE_SECRET_KEYS`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL`) had `updated_at` refreshed to the deploy time (`2026-09-15T19:53:40.895Z`, equal to the new function's `updated_at`), with unchanged digests. Their previous timestamp (`2026-09-04T01:56:23.741Z`) equals `send-contact-notification`'s last deploy time, so Supabase refreshes these on any function deploy. Values did not change; compare digests, not `updated_at`, for platform-injected secrets (in the spirit of S2-18). |
| A. Database | The three lead-magnet tables empty and unchanged (RLS on, 0 policies, no `anon`/`authenticated` privileges, 0 triggers; identity-sequence ACL `postgres`, `service_role` only). Existing objects unchanged against the baseline: `leads` 58, `investor_access` 10, `profiles` 0 rows; policies; triggers including the `leads` webhook; database functions; event triggers; webhook call history 51. |
| B. Probes | `OPTIONS` with `Origin: https://jit-pro.com` → **204**, `Access-Control-Allow-Origin: https://jit-pro.com`, `Vary: Origin`, allow-methods `POST, OPTIONS`, allow-headers `Content-Type, Authorization, X-Client-Info, Apikey` (no test-fault headers), max-age 86400. `OPTIONS` with `Origin: https://evil.example` → **403**, no `Access-Control-Allow-Origin`. `GET` → **405**, `Allow: POST, OPTIONS`. Row counts after the probes: 0 / 0 / 0; `leads` 58; webhook calls 51. |
| Not done | No `POST` sent; integration script not run; simulated persistence failure not run; no contacts, requests, or IP-activity rows; no cleanup. Step 3 (controlled integration-test run) awaits Jeff's separate authorisation. |

**Step 3: controlled integration-test run `20260915s3` (2026-09-15, Jeff's approval; run once).**

| Item | Result |
|---|---|
| Pre-test | `LEAD_MAGNET_TEST_MODE` present with the digest of `true`; `LEAD_MAGNET_TURNSTILE_TEST_SECRET` digest equals Cloudflare's always-pass test secret; the local fault secret matches the deployed digest (compared by hash, not printed). Lead-magnet tables 0 / 0 / 0. Baseline: `leads` 58 (latest 2026-09-09 20:59:18 UTC), webhook calls 51. This machine has no `.env.local`, so the public anon key was read with `supabase projects api-keys` into an environment variable, never printed. |
| Run | `scripts/lead-magnet/submit-request-curl-tests.sh 20260915s3`, 20:00:44 to 20:01:07 UTC, exit code 0: **19 passed, 0 failed**. |
| Cases | 01 new contact unchecked · 02 repeat unchecked · 03 repeat checked (marketing opt-in) · 04 new contact checked · 05 invalid email (400, no guide) · 06 unknown asset (400, no guide) · 07 unknown placement (400, guide) · 08 unknown consent version (400) · 09 non-JSON body (400) · 10 honeypot (200, nothing stored) · 11 missing Turnstile token (403, guide) · 12 `example.com` refused in test mode (403, guide) · 13 fault header alone ignored · 14 fault header with wrong secret ignored · 15 secret-gated simulated persistence failure (200, `stored:false`, guide) · 16 allowed-origin preflight 204 · 17 disallowed-origin preflight 403, not reflected · 18 GET 405 · 19 attempts 8 to 10 accepted, attempt 11 rate limited (429, guide). All **PASS**. |
| Rows | Exactly the README model. `contacts` **5**: `-a` and `-b` `marketing_opt_in` (opt-in time set), `-e`, `-f`, `-h` `transactional_only`; every contact has first-touch `lm-test-script` / `cli` / `lm-test` / `/field-guide` / `https://www.linkedin.com/feed/` and consent evidence `v1` / `checkbox` / `landing-page` / `/field-guide` / `procurement-field-guide`; none suppressed or unsubscribed. `lead_magnet_requests` **9**, in order `a` (repeat false, opt-in false), `a` (true, false), `a` (true, true), `b` (false, true), `e`, `f`, `h` (false), `h` (true), `h` (true); all with asset `procurement-field-guide` `2026-09`, placement `landing-page`, paths `/field-guide` (query strings and fragments stripped), referrer `https://www.linkedin.com/feed/`, UTMs `lm-test-script` / `cli` / `lm-test` / `20260915s3`, `turnstile_passed` true, `fulfilment_status` `delivered_inline`, `email_status` / provider id / error null. `lead_magnet_ip_activity` **11** rows, all `request`, one 64-hex salted hash, 20:00:47 to 20:01:08 UTC. |
| No unexpected data | 0 contacts and 0 requests outside the run's test addresses and markers; nothing stored for `-c` (honeypot), `-d` (no token), `-g` (simulated failure), `lm-test-20260915s3@example.com`, or the invalid-input cases. |
| Existing data and objects | `leads` 58 with the same latest row; webhook calls 51 (the `leads` webhook did not fire). Existing objects unchanged against the baseline (columns, constraints, indexes, RLS, grants, policies, triggers, database functions, event triggers, `investor_access` 10, `profiles` 0). All 8 Edge Functions identical to the post-deployment baseline; all 15 secrets identical in name, digest, and `updated_at` to the pre-test list. |
| Log review | **Awaiting Jeff.** The CLI has no logs command, and the Management API would require extracting the CLI login token from the Windows credential store, which was not done without approval. Jeff to review in the dashboard (function id `2bc6b479-d894-4b89-91ba-0a227368248b`). Code review and the pre-deployment simulation already assert masked emails and no IP, hash, token, or secret in logs. |
| Recovery alert | **Not delivered. Diagnosed 2026-09-15 by Jeff in the marketing-site Resend account.** Case 15 correctly exercised the fail-open persistence-failure path, and Supabase successfully called Resend. Resend received the request (To `info@jit-pro.com`, From `JiTpro Notifications <noreply@mail.jit-pro.com>`, subject *Field Guide request could not be saved*, the correct Step 3 request id, test recipient, body, and tags) and rejected it with **HTTP 403 "Domain not verified: Verify mail.jit-pro.com or update your from domain."** The sole cause was the unverified sender domain: a sender-configuration and design error. It was **not** a Supabase networking failure, an API-key failure, a Microsoft 365 failure, or a control-flow bug. The deployed code was confirmed byte-identical to `51053e5` (downloaded read-only and compared), and the alert call is awaited before the response. The function logged only the HTTP status, which hid Resend's message; case 15's PASS proved the visitor response, not delivery. Corrections: **S2-19** (sender) and **S2-20** (diagnostics). |
| Not done | No cleanup; test mode and test secrets left set; no rerun; Sprint 3 not started. Cleanup statements go to Jeff for separate approval (S2-9). *(Closed by Steps 4 and 5 below.)* |

**Step 4: recovery-alert correction deployed and delivery confirmed (2026-09-15).**

| Item | Result |
|---|---|
| Correction | S2-19 (sender) and S2-20 (diagnostics) implemented in `d0b3127`: `LEAD_MAGNET_NOTIFICATIONS_FROM` is now `JiTpro Notifications <info@jit-pro.com>`; `resendDiagnostics.ts` logs a pre-call marker and then the status with the Resend message id, or a sanitised error name and message, or the fetch error type, each with elapsed time. Local checks clean (139 tests at that commit); PR #52 `build-and-test` passed (run 35031876789). |
| Deploy | `submit-lead-magnet-request` alone, by the approved command, now **v2** (`ACTIVE`, `verify_jwt: false`). The original seven Edge Functions stayed identical (version, bundle hash, `updated_at`, `verify_jwt`, status); secret digests unchanged, with only the platform-injected `SUPABASE_*` timestamps refreshed (S2-18). |
| Isolated delivery test | One request, run id `20260916ra`, 22:40:41-22:40:44 UTC, request id `f1bc492a-c3d3-46cd-9883-76c690b012a4`. Response **200** with `ok:true`, `stored:false`, and the guide URL. **0** contacts and **0** requests created, exactly **1** `lead_magnet_ip_activity` row, Step 3 rows untouched, `leads` and webhook activity unchanged. |
| Delivery | **PASSED. Manually confirmed by Jeff:** the alert from `JiTpro Notifications <info@jit-pro.com>` arrived at the `info@jit-pro.com` mailbox/alias. The Resend message id was not captured and is not required in this record. The 19-case suite was not rerun. |
| Conclusion | The Step 3 failure is fully resolved: it was the unverified `mail.jit-pro.com` sender, nothing else. `mail.jit-pro.com` remains unverified and unused; the contact-form functions, `RESEND_API_KEY`, and all secrets were never touched. |

**Step 5: Sprint 2 test-data cleanup (2026-09-15, Jeff's approval; Option B declined).**

| Item | Result |
|---|---|
| Preview | Read-only counts matched the approved gate exactly: 9 test requests, 5 test contacts, 0 non-test requests, 0 non-test contacts. |
| Operation | The approved guarded `DO` block, one transaction: it re-checked all four counts, would have raised and rolled back on any mismatch, deleted request rows matching a Resend test address **and** both test UTM markers, then deleted only test contacts left with no requests. No `TRUNCATE`, no schema change, no reset. |
| Result | `contacts` **0**, `lead_magnet_requests` **0**. |
| Left alone | The **12** `lead_magnet_ip_activity` rows (20:00:47 to 22:40:43 UTC, one salted daily hash, no prospect data) stay to expire through the function's normal 24-hour retention, which runs on its next invocation. Option B was not run. |
| Unchanged | `leads` 59 with its latest row at 2026-09-15 20:54:44 UTC (Jeff's own contact-form test, created between Steps 3 and 4 and never touched), webhook calls 52, `investor_access` 10, `profiles` 0; every existing object, policy, trigger, database function, and event trigger identical to the baseline; the three lead-magnet tables keep their approved structure, RLS on, 0 policies, and no `anon` or `authenticated` privileges. |
| Still in place | `LEAD_MAGNET_TEST_MODE`, `LEAD_MAGNET_TURNSTILE_TEST_SECRET`, `LEAD_MAGNET_TEST_FAULT_SECRET`, and `LEAD_MAGNET_IP_SALT`, all removed at go-live (L-6). |

**Sprint 2 is complete (2026-09-15).** Migrations applied and verified; `submit-lead-magnet-request` deployed and exercised across all 19 documented cases plus the recovery-alert delivery test; fail-open behaviour, abuse controls, consent transitions, and attribution confirmed against real rows; test data removed. The existing contact-form pipeline was never modified, and `leads`, its webhook, and every other existing object are unchanged.

**Staging inspection report (2026-09-13, read-only). Historical record: superseded by G-8 on 2026-09-14.** Retained because it established that `jitpro-staging` is the product application's database and must not be involved in website work. Its recommendation (a website-dedicated project or `jitpro-sandbox`) was not adopted; Jeff chose `jitpro_website` as the only website project.

| Item | Finding |
|---|---|
| Project | `jitpro-staging`, ref `npbieovfrwvzgyjcwrpj`, us-west-1, `ACTIVE_HEALTHY`, Postgres 17.6, created 2026-05-21, database 13 MB. Not the linked project; every command carried an explicit `--project-ref`, and the repository link to production was left untouched. |
| Method | `supabase functions list`, `secrets list` (names only), `branches list`, and `supabase db query --linked --project-ref <ref>` with SELECT statements only, executed through the Management API as the `postgres` role. No migration, table, function, secret, data, or configuration change. **Side effect disclosed:** the CLI's login step creates or refreshes a platform-managed role `cli_login_postgres` (login only, not superuser, credential valid a few minutes); whether it existed before the inspection could not be determined. |
| Schemas | `auth`, `extensions`, `graphql`, `graphql_public`, `public`, `realtime`, `storage`, `supabase_migrations`, `vault`. No custom schemas; no `supabase_functions` or `cron` schema. |
| Tables | **The public schema belongs to the JiTpro product application, not the website:** 25 tables and one view (`companies`, `company_holidays`, `company_work_weeks`, `constraint_type_taxonomy`, `constraints`, `cost_codes`, `organizations`, `pcl_templates`, `pcl_template_tasks`, `people`, `directory_people` view, `procurement_items`, `procurement_item_locations`, `procurement_item_submittals`, `procurement_timelines`, `project_locations`, `project_members`, `project_team`, `projects`, `roles`, `schedule_impact_event_constraints`, `submittal_types`, `timeline_assignments`, `timeline_baselines`, `timeline_edit_log`), RLS on every table, 54 company-member policies, 13 triggers, and six application functions (`current_company_id`, `handle_new_user`, `setup_company`, `user_belongs_to_company`, `update_updated_at`, `check_cost_code_hierarchy`). Plus `investor_access`, column-for-column identical to this repository's migration, present via the baseline. `leads` and `demo_requests` are absent. |
| Edge Functions, secrets, other | Zero deployed functions. Zero secrets. Zero branches, zero storage buckets, no database webhooks, no cron jobs, no realtime publications. Extensions: `pg_stat_statements`, `pgcrypto`, `plpgsql`, `supabase_vault`, `uuid-ossp`. |
| Activity | Migration history: `00000000000000 baseline` (350 statements) and `20260605221852 constraint_register`; neither exists in this repository, and none of this repository's three migrations exists there. Small test data; latest write 2026-06-08. Two auth users; latest created 2026-06-12; last sign-in 2026-06-08. Query statistics since 2026-05-21 show only platform health checks and dashboard or CLI introspection, no application traffic; only platform services were connected. Dormant about three months, but clearly another codebase's environment (most likely the product application's staging; the organisation also holds `JiTpro-webapp`). |
| Name collisions | None. No relation, function, or type named `contacts`, `lead_magnet_requests`, `lead_magnet_ip_activity`, or `lead_magnet_events`, and nothing matching `lead_magnet%`. The nearest neighbours, `people` and `directory_people`, do not overlap. |
| Migration safety | The new tables collide with nothing, but **`supabase db push` from this repository is not safe against `jitpro-staging`**: the remote history holds two versions absent locally and lacks the three local versions, so the CLI would refuse and suggest `supabase migration repair`, which rewrites staging's history and must never be run; a forced push would also create `demo_requests` there as a side effect. Migrations could only be applied additively as explicit SQL files (`supabase db query --linked --project-ref <ref> -f <file>`), bypassing history. |
| Suitable for integration testing? | **Usable additively, but not recommended as-is.** A generic `contacts` table would sit beside the product application's `people` and `organizations` tables and invites a future collision with its migrations; cleanup afterwards would be a destructive change on another codebase's environment; and the normal migration workflow cannot be rehearsed there, which weakens the staging-before-production rehearsal. |
| Recommendation | Do not use `jitpro-staging` through `db push`. Prefer a website-dedicated project: (a) inspect `jitpro-sandbox` (ref `bfafwzdhaziioiycxtes`, created 2026-04-06, active, us-west-2, not yet inspected) read-only under §15.2 and adopt it if empty, recording a D5.11 amendment; or (b) create a new website-only project (Jeff's dashboard action). If Jeff prefers `jitpro-staging`, proceed additively with guardrails: explicit SQL files, `functions deploy` and `secrets set` only with an explicit `--project-ref`, never `link`, `db push`, or `migration repair`, and an approved cleanup after Sprint 6. Fallback remains D5.11 option (a), production with `LEAD_MAGNET_TEST_MODE`. |
| Status | Report delivered to Jeff 2026-09-13. **No staging change made.** Closed 2026-09-14 by G-8: `jitpro-staging` is not used. |

### Sprint 3: Email fulfilment (on `jitpro_website` in test mode)

**S3-2: authenticated development cooldown bypass (standing rule; Jeff, 2026-09-16).** The one-hour fulfilment-email cooldown (D2.2) is correct for visitors and is **never weakened, shortened, or globally exempted for any domain**. To let the email be re-tested during active development, the function honours an explicit, authenticated override that requires **all** of:

1. `LEAD_MAGNET_TEST_MODE=true`;
2. a recipient the existing test-mode restriction already allows (`@resend.dev` or `@jit-pro.com`);
3. the explicit request header `x-lead-magnet-test-bypass-cooldown: cooldown`;
4. the existing `LEAD_MAGNET_TEST_FAULT_SECRET` in the existing `x-lead-magnet-test-fault-secret` header;
5. a constant-time match of that secret, using the same mechanism as the fault hooks.

It reuses the secret-gated testing architecture rather than adding another authentication path, and the bypass header is deliberately **absent from the CORS allow-list**, so no browser request can carry it. It overrides the cooldown **only**: a suppressed contact is still never emailed, and every other control (Turnstile, honeypot, validation, rate limiting, recipient restriction) is unaffected. Any error while evaluating it leaves the cooldown enforced. Like every test hook, it dies at go-live when `LEAD_MAGNET_TEST_MODE` and the test secrets are removed (L-6). Four behaviours are proven by tests: no bypass keeps `skipped_cooldown`; a valid bypass sends every time; the header without a valid secret keeps the cooldown; and with test mode off the headers are ignored entirely.

**S3-1: no mailing address anywhere in this project (Jeff, 2026-09-15).** Jeff's business and personal mailing addresses are not included in the fulfilment email, the capture experience, or any other part of the lead-magnet implementation, and no address blocks development, testing, Sprint 3, Sprint 5, or production launch. There is no placeholder, no `mailingAddress` module, no `LAUNCH_READY` address guard, and no address-related CI test. L-2 is withdrawn. The fulfilment email stays strictly transactional: the recipient explicitly requested the guide and this message fulfils that request; it never becomes a marketing or nurture message, and it carries no unsubscribe link. Marketing remains separately controlled by the explicit unchecked opt-in and any future marketing implementation. The approved footer is exactly: *You received this email because you requested the JiTpro Field Guide at jit-pro.com.* and *Questions? info@jit-pro.com*. This supersedes the mailing-address elements of D3.3, D6.8, §7.1, §10 item 7, §25.7, and the §27 contact line.

- **Objective:** a successful request reliably produces the approved guide email and the internal notification.
- **Scope:** HTML and plain-text templates per Section 25.7 with the footer line and the mailing-address placeholder; stable link; From `JiTpro <info@jit-pro.com>` with explicit Reply-To; tags `asset` and `environment`; `Idempotency-Key` from the request id; synchronous send with one retry; one-hour cooldown enforcement; `sent`, `skipped_cooldown`, `failed`, `suppressed` recorded on the row; internal notification per Section 25.8 From `JiTpro Notifications <info@jit-pro.com>`; `LEAD_MAGNET_TEST_MODE` recipient restriction; failure logging.
- **Out of scope:** nurture, unsubscribe endpoint, Resend webhook receiver (F-7).
- **Dependencies:** Sprint 2. **No mailing-address dependency (S3-1).**
- **Tasks:** templates; send module; notification module; test mode; tests; delivery verification.
- **Acceptance criteria:** Section 14.4 checks pass against Resend test recipients and a JiTpro-owned mailbox (sender, Reply-To, subject, preheader, body, button link, footer, plain-text part, mobile and desktop rendering); cooldown verified; `suppressed@resend.dev` path recorded as suppressed; failure path verified without changing the shared `RESEND_API_KEY`, by the method Jeff approves under §21 item 1; test mode refuses an outside recipient; any change to the deployed function is re-proposed to Jeff before redeploying (Section 15.2); internal notification arrives with the approved fields and no IP data.
- **Tests:** template rendering (subject, link, footer, escaping, text part, placeholder guard); cooldown decision; notification formatting.
- **Risks:** spam placement in a real mailbox (DNS already correct).
- **Decision dependencies:** none outstanding.
- **Definition of done:** real test messages verified in a mailbox; plan updated.
- **Commit boundaries:** (1) templates with tests; (2) send and cooldown logic; (3) internal notification and test mode.

**Implementation record (2026-09-15; code complete, not deployed).**

| Item | Result |
|---|---|
| New modules | `fulfilmentEmail.ts` (visitor email, HTML and text, S3-1 footer), `internalNotification.ts` (§25.8, independent), `emailOutcome.ts` (cooldown and suppression planning, Resend failure classification), each with tests. |
| Changed | `testMode.ts` gains the gated fault vocabulary `persistence` / `email` / `email_suppressed` (`requestedTestFault`); `rows.ts` gains `buildEmailStatusPatch` and `buildContactSuppressionPatch`; `outcome.ts` reports `email_status`; the handler sends the guide email, records the outcome, then sends the notification independently, with one retry on transport or 5xx errors reusing the idempotency key; `recoveryAlert` now shares the same Resend poster and diagnostics. |
| Reads and writes | Adds `contacts.email_suppressed_at` to the existing lookup, a cooldown lookup of the latest `email_status='sent'` request, a `PATCH` of the request row's email fields, and a `PATCH` of contact suppression only on provider-reported suppression. **No migration, no new column, no other table.** |
| Not created | No mailing-address module, placeholder, launch guard, or address test (S3-1). |
| Tests | 179 unit tests across 18 files (was 144), covering the approved copy verbatim in both parts, the two-line footer, the absence of any postal address, unsubscribe link, or sales CTA, escaping, status mapping, cooldown boundaries, suppression, the fault gate, tags, and idempotency keys. The scratchpad simulation grew to 19 scenarios including cooldown, suppression, provider rejection, retry, both email faults, and notification independence. |
| Local checks | Handler type-checked against the Deno shim; typecheck clean; lint 0 errors (4 pre-existing warnings); build; `audit-ci`; package files unchanged. |
| Status | Committed and CI-verified; **`submit-lead-magnet-request` v3 not deployed**, and no Sprint 3 test data created. Deployment and the controlled run await Jeff's approval. *(Superseded by the records below.)* |

**Sprint 3 controlled run `20260916s3f` (2026-09-16, Jeff's approval; run once).** Deployed as v3, isolation verified (the original seven functions and all secret digests unchanged). All nine approved cases **PASSED**: `sent` for a new request, `skipped_cooldown` for the repeat inside the hour, `sent` for `complained@` and `bounced@`, `failed` and `suppressed` for the two gated faults, `sent` when the fault header arrived without its secret, and `sent` to `info@jit-pro.com`. Every response returned the guide URL, so fail-open held on the failed and suppressed paths. The footprint matched the exact prediction: **8 contacts, 9 requests, 9 IP-activity rows**, one repeat (case 2), suppression recorded on the fault case only, and no visitor email for cases 2, 6, 7. **Resolved behaviour:** Resend *accepts* `suppressed@resend.dev` (200 with a message id) and suppresses silently rather than rejecting, so that case records `sent`; the suppression path is proven by the gated fault and by unit tests. Provider ids present on exactly the sent cases; `email_error` only on the fault cases, sanitised. `leads` (59) and webhook activity (52) unchanged.

**Fulfilment email presentation approved (2026-09-16).** The Sprint 3 email was functionally correct but visually unfinished, so the HTML presentation was redesigned to Jeff's specification: a centred 640px white card with a hairline border on a light neutral canvas, centred logo over the live-text descriptor, hairline dividers, a two-level headline, the approved description, a bulletproof amber CTA (VML for Outlook, padded anchor elsewhere) in **dark ink `#02101B` on `#F59E0B`** at Jeff's direction, the approved closing and signature, and the quiet two-line footer. Spacing is table-cell padding throughout with no CSS margins (Jeff's refinement), email-safe fonts only, and responsive behaviour below 620px. **Copy, senders, Reply-To, the permanent URL and all behaviour are unchanged, and the plain-text part is byte-identical.** Deployed as v4 and sent for review as run `20260916v4render` (request `437d2634-6e63-42c8-8540-52c5da63bdd6`, Resend id `2d8e17e2-ca73-4840-93a2-67c9adc2c4ed`).

**Break-point record (2026-09-16), superseded by the closure record below: Sprint 3 complete but not formally closed; cleanup proposed, awaiting approval.**

| Item | State |
|---|---|
| Deployed | `submit-lead-magnet-request` **v5** (`ACTIVE`, `verify_jwt: false`) on `jitpro_website`; the original seven Edge Functions unchanged throughout; all 15 secret digests unchanged. |
| Test data still present | **8 contacts, 10 requests** from runs `20260916s3f` (9) and `20260916v4render` (1); **22 `lead_magnet_ip_activity` rows**, deliberately left to expire under the 24-hour retention. No production contact exists; non-test rows in either table: 0. |
| Untouched | `leads` 59 (latest 2026-09-15 20:54:44 UTC, Jeff's own contact-form test), webhook calls 52, `investor_access` 10, `profiles` 0, and every existing database object. |
| Test controls | `LEAD_MAGNET_TEST_MODE`, `LEAD_MAGNET_TURNSTILE_TEST_SECRET`, `LEAD_MAGNET_TEST_FAULT_SECRET`, `LEAD_MAGNET_IP_SALT` all still set, and stay set for development until go-live (L-6). The local fault secret lives at `~/.jitpro/lead-magnet-test-fault-secret` and is never printed. |
| **Next action** *(done; see the closure record)* | Jeff to approve the guarded cleanup: a single `DO` block, gated on exactly **10** test requests, **8** test contacts and **0** non-test rows in either table, deleting requests matched by `utm_source = 'lm-test-script'`, `utm_campaign = 'lm-test'` and `utm_content in ('20260916s3f','20260916v4render')`, then only those contacts left with no requests. It aborts and rolls back on any mismatch; no `TRUNCATE`, no schema change, no reset. IP-activity rows are not deleted by hand. Note for Jeff's decision: the list includes the `info@jit-pro.com` contact, which is test data here and would be recreated by any future request. |
| Then *(now live; see Sprint 4 below)* | Sprint 3 closes. **Sprint 4 (visitor capture experience) needs:** Jeff's go-ahead and a proposal first; **L-5**, the Turnstile preview hostnames, or browser QA falls back to a post-merge production smoke test; and a decision on **L-14**, whether preview submissions write to `jitpro_website` with test mode on. L-3 (legal review) blocks production launch, not Sprint 4. |

> **APPROVED BASELINE (Jeff, 2026-09-16, manual visual review in Outlook desktop).** The card layout, typography, spacing, hierarchy, amber CTA, closing, signature, dividers and footer are approved. Outlook blocking the externally hosted logo until images are downloaded is expected and needs no design change; the email remains coherent with images blocked. **This fulfilment-email design and copy are the approved baseline** and are not changed without Jeff's approval; the presentation tests in `fulfilmentEmail.test.ts` hold the baseline in place.

**SPRINT 3 CLOSED (2026-09-16). Guarded cleanup approved by Jeff and executed; Sprint 3 is formally complete.**

*Cleanup gate (read-only, before any write).* Jeff's approval was conditional on the gate returning exactly 10 test requests, 8 test contacts, 0 non-test requests and 0 non-test contacts, with instructions to stop on any difference. The gate returned exactly that: `test_requests` 10, `test_contacts` 8, `non_test_requests` 0, `non_test_contacts` 0 (`total_requests` 10, `total_contacts` 8). All eight contacts were test data: six `@resend.dev` addresses (`bounced@`, `complained@`, `suppressed@`, and `delivered+lm-s3-20260916s3f-a/f/g/h@`) and `info@jit-pro.com`, whose deletion Jeff approved explicitly. Approval condition met, so the cleanup proceeded.

*Cleanup executed.* A single `DO` block re-evaluated all four gate conditions inside the transaction and would have raised (rolling the whole statement back) on any mismatch, then deleted the requests matched by `utm_source = 'lm-test-script'`, `utm_campaign = 'lm-test'`, `utm_content in ('20260916s3f','20260916v4render')`, and only those contacts left with no remaining requests, with post-delete row-count assertions of exactly 10 and 8. It completed without raising. No `TRUNCATE`, no schema change, no reset, no migration repair, and no hand-deletion of IP-activity rows (S2-8, §15.2).

*Post-cleanup verification.*

| Object | Before | After | Expected |
|---|---|---|---|
| `lead_magnet_requests` | 10 | **0** | 0 |
| `contacts` | 8 | **0** | 0 |
| `lead_magnet_ip_activity` | 22 | **22** | unchanged, left to expire under the 24-hour retention |
| `leads` | 59 | **59** | unchanged |
| `investor_access` | 10 | **10** | unchanged |
| `profiles` | 0 | **0** | unchanged |

*Deployed state verified against the break-point record.* `submit-lead-magnet-request` is **v5**, `ACTIVE`, `verify_jwt: false`. Eight Edge Functions exist; the original seven (`send-contact-notification` v21, `submit-contact` v6, `submit-investor-request` v8, `approve-investor` v8, `verify-investor-token` v6, `revoke-investor` v6, `list-investor-requests` v6) are unchanged. Repository verified at `4949c6d` on `feature/navigation-simplification-lead-gen-guide`, clean and in sync with its upstream.

*Still in place, by design.* `LEAD_MAGNET_TEST_MODE`, `LEAD_MAGNET_TURNSTILE_TEST_SECRET`, `LEAD_MAGNET_TEST_FAULT_SECRET` and `LEAD_MAGNET_IP_SALT` remain set for continued development and are removed at go-live (L-6). The approved fulfilment-email design and copy remain the baseline, held by the presentation tests in `fulfilmentEmail.test.ts`.

*Definition of done.* Real test messages were verified in a mailbox and the presentation approved in Outlook desktop (2026-09-16); all nine controlled cases of run `20260916s3f` passed; the plan is updated; the database carries no lead-magnet test data. **Sprint 3 is closed.** Sprint 4 is planning-only until Jeff approves the proposal.

### Sprint 4: Visitor capture experience

- **Objective:** a visitor can encounter a CTA, enter an email, submit, and receive the correct outcome state, on desktop, tablet, and mobile, accessibly.
- **Scope:** `LeadMagnetCTA` (band and footer-link variants), `LeadMagnetDialog` (lazy-loaded native `<dialog>` per A1), `LeadCaptureForm` with every state in Sections 13.2 and 25.6 including the unchecked checkbox, Turnstile interaction-only with expired-token handling, fine print linking `/privacy`, honeypot; `useAttribution` (`sessionStorage`); API client; the `/field-guide` landing page per Section 25.4 with its title and meta description; funnel event calls present but pointed at a no-op until Sprint 6; a single development placement for QA.
- **Out of scope:** the production placements (Sprint 5), live analytics (Sprint 6).
- **Dependencies:** Sprints 1a, 2, 3 (backend verified on `jitpro_website` in test mode); Sprint 1b for the real PDF behind the route during QA; the draft PR #52 preview confirmed to reference `jitpro_website` with test mode on (L-14) and Turnstile preview hostnames (L-5) for a full preview test.
- **Tasks:** components; states; attribution; landing page; accessibility pass; responsive pass; reduced-motion verification; failure-path QA.
- **Acceptance criteria:** Section 14.3 desktop, mobile (360, 390, 430), tablet (768, 1024), and accessibility checklists pass with screenshots recorded; every row of Section 13.3 produces the correct visitor state; keyboard-only completion; screen-reader announcement of errors and outcome headings; no horizontal overflow; Turnstile invisible in the normal path.
- **Tests:** form reducer and failure-state mapping tests; browser QA with the Chrome tools and headless screenshots; reduced-motion verification per the recorded tooling note.
- **Risks:** iOS software keyboard covering the field; preview cannot submit until L-5 and L-14 are done (fallback: production smoke test after merge).
- **Decision dependencies:** none outstanding.
- **Definition of done:** QA evidence recorded in the plan; plan updated.
- **Commit boundaries:** (1) dialog and form components with states; (2) attribution and API client; (3) landing page; (4) QA fixes.

**SPRINT 4 CLOSED (2026-09-16). Implemented, QA'd locally in Chrome, approved by Jeff, and its test data removed under a guarded cleanup.**

**S4-1: `/privacy` moved into Sprint 4 (Jeff, 2026-09-16).** The capture form's approved fine print links to `/privacy`, so leaving that page in Sprint 5 would have meant a link falling through to the catch-all route for the whole of Sprint 4 QA. The Section 27 notice is therefore built as part of the landing-page commit, with the approved copy unchanged, no postal address (S3-1), contact via `info@jit-pro.com` only, and the legal-review designation shown on the page until L-3 closes. The page is not extended beyond the approved content.

**S4-2: local end-to-end QA instead of preview submissions (Jeff, 2026-09-16).** Sprint 4's submit testing is done on `localhost` using Cloudflare's published always-pass Turnstile test site key, supplied **only** through the git-ignored `.env.local`. The production Turnstile configuration is not changed and **L-5 stays open and deferred**; Cloudflare previews are used for visual review, breakpoints, dialog presentation, keyboard behaviour, reduced motion and Jeff's approval, and Sprint 6's production smoke test remains the final real-production verification. Local submissions call the deployed `submit-lead-magnet-request` on `jitpro_website` with `LEAD_MAGNET_TEST_MODE` on and recipients restricted to `@resend.dev` and `@jit-pro.com`. No second Supabase project; `jitpro-staging` and `jitpro-sandbox` untouched.

**L-14 decided (Jeff, 2026-09-16).** Approved for Sprint 4 local QA: local development submissions may write test records into the lead-magnet tables in `jitpro_website` while test mode and the approved recipient restrictions are active. **This approval covers the new lead-magnet tables and workflow only**; test submissions are never routed through, and never modify, the existing `leads` contact-form workflow.

**Implementation record (2026-09-16).** Six commits on `feature/navigation-simplification-lead-gen-guide`, each CI-verified on draft PR #52.

| Commit | Contents |
|---|---|
| `463a02d` | `attribution.ts` (first-touch UTMs, referrer and landing path in `sessionStorage`, never overwritten, internal referrers dropped, query strings stripped, every storage access wrapped), `submitLeadMagnetRequest.ts` (never throws; every failure becomes a mappable result), `funnel.ts` (the seven event names fixed, sender deliberately inert until Sprint 6), `leadCaptureMachine.ts` (the whole §13.3 matrix collapsed into the three §13.2 states as a pure reducer). |
| `e174b59` | `LeadCaptureForm.tsx`, one component serving both the dialog and the landing page; `Turnstile.tsx` gains optional `appearance`, `onInteractive` and `className`, with the contact form's behaviour unchanged by its defaults. |
| `b297e0d` | `LeadMagnetDialog.tsx` (§28.1) and `dialog.css` (scrim, `[open]`, 160ms opacity entrance and its reduced-motion variant, every colour a token via `color-mix`); `LeadMagnetCTA.tsx` (§20.2 band and footer link, a real link to `/field-guide` so the offer survives without JavaScript, dialog lazy-loaded). |
| `a7e42ac` | `/field-guide` (§25.4) and `/privacy` (§27, S4-1), plus the QA placement. |
| `4384187` | The two defects found in browser QA (below). |
| `0d005e4` | QA placement moved to the unlisted `/review/lead-magnet` route. |

**Two defects found in Chrome that no unit test could have caught, both fixed client-side with the deployed function unchanged.**

1. **Focus return (§28.1, WCAG 2.4.3).** Closing the dialog left focus on `<body>` instead of the trigger. The close handler focused the trigger, but React then unmounted the dialog and its cleanup called the native `close()`, which moves focus and overwrote it. Focus is now restored from a parent effect that runs after the child's cleanup, the first moment it sticks. Verified: `document.activeElement` is the CTA link after Escape.
2. **Honeypot detectability (§13.3).** A honeypot-filled submission showed the email-failure state rather than plain success, letting a bot identify the trap and stop filling the field. The function answers the honeypot with `stored: true` and no email status, an ordinary-looking acceptance that stores and sends nothing; the reducer was mapping that null status to failure. It now maps to success. This is the only path reporting a stored request with no email status, because every genuinely stored request records one of the four statuses, so no real visitor is promised an email that is not coming. **Jeff approved the client-side handling on 2026-09-16 and directed that the backend NOT be redeployed to change it.**

**Local browser QA (2026-09-16), `localhost:5173` against the deployed v5 function in test mode.** `turnstile_passed` true throughout, confirming the dummy site key validated against `LEAD_MAGNET_TURNSTILE_TEST_SECRET`.

| Case | Path | Result |
|---|---|---|
| Empty and malformed email | landing page | Inline §33.1 error, no network; live re-validation clears it as corrected (§24.1) |
| A `delivered+lm-s4-a@resend.dev` | landing page | `sent` |
| B same address, immediately | landing page | `skipped_cooldown`, `is_repeat` true, no second email |
| C `delivered+lm-s4-c@resend.dev` | dialog, `home-band` | `sent` |
| D `delivered+lm-s4-d@resend.dev` | dialog, `footer-link`, keyboard only | `sent`; focus moved to the outcome heading |
| E `delivered+lm-s4-e@resend.dev` | landing page, checkbox ticked | `sent`, `marketing_opt_in_checked` true, contact `marketing_opt_in` |
| F honeypot filled | landing page | Nothing stored; plain success shown |

Consent model confirmed in the data: every unticked case recorded `transactional_only`, only case E recorded `marketing_opt_in`, and `consent_text_version` was `v1` on all five rows. Attribution confirmed: all five carried the QA markers, `page_path` matched the surface, and `landing_path` held the session's first touch. Jeff confirmed receipt of the corresponding emails. **Approved by Jeff on 2026-09-16 on the strength of this local QA.**

*Verified separately:* the dialog's entrance computes to `jp-lead-dialog-in 0.16s` opacity-only with an `animation: none` rule under `prefers-reduced-motion`; the honeypot is off-screen, inside an `aria-hidden` container, `tabIndex -1`, `autocomplete="off"`; the consent checkbox is unchecked by default in an 89px row (§34.1 minimum 44px); no console errors.

*Not verified by the assistant:* the 360 / 390 / 430 and 768 / 1024 breakpoint passes. `resize_window` had no effect in this environment (the window stayed maximised at 1745 CSS px), so those were left to Jeff's preview review. The §28.1 rules are implemented against directly (panel `calc(100% - 2rem)` capped at 32rem, `max-height: calc(100dvh - 2rem)`, internal scrolling).

**Cleanup (2026-09-16).** Read-only gate returned exactly Jeff's condition: **5 test requests, 4 test contacts, 0 non-test requests, 0 non-test contacts**, identified by `utm_source = 'lm-test-browser'`, `utm_medium = 'qa'`, `utm_campaign = 'lm-test'`, `utm_content = '20260916s4qa'`. *(Jeff's stated expectation of 4 contacts and 5 requests was correct; the assistant's own pre-submission summary had said 5 and 6, an arithmetic slip against its own case table, since cases A and B share a contact and the honeypot stores nothing.)* The approved guarded cleanup then ran as a single transactional `DO` block with the Sprint 3 safeguards: all four gates re-evaluated inside the transaction, post-delete assertions of exactly 5 and 4, rollback on any mismatch, no `TRUNCATE`, no schema change, no reset, and no hand-deletion of IP-activity rows.

| Object | Before | After | Expected |
|---|---|---|---|
| `lead_magnet_requests` | 5 | **0** | 0 |
| `contacts` | 4 | **0** | 0 |
| `lead_magnet_ip_activity` | 27 | **27** | unchanged, expiring under the 24-hour retention |
| `leads` | 59 | **59** | unchanged |
| Webhook invocations (`supabase_functions.hooks`) | 52 | **52** | unchanged |
| `investor_access` | 10 | **10** | unchanged |
| `profiles` | 0 | **0** | unchanged |
| Public tables / functions / RLS policies / triggers | 6 / 1 / 3 / 1 | **6 / 1 / 3 / 1** | unchanged |
| Edge Functions | 8 | **8**, `submit-lead-magnet-request` still v5 `ACTIVE`, the original seven at v21/v6/v8/v8/v6/v6/v6 | unchanged |

**Still in place, by design.** All four `LEAD_MAGNET_*` secrets remain set with their 2026-09-15 digests unchanged, and stay set until go-live (L-6). The approved fulfilment email design, copy and plain-text part are untouched. The consent model is unchanged. `.env.local` remains git-ignored and uncommitted.

**Definition of done.** Every §13.3 row produces the correct visitor state; keyboard-only completion verified; the outcome heading takes focus; QA evidence recorded here; the plan updated; the database carries no lead-magnet test data; Jeff has approved the capture experience. **Sprint 4 is closed.** Sprint 5 is planning-only until Jeff approves the proposal.

### Sprint 5: Website integration

- **Objective:** the approved offer is live on the homepage, Learn More, and the footer, with the privacy notice published.
- **Scope:** homepage band after `HomeFinalCTA` (A7, D6.6); Learn More band after section 11 outside the guide area (A8); footer *Free field guide* item and *Privacy* link (D6.15) using token classes; the `/privacy` page from Section 27 (no mailing address, S3-1); route registration; regression pass.
- **Out of scope:** navigation, other pages, a Terms page, any other footer change.
- **Dependencies:** Sprint 4; Section 27 approved by Jeff (done in Round 6; legal review may still be pending and does not block a preview, but does block production launch).
- **Tasks:** one commit per placement; privacy page; regression.
- **Acceptance criteria:** each placement renders and opens the dialog with the correct `placement`; §48.1 and §48.7 respected (band eyebrow is the only amber; no two primary actions in one viewport); homepage and Learn More visually unchanged above the bands; contact form, navigation, and footer regression-free; `/privacy` reachable from the form and the footer.
- **Tests:** browser QA per placement at all breakpoints; regression on contact form and navigation; lychee passes.
- **Risks:** homepage visual review by Jeff before merge (plan-then-approve rule); the Learn More guide area's grid and the band's full-bleed placement.
- **Decision dependencies:** none outstanding.
- **Definition of done:** Jeff has seen the preview of both bands and approved them; plan updated.
- **Commit boundaries:** (1) homepage band; (2) Learn More band; (3) footer; (4) privacy page.

**SPRINT 5 CLOSED (2026-09-16). All three placements live on the branch, the offer band redesigned under amendment A11, and both placements visually approved by Jeff.**

**S5-1: footer items use tokens; the legacy footer is not migrated (Jeff, 2026-09-16).** The two new footer items take approved token classes. The surrounding footer links carry raw palette classes (`text-slate-400`, `hover:text-slate-100`) that predate Design System §8.8, §8.9 and §45; that is a scheduled migration and was explicitly held out of scope, so the new items do not match their neighbours exactly until it happens. A note at the top of `Footer.tsx` records this so the mismatch reads as deliberate.

**S5-2: Sprint 5 QA verified payloads without submitting (Jeff, 2026-09-16).** The end-to-end submission workflow was already proven in Sprints 3 and 4, so Sprint 5 created **no new Supabase test data**. Verification instead patched `window.fetch` in the browser to capture the request body and answer locally, so nothing could reach the function. Confirmed afterwards: `contacts` 0, `lead_magnet_requests` 0, `lead_magnet_ip_activity` unchanged at 27 (no new rows, therefore no request reached the function), `leads` 59, webhook invocations 52.

| Surface | `placement` | `page_path` | `asset_id` | consent version |
|---|---|---|---|---|
| Homepage | `home-band` | `/` | `procurement-field-guide` | `v1` |
| Learn More | `learn-more-band` | `/learn-more` | `procurement-field-guide` | `v1` |
| Footer | `footer-link` | the page it was clicked from | `procurement-field-guide` | `v1` |

All five UTM fields, the referrer, the landing path and the empty honeypot travelled correctly on all three. `landing_path` stayed at the session's first touch across client-side navigation, which incidentally proves first-touch attribution survives React Router. The Learn More run also ticked the consent box and `marketing_opt_in: true` travelled.

**Implementation record (2026-09-16).** Six commits, each CI-verified on draft PR #52.

| Commit | Contents |
|---|---|
| `e99c663` | Homepage band after `HomeFinalCTA`, outside the five-section doctrine; nothing above it changed. |
| `170aab7` | Learn More band after the close, **outside** the guide-area wrapper so it cannot land in the rail's grid column and read as a twelfth numbered section (A8, §50.5). |
| `25d9529` | Footer: *Free field guide* opening the dialog with `placement="footer-link"`, and *Privacy* beside *For Investors* (D6.15, S5-1). |
| `f5df425` | **Amendment A11** to the Design System, recorded before any component changed (§49). |
| `61ef601` | The rendered cover, the generation script, the registry `coverBaseName`, and the consistency assertions. |
| `e6488ec` | The redesigned band implementing A11 and §20.2.1. |

**The visual redesign (amendment A11).** Jeff reviewed the first Sprint 5 band and **declined the visual treatment**: the copy and placement were approved, but the presentation read as another content section rather than as a free publication a visitor could have. The redesign was proposed, approved, and then implemented in the approved order: amendment first, then the cover asset and its CI gate, then the component.

- **Composition.** Copy column (eyebrow, heading, supporting sentence, action) at left; the publication object at right. Below `lg` the same DOM order stacks, so the mobile stack and the screen-reader order are one thing rather than two rules to keep in agreement.
- **Action.** Brand Amber fill with `--jp-background` ink, matching the approved fulfilment-email CTA. Because hue can no longer separate it from the page's commercial primary, **weight does**, and it was measured: the commercial primary is 275x56 at 16px with an amber glow; the guide action is **240x50 at 15px with no shadow at all**. Smaller on every axis and the only one of the two without elevation. No artificial vertical spacing was added to separate them, per A11.
- **The publication object (§20.2.1).** A mechanical render of page 1 of the approved committed PDF, never a recreation, which keeps §48.8 satisfied by construction. Slight perspective flattening towards mobile, two page-edge slivers at two depths, one restrained `color-mix` shadow, and a faint technical grid. **No amber glow**, at Jeff's direction: the cover artwork carries its own amber and the band's two amber elements are already spent on the eyebrow and the action.
- **The structural hairline.** Measured, not assumed: the cover's ground is `#02101B`, which is **1.05:1 against `--jp-background`** and **1.08:1 against `--jp-surface`**. Without an explicit 1px `--jp-border` edge the object dissolves into the band, which is the flatness the redesign existed to fix. §20.2.1 records the measurement so any future dark publication is checked the same way.
- **Governance.** A11 also corrected two cross-references it would otherwise have left contradicting the document: §26.1 no longer claims this band as its first approved use, and the §50.5 amendment no longer says the band takes a hairline secondary.

**Cover asset and version integrity.** `scripts/generate-guide-cover.sh` renders page 1 with `pdftocairo` and encodes WebP at 800w (27KB) and 1600w (58KB) into `public/assets/guides/`, using developer tooling on the machine rather than project dependencies: `package.json` and the lockfile are untouched. The registry gains `coverBaseName`, `GUIDE_COVER_DIR`, `GUIDE_COVER_WIDTHS` and `guideCoverPath`. The consistency test fails if either width is missing or is not really WebP, and if `coverBaseName` and `fileName` do not both carry the asset's `version`. **A future PDF version therefore implies a new cover basename, which fails the existence check until the cover is regenerated.** A modification-time check was written and then removed deliberately: git does not preserve mtimes, so on a fresh CI checkout every file is written at once and their relative order is arbitrary, which would have made it flaky. The version-label pairing carries the same guarantee deterministically.

**Regression pass.** Clean, with no fixes required, so the planned fourth commit boundary was a no-op. The contact form still renders Turnstile, issues a token and enables submit, confirming the optional props added to `Turnstile.tsx` preserved its previous behaviour. Navigation untouched. No other CTA placement added. On Learn More the band was confirmed in the DOM to sit outside `#in-this-guide` and to be absent from the guide and the rail. No horizontal overflow on either page.

> **APPROVED BASELINE (Jeff, 2026-09-16, visual review of the Cloudflare preview).** The redesigned publication-object treatment, the actual Field Guide cover, the composition, the amber CTA, the hierarchy, the spacing and the responsive behaviour on desktop and mobile are all approved, on the homepage and on Learn More. **This is the governed baseline for the Field Guide offer band and is not changed without Jeff's approval**; Design System §20.2 as amended by A11 and §20.2.1 hold it in place, and the registry consistency test holds the cover to its PDF version. Jeff also reviewed the Learn More placement and **did not encounter a blocking rendering problem**, closing the white-paint observation recorded during implementation as a local session artifact rather than a defect.

**Definition of done.** Each placement renders and supplies the correct placement, page path, asset id, consent version and attribution; §48.1 and §50.5 respected; the homepage and Learn More are unchanged above the bands; contact form, navigation and footer regression-free; `/privacy` reachable from both the form and the footer; lychee passes in CI; Jeff has seen and approved both bands. **Sprint 5 is closed.** Sprint 6 is planning-only until Jeff approves the proposal.

### Sprint 6: Analytics, QA, and production readiness

- **Objective:** the complete funnel is measurable, verified, and live for visitors.
- **Scope:** `lead_magnet_events` migration and `record-lead-magnet-event` function on `jitpro_website`, each after a fresh read-only inspection and Jeff's approval of the exact change set (Section 15.2), verified in test mode; `funnel.ts` wired to the seven events with impression deduplication; the eight saved queries under `supabase/queries/`; full regression; accessibility audit; email re-verification; **go-live switch** (L-6, L-7): test mode and any test-only override removed with Jeff's approval, production-mode `curl` check with a JiTpro-owned address, approved targeted cleanup of test rows if Jeff wants it; Cloudflare Web Analytics enablement (L-9); Pulsetic monitor (L-11); draft PR #52 marked ready with the Section 15 summary; production smoke test after merge; results recorded. No staging-to-production promotion (G-8).
- **Out of scope:** any nurture prerequisite (Section 21.2), Resend webhook, report page.
- **Dependencies:** Sprints 1 to 5; launch checklist L-1 to L-14 complete, including legal review (L-3) before merge to production.
- **Tasks:** events; queries; audits; go-live switch; PR; smoke test; documentation.
- **Acceptance criteria:** the brief's Section 38 review passes in full (functional, visual, accessibility, email, analytics, data, security, regression, CI); events appear once per action with no StrictMode duplication in the production build; queries return sensible results; all launch items checked; Jeff authorises the merge.
- **Tests:** everything in Section 14; production smoke test per Section 15 step 6.
- **Risks:** an external prerequisite still open at merge time (the PR waits); event duplication in development only.
- **Decision dependencies:** Jeff's authorisation to merge.
- **Definition of done:** merged, production smoke test recorded, post-launch measurement plan started (Section 23).
- **Commit boundaries:** (1) events table, function, client wiring; (2) saved queries; (3) QA and audit fixes; (4) documentation and launch record.

**SPRINT 6 IN PROGRESS (2026-09-16). Analytics built, deployed and verified; privacy claims verified and corrected; the L-6 go-live switch and the merge remain, both gated on Jeff.**

**S6-1: the §8.1 event vocabulary was corrected, not amended (Jeff, 2026-09-16).** Sprint 4 shipped seven shortened names behind the inert sender (`cta_view` rather than `lead_magnet_cta_view`, and so on) and omitted `error_kind`. §8.1 calls the vocabulary fixed, so the implementation was corrected to match rather than the plan relaxed to accommodate it. Nothing had been emitted, so there was no data to migrate. The `lead_magnet_events` CHECK constraint is written from the same list, so a future drift fails at the database instead of producing an unreadable funnel.

**S6-2: conversion means storage, not delivery (Jeff, 2026-09-16).** The Sprint 4 code fired success only when `email_status === 'sent'`. §8.1 defines `lead_magnet_request_success` as the server returning success with the lead recorded and access granted; the email outcome is not part of it. As written, a lead recorded perfectly whose email merely hit the one-hour cooldown was reported as a funnel **failure**, understating conversion and inflating the error rate in the saved queries. **Success now means `stored`, full stop.** Email outcomes stay measured separately from `lead_magnet_requests.email_status` (saved query 6), so the same fact is never counted twice in two places that could disagree. This also keeps the honeypot indistinguishable: it answers `stored: true`, so a bot logs a success exactly as a visitor does.

**S6-3: L-3 disposition (Jeff, 2026-09-16).** Generic L-3 is **not** a hard blocker to this launch. The transactional fulfilment email is accepted as implemented and stays narrowly limited to fulfilling the visitor's explicit request, with no marketing content. The optional unchecked marketing checkbox remains, and **no marketing or nurture email is sent as part of this launch**; an operational unsubscribe mechanism is a hard prerequisite before the first such email is ever sent, not before this feature launches. The three implementation-dependent privacy claims were to be verified against the running system before launch, with any discrepancy reported before copy changed. No consent banner is introduced. The remaining legal-review recommendation stays documented as a business and legal follow-up.

**Implementation record (2026-09-16).**

| Commit | Contents |
|---|---|
| `52cd935` | Event vocabulary corrected to §8.1, `error_kind` added, the S6-2 conversion fix, and stale L-13 corrected. |
| `f2fbb0f` | `lead_magnet_events` migration, applied and verified. |
| `291cb09` | `record-lead-magnet-event` implemented (not yet deployed at that commit). |
| `19ce0f7`, `50ed246`, `9c1c63b` | The live funnel sender, the eight saved queries, and two CI fixes (below). |
| `628b367` | The two verified privacy corrections. |

**Two CI failures on the branch, both mine, neither reaching `main`.** A type error was pushed because the verification chain used pipes, so the shell read `tail`'s exit status instead of `tsc`'s and a failing typecheck did not stop the run; checks are now run with `pipefail` set. Then two transport tests passed locally and failed in CI, because `sendFunnelEvent` returns early without `VITE_SUPABASE_URL`, which `.env` supplies locally and CI does not have; the tests now stub the environment explicitly, a new test pins the early return, and the fix was verified by moving `.env` and `.env.local` aside and re-running.

**The `lead_magnet_events` migration (`20260916000005`).** Pre-change §15.2 inspection matched the approved baseline exactly: 6 public tables with the expected names, no collision on the table or its sequence, `contacts` 0, `lead_magnet_requests` 0, `lead_magnet_ip_activity` 27, `leads` 59, webhook invocations 52, `investor_access` 10, `profiles` 0. Applied individually with the explicit project ref; never `db push`. Verified afterwards: columns and all five constraint definitions match the approved design; RLS enabled with zero policies; `anon` and `authenticated` hold no table privilege **and no sequence privilege**, the sequence revoked in the same file per S2-10; three indexes; zero rows. Public tables 6 to 7 with `lead_magnet_events` the only addition, every other count identical, and the eight Edge Functions unchanged.

**Deploying `record-lead-magnet-event` (2026-09-16, Jeff's approval).** Deployed alone by explicit name with `--no-verify-jwt`. Verified: Edge Functions **8 to 9**, the new function **ACTIVE, `verify_jwt: false`, v1**; the original eight showed **zero drift** in bundle hash, version, `verify_jwt` and status; secrets 15 to 15 with **no digest change**; the seven platform-injected `SUPABASE_*` secrets had `updated_at` refreshed by the deploy, which is the documented S2-18 behaviour and not a secret change, while every project-managed secret was untouched.

**Controlled probes.** Six, the minimum needed, with the expected footprint stated first. `OPTIONS` from an allowed origin returned 204; from a disallowed origin 403; `GET` returned 405; `POST` from a disallowed origin returned 403. One valid event was accepted and stored with the correct name, asset, placement and sanitised path. One invalid event (the shortened `cta_click`) was dropped and stored nothing, **and created no IP-activity row either**, because validation runs before the limiter. Footprint matched the prediction exactly: events 0 to 1, IP activity 27 to 28 with `activity_kind='event'` 0 to 1. `contacts`, `lead_magnet_requests`, `leads`, webhook invocations, `investor_access` and `profiles` all unchanged.

**Probe cleanup (2026-09-16, Jeff's approval).** Read-only gate returned exactly 1 probe event and 0 non-probe events. The guarded transactional `DO` block re-checked both gates inside the transaction, asserted the deleted count, and removed the single event. Verified afterwards: `lead_magnet_events` **0**, `contacts` 0, `lead_magnet_requests` 0, `leads` 59, webhook invocations 52, `investor_access` 10, `profiles` 0, 7 public tables, 3 RLS policies, 1 database function, 1 trigger, and 9 Edge Functions all ACTIVE at unchanged versions. The one IP-activity row was left to expire under the 24-hour retention.

**Privacy-claim verification (2026-09-16).** All three implementation-dependent claims were checked against the running system, and the findings reported to Jeff before any copy changed.

| Claim | Finding | Outcome |
|---|---|---|
| Cookies | `jit-pro.com` sets **no cookies on any route**, verified on the homepage, `/contact`, a static asset and the PDF route. But both Supabase Edge Function endpoints set a short-lived Cloudflare bot-management cookie (`__cf_bm`, `HttpOnly`, `SameSite=None`, domain `supabase.co`) when the browser calls them. The draft attributed every cookie to the provider serving the website, which missed this entirely. | **Corrected.** The sentence now covers the providers that process a request as well, and names the moment it happens, without characterising the cookie beyond what was verified. Jeff chose wording that keeps the Cloudflare and Supabase infrastructure relationship out of visitor-facing copy; the technical detail is recorded here instead. No consent banner introduced. |
| Email delivery records | The draft described a system that receives delivery, bounce and complaint notifications and stops sending on the strength of them. **There is no Resend webhook receiver** in the repository; F-7 deferred it, and nothing listens for asynchronous events. Sprint 3 demonstrated the gap concretely: Resend accepted `suppressed@resend.dev` with a 200 and a message id, suppressing silently, and the row recorded `sent`. | **Corrected.** The paragraph now says the provider handles delivery and suppression while JiTpro records the immediate result of its own send attempt, and claims no asynchronous notifications. **F-7 remains a future enhancement, not a launch requirement**; no webhook receiver was built. |
| No sale, no sharing | Verified by enumerating every external host the code calls: Resend (email), Cloudflare (hosting and Turnstile), Supabase (database and functions) and Microsoft 365 (the `info@` mailbox). No advertiser, data broker or enrichment service is involved. Cloudflare Web Analytics is **not yet enabled**, confirmed by the absence of the beacon on production. | **Accurate, unchanged.** |

`VERIFIED_CLAIMS` in `privacyNotice.ts` records what each check produced, and `PENDING_VERIFICATION` now holds only the publication date. Four tests pin the corrected paragraphs, assert the three withdrawn sentences cannot return, and check that none of this bookkeeping reaches a visitor.

**Analytics verification on the production build (2026-09-16).** Run against `npm run preview`, not the dev server, so React StrictMode's double invocation could not mask a duplicate. Both the event endpoint and the capture endpoint were intercepted in the browser, so **no database row was created**.

- `lead_magnet_cta_view` fired **once per placement per mount** with the correct §8.1 names, and the per-placement session dedupe held across client-side navigation.
- A full successful capture emitted, in order and once each: `lead_magnet_cta_click`, `lead_magnet_form_view`, `lead_magnet_form_submit`, `lead_magnet_request_success`, `lead_magnet_download_click`, every one with `error_kind: null`.
- **The S6-2 fix was proven end to end:** a response of `stored: true` with `email_status: 'skipped_cooldown'` produced `lead_magnet_request_success`, not an error.
- A 429 produced `lead_magnet_request_error` with `error_kind: 'rate_limited'`, and the visitor still saw the fail-open outcome offering the guide.
- Confirmed afterwards: `lead_magnet_events` 0, `contacts` 0, `lead_magnet_requests` 0, `leads` 59, webhook invocations 52.

**Saved queries.** The eight §8.3 queries are committed under `supabase/queries/`, read-only and versioned, each executed against the live schema to prove it runs. The README and the comments in queries 4 and 6 carry the S6-2 rule, so the definition of conversion is stated where the numbers are read rather than only in the plan.

**State at this point.** Database: 7 public tables, all lead-magnet tables empty, `leads` 59 and webhook invocations 52 untouched. Functions: 9, all ACTIVE, `submit-lead-magnet-request` v5 and `record-lead-magnet-event` v1. Secrets: 15, all four `LEAD_MAGNET_*` still set. PR #52 still a draft. **Nothing is visitor-facing: the CTA is live only on the branch.**

**Remaining before launch:** the L-6 go-live switch, production Turnstile and Resend verification, PR #52 marked ready, Jeff's merge approval, the squash merge, the Cloudflare production check, the live smoke test, and the smoke-test cleanup. Each is gated on Jeff.

---

**L-6 GO-LIVE SWITCH EXECUTED (2026-09-16, Jeff's approval). The backend is now in production mode.**

A baseline of every secret digest, all nine Edge Functions (version, bundle hash, `verify_jwt`, status, entrypoint, import map) and the full database state was captured first, solely to prove L-6 changed exactly what was expected.

**Secrets: 15 to 12.** Removed exactly `LEAD_MAGNET_TEST_MODE`, `LEAD_MAGNET_TURNSTILE_TEST_SECRET` and `LEAD_MAGNET_TEST_FAULT_SECRET`, and nothing else. `LEAD_MAGNET_IP_SALT` remains with its **digest unchanged**, so production rate limiting is intact. No retained secret changed digest, nothing was added, and `LEAD_MAGNET_NOTIFY_TO` stays unset so internal notifications keep defaulting to `info@jit-pro.com`. Removing test mode alone disables every test hook, since each requires it as its first condition: the recipient restriction, the three simulated faults, the Cloudflare test-secret path, and the S3-2 development cooldown bypass, which is now dead and the one-hour cooldown absolute.

**Edge Functions: exactly the S2-18 behaviour.** All nine version-bumped by one as they picked up the changed environment (`submit-lead-magnet-request` v5 to v6, `record-lead-magnet-event` v1 to v2, `send-contact-notification` v21 to v22, and so on), all remain `ACTIVE`, and **every bundle hash, `verify_jwt`, status, entrypoint and import-map setting is identical to the pre-L-6 baseline**. Zero drift; no function was redeployed or changed.

**Database: unchanged.** Every count and object identical to the baseline, including the latest `leads` timestamp, confirming nothing moved independently either.

**Turnstile negative proof (the primary functional check).** The same Cloudflare dummy token that succeeded while test mode was on now returns **403 `verification_failed`**. The response still carried the guide URL, so fail-open held, and the footprint was **nothing at all**, not even an IP-activity row, because verification runs before both persistence and the limiter. This is the proof the test Turnstile path is genuinely gone rather than merely unlisted.

**External production-email test, run `20260916l6prod`.** One production request to **`jeffk@kaufmanbuilding.com`**, deliberately outside both `jit-pro.com` and `resend.dev`, which the former test-mode restriction would have refused.

*How a valid production token was obtained without weakening anything:* `https://jit-pro.com/contact` renders the Turnstile widget with the production site key on the allowed hostname, so it was loaded in a real browser, Cloudflare issued a genuine token to that browser, and the request was fired **from inside that page** so the token was never handled or printed. The contact form was not submitted, so no `leads` row was created. No hostname was added, no secret altered, no check disabled; the unmodified production `TURNSTILE_SECRET_KEY` verified a real token. Recorded for completeness: the function does not inspect the hostname claim in Cloudflare's response, which is why a token minted on `/contact` validates. The request also confirmed the function is reachable without an `apikey` header, as `verify_jwt: false` implies.

*Result, matching the prediction exactly:* HTTP 200, `stored: true`, `email_status: sent`, provider id present, `email_error` null. One contact and one request created. The contact is **`transactional_only`** with `marketing_opt_in_at` null, and the request carries `marketing_opt_in_checked: false`, `consent_text_version: v1`, `turnstile_passed: true`, `placement: home-band`, `page_path: /`, `asset_version: 2026-09`, `fulfilment_status: delivered_inline`, and the markers `utm_source=lm-l6-verify`, `utm_medium=prod-check`, `utm_campaign=lm-test`, `utm_content=20260916l6prod`. IP activity 28 to 29. **`leads` 59 with its latest timestamp unchanged, webhook invocations 52, `investor_access` 10, `profiles` 0, `lead_magnet_events` 0.** Two Resend sends: the approved fulfilment email to `jeffk@kaufmanbuilding.com` and the independent internal notification to `info@jit-pro.com`. No marketing or nurture email.

**Local development override removed.** `.env.local`, which supplied Cloudflare's published dummy Turnstile site key for Sprint 4 QA (S4-2), was deleted so future local development cannot silently use it. It was confirmed git-ignored and its removal produced no repository change.

**Verification rows still in place.** The one contact and one request from run `20260916l6prod` are deliberately left for Jeff's review, with the guarded cleanup proposed separately. The IP-activity row expires under normal 24-hour retention.

---

## BREAK POINT (2026-09-16): machine handover, Windows PC to MacBook Pro

**THE NEXT DECISION AND ACTION:**

> **Resume on the MacBook Pro, verify repository synchronization and deployed state, then continue from the PR #52 ready/cleanup/merge gate. Do not merge without Jeff's explicit approval.**

### Where the project stands

| | |
|---|---|
| **Sprints 1a, 1b, 2, 3, 4, 5** | **Complete and formally closed.** |
| **Sprint 6** | **In progress.** Analytics built, deployed and verified; privacy claims verified and corrected; **L-6 complete**. Remaining: the guarded cleanup of the L-6 verification row, marking PR #52 ready, Jeff's merge approval, the squash merge, the Cloudflare production check, the live smoke test and its cleanup. |
| **Production website** | **Has NOT received the feature.** Nothing is visitor-facing; the CTA exists only on the branch. |
| **PR #52** | **Still a draft. Not merged.** Description updated to the final §15 summary. |
| **Post-merge smoke test** | **Not performed.** |

### Backend state: production mode is ACTIVE

**L-6 completed successfully on 2026-09-16.** The three test secrets were removed:

- `LEAD_MAGNET_TEST_MODE` — removed
- `LEAD_MAGNET_TURNSTILE_TEST_SECRET` — removed
- `LEAD_MAGNET_TEST_FAULT_SECRET` — removed

**`LEAD_MAGNET_IP_SALT` is retained** with its digest unchanged, because production rate limiting depends on it. Secrets went 15 to 12; no other digest changed; `LEAD_MAGNET_NOTIFY_TO` remains deliberately unset so internal notifications default to `info@jit-pro.com`.

Because test mode is gone, every test hook is dead: the recipient restriction, the three simulated faults, the Cloudflare test-secret path, and the S3-2 development cooldown bypass. **The one-hour cooldown is now absolute**, which matters for any future testing.

**9 Edge Functions, all `ACTIVE`.** All nine version-bumped by one when the secrets changed (S2-18), with **every bundle hash, `verify_jwt`, status, entrypoint and import-map setting identical** to the pre-L-6 baseline. Current versions: `submit-lead-magnet-request` v6, `record-lead-magnet-event` v2, `send-contact-notification` v22, `submit-contact` v7, `submit-investor-request` v9, `approve-investor` v9, `verify-investor-token` v7, `revoke-investor` v7, `list-investor-requests` v7.

### Production verification that has already passed

**Turnstile negative test: PASSED.** The Cloudflare dummy token that worked while test mode was on now returns **403 `verification_failed`**, with no database footprint at all. This is the proof the test path is genuinely gone.

**External production fulfilment: SUCCEEDED.** One real request to **`jeffk@kaufmanbuilding.com`**, outside both `jit-pro.com` and `resend.dev`, returned HTTP 200 with `stored: true` and **`email_status: sent`**.

**Internal notification to `info@jit-pro.com`: SUCCEEDED**, sent independently of the fulfilment email.

**Jeff personally confirmed receipt of the external fulfilment email.**

### The one outstanding database row

**One verification contact and one request remain in `jitpro_website`, pending cleanup.** They are **not** production leads and must not be treated as such.

*Resolved 2026-09-16 on the MacBook Pro: the gate passed exactly and the row was removed under Jeff's approval. See the resumption record below. The SQL is kept here as the executed record.*

**Identifying run marker: `20260916l6prod`** (`utm_source=lm-l6-verify`, `utm_medium=prod-check`, `utm_campaign=lm-test`, `utm_content=20260916l6prod`).

Contact `jeffk@kaufmanbuilding.com`, `transactional_only`, `marketing_opt_in_at` null. Request: `placement=home-band`, `page_path=/`, `consent_text_version=v1`, `turnstile_passed=true`, `email_status=sent`, provider id present.

**The approved-pattern guarded cleanup, preserved so the Mac session need not reconstruct it.** It is **not executed**; it needs Jeff's approval, and he may prefer to run it after the smoke test so one cleanup covers both sets of rows.

```sql
do $$
declare v_req bigint; v_other_req bigint; v_other_con bigint; v_dr bigint; v_dc bigint;
begin
  create temporary table _tmp_l6 on commit drop as
    select id, contact_id from public.lead_magnet_requests
    where utm_source='lm-l6-verify' and utm_medium='prod-check'
      and utm_campaign='lm-test' and utm_content='20260916l6prod';

  select count(*) into v_req from _tmp_l6;
  select count(*) into v_other_req from public.lead_magnet_requests r
    where not exists (select 1 from _tmp_l6 t where t.id=r.id);
  select count(*) into v_other_con from public.contacts c
    where not exists (select 1 from _tmp_l6 t where t.contact_id=c.id);

  if v_req <> 1 then raise exception 'GATE: expected 1 request, found %', v_req; end if;
  if v_other_req <> 0 then raise exception 'GATE: expected 0 other requests, found %', v_other_req; end if;
  if v_other_con <> 0 then raise exception 'GATE: expected 0 other contacts, found %', v_other_con; end if;

  delete from public.lead_magnet_requests r using _tmp_l6 t where r.id=t.id;
  get diagnostics v_dr = row_count;
  delete from public.contacts c using _tmp_l6 t where c.id=t.contact_id
    and not exists (select 1 from public.lead_magnet_requests r where r.contact_id=c.id);
  get diagnostics v_dc = row_count;

  if v_dr <> 1 then raise exception 'ABORT: deleted % requests', v_dr; end if;
  if v_dc <> 1 then raise exception 'ABORT: deleted % contacts', v_dc; end if;
end $$;
```

**Gate before running it:** exactly 1 request carrying the marker, 0 non-marker requests, 0 non-marker contacts. **If anything differs, STOP** — a difference after this date may mean a real visitor lead exists, which changes the decision entirely. IP-activity rows are never hand-deleted; they expire under the 24-hour retention.

### Database state at the break point

`contacts` **1**, `lead_magnet_requests` **1** (both the verification row above), `lead_magnet_events` **0**, `lead_magnet_ip_activity` 29 (expiring), **`leads` 59 with its latest timestamp unchanged**, webhook invocations **52**, `investor_access` 10, `profiles` 0, 7 public tables, 3 RLS policies, 1 database function, 1 trigger. The contact form and its pipeline were never touched at any point.

### Repository state

Branch `feature/navigation-simplification-lead-gen-guide`, working tree clean, fully pushed and synchronized with `origin`. **Branch is current with `main`** (`main` has not advanced; the branch is ahead only). **Final CI is green:** `build-and-test` and Cloudflare Pages both pass. Locally: 342 tests, typecheck clean, lint 0 errors (4 pre-existing warnings), build and `audit-ci` pass, `package.json` and the lockfile unchanged throughout the project.

### What does NOT transfer through GitHub

- **`.env`** is git-ignored and must be recreated on the MacBook Pro. It holds three values: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_TURNSTILE_SITE_KEY`. All three are also set in the Cloudflare Pages environment, which is the authoritative copy.
- **`.env.local` no longer exists and must not be recreated.** It carried Cloudflare's dummy Turnstile site key for Sprint 4 QA and was deliberately removed at L-6 so local development cannot silently bypass production Turnstile.
- **Supabase CLI authentication** is per-machine; run `supabase login` on the Mac.
- `node_modules/`, `dist/` and `supabase/.temp/` are regenerated by `npm ci` and the build.
- **`~/.jitpro/lead-magnet-test-fault-secret` is now obsolete** and must NOT be carried over. The secret it mirrored was removed from Supabase at L-6, so the file is inert; it can be deleted on this PC whenever convenient.

*Reconciled on the MacBook Pro 2026-09-16: `.env` created from verified values, the Mac's older `.env.local` removed, CLI already authenticated. See the resumption record below.*

### Remaining sequence after resuming

1. ~~Verify repository sync and deployed state (9 functions, 12 secrets, the row counts above).~~ **Done 2026-09-16 on the MacBook Pro; everything matched.**
2. ~~Decide the cleanup timing for `20260916l6prod`: now, or together with the smoke-test rows.~~ **Done 2026-09-16: Jeff chose now; the guarded cleanup ran and verified.**
3. ~~Remove the rows from Jeff's 21:09 UTC manual browser test.~~ **Done 2026-09-16 (21:43 UTC): the guarded cleanup ran and verified; record below.**
4. ~~**Resolve the missing funnel events from that manual test.**~~ **Done 2026-09-16: root cause established (the `sendBeacon` transport's credentialed preflight fails against a CORS helper that grants no credentials), the client-only fix shipped in `7097e9d` with CI green, and a real-browser verification at 22:22 UTC stored exactly the two predicted events (record below).**
5. ~~**Jeff's decision on the guarded cleanup of the two verification events.**~~ **Done 2026-09-16 (22:27 UTC): Jeff approved, the read-only gate matched exactly, the block ran unchanged, 2 events deleted and verified (record below).**
6. Mark PR #52 ready **on Jeff's instruction**.
7. **Jeff's explicit merge approval**, then the squash merge (squash-only ruleset; `build-and-test` required and strict).
8. Verify the Cloudflare production deployment.
9. Run the live smoke test, verify the email and the analytics events.
10. Propose the guarded cleanup of the smoke-test rows.
11. Record the launch in this plan.

**Recommended but not launch-blocking:** L-9 Cloudflare Web Analytics, L-11 Pulsetic monitor, L-10 Supabase log retention, L-1 mailbox monitoring confirmation. **Deferred:** L-5 Turnstile preview hostnames, F-7 Resend webhook receiver, and the unsubscribe mechanism, which is required only before the first marketing email and this launch sends none.

### Resumption record (2026-09-16, MacBook Pro)

**Repository and deployed state verified against this break-point record (19:40 UTC).** Branch `feature/navigation-simplification-lead-gen-guide` at `1ac1c23`, working tree clean, 0 ahead and 0 behind `origin`, 67 ahead of `main` and 0 behind. PR #52 open as a draft, mergeable with a clean merge state, `build-and-test` and Cloudflare Pages both passing. The Supabase CLI was already authenticated on the Mac and the clone already linked to `jitpro_website`. Deployed: **9 Edge Functions, all `ACTIVE`, at exactly the recorded versions**; **12 secrets**, the three test secrets and `LEAD_MAGNET_NOTIFY_TO` absent, `LEAD_MAGNET_IP_SALT` present with `updated_at` 2026-09-15 (untouched by L-6). Database exactly as recorded: `contacts` 1, `lead_magnet_requests` 1 (the marker row, every field as documented), `lead_magnet_events` 0, `lead_magnet_ip_activity` 29 (28 request, 1 event; newest is the L-6 request itself, so the function had not been invoked since), `leads` 59 with latest 2026-09-15 20:54 UTC, webhook invocations 52 with the same latest timestamp, `investor_access` 10, `profiles` 0; 7 public tables, 3 RLS policies, 1 database function, 1 trigger, no migration-history table, `anon` and `authenticated` holding no table or sequence privilege on any lead-magnet table.

Bundle hashes were not previously written down, so the pre-L-6 comparison could not be repeated; they are recorded here as the baseline for future drift checks:

| Function | Version | `verify_jwt` | Bundle SHA-256 |
|---|---|---|---|
| `submit-lead-magnet-request` | v6 | false | `60a7b5743daafee20c9fd85459143ab6956b8528db6d08500d009c2242e58065` |
| `record-lead-magnet-event` | v2 | false | `5bc16863d0f5a5f29dc7b6c9185a0b7321d42f4e204814ed37c169daa748369c` |
| `send-contact-notification` | v22 | true | `54b89cf2259acac8d17681ff1300ec8103e697e2d9659e50d50c44b4530974ab` |
| `submit-contact` | v7 | false | `98adf5e803f3eb559c618a856cb5af48c1f1cfcbb48eca6a493bb41f7848b31c` |
| `submit-investor-request` | v9 | false | `16f963c7144ed2284fede188c7436c144b2e60981e8d7f59c7c2dc43db69edee` |
| `approve-investor` | v9 | false | `30a1ad6fb20a8da43779b2e4196c1d185532165c4318143b426ffeefa31dc2a0` |
| `verify-investor-token` | v7 | false | `85afba3b2aae646c15c187057a1927311b69dd38b62eb5c4d78286eb0a0ba76a` |
| `revoke-investor` | v7 | false | `674a883ebfbb95969eab37042a3ec916245fb43d5c2fde0cc83146709eccd67d` |
| `list-investor-requests` | v7 | false | `446adf8031c2a1625cd1459beb028e0456e05ddb7f94d93981d9ae3839f08f36` |

**Guarded cleanup of `20260916l6prod` (19:49 to 19:50 UTC, Jeff's approval).** The read-only gate was re-run first and returned exactly the approved condition: **1 marker request, 0 other requests, 0 other contacts.** The `DO` block above was extracted verbatim from this document and executed unchanged through `supabase db query --linked --project-ref pynjyrvnokfexyudimsn`. It completed without exception, so its in-transaction gates held and both post-delete assertions passed: **1 request and 1 contact deleted.** Verified afterwards: **`contacts` 0, `lead_magnet_requests` 0, `lead_magnet_events` 0**, `lead_magnet_ip_activity` 29 (untouched; the rows remain only for normal 24-hour expiry), **`leads` 59 with its latest timestamp unchanged, webhook invocations 52 with its latest timestamp unchanged**, `investor_access` 10, `profiles` 0. Objects unchanged: 7 public tables, 3 RLS policies, 1 database function, 1 trigger, the same event triggers and extensions, 10 lead-magnet indexes, 19 lead-magnet constraints, privileges identical. **The database holds no lead-magnet data.** Each query refreshed the platform-managed `cli_login_postgres` role, which already existed; that is not a schema change.

**Mac environment reconciliation (Jeff's approval).** `.env` was absent, as predicted. This clone predates the project (cloned 2026-04-02) and carried an older `.env.local` dated 2026-08-26 holding the same three `VITE_*` keys; it was not the Sprint 4 dummy-key file, but the rule that `.env.local` must not exist still applied. The three values were compared without printing them: each was hashed locally (SHA-256) and the hashes compared inside the Cloudflare dashboard page against the Pages **Production** variables, all three of which are plain-text variables. Result: **`VITE_SUPABASE_URL` MATCH, `VITE_SUPABASE_ANON_KEY` MATCH, `VITE_TURNSTILE_SITE_KEY` MATCH.** The same three values were also found verbatim in the live `jit-pro.com` production bundle, and the URL and key match `jitpro_website` directly (the anon value is the project's `sb_publishable_` key, not the legacy JWT). The Turnstile value is the production `0x4A…` site key, not a dummy key. `.env` was then created with exactly those three lines (owner-only permissions), each value verified by hash against the original, and `.env.local` deleted. `.gitignore` covers both names (lines 8 and 9); neither file is tracked, and `git status` remained clean. No Cloudflare setting was viewed for change or changed.

**Local verification on the Mac.** `npm test` 342 passed in 24 files; lint 0 errors with the 4 pre-existing warnings; build and `audit-ci` pass. **`npm run typecheck` fails on this machine only:** 16 `TS2688` errors, each for an empty duplicate directory such as `node_modules/@types/ws 2`. 271 empty directories named `<name> 2` appeared under `node_modules` at 12:39 local time, after `npm ci` had finished at 12:20 to 12:27, which is the macOS duplicate-naming pattern associated with iCloud syncing of the Documents folder. TypeScript includes every directory under `@types` implicitly, so the empty ones fail; there are **zero code errors**, and CI on the same commit is green. This is a machine artefact, not a dependency change, and nothing was altered: the remedy (remove the empty stray directories or rerun `npm ci`, and keep the working tree out of iCloud sync) is for Jeff to approve.

**State at this record.** Backend in production mode: 9 Edge Functions `ACTIVE`, 12 secrets, no lead-magnet rows. Repository clean and synchronized. **PR #52 remains a draft with green CI; it has not been merged; the production website does not contain the feature; no post-merge smoke test has occurred.** No production test was performed and no Supabase, Cloudflare, Resend or production configuration was changed. **Next: mark PR #52 ready on Jeff's instruction, then his explicit merge approval.**

### Manual browser test and its cleanup (2026-09-16, MacBook Pro)

**What happened.** After the repository moved to `~/Developer/JiTpro-Website`, Jeff ran `npm run dev` and submitted the Field Guide form from the local website with his own address, `jeffk@kaufmanbuilding.com`, and received the fulfilment email. `http://localhost:5173` is an allowed origin (§4.6, `cors.ts`), production Turnstile verified a genuine token, and the backend behaved as designed: one contact and one request were stored at **21:09:43 UTC** and one IP-activity request row was written. This was an intentional test, not a visitor lead, and it carried **no run marker**: a manual browser submission has no UTM fields to set.

**How it was found.** The next session's read-only verification against the resumption record found `contacts` 1 and `lead_magnet_requests` 1 where the record said 0. Per the standing rule the session stopped and reported before anything else; Jeff confirmed the test as his and authorised a read-only inspection of the single request.

**Row characteristics (read from 21:27 UTC).** Request `057bab3b-4a6b-453e-a52a-0d111366f8c0` for contact `4046237f-8132-41e8-bd38-670c2fac341c`: `asset_id procurement-field-guide`, `asset_version 2026-09`, `placement home-band`, `page_path /`, `landing_path /`, `referrer` null, all five `utm_*` null, `is_repeat false`, **`marketing_opt_in_checked true`**, `consent_text_version v1`, `consent_method checkbox`, `turnstile_passed true`, `fulfilment_status delivered_inline`, `email_status sent`, provider id present, `email_error` null, `created_at 2026-09-16 21:09:43.627 UTC`. Contact: `consent_status marketing_opt_in`, `marketing_opt_in_at 21:09:43.221 UTC`, `consent_placement home-band`, `consent_page_path /`, `consent_asset_id procurement-field-guide`, `first_landing_path /`, first source, medium, campaign and referrer null, not unsubscribed, not suppressed, `created_at 21:09:43.323 UTC`. Jeff had ticked the marketing checkbox, so this was the database's only marketing opt-in record; removing it is correct for a test address, and this launch sends no marketing email in any case.

**Gate (Jeff's minimum, extended).** Address equal to `jeffk@kaufmanbuilding.com`; both row ids; `created_at` inside the one-minute window 21:09:00 to 21:10:00 UTC; `placement home-band`; all four attribution UTMs null; exactly 1 matching request; exactly 1 matching contact linked to it; 0 other requests; 0 other contacts; 0 lead-magnet events. **Read-only inspection returned 1, 1, 1, 1, 0, 0, 0** (matching request, matching contact, request in window, request linked to the contact, other contacts, other requests, events).

**Executed block (21:43:44 to 21:43:47 UTC, Jeff's approval).** The read-only gate was re-run with the same predicates immediately beforehand and returned exactly the approved condition: **1 matching request, 1 matching contact, 0 other requests, 0 other contacts, 0 events.** The block below was written to a file (SHA-256 `df45476a7bb8aeac13258bbe2a11b41cff86377cce2360ee4e263dc7a6649a0b`) and executed unchanged through `supabase db query --linked --project-ref pynjyrvnokfexyudimsn -f`. It completed without exception, so its five in-transaction gates held and both post-delete assertions passed: **1 request and 1 contact deleted.**

```sql
do $$
declare
  v_req bigint; v_con bigint; v_other_req bigint; v_other_con bigint; v_events bigint;
  v_dr bigint; v_dc bigint;
begin
  create temporary table _tmp_manual_2109 on commit drop as
    select id, contact_id from public.lead_magnet_requests
    where email = 'jeffk@kaufmanbuilding.com'
      and id = '057bab3b-4a6b-453e-a52a-0d111366f8c0'
      and contact_id = '4046237f-8132-41e8-bd38-670c2fac341c'
      and created_at >= '2026-09-16 21:09:00+00'
      and created_at <  '2026-09-16 21:10:00+00'
      and placement = 'home-band'
      and utm_source is null and utm_medium is null
      and utm_campaign is null and utm_content is null;

  select count(*) into v_req from _tmp_manual_2109;
  select count(*) into v_con from public.contacts c
    where c.email = 'jeffk@kaufmanbuilding.com'
      and c.id = '4046237f-8132-41e8-bd38-670c2fac341c'
      and exists (select 1 from _tmp_manual_2109 t where t.contact_id = c.id);
  select count(*) into v_other_req from public.lead_magnet_requests r
    where not exists (select 1 from _tmp_manual_2109 t where t.id = r.id);
  select count(*) into v_other_con from public.contacts c
    where not exists (select 1 from _tmp_manual_2109 t where t.contact_id = c.id);
  select count(*) into v_events from public.lead_magnet_events;

  if v_req <> 1 then raise exception 'GATE: expected 1 request, found %', v_req; end if;
  if v_con <> 1 then raise exception 'GATE: expected 1 matching contact, found %', v_con; end if;
  if v_other_req <> 0 then raise exception 'GATE: expected 0 other requests, found %', v_other_req; end if;
  if v_other_con <> 0 then raise exception 'GATE: expected 0 other contacts, found %', v_other_con; end if;
  if v_events <> 0 then raise exception 'GATE: expected 0 events, found %', v_events; end if;

  delete from public.lead_magnet_requests r using _tmp_manual_2109 t where r.id = t.id;
  get diagnostics v_dr = row_count;
  delete from public.contacts c using _tmp_manual_2109 t where c.id = t.contact_id
    and not exists (select 1 from public.lead_magnet_requests r where r.contact_id = c.id);
  get diagnostics v_dc = row_count;

  if v_dr <> 1 then raise exception 'ABORT: deleted % requests', v_dr; end if;
  if v_dc <> 1 then raise exception 'ABORT: deleted % contacts', v_dc; end if;
end $$;
```

**Verified afterwards.** `contacts` **0**, `lead_magnet_requests` **0**, `lead_magnet_events` **0**; `lead_magnet_ip_activity` 19 with its newest row still the 21:09:42 UTC test request (untouched; the rows remain only for the 24-hour expiry); **`leads` 59 with its latest row unchanged at 2026-09-15 20:54:44 UTC; webhook invocations (`supabase_functions.hooks`) 52 with the same latest timestamp**; `investor_access` 10; `profiles` 0. Objects unchanged: 7 public tables, 3 RLS policies, 1 database function, 1 trigger, 7 event triggers, 6 extensions, 10 lead-magnet indexes, 19 lead-magnet constraints, and `anon` and `authenticated` still hold no privilege on any lead-magnet table. **9 Edge Functions, all `ACTIVE`, at the recorded versions with every bundle hash identical to the baseline table above.** No secret, Supabase, Cloudflare or Resend setting was touched. **The database again holds no lead-magnet data.**

**Documentation correction.** L-7 had read Open in §15.1 and §28 although every migration and both lead-magnet functions were deployed and verified in Sprints 2, 3, 4 and 6 and confirmed `ACTIVE` in production mode after L-6. Both rows now read Done with today's date and a note that the status was corrected, not the work.

**Observation opened by this test: no funnel events were recorded.** A browser submission from the dev server should have produced up to six `lead_magnet_*` events, from the impression to the download click. `lead_magnet_events` held 0 and the IP-activity table gained no `activity_kind='event'` row after the 18:01 UTC Sprint 6 probe. `record-lead-magnet-event` inserts an event-kind IP-activity row before it counts or stores anything, and its limiter fails open, so no beacon reached that point. The origin and method checks are shared with `submit-lead-magnet-request`, which accepted the submission from the same page, so the loss lies between the browser and the function's JSON parse. The Sprint 6 analytics verification intercepted the endpoint in the browser rather than sending to it, so the beacon path has never been proven end to end. **Jeff agreed this must be resolved before PR #52 is marked ready** and authorised a read-only diagnosis (function logs for 21:09 to 21:11 UTC and the browser-side request format), with no code, function, deployment, configuration or test-event change until he has seen the evidence and any proposed fix. The outcome is recorded in the next subsection.

### Funnel-event diagnosis (2026-09-16, read-only, Jeff's authorisation)

**Evidence (Supabase dashboard, Edge Functions log collection, 21:09 to 21:10 UTC; nothing sent, nothing changed).** Thirteen invocations in the window. `submit-lead-magnet-request`: OPTIONS 204 at 21:09:41, then POST 200 at 21:09:44. `record-lead-magnet-event`: **eleven OPTIONS, all 204** (21:09:16 twice, 21:09:26 three times, 21:09:30 three times, 21:09:41, 21:09:44, 21:09:49) and **zero POST**. Its function log for the window holds only `booted` and `shutdown` lines: no `recorded`, `dropped` or `rejected` message, so the handler never received a body. The expanded 21:09:49 preflight shows request URL `/functions/v1/record-lead-magnet-event?apikey=…`, which only the `sendBeacon` branch of `sendFunnelEvent` produces, method OPTIONS, status 204, `Vary: Accept-Encoding, Origin`, from Chrome 152 on macOS. The API Gateway collection carries no `/functions/v1` traffic at all (it shows only the submit function's own PostgREST calls at 21:09:41 to 21:09:43), so the functions collection is the authoritative record.

**Determination, item by item.** The browser requests reached Supabase and reached the function: every preflight was invoked and answered. Supabase rejected nothing before invocation. The function rejected or dropped nothing, because no POST ever arrived; JSON parsing, the POST origin check, rate limiting and persistence were never reached, and authentication was never evaluated. The loss is browser-side, after the preflight response: Chrome evaluated the 204, failed its CORS check, and never sent the POST.

**Root cause (narrowest).** `navigator.sendBeacon` sends with credentials mode `include` (Beacon specification), and a `Blob` of type `application/json` is not a CORS-safelisted content type, so the browser preflights it. For a credentialed request the CORS check requires the preflight response to carry `Access-Control-Allow-Credentials: true`. `corsHeadersFor` in `supabase/functions/_shared/lead-magnet/cors.ts` never sets that header, so the check fails and the beacon is discarded. `sendBeacon` had already returned `true` (it reports queueing, not delivery), so the `fetch` fallback never ran. The submit path is unaffected because `fetch` defaults to `credentials: 'same-origin'`, which sends no credentials cross-origin and needs no `Allow-Credentials`; its preflight passed against the identical helper and origin in the same minute. The other preflight failure modes are excluded by that comparison: the origin echo, allowed methods and allowed headers are the same, and the beacon asks only for `content-type`, a subset of what the submit preflight asked for successfully. A failed preflight is never cached, so every attempt appears as its own OPTIONS: eleven, for the two homepage placements (`home-band`, `footer-link`) plus the dialog events, with development StrictMode double-invocation plausible for some.

**Consequence.** Not a development-only artefact. Production uses the same helper and the same transport, so after the merge every funnel event would be lost in exactly this way while the capture itself worked. The Sprint 6 analytics verification on the production build intercepted `sendBeacon` and `fetch` inside the browser and therefore never exercised the real preflight: it proved payloads and ordering, not delivery.

**Proposed fix (PROPOSED; not implemented; Jeff's approval required).** Client only, inside PR #52; no function change, no deployment, no configuration change.

1. `src/components/lead-magnet/funnel.ts`: `sendFunnelEvent` drops the `sendBeacon` branch and the query-string key and sends every event with `fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: anonKey, Authorization: `Bearer ${anonKey}` }, body, keepalive: true })`, the same shape as the submit request the same helper already accepts. `keepalive` keeps the request alive across navigation, which was the only reason for `sendBeacon`; the download link opens in a new tab, so the capture page does not even unload. No credentials are sent, which is also the more private choice. The doc comment is corrected to say why `sendBeacon` is unsuitable here.
2. `src/components/lead-magnet/funnel.test.ts`: replace "prefers sendBeacon" and "falls back to keepalive fetch when sendBeacon refuses" with tests asserting that `fetch` is called exactly once with the bare function URL (no query string), the three headers, `keepalive: true` and the five-key body, and that `navigator.sendBeacon` is never called even when present; keep the missing-environment and throwing-transport cases.

Rejected alternatives: (a) adding `Access-Control-Allow-Credentials: true` to `cors.ts` fixes the beacon but changes both functions' CORS contract, needs `record-lead-magnet-event` redeployed, and starts sending the visitor's `supabase.co` cookies with every event; (b) a `text/plain` Blob avoids the preflight only through the simple-request loophole and still sends credentials.

**Test plan (PROPOSED).** (1) Unit: the updated `funnel.test.ts`, full suite, typecheck, lint, build. (2) Transport proof with no production traffic: run the dev server with `VITE_SUPABASE_URL` pointed at a throwaway local HTTP server that answers OPTIONS with exactly the headers `corsHeadersFor` produces and logs every request; load the homepage and walk the dialog with the submit intercepted; expect OPTIONS 204 followed by a POST carrying the JSON body for every event, and zero requests to Supabase. (3) One controlled production check from `http://localhost:5173` with Jeff's approval and the footprint predicted first: a single homepage load produces exactly two `lead_magnet_cta_view` rows (`home-band`, `footer-link`) and two event-kind IP-activity rows and nothing else; verify, then propose the guarded cleanup of those two events, or fold it into the smoke-test cleanup. (4) CI green on the PR; only then does the ready gate reopen.

**State at this record.** Database holds no lead-magnet data; backend in production mode and untouched; PR #52 a draft with green CI; **nothing implemented, deployed or configured for the fix.** Next: Jeff's decision on the proposed fix.

### Transport fix, verification and cleanup proposal (2026-09-16, Jeff's approval of the fix)

**Implementation (`7097e9d`).** Tests were written first and watched fail: five of the eight new transport tests failed against the beacon code for exactly the expected reasons (the beacon was called with the key in the query string and `fetch` never ran), and the three guards passed. `sendFunnelEvent` in `src/components/lead-magnet/funnel.ts` now posts with `fetch`, a JSON body, the `apikey` and `Authorization` headers and `keepalive: true`, to the bare function URL; the beacon branch and the query-string key are gone; the response is ignored and every failure, synchronous or rejected, is swallowed, so analytics still cannot touch a capture. The tests prove the bare URL, no key in the query string, the three headers, `keepalive`, the exact wire body, that `navigator.sendBeacon` is never used even when available, and that a throwing or rejecting transport never surfaces. Nothing else changed: no Edge Function, no CORS helper, no schema, no secret, no configuration, no consent or fulfilment behaviour, and `package.json` and the lockfile untouched. Local: typecheck clean, **346 tests in 24 files**, lint 0 errors with the 4 known warnings, build and `audit-ci` pass. **CI: `build-and-test` passed on `7097e9d` in 31 s** (run 35155384991); the Cloudflare Pages check had not reported for this commit when this was written.

**Predicted footprint, stated before the verification.** One fresh load of the homepage from `http://localhost:5173/`, no click, no dialog, no submission: exactly 2 `lead_magnet_events` rows, both `lead_magnet_cta_view` for `procurement-field-guide` on `/`, placements `home-band` and `footer-link`, `error_kind` null; exactly 2 event-kind IP-activity rows; `contacts` and `lead_magnet_requests` unchanged at 0; `leads` and webhook activity unchanged.

**Verification (22:22 UTC).** Headless Google Chrome 152 on the MacBook Pro, a fresh empty profile, driven over the DevTools protocol, loading the homepage from this clone's dev server, which was restarted first so it served the fixed module. Observed on the wire: two preflights (OPTIONS, initiator `preflight`, 204) followed by two POSTs (initiator `script`, 204) carrying `Authorization`, `Content-Type` and `apikey` headers and **no query string**. The function's invocation log shows the two POST invocations at 22:22:16 UTC. Database afterwards: `lead_magnet_events` 0 to **2** (id 2 `footer-link` at 22:22:16.776, id 3 `home-band` at 22:22:16.899, both `lead_magnet_cta_view`, `procurement-field-guide`, `/`, `error_kind` null); `lead_magnet_ip_activity` 19 to 21 with event-kind 1 to 3; `contacts` 0, `lead_magnet_requests` 0, `leads` 59, webhook invocations 52. **Exactly the predicted footprint. Real POSTs now reach `record-lead-magnet-event` and are stored.**

**Detour worth recording: the Claude in Chrome extension drives Jeff's Windows PC.** Four earlier homepage loads through the extension (22:01 to 22:13 UTC) ran the OLD transport, stored nothing and added only OPTIONS 204 invocations, and no server restart or hard reload on the Mac changed that. `list_connected_browsers` shows a single connected browser, osPlatform Windows, not local: every `localhost:5173` load went to a Vite dev server still running on the Windows PC from the pre-migration working copy, which serves the old module. That browser was fine for the read-only dashboard inspections, which are cloud pages. **Jeff should stop the stale Windows dev server**, since it serves pre-migration code. During the investigation the Mac dev server Jeff started at 21:09 UTC was stopped and restarted twice and finally stopped; run `npm run dev` again when needed. The plan's §14.3 note that Playwright or headless shells may be used stands: headless Chrome over the DevTools protocol is the reliable way to exercise this Mac's dev server.

**Guarded cleanup of the two verification events (PROPOSED; not executed; Jeff's approval required).** Gate: exactly 2 events; ids 2 and 3; both `lead_magnet_cta_view`, `procurement-field-guide`, `page_path` `/`, `error_kind` null, created between 22:22:00 and 22:23:00 UTC; exactly one `home-band` and one `footer-link`; 0 other events; `contacts` 0; `lead_magnet_requests` 0. The read-only form of the same predicates is re-run immediately before execution; the block re-checks everything inside the transaction and asserts that exactly 2 rows were deleted. IP-activity rows are left to expire.

```sql
do $$
declare
  v_hit bigint; v_home bigint; v_footer bigint; v_other bigint; v_con bigint; v_req bigint; v_del bigint;
begin
  create temporary table _tmp_ev_2222 on commit drop as
    select id from public.lead_magnet_events
    where id in (2, 3)
      and event_name = 'lead_magnet_cta_view'
      and asset_id = 'procurement-field-guide'
      and page_path = '/'
      and error_kind is null
      and created_at >= '2026-09-16 22:22:00+00'
      and created_at <  '2026-09-16 22:23:00+00';

  select count(*) into v_hit from _tmp_ev_2222;
  select count(*) into v_home from public.lead_magnet_events e join _tmp_ev_2222 t on t.id = e.id where e.placement = 'home-band';
  select count(*) into v_footer from public.lead_magnet_events e join _tmp_ev_2222 t on t.id = e.id where e.placement = 'footer-link';
  select count(*) into v_other from public.lead_magnet_events e where not exists (select 1 from _tmp_ev_2222 t where t.id = e.id);
  select count(*) into v_con from public.contacts;
  select count(*) into v_req from public.lead_magnet_requests;

  if v_hit <> 2 then raise exception 'GATE: expected 2 verification events, found %', v_hit; end if;
  if v_home <> 1 or v_footer <> 1 then raise exception 'GATE: expected one home-band and one footer-link, found % and %', v_home, v_footer; end if;
  if v_other <> 0 then raise exception 'GATE: expected 0 other events, found %', v_other; end if;
  if v_con <> 0 then raise exception 'GATE: expected 0 contacts, found %', v_con; end if;
  if v_req <> 0 then raise exception 'GATE: expected 0 requests, found %', v_req; end if;

  delete from public.lead_magnet_events e using _tmp_ev_2222 t where e.id = t.id;
  get diagnostics v_del = row_count;
  if v_del <> 2 then raise exception 'ABORT: deleted % events', v_del; end if;
end $$;
```

**State at this record.** Fix merged into the branch and pushed; PR #52 a draft with `build-and-test` green on `7097e9d`; backend in production mode and untouched; database holds the two verification events and nothing else lead-magnet; no technical issue known before the ready gate other than Jeff's decision on this cleanup and the Cloudflare Pages check reporting for the new commit.

### Verification-event cleanup, Windows ruling and PR-ready verification (2026-09-16, Jeff's approval)

**Read-only gate (22:26:32 UTC), re-run immediately before execution with the documented predicates.** Matching events (ids 2 and 3, `lead_magnet_cta_view`, `procurement-field-guide`, `page_path` `/`, `error_kind` null, created between 22:22:00 and 22:23:00 UTC) **2**; of those `home-band` **1** and `footer-link` **1**; other events **0**; events total 2; `contacts` **0**; `lead_magnet_requests` **0**. Exactly the approved condition.

**Execution (22:27:01 to 22:27:03 UTC).** The `DO` block above was extracted verbatim from this document by pattern (SHA-256 of the extracted file `3b4152597ced67987ebb90f8b56a0e5e93b257b31ff31a06aa3893d5bd58f465`) and executed unchanged through `supabase db query --linked --project-ref pynjyrvnokfexyudimsn -f`. It completed without exception, so its five in-transaction gates held and the post-delete assertion passed: **2 events deleted.**

**Verified afterwards.** `lead_magnet_events` **0**, `contacts` **0**, `lead_magnet_requests` **0**; `lead_magnet_ip_activity` 21 with 3 event-kind rows, untouched and left to the 24-hour expiry; **`leads` 59 with its latest row unchanged at 2026-09-15 20:54:44 UTC; webhook invocations 52 with the same latest timestamp**; `investor_access` 10; `profiles` 0. Objects unchanged: 7 public tables, 3 RLS policies, 1 database function, 1 trigger, 7 event triggers, 6 extensions, 10 lead-magnet indexes, 19 lead-magnet constraints, no `anon` or `authenticated` privilege on any lead-magnet table. **9 Edge Functions, all `ACTIVE`, every version and bundle hash identical to the baseline table; 12 secrets, the three test secrets and `LEAD_MAGNET_NOTIFY_TO` absent, `LEAD_MAGNET_IP_SALT` present with its digest and 2026-09-15 timestamp unchanged.** The backend remains in production mode and untouched. **The database holds no lead-magnet data.**

**Windows PC ruling (Jeff, 2026-09-16).** The Vite dev server still running on the Windows PC from the pre-migration working copy **is no longer to be used**, and this Mac must not attempt to access or stop that machine. **The authoritative development working copy is `/Users/jeffkaufman/Developer/JiTpro-Website`.** The Claude in Chrome extension's connected browser is that Windows machine, so no localhost page for this project is exercised through it; this Mac's dev server is exercised with a headless Chrome over the DevTools protocol instead.

**PR-ready verification at `898dae1` (the branch head before this record was committed).** `build-and-test` passed (run 35157567909, 34 s, head `898dae1`); **Cloudflare Pages passed**; HEAD equal to `origin`; 72 ahead of `main` and **0 behind**; working tree clean; PR #52 open, **draft**, `MERGEABLE` with a `CLEAN` merge state; backend in production mode; lead-magnet tables empty after the cleanup; the transport fix committed (`7097e9d`), pushed and recorded in this plan. **Every technical prerequisite for marking PR #52 ready is satisfied.** The commit that adds this record re-runs both checks; their result on that commit is confirmed in the session before the ready gate is presented to Jeff. Not marked ready; not merged; no further test performed.

---

### Sprint completion records

*(Filled in as sprints close: date, commits, tests run, deviations, unresolved issues.)*

| Sprint | Closed | Summary |
|---|---|---|
| Sprint 0 | 2026-09-12 | Discovery, architecture, six decision rounds, approved copy, Design System amendments A1 to A10, final sprint plan. |
| Sprint 1a | 2026-09-13 | Vitest 5 and `npm test` in CI, shared registry, consent texts, copy module, Design System amendments written. CI-verified on draft PR #52. |
| Sprint 1b | 2026-09-15 | Approved 31-page PDF committed (`04991ad`), `/guides/procurement-field-guide` redirect, PDF headers, consistency test. L-8 closed. |
| Sprint 2 | 2026-09-15 | Four migrations applied and verified on `jitpro_website`; `submit-lead-magnet-request` deployed (v2) and verified across 19 cases; S2-19 sender correction confirmed in a real mailbox; guarded cleanup executed. L-12 closed. |
| Sprint 5 | **2026-09-16** | Homepage band, Learn More band (outside the guide area and rail) and the two footer items, all served by one governed component. The first band was declined on visual grounds, so Design System amendment A11 was proposed, approved and recorded before the component changed, adding §20.2.1 the publication object; the band was rebuilt with a rendered Field Guide cover and a Brand Amber action subordinated by measured weight rather than hue. Cover assets generated from the approved PDF with no new dependency and tied to the asset version by the consistency test. QA verified request payloads without submitting, so no new database footprint. Approved by Jeff as the governed baseline. Deviations: legacy footer classes left unmigrated by decision (S5-1); the regression boundary was a no-op. Unresolved: none inside the sprint; L-3 remains external. |
| Sprint 4 | **2026-09-16** | LeadMagnetCTA, LeadMagnetDialog, LeadCaptureForm, attribution, API client, inert funnel, `/field-guide` and (brought forward, S4-1) `/privacy`, plus the unlisted `/review/lead-magnet` QA placement. 122 new tests (301 total). Local Chrome QA against the deployed v5 function proved all seven cases and the consent model; two defects found and fixed client-side (focus return, honeypot detectability). Approved by Jeff; guarded cleanup executed. Deviations: L-5 deferred by decision (S4-2), so preview submissions were never tested; breakpoint passes left to Jeff. Unresolved: none inside the sprint; L-3 remains external. |
| Sprint 3 | **2026-09-16** | Fulfilment and internal notification implemented with 179 unit tests; controlled run `20260916s3f` 9/9 passed; email presentation redesigned and approved in Outlook desktop (v4); S3-2 authenticated development cooldown bypass (v5); approved guarded cleanup executed after a passing read-only gate, leaving `contacts` and `lead_magnet_requests` empty and every existing object unchanged. Deviations: none. Unresolved: none inside the sprint; L-3, L-5, L-14 remain external. |

---

## 23. Post-launch measurement plan

- Week 1: verify events and rows daily; no optimisation.
- Weeks 2 to 6: establish a baseline for CTA impressions, clicks, form views, requests, conversion rate by placement and source, download rate, and any contact-form submissions from guide leads.
- Review monthly with the saved queries. Only test changes (placement, wording, fields, modal vs page, follow-up) when the baseline has enough volume to make a difference visible.

---

## 25. Approved visitor-facing copy (Round 6, 2026-09-12)

Every string below is approved and is the source for `src/content/leadMagnets.ts`, `src/content/consentTexts.ts`, the email templates, and the pages. Implementation must not paraphrase. Items marked **legal review** are approved for build and remain subject to L-3 before production launch. No em dashes anywhere (§7.7). Site headings are sentence case (A10).

### 25.1 Homepage guide band (after the final commercial CTA, before the footer)

| Element | Copy |
|---|---|
| Eyebrow (mono, uppercase via CSS, `--jp-brand-amber`) | Free field guide |
| Heading (h2) | What will stop work six months from now? |
| Supporting sentence | A JiTpro field guide for general contractors on finding the decisions, information, products, materials, services, approvals, and commitments the field will depend on while there is still time to act. |
| Button (hairline secondary, A6; opens the dialog; `placement = home-band`) | Get the free field guide |

No reassurance line beneath the button. The offer is confident and simple.

### 25.2 Learn More guide band

Same component and copy as 25.1, placed after section 11, outside the numbered sequence and the guide rail (A8). `placement = learn-more-band`.

### 25.3 Footer

- Company column, new item (button with the established footer-link appearance, opens the dialog, `placement = footer-link`, records the page it was clicked from): **Free field guide**
- Bottom legal area, new link beside *For Investors*: **Privacy** → `/privacy`

### 25.4 `/field-guide` landing page (indexable)

| Element | Copy |
|---|---|
| Browser title | What Will Stop Work Six Months From Now? \| JiTpro Field Guide |
| Meta description | A free JiTpro field guide for general contractors on construction procurement control: Required on Site Dates, backward planning, named commitments, and a self-assessment. |
| Eyebrow | Free field guide |
| H1 | What will stop work six months from now? |
| Subtitle (heading-behaving line beneath the H1) | The JiTpro Field Guide to Construction Procurement Control |
| Intro | A 31-page guide for general contractors on identifying the decisions, information, products, materials, services, approvals, and commitments the field will depend on months from now, and establishing accountability while useful options still exist. |
| H2 | What the guide covers |
| List (rendered as a readable list, one item per line) | 1. Why the construction schedule is a statement of future demand. 2. Why missing information, not late purchasing, is usually what makes procurement late. 3. Required on Site Dates, and how to plan backward from them through the procurement chain. 4. Named commitments: who owns the next move, and by when. 5. Plan, commitment, actual, and forecast, and why preserving change and causality matters. 6. Managing by exception: item health, project health, and company health. 7. A procurement-control self-assessment you can run on your own project. |
| Form heading (h2, in a §27.1 card beside the content from `lg`, below it otherwise) | Get the guide |
| Form | The exact same capture component, validation, consent model, and states as the dialog (25.5, 25.6). `placement = landing-page`. Its submit button is the page's one amber action. |

### 25.5 Dialog

| Element | Copy or behaviour |
|---|---|
| Close control (top-right, labelled, X icon, 44px target) | Close |
| Heading (h2; `aria-labelledby` target) | Get the free field guide |
| Sub line | What will stop work six months from now? We'll open the guide right away and email you a link. |
| Field label | Email address |
| Input | `type="email"`, `autocomplete="email"`, `inputmode="email"`, no placeholder, no asterisk |
| Checkbox (unchecked by default; consent text version `v1`) **legal review** | Also send me occasional JiTpro insights on keeping projects ahead of the field. I can unsubscribe at any time. |
| Turnstile | Invisible (`appearance: "interaction-only"`). If Cloudflare requires interaction, the compact dark widget appears above the submit button beneath this line: **One quick check before we open your guide.** |
| Submit (amber primary) | Get the free field guide |
| Fine print **legal review** | We'll email you a link to the guide. Read our privacy notice. (*privacy notice* links to `/privacy`, opens in a new tab, with a screen-reader note that it opens in a new tab.) |
| Honeypot | Hidden field named `company_website`, as on the contact form |

### 25.6 Form and outcome states

| State | Copy and behaviour |
|---|---|
| Submitting | Button reads **Getting your guide…**, disabled, width held; form `aria-busy`; after 15 seconds a muted line **Still working…** |
| Empty email | **Enter your email address to get the guide.** (icon plus text beneath the field; `aria-invalid`; `aria-describedby`; focus to the field) |
| Invalid email | **Enter a valid email address, like name@company.com.** (same treatment) |
| Shared outcome heading (focus moves here) | **Your guide is ready.** |
| Primary button in every outcome (amber; opens `/guides/procurement-field-guide` in a new tab; screen-reader note "opens in a new tab") | **Open the field guide** |
| Success | We've also emailed a link to **name@company.com** so you can return to it later. |
| Repeat within the hour | We emailed a link to **name@company.com** within the last hour, so we haven't sent another. You can open the guide below. |
| Email not sent (email failure, suppressed address, persistence failure, network failure or timeout, rate limiting, browser-verification failure, any other server error) | We couldn't email your copy just now, but you can open the guide below. If you'd like an emailed copy, write to info@jit-pro.com. |
| Quiet *Try again* link | Beneath the "Email not sent" body **only** for network failure and timeout |

No secondary sales CTA in any outcome state (D6.11).

### 25.7 Fulfilment email **legal review (classification and footer)**

| Element | Copy |
|---|---|
| From | JiTpro <info@jit-pro.com> |
| Reply-To | info@jit-pro.com |
| Subject | Your JiTpro Construction Procurement Field Guide |
| Preheader | What Will Stop Work Six Months From Now? Your link is inside. |
| Body, paragraph 1 | Thanks for requesting **What Will Stop Work Six Months From Now?** |
| Body, paragraph 2 | The JiTpro Field Guide to Construction Procurement Control explains how general contractors can connect field demand to the decisions, information, approvals, products, materials, services, and commitments required to keep work moving. |
| Button | Open the Field Guide → `https://jit-pro.com/guides/procurement-field-guide` |
| Closing | Construction problems discovered six months from now often already exist today. JiTpro helps you find them while there is still time to act. |
| Signature | JiTpro ¶ Construction Procurement Control |
| Footer (amended 2026-09-15, S3-1) | You received this email because you requested the JiTpro Field Guide at jit-pro.com. ¶ Questions? info@jit-pro.com **No postal address.** |
| Plain-text part | The same content in the same order, with the stable URL written out |

### 25.8 Internal notification

| Element | Content |
|---|---|
| From | JiTpro Notifications <info@jit-pro.com> |
| To | info@jit-pro.com |
| Subject | New Field Guide request · [placement] |
| Body (table) | Requester email · Placement · Page · Landing page · Source (UTM source / medium / campaign, or referrer host, or "direct") · Repeat request: yes/no · Marketing opt-in: yes/no · Fulfilment email status · Request id · Timestamp |
| Excluded | IP address, IP hash, user agent |

### 25.9 Persistence-failure recovery alert

| Element | Content |
|---|---|
| From | JiTpro Notifications <info@jit-pro.com> |
| To | info@jit-pro.com |
| Subject | Field Guide request could not be saved |
| Body | Timestamp · Request id · Placement · Page · Concise error summary · **Requester email address (full, deliberately, for lead recovery)** |

---

## 26. Design System amendments (APPROVED A1 to A10, Round 6; written into the Design System in Sprint 1a before any component is coded)

Each item below is transcribed into `docs/design/JiTpro_Design_System_v1.0.md` as an APPROVED subsection with a dated Decision Log row naming Jeff Kaufman as approver and this plan as the source.

- **A1. §28.1 APPROVED: Marketing lead-capture dialog.** Native `<dialog>` opened with `showModal()`. On open, focus moves to the first field; Escape closes through the `cancel` event and backdrop click closes; body scroll is locked; on close, focus returns to the control that opened it; the dialog carries `aria-labelledby` pointing at its heading. Panel: the §27.1 default card (`--jp-surface`, 1px `--jp-border` at 15%, `rounded-2xl`, padding 24px, 32px from `sm`, 40px at `xl`); max width 32rem; full width minus 16px gutters below `sm`; max height `calc(100dvh - 2rem)` with internal scrolling. Scrim: `--jp-background` at 88% via `color-mix`, no blur. Close: a labelled quiet pill ("Close" plus the X icon) top-right inside the panel with a 44px hit area, taking the existing lightbox close treatment expressed in tokens. Entrance: 160ms opacity only; none under `prefers-reduced-motion`; no scale, no slide. One amber action per dialog state (§48.1). One size. Drawers and confirmation dialogs are not defined by this section.
- **A2. §24.1 APPROVED: Marketing capture field, checkbox, and fine print.** Label above the field in the contact form's label style (`text-sm font-semibold text-jp-text-secondary`). Input takes the contact form's recipe (`rounded-lg border border-jp-border/30 bg-jp-surface px-4 py-3 text-lg`, focus `border-jp-brand-amber` with `ring-2 ring-jp-brand-amber-active/30`). No placeholder used as a label. A single required field carries no asterisk. Validation runs on submit, then live only for a field already marked invalid. Checkbox: native `<input type="checkbox">` at 20px with `accent-color: var(--jp-brand-amber)`, wrapped by its `<label>` with vertical padding so the row is at least 44px tall; label text `text-[0.9375rem] text-jp-text-secondary`. Fine print: `text-sm text-jp-text-muted`, links underlined with `underline-offset-4`, hover to `--jp-brand-amber-active`. Disabled controls take the contact form's disabled recipe.
- **A3. §33.1 APPROVED: Marketing form errors and status.** No semantic error colour exists and none is created. A field error is the lucide `AlertCircle` at 16px plus text in `--jp-text-primary` beneath the field, `role="alert"`, with `aria-invalid` and `aria-describedby` on the field; the invalid field's border rises to `--jp-text-primary` at 60%. Access-granting outcome states (§13.2) reuse the success layout: heading, one sentence, the primary action; where the sentence reports that the email was not sent it is preceded by the same icon. Meaning is carried by icon, text, and placement, never by colour.
- **A4. §32.1 APPROVED: Submit in progress on marketing forms.** The control's label changes to a progress phrase ending in an ellipsis; the control is disabled; its width is held at the idle width so the layout does not shift; no spinner; the form is `aria-busy`; after 15 seconds a muted "Still working…" line appears beneath the control.
- **A5. §34 and §36 APPROVED: Minimum touch target.** Interactive controls on marketing surfaces have a minimum hit area of 44 by 44 CSS pixels. Quiet text links reach it with padding. This resolves the open TODO recorded on 2026-09-03.
- **A6. §26 and §48.1 APPROVED: Hairline secondary button.** `rounded-xl`, 1px `--jp-border` at 30%, transparent background, the primary button's padding and type (`px-7 py-4 text-[0.9375rem] font-semibold`), label in `--jp-text-primary`. Hover is one gesture: border and label change together to `--jp-brand-amber-active`. Focus: `--jp-text-primary` outline at 3px offset. No fill, no shadow, no movement. Use: an action that is alone on a quiet surface but must remain subordinate to the page's commercial primary action.
- **A7. §20.2 APPROVED: Lead-magnet offer band.** Placed after the final commercial CTA and before the footer; never above the final CTA; never in the hero. Elevated band tone (`bg-jp-surface` with `border-y border-jp-border/12`). Left-aligned; two columns from `lg` with the action right-aligned and bottom-aligned; stacked below. The eyebrow is the band's only amber. The action is the A6 hairline secondary. Copy is governed by §20.1 and uses the main publication title. At most one such band per page. Recorded as a post-CTA band outside the five-section homepage doctrine.
- **A8. §50.1 and §50.5 amendment APPROVED.** One lead-magnet offer band (§20.2) MAY follow the closing section of a long-form explainer page, outside the numbered sequence and the guide rail, with its action in the A6 treatment. It is neither a fourth primary action nor a second secondary action within the numbered argument, and it remains visually subordinate to the page's primary commercial offer.
- **A9. §20.1 note APPROVED.** No terminology exception is required. All homepage, Learn More, and dialog strings use the main publication title and avoid the retired word by construction.
- **A10. §7.7 note APPROVED.** No amendment. Publication titles set as site headings take sentence case; the email and the PDF retain the publication's title-case presentation.

---

## 27. Privacy notice: complete draft (Round 6)

> **SUBJECT TO LEGAL REVIEW BEFORE PRODUCTION LAUNCH.** This draft describes the system as designed in this plan. It is not legal advice and has not been reviewed by counsel; Jeff's approval of the draft on 2026-09-12 (with three revisions) is editorial approval for build, not final legal approval. The business mailing address is an explicit placeholder until L-2. Statements marked [verify] are confirmed against the actual launch implementation (and, for email delivery, against Resend's actual behaviour) during Sprint 5, before the page is published.

**JiTpro Privacy Notice**

Last updated: [launch date]

**Who we are.** JiTpro provides construction procurement control services to general contractors. This notice explains what information we collect through jit-pro.com, why we collect it, who helps us process it, how long we keep it, and the choices you have. If you have a question about anything here, email us at info@jit-pro.com.

**What this notice covers.** The jit-pro.com website, including the Field Guide request form, the contact form, and the investor access request form.

**Information you give us.**
- *Field Guide request:* your email address, and whether you ticked the box asking for occasional JiTpro insights.
- *Contact form:* your first name, last name, email address, your role, and the note you write.
- *Investor access request:* your name, email address, company, and investment interest.

**Information collected automatically when you request the Field Guide.** So we can understand which parts of the website and which campaigns are useful, we record with your request: which offer you used and where it appeared, the page you were on, the first page of your visit, the site that referred you (if any), any campaign tags in the link you followed (for example utm_source), which version of the guide you received, the time of the request, whether you had requested the guide before, and whether the email copy could be sent. During your visit, your browser holds the first-visit details (campaign tags, referring site, first page) in session storage, which is cleared when you close the tab or browser. We do not use cookies for this.

**Information used only to prevent abuse.** To stop automated submissions and protect our email reputation:
- The request form uses Cloudflare Turnstile, a service that distinguishes people from automated programs. Cloudflare processes technical signals from your browser to do this; its Turnstile privacy notice describes that processing.
- We keep a one-way, salted hash of your IP address for up to 24 hours so we can limit how many requests come from one network in a short period. The hash is designed so that JiTpro does not need to retain the underlying IP address: the salt changes every day, the hash is never linked to your email address or your request record, and it is deleted automatically. We do not store your IP address itself in our database.

**Website analytics.** We use Cloudflare Web Analytics to understand page views, visits, referring sites, countries, device types, browsers, and page performance. Cloudflare describes this service as privacy-first and states that it does not track individuals across websites; its documentation describes how it works. Separately, we count how many people see, click, open, and submit the Field Guide offer. Those counts contain no identifier, no email address, and no IP address; they are numbers about pages and buttons, not about you. We do not use Google Analytics or advertising trackers.

**Cookies.** We do not set cookies for analytics or advertising. Cloudflare, which serves our website, may set strictly necessary technical cookies for security and performance [verify at Sprint 5]. Session storage, described above, is not a cookie and is cleared at the end of your visit.

**Why we use your information.**
- To send you the Field Guide you requested, by opening it in your browser and by emailing you a link.
- To notify the JiTpro team that a request or message has arrived, and to reply to you.
- To understand which pages, offers, and campaigns lead people to request the guide or contact us.
- To prevent abuse of our forms and to keep our email deliverable.
- To send you occasional JiTpro insights **only if you ticked the box asking for them**.

**Marketing email and your choices.** Requesting the Field Guide does not sign you up for marketing. Unless you tick the optional box, we treat your address as transactional only: you receive the guide, a repeat of it if you ask again, and any message needed to deliver what you asked for, and nothing else. If you tick the box, we record when and how you did so, and we may send occasional insights on keeping projects ahead of the field. You can withdraw that consent at any time by emailing info@jit-pro.com, and, once we begin sending such messages, by using the unsubscribe link in any of them. We will not send marketing email to anyone who has withdrawn consent.

**Email delivery records.** [verify against the actual launch implementation and Resend's actual behaviour before publication] Our email service tells us whether a message was delivered, bounced, or was reported as unwanted. If an address bounces or is reported as unwanted, we stop sending to it. We keep that status so we do not try again.

**Who processes your information for us.** We use a small number of service providers, each acting on our instructions:
- *Cloudflare* hosts and serves the website, provides Turnstile, and provides Web Analytics.
- *Supabase* stores our request and contact records and runs the code that processes your request, in a data centre in the United States.
- *Resend* delivers our email, from infrastructure in the United States.
- *Microsoft 365* provides the JiTpro mailbox (info@jit-pro.com) that receives notifications and your replies.
We do not sell your personal information, and we do not share it with advertisers or data brokers [verify at final review].

**Where your information is processed.** In the United States. If you are outside the United States, your information is transferred to and processed there.

**How long we keep it.** Field Guide requests and contact records are kept for as long as we need them to understand our relationship with you and how people find JiTpro, unless you ask us to delete them. The IP-address hash is deleted within 24 hours. Session storage is cleared when your visit ends. Cloudflare and Resend keep their own operational records for the periods described in their documentation.

**Your rights and requests.** You can ask us to tell you what information we hold about you, to correct it, to delete it, or to stop sending you marketing email. Email info@jit-pro.com from the address in question, or tell us which address you mean, so we can confirm the request is yours. We will respond to verified requests as required by applicable law. Depending on where you live, you may have additional rights under applicable law; we will honour them.

**Children.** Our website and services are for businesses and are not directed to children.

**Changes to this notice.** If we change how we handle information, we will update this page and the date at the top.

**Contact.** JiTpro. Email: info@jit-pro.com. *(Amended 2026-09-15, S3-1: no postal address is published through this workflow.)*

---

## 28. External launch prerequisites (everything that is not code)

Consolidated from the launch checklist (Section 15.1) so nothing is hidden inside implementation sections. None of these blocks Sprint 1a. Each is requested from Jeff when its sprint reaches it, and nothing requiring his approval or credentials is done silently (D5.12).

| # | Prerequisite | Owner | Needed by | Blocks |
|---|---|---|---|---|
| L-8 | The approved 31-page PDF, *What Will Stop Work Six Months From Now? The JiTpro Field Guide to Construction Procurement Control*, placed where the assistant can read it | Jeff | Sprint 1b | **Done 2026-09-15**; committed in `04991ad` and verified on the preview |
| ~~L-2~~ | ~~JiTpro's approved business mailing address~~ | Jeff | — | **Withdrawn 2026-09-15 (S3-1); blocks nothing.** |
| L-3 | Legal review: consent checkbox wording, fine print, privacy notice (Section 27), fulfilment-email classification and footer, the no-cookie analytics assumptions | Jeff / counsel | Before the production merge (Sprint 6) | Production launch |
| L-1 | `info@jit-pro.com` mailbox confirmed monitored and receiving external mail | Jeff | Sprint 3 verification | Production launch |
| L-4 | Resend dashboard confirms `jit-pro.com` verified (`mail.jit-pro.com` not verified, not used, S2-19) | Jeff, or assistant with dashboard access | Sprint 3 | **Done 2026-09-15** |
| L-12 | `jitpro_website` read-only inspection reported and the Sprint 2 change set approved (Section 15.2) | Assistant inspects; Jeff approves | Start of Sprint 2 | Any migration or function deployment |
| L-13 | New lead-magnet secrets set on `jitpro_website` (`LEAD_MAGNET_IP_SALT`, `LEAD_MAGNET_TEST_MODE` for testing, optional `LEAD_MAGNET_NOTIFY_TO`); shared existing secrets unchanged | Assistant via CLI with Jeff's approval | Sprint 2 | Sprint 2 function tests |
| L-5 | Turnstile widget allowed hostnames extended to the Cloudflare preview URLs | Jeff / admin (Cloudflare dashboard) | Sprint 4 preview QA | Full submit test on previews (fallback: production smoke test) |
| L-14 | Cloudflare Pages preview environment confirmed to reference `jitpro_website` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`); Jeff acknowledges preview submissions write to the live website project in test mode | Jeff / admin | Sprint 4 preview QA | Same |
| L-10 | Supabase production plan confirmed; actual function-log retention recorded here | Jeff / assistant with dashboard access | Sprint 6 | Observability record only |
| L-6 | Go-live switch: `LEAD_MAGNET_TEST_MODE`, `LEAD_MAGNET_TURNSTILE_TEST_SECRET`, and `LEAD_MAGNET_TEST_FAULT_SECRET` removed from `jitpro_website`; production-mode `curl` passes | Assistant via CLI with Jeff's approval | Sprint 6, before the frontend merge | Production launch |
| L-7 | All lead-magnet migrations and both new functions live on `jitpro_website`, each approved by Jeff and verified in test mode | Assistant via CLI with Jeff's approval | Sprint 6, before the frontend merge | **Done 2026-09-16** (status corrected; see §15.1) |
| L-9 | Cloudflare Web Analytics enabled on the Pages project (Metrics → Enable) | Jeff / admin | Sprint 6 | Page-view reporting only |
| L-11 | Pulsetic HTTP monitor for `https://jit-pro.com/guides/procurement-field-guide` following the redirect | Jeff | After the production merge | Monitoring only |

---

## 29. Document change history

| Date | Change |
|---|---|
| 2026-09-12 | Created after repository discovery. Current state, proposed architecture, data model, failure matrix, testing and deployment plans, Decision Log opened with recommendations, draft sprint plan. |
| 2026-09-12 | Round 1 decided by Jeff: G-1 (stay on the existing branch), G-2, G-3 (approved asset is the new 31-page PDF, not yet supplied), D1.1 to D1.7 accepted as recommended. Follow-up items F-1 to F-5 recorded in §21.1 as out of scope. |
| 2026-09-12 | Round 2 decided by Jeff: D2.1 two new tables (`contacts`, `lead_magnet_requests`), `leads` untouched; D2.2 one-hour email cooldown; D2.3 attribution set with no user agent and no raw IP; D2.4 no CRM; D2.5 lead vs subscriber; D2.6 no contact-form integration (F-6 added); D2.7 IP-hash retention recommendation documented (§9.1, §6.3). G-5 git identity (repository-local, metadata only). Visitor-facing sender fixed as `JiTpro <info@jit-pro.com>`; `jeff@jit-pro.com` never exposed. Sections 4.4, 4.5, 6, 9, 13 updated. |
| 2026-09-12 | Round 3 decided by Jeff: D3.1 Resend only; D3.2 explicit Reply-To `info@`; D3.3 footer line and mailing address, transactional, legal review; D3.4 explicit unchecked checkbox, non-US prospects assumed; D3.5 no nurture, permissions by state; D3.6 no unsubscribe endpoint in V1, Resend suppression relied on, webhook deferred (F-7); D3.7 `/privacy` in scope; D3.8 internal notification From `noreply@mail.jit-pro.com`; D3.9 test safety; D3.10 consent evidence; D3.11 legal principle; D2.7 approved. Added §7.3 to §7.5, §10 rewrite, §15.1 launch checklist, §21.2 nurture prerequisites, D6.7 to D6.9, failure-matrix suppression rows, Sprint 3 to 5 scope updates. |
| 2026-09-12 | Round 4 decided by Jeff: D4.1 to D4.10 accepted as recommended. Cloudflare Web Analytics plus Supabase `lead_magnet_events`; seven fixed event names (§8.1); fixed placements; `sessionStorage` UTMs; no ids, no personal data, no cookies, no GA4, no Plausible; eight saved queries (§8.3); email-join downstream conversion; no-cookie assumptions flagged for legal review (§8.4). Added §6.4 events table and the `record-lead-magnet-event` function to §4.3; Sprint 6 scope updated. |
| 2026-09-12 | Round 5 decided by Jeff: D5.1 `public/guides/` with versioned file and clean `Content-Disposition` filename; D5.2 `/guides/procurement-field-guide` establishing `/guides/<asset-slug>`, consistency check; D5.3 confirmed; D5.4 interaction-only Turnstile plus server honeypot and validation; D5.5 **10** requests and 100 events per hash per 10 minutes, calm 429; D5.6 **fail open for guide access** (§13 rewritten with the four cases); D5.7 observability with masked emails and L-10 plan check; D5.8 Vitest 5, pure-logic tests, no jsdom; D5.9 Supabase functions confirmed; D5.10 noindex PDF, indexable `/field-guide`; D5.11 `jitpro-staging` as test target subject to the §15.2 inspection protocol; D5.12 no silent account changes. Launch checklist extended to L-14; §4.6, §9, §9.2, §14, §15, §17 and Sprints 1, 2, 6 updated. |
| 2026-09-12 | **Sprint 1a completed.** Vitest 5 and `npm test` in CI (`94dfaf5`); js-yaml advisory patched (`fbd6c0d`); shared lead-magnet registry, versioned consent texts, approved copy module, and 16 tests (`3581038`); Design System amendments A1 to A10 written with Decision Log rows (`1e71a17`). §3.12, §4.3, and the Sprint 1a completion record updated. CI verification pending a pull request. |
| 2026-09-12 | Privacy draft (§27) revised per Jeff: response-time sentence replaced with "as required by applicable law"; IP-hash wording changed from an absolute claim to "designed so that JiTpro does not need to retain the underlying IP address"; email bounce and suppression paragraph explicitly marked for verification against the launch implementation and Resend behaviour before publication. Still subject to legal review; not final legal approval. Sprint 1a authorised. |
| 2026-09-12 | Round 6 decided by Jeff: approved copy for every surface with his edits (§25); visitor-facing failure language simplified to three access-granting states (§13.2, D6.10); no secondary sales CTA in success (D6.11); opt-in line kept in the internal notification (D6.12); full email in the recovery alert (D6.13); footer additions only (D6.15); Design System amendments A1 to A10 approved with implementation text (§26); complete privacy notice drafted (§27, subject to legal review); sprint plan finalised with Sprint 1 split into 1a and 1b, implementation order, acceptance criteria, and commit boundaries (§22); external prerequisites consolidated (§28); §21 reduced to external items and the Sprint 1 go-ahead; G-4 closed into L-5. **Sprint 0 complete. Implementation awaits Jeff's explicit authorisation.** |
| 2026-09-13 | Jeff decided G-6 (keep `fbd6c0d`) and G-7 (open the draft PR now). Draft PR #52 opened; `build-and-test` passed on its first run and Cloudflare Pages previews build on every push; Sprint 1a acceptance row updated to CI-verified. Read-only `jitpro-staging` inspection performed per §15.2 and recorded under Sprint 2 in §22: the project holds the product application's schema, no name collisions, `db push` unsafe because of a foreign migration history; recommendation is a website-dedicated project, starting with a read-only look at `jitpro-sandbox`. L-12 marked inspected, not confirmed; §21 item 1 replaced with the target decision. No staging change made; Sprint 2 paused. |
| 2026-09-14 | Dependency governance: CLAUDE.md gains "Dependencies: report only, never correct" (commit `0c59e50`). Dependabot alone changes existing dependencies; Claude reports and stops; a genuinely new dependency for an explicitly approved task must be called out in the implementation report. §22 git expectations and G-6 updated to match. This break-point record added so work resumes cleanly from another machine. |
| 2026-09-14 | **Single-project infrastructure amendment (Jeff).** G-8 added: `jitpro_website` is the website's only Supabase project; product-application projects (`jitpro-staging`, `jitpro-sandbox`, others) are separate infrastructure and are not used. No website staging project. D5.11 amended; §4.3 governance note and boundary; §4.5 and §14.4 test-mode wording; §4.8 apply methods (no reset or migration repair; functions deployed by explicit name); §14.2 testing on `jitpro_website`; §15 steps rewritten with no promotion step and a go-live switch; §15.2 replaced by single-project safeguards (migration discipline, Edge Function discipline, email, database, and frontend test safety); §16 test-mode row; L-6, L-7, L-12 to L-14 revised in §15.1 and §28; §21 item 1 replaced by the shared-secret testing question; Sprints 2, 3, 4, 6 revised; staging inspection report kept as a historical record. No other decision changed. |
| 2026-09-14 | Read-only `jitpro_website` inspection recorded under Sprint 2 in §22 (no migration history; `demo_requests` absent; `profiles` present; no collisions; default privileges and `ensure_rls` noted). Jeff approved the Sprint 2 database change set: S2-1 to S2-9 (three additive migrations, departures 1 to 5, apply method, no rollback migrations, cleanup criteria to Jeff first). §3.4, §6.1 to §6.3, §15.1 L-12, and §15.2 updated. Migration files written; **not applied**, awaiting final authorisation. |
| 2026-09-15 | **Break-point record.** Sprint 2 migrations `20260914000001` to `20260914000003` applied to `jitpro_website` on 2026-09-14 with Jeff's authorisation and verified against the approved design and a baseline of existing objects (all unchanged). One finding holds the sprint: the `lead_magnet_ip_activity` identity sequence retains anon and authenticated privileges from the project's default privileges. Fix proposed as migration `20260914000004`, awaiting Jeff. Status line and Sprint 2 record updated so work resumes cleanly after a restart. |
| 2026-09-15 | Jeff approved `20260914000004` and rule S2-10 (§15.2: review and revoke anon/authenticated privileges on any identity or serial-backed sequence). Committed at `7291b3d`, CI passed, applied alone to `jitpro_website`, verified: the sequence no longer grants anon or authenticated; the three new tables match the approved design; all existing objects and Edge Functions unchanged. S2-1 closed; L-12 complete. Next: the `submit-lead-magnet-request` proposal. |
| 2026-09-15 | Jeff approved the `submit-lead-magnet-request` proposal for implementation and local testing (S2-11 to S2-17). §16 gains `LEAD_MAGNET_TURNSTILE_TEST_SECRET` and `LEAD_MAGNET_TEST_FAULT_SECRET`; L-6 removes both at go-live; §21 item 1 resolved for Sprint 2. Function, pure shared modules with tests, and the `curl` script written; nothing set or deployed. |
| 2026-09-15 | Step 1: the four `LEAD_MAGNET_*` test-period secrets set on `jitpro_website` with Jeff's approval; existing 11 secrets unchanged; Supabase version-bumped the seven existing Edge Functions with bundles and configuration unchanged, recorded as expected platform behaviour; new §15.2 rule S2-18 requires future secret proposals to disclose this. Database objects and row counts unchanged; no test data; lead-magnet function not yet deployed. Step 2 (deployment) approved. |
| 2026-09-15 | Step 2: `submit-lead-magnet-request` deployed alone with the approved command; 8 functions, the original seven identical to the post-Step-1 baseline; secret digests unchanged (platform-injected `SUPABASE_*` `updated_at` refreshed by the deploy, recorded as platform behaviour); database unchanged and lead-magnet tables empty; no-data probes 204 / 403 / 405 as designed. Step 3 awaits authorisation. |
| 2026-09-15 | Step 3: one controlled integration run (`20260915s3`), 19/19 cases passed; rows match the documented model exactly (5 contacts, 9 requests, 11 IP-activity rows); no unexpected or production data; `leads`, webhook activity, existing objects, the 8 functions, and all secrets unchanged. Live log review and the recovery-alert mailbox check await Jeff. S2-18 extended to platform-injected `SUPABASE_*` secret timestamps refreshed by deploys. No cleanup; test mode kept. |
| 2026-09-15 | **Recovery-alert sender correction.** Jeff diagnosed the Step 3 alert failure in the Resend account: Resend received the request and returned 403 *Domain not verified* for `mail.jit-pro.com`. S2-19 standardises the lead-magnet workflow on the verified `info@jit-pro.com` identity (`noreply@mail.jit-pro.com` removed from this workflow; `mail.jit-pro.com` not verified or configured); S2-20 adds sanitised Resend diagnostics. §3.5, §4.5, §7.2, §9.2, §25.8, §25.9, Sprint 3 scope, L-4, D3.8, D5.7 and the Step 3 record updated; F-8 records the investor functions' identical exposure, outside this project. Contact-form functions, `RESEND_API_KEY`, and all secrets untouched. |
| 2026-09-16 | Sprint 3 controlled run `20260916s3f`: nine of nine cases passed, footprint exactly as predicted (8 contacts, 9 requests, 9 IP rows); Resend accepts `suppressed@resend.dev` silently, so that case records `sent`. Fulfilment email presentation redesigned to Jeff's specification and deployed as v4; **Jeff approved the rendering in Outlook desktop on 2026-09-16 and it is now the approved baseline**. S3-2 added: an authenticated, test-mode-only cooldown bypass reusing the secret-gated architecture, with production cooldown behaviour unchanged; deployed as v5. |
| 2026-09-15 | **S3-1 (Jeff): no mailing address anywhere in this project.** The business and personal mailing address is removed from the fulfilment email footer, the capture experience, and the privacy notice; no placeholder, no address guard, no address CI test; L-2 withdrawn as a prerequisite for Sprint 3, Sprint 5, and production launch. The fulfilment email stays strictly transactional with the reason-for-receipt line and "Questions? info@jit-pro.com", and no unsubscribe link. D3.3, D6.8, D6.9, §7.1, §10, §25.7, §27, Sprint 3 and Sprint 5 amended. |
| 2026-09-15 | **Sprint 2 complete.** Step 4: the S2-19 sender correction and S2-20 diagnostics deployed as `submit-lead-magnet-request` v2; the isolated delivery test (`20260916ra`) returned the fail-open response and the alert from `JiTpro Notifications <info@jit-pro.com>` arrived at info@jit-pro.com, manually confirmed by Jeff (Resend message id not captured, not required). Step 5: the approved guarded cleanup removed 9 test requests and 5 test contacts after a matching preview; `contacts` and `lead_magnet_requests` are empty; the 12 IP-activity rows were deliberately left to expire; `leads` (59), webhook activity (52), and all existing objects unchanged. Test mode and test secrets remain set until L-6. |
| 2026-09-16 | **Sprint 6 analytics and privacy verification.** Event vocabulary corrected to the fixed §8.1 names with `error_kind` added (S6-1), and the conversion definition fixed so a stored request counts as success regardless of the email outcome (S6-2) - the previous code reported a cooled-down email as a funnel failure. `lead_magnet_events` applied after a matching §15.2 inspection and verified down to the five constraint definitions and the revoked sequence; `record-lead-magnet-event` deployed alone (v1, `ACTIVE`) with zero drift on the original eight functions and no secret digest change. Six controlled probes passed with the footprint predicted exactly, and the single probe event was removed under an approved guarded cleanup. All three implementation-dependent privacy claims verified: the cookie sentence and the email-delivery paragraph were both wrong and were corrected with Jeff's approved wording, and the no-sale statement was confirmed accurate against the four services actually used. F-7 stays a future enhancement and no consent banner was added (S6-3). Analytics verified on the production build with no database footprint. 342 tests. |
| 2026-09-16 | **Sprint 5 closed.** Three placements shipped in `e99c663`, `170aab7` and `25d9529`: the homepage band after the final CTA, the Learn More band outside the guide wrapper so it cannot read as a twelfth numbered section, and the footer's *Free field guide* and *Privacy* items in token classes with the legacy footer deliberately unmigrated (S5-1). QA verified the generated payloads by intercepting fetch rather than submitting, proving placement, page path, asset id, consent version and attribution for all three surfaces with **no new database footprint** (S5-2). Jeff then declined the band's visual treatment: copy and placement were approved but it read as another content section. **Design System amendment A11** (`f5df425`) was recorded before any component changed, amending §20.2's composition, amber budget and subordination rules and adding §20.2.1 the publication object, and correcting two cross-references in §26.1 and §50.5 that it would otherwise have left contradicting the document. The Field Guide cover was then rendered from the approved PDF and tied to its version by the consistency test (`61ef601`), and the band rebuilt (`e6488ec`) with the action at Brand Amber subordinated by measured weight (240x50 at 15px, no shadow, against the commercial primary's 275x56 at 16px with a glow) and the cover carrying a structural hairline required by measurement (#02101B is 1.08:1 against --jp-surface). **Jeff approved the result on the preview as the governed baseline**, including responsive behaviour, and reported no blocking rendering problem on Learn More. No new dependency; `package.json` and the lockfile untouched. Sprint 6 proceeds to proposal only. |
| 2026-09-16 | **Sprint 4 closed.** Capture experience implemented in six CI-verified commits (`463a02d` to `0d005e4`): attribution, API client, inert funnel and the pure form state machine; `LeadCaptureForm` and interaction-only Turnstile; `LeadMagnetDialog` with tokenised `dialog.css` and `LeadMagnetCTA`; `/field-guide` and `/privacy` (S4-1, brought forward with Jeff's approval); the two browser-QA fixes; and the QA placement moved to the unlisted `/review/lead-magnet` route. 122 new tests, 301 total. S4-2 records local QA as the submit-testing route, L-5 deferred with no Turnstile change, and L-14 decided: local development submissions may write test records to the lead-magnet tables only, never through the existing `leads` workflow. Local Chrome QA proved all seven cases, the consent model and the attribution; Jeff confirmed the emails and approved the experience. Two defects found and fixed client-side, with the backend deliberately not redeployed at Jeff's direction. The read-only gate returned exactly 5 test requests, 4 test contacts and 0 non-test rows, so the guarded cleanup ran transactionally: `lead_magnet_requests` 0, `contacts` 0, `lead_magnet_ip_activity` 27 left to expire, `leads` 59, webhook invocations 52, `investor_access` 10, `profiles` 0, and all schema objects and 8 Edge Functions unchanged. Sprint 5 proceeds to proposal only. |
| 2026-09-16 | **Sprint 3 closed.** Repository (`4949c6d`, clean, in sync) and deployed state (`submit-lead-magnet-request` v5 `ACTIVE`, the original seven Edge Functions unchanged) verified against the break-point record. The read-only gate returned exactly Jeff's approval condition (10 test requests, 8 test contacts, 0 non-test rows in either table), so the approved guarded cleanup ran as a single transactional `DO` block with in-transaction gates and post-delete assertions: 10 requests and 8 contacts deleted, including the `info@jit-pro.com` test contact Jeff approved by name. Verified afterwards: `lead_magnet_requests` 0, `contacts` 0, `lead_magnet_ip_activity` 22 (left to expire), `leads` 59, `investor_access` 10, `profiles` 0. Test mode and the test secrets stay set until L-6. Sprint 4 proceeds to proposal only; no implementation without Jeff's approval. |
| 2026-09-15 | **Sprint 1b complete.** Jeff placed the approved 31-page PDF; verified (valid PDF, page count, title, subtitle, amber brand cover) and committed with the `/guides/procurement-field-guide` 302 redirect above the SPA catch-all, the PDF's inline, noindex, immutable headers, and a new consistency test tying registry, file, redirect, and headers together (`04991ad`). CI passed; the Cloudflare preview returns 302 → 200 with the approved headers and byte-identical PDF. L-8 closed. |
| 2026-09-16 | **Resumed on the MacBook Pro.** Repository and deployed state verified against the break-point record (9 Edge Functions `ACTIVE` at the recorded versions, 12 secrets, every row count identical). The guarded cleanup gate passed exactly (1 marker request, 0 other requests, 0 other contacts) and the `20260916l6prod` request and contact were removed under Jeff's approval; `contacts` 0, `lead_magnet_requests` 0, `lead_magnet_events` 0, IP-activity rows left to expire, `leads`, webhook activity and all other objects unchanged. Mac `.env` created from the three values verified MATCH against the Cloudflare Pages Production variables and `.env.local` removed; neither tracked; tree clean. Bundle hashes recorded as the drift baseline. Local typecheck failure traced to empty macOS duplicate directories under `node_modules`, not code; CI green. PR #52 still draft and unmerged; the production website does not yet have the feature. |
| 2026-09-16 | **Manual test cleanup and L-7 correction.** Jeff's 21:09 UTC browser submission from the local dev server (allowed origin `http://localhost:5173`) stored one contact and one request for his own address, with the marketing checkbox ticked and no UTM marker. Found by the next session's verification, identified read-only, confirmed by Jeff, and removed under a guarded cleanup gated on the address, both row ids, a one-minute window, the placement, the absence of UTMs and zero other rows or events: `contacts` 0, `lead_magnet_requests` 0, `lead_magnet_events` 0, IP-activity rows left to expire, `leads` 59, webhook invocations 52, every object and all 9 Edge Functions unchanged. L-7 corrected to Done in §15.1 and §28 (the work had closed earlier). The test recorded **no funnel events**; read-only diagnosis opened and PR #52 stays draft until it is explained. |
| 2026-09-16 | **Funnel-event diagnosis.** Read-only inspection of the Edge Functions logs for 21:09 to 21:10 UTC: the submit function shows OPTIONS 204 then POST 200; `record-lead-magnet-event` shows eleven OPTIONS 204 and no POST, and its log holds only `booted` and `shutdown`. Root cause: `navigator.sendBeacon` sends a credentialed request and Chrome preflights its JSON Blob; the shared CORS helper never sets `Access-Control-Allow-Credentials`, so the browser fails the CORS check and never sends the event, while `sendBeacon` has already reported success and the `fetch` fallback never runs. Production would lose every event identically. Client-only fix (keepalive `fetch` with headers, no beacon, no query-string key) and a four-step test plan recorded as PROPOSED, awaiting Jeff; nothing implemented, deployed or configured. Sprint 6 record and remaining sequence updated; PR #52 stays draft. |
| 2026-09-16 | **Funnel transport fixed and verified.** With Jeff's approval, `7097e9d` replaces `sendBeacon` with keepalive `fetch` carrying the submission path's headers to the bare function URL, tests first (eight transport tests). Typecheck, 346 tests, lint, build and `audit-ci` pass locally; `build-and-test` green in CI. A headless Chrome on the Mac loading the homepage once produced two preflights and two POSTs answered 204 and stored exactly the two predicted `lead_magnet_cta_view` rows (ids 2 and 3); `contacts`, `lead_magnet_requests`, `leads` and webhook activity unchanged. Guarded cleanup of those two rows recorded as PROPOSED, not executed. Found and recorded: the Claude in Chrome extension's only connected browser is Jeff's Windows PC, where a pre-migration dev server still serves the old code on port 5173. PR #52 stays draft; nothing deployed or configured. |
| 2026-09-16 | **Verification events cleaned up; PR-ready prerequisites verified.** The read-only gate returned exactly the approved condition (2 matching `lead_magnet_cta_view` events, ids 2 and 3, one per placement, 0 other events, 0 contacts, 0 requests) and the documented block ran unchanged: 2 events deleted; `lead_magnet_events`, `contacts` and `lead_magnet_requests` all 0, IP-activity rows left to expire, `leads` 59 and webhook invocations 52 unchanged, every object, all 9 Edge Functions and all 12 secrets unchanged. Jeff's ruling recorded: the stale Windows PC dev server is retired and `/Users/jeffkaufman/Developer/JiTpro-Website` is the only working copy. At `898dae1` `build-and-test` and Cloudflare Pages both pass, the branch is synchronized and 0 behind `main`, and PR #52 is draft and mergeable; every technical prerequisite for marking it ready is satisfied. Not marked ready; not merged. |
| 2026-09-18 | **Two production lead-capture defects investigated; canonical host corrected; reliability correction opened as Issue #54.** Incident 1 (2026-09-18 01:13 UTC): a legitimate visitor's POST reached `submit-lead-magnet-request` and was answered 403 `verification_failed` with `verification failed: token missing`; no lead stored, Resend never called, neither email sent, and the visitor still obtained the guide through the fail-open outcome. Read-only forensics established the funnel sequence (`cta_view` 01:13:11.35 → `cta_click` → `form_view` → `form_submit` 01:13:25.38 → `request_error` `verification` → `download_click`), which ruled out token expiry (3.8 s from form view to submit) and proved guide access came from the fail-open panel. Code analysis proved the submit control is actionable while `turnstileToken` is null, that `handleSubmit` performs no token check and sends `turnstile_token: null`, that the widget reset required by D5.4 and §13.3 is not implemented, that the submitting guard is read from a render closure, and that the deferred-script path never removes its widget. Controlled local testing under an isolated harness (funnel and submit transports disabled at source; zero production traffic) recorded `render` → `before-interactive-callback` at ~3,672 ms with no token and no error, showing Cloudflare can spend over 3.6 s before producing anything actionable, and confirming the site key permits the hostname; localhost escalated to an interactive challenge and so does not represent the production passive path. Incident 2 (2026-09-18 06:41 to 06:44 UTC): four OPTIONS answered 403 with no POST, no application log beyond `booted`, from iPhone Safari; traced to the `www` host mismatch recorded in S6-3 and proved independent of Incident 1 by that incident's OPTIONS 204. Jeff deployed and verified the Cloudflare `www` → apex 301 and confirmed a full end-to-end production submission with both emails received. Issue #54 opened with the approved correction scope; branch `fix/54-field-guide-lead-capture-reliability`. Schema changes, Turnstile telemetry fields, visitor copy, the `sr-only` host and dependencies are all explicitly out of scope. |
