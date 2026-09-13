# Procurement Field Guide Lead-Generation System: Project Plan

| | |
|---|---|
| Status | **Sprint 0 complete: all six decision rounds decided; sprint plan final. Awaiting Jeff's explicit authorisation to begin Sprint 1.** No implementation has started. |
| Owner / approver | Jeff Kaufman |
| Document created | 2026-09-12 |
| Last updated | 2026-09-12 (Round 6: approved copy, simplified visitor-facing failure language, Design System amendment texts, privacy notice draft, final sprint plan, external prerequisites) |
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

There is no contacts or people table, no unique constraint on email anywhere, and no consent or suppression columns. The contact form stores hard-coded attribution: `source='website'`, `page='/contact'`, `intent='contact'`.

### 3.5 Transactional email

- Provider: **Resend**, called directly with `fetch` from edge functions using `RESEND_API_KEY`.
- Senders in use: `JiTpro <info@jit-pro.com>` (visitor-facing confirmation), `JITpro Leads <jeff@jit-pro.com>` (internal contact notification), `JITpro Demo Requests <jeff@jit-pro.com>` (undeployed demo function), `JiTpro Investor Requests <noreply@mail.jit-pro.com>` (investor). Both `jit-pro.com` and `mail.jit-pro.com` therefore appear to be verified sending domains; this should be confirmed in the Resend dashboard before relying on it.
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

- **No test framework is installed.** No Vitest, Jest, Playwright, or Testing Library. No `test` script.
- CI (`.github/workflows/ci.yml`, job `build-and-test`, PR-only): `npm ci` → `audit-ci` (high/critical) → `npm run typecheck` → `npm run lint` → `npm run build` → lychee offline link and asset check over `dist/`.
- Baseline on this branch: typecheck clean; lint 0 errors and 4 pre-existing `react-refresh/only-export-components` warnings.
- Local tooling: Node 24.19 (`.nvmrc` = 24), Google Chrome, Playwright Chromium headless shells cached (used for reduced-motion verification), the gstack `browse` skill. **Deno is not installed**, so edge functions cannot be executed locally without adding it. **Wrangler is not installed.** The Supabase CLI (v2.116) is installed as a dev dependency and is authenticated to the linked project.

### 3.13 Git and GitHub governance

- Repository `JiTproLabs/JiTpro-Website`, public, default branch `main`.
- Ruleset **"Protect Main Branch"** (active, no bypass actors): pull request required; **squash merge only**; required status check `build-and-test` with the strict policy (the branch must be up to date with `main` before merging); all review threads must be resolved; extra approval required for unattributed changes; no force pushes; no deletion. Zero approving reviews are required.
- Branch prefixes (CONTRIBUTING.md): `feature/`, `fix/`, `chore/`, `docs/`.
- Current state: `feature/navigation-simplification-lead-gen-guide` is checked out, clean, in sync with its upstream, and one commit ahead of `main` (`8a111f3 WIP: update homepage method section`, which deletes a figcaption in `MethodSection.tsx` and is unrelated to lead generation). `main` equals `origin/main`. No open PRs.
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

Server-side registry (authoritative for fulfilment): asset id → current version, versioned filename, stable public path, email subject and body. A unit test asserts the client registry and server registry agree on ids and versions.

Why an edge function rather than a Cloudflare Pages Function (DECIDED D5.9): the secrets, database access, Resend integration, logging conventions, and the team's operational familiarity all already live in Supabase. Adding a second serverless platform for one endpoint creates a second place to manage secrets and deploys. Cloudflare Pages Functions are not introduced.

**Fail-open ordering inside the function (D5.6):** the guide URL is known from the registry before any I/O, so the response can always include it. The function attempts persistence, then email, and reports each outcome honestly in the response; a persistence failure produces an internal failure alert and still returns the guide URL.

**Backend environments (D5.11):** the existing `jitpro-staging` Supabase project is the integration-test target, subject to the inspection in Section 15.2. Migrations and functions are exercised there first and promoted to production `jitpro_website` only after success.

A second, deliberately tiny function `supabase/functions/record-lead-magnet-event/index.ts` (D4.1) accepts one funnel event, validates the event name, asset, placement, and page path against fixed allow-lists, truncates strings, inserts one row into `lead_magnet_events`, and returns 204. It stores no identifiers and reads nothing back.

### 4.4 Storage (DECIDED, Round 2, 2026-09-12)

Two new tables, created by migrations in this repository. The conceptual model is fixed and must stay clear throughout implementation:

| Table | Answers | Rule |
|---|---|---|
| `contacts` | **Who is this person?** | One row per normalised unique email. Identity, first/last seen, first-touch attribution, consent and subscriber state. Designed to carry identity and consent state as the system grows. |
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
- Primarily transactional: its purpose is to deliver the requested guide. It is not a sales email. Footer states why the recipient received it and carries JiTpro's business mailing address once Jeff supplies it (never invented).
- Every send carries Resend `tags` (`asset`, `environment`) and an `Idempotency-Key` derived from the request id so a retry cannot double-send (D3.9).

**Internal notification (D3.8):** one per valid request, To `info@jit-pro.com`, From **`JiTpro Notifications <noreply@mail.jit-pro.com>`** (the existing internal sender domain, verified in Resend; DNS shows DKIM at `resend._domainkey.mail.jit-pro.com` and `send.mail.jit-pro.com`). Never From `info@` back to itself, never From `jeff@`.

**Test safety (D3.9):** `LEAD_MAGNET_TEST_MODE` restricts recipients to `@resend.dev` and `@jit-pro.com` on non-production deployments; Resend's documented test recipients (`delivered@`, `bounced@`, `complained@`, `suppressed@resend.dev`) are used for development and automated checks.

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

Frontend changes ship through PR → preview → squash merge → Cloudflare. Database migrations ship with `supabase db push` (requires the database password) and the edge function with `supabase functions deploy submit-lead-magnet-request` (the CLI is authenticated on this machine). Both are manual steps that must happen **before** the frontend that depends on them is merged. Section 15 has the ordered plan.

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
| `email` | text, unique index on `lower(trim(email))` | The one identifier the visitor gives; normalised on write |
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
| `placement` | text | `home-band`, `learn-more-band`, `footer-link`, `landing-page` (CTA conversion) |
| `page_path` | text | Where the form was submitted (page conversion) |
| `landing_path` | text | First page of the session |
| `referrer` | text | |
| `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` | text | Source conversion |
| `is_repeat` | boolean | Same email already requested this asset |
| `marketing_opt_in_checked` | boolean | The checkbox state at this request (D3.4) |
| `consent_text_version`, `consent_method` | text / text | Per-event consent evidence (D3.10): which sentence version was shown and how consent was expressed |
| `turnstile_passed` | boolean | Audit |
| `fulfilment_status` | text (`delivered_inline`) | Whether the visitor was shown the download |
| `email_status` | text (`sent` / `failed` / `skipped_cooldown` / `suppressed`) | Outcome of the fulfilment send |
| `email_provider_id` | text | Resend message id for tracing |
| `email_error` | text | Provider error summary, no secrets |
| `created_at` | timestamptz | Request time |

### 6.3 `lead_magnet_ip_activity` (abuse control only; recommended, D2.7)

| Column | Type | Why |
|---|---|---|
| `ip_hash` | text | Salted hash; salt is a secret combined with the UTC date so hashes cannot be linked across days |
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

RLS is enabled on all tables; only the service role writes; nothing reads from the browser.

---

## 7. Email behaviour

### 7.1 Fulfilment email (APPROVED, Round 6; wording in Section 25.7)

- From: `JiTpro <info@jit-pro.com>` (D3.2)
- Reply-To: `info@jit-pro.com`, set explicitly (D3.2)
- Subject: **Your JiTpro Construction Procurement Field Guide**
- Preheader: *What Will Stop Work Six Months From Now? Your link is inside.*
- Body, button (*Open the Field Guide* → `https://jit-pro.com/guides/procurement-field-guide`), closing, and footer exactly as approved in Section 25.7. The existing 600px template and logo header are reused.
- Footer (D3.3): the reason-for-receipt line, the business mailing address (**placeholder until Jeff supplies it, L-2; never invented**), and *Questions: info@jit-pro.com*. No marketing unsubscribe link: the message is transactional (D3.6).
- The message stays primarily transactional. Its job is to deliver the guide; it must not grow into a sales email.
- A matching plain-text part is approved and generated from the same content.
- **Legal review before launch:** the transactional-vs-commercial classification of this message and its final footer wording.

### 7.2 Internal notification (APPROVED, Round 6; format in Section 25.8)

One per valid request. From `JiTpro Notifications <noreply@mail.jit-pro.com>` To `info@jit-pro.com`. Subject pattern *New Field Guide request · [placement]*. Body: requester email, placement, page, landing page, source, repeat request yes/no, **marketing opt-in yes/no (kept, useful internally)**, fulfilment email status, request id, timestamp. **No IP address, no IP hash.**

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
| Persistence failure | A failure alert From `JiTpro Notifications <noreply@mail.jit-pro.com>` To `info@jit-pro.com` sent by the function when the request could not be saved, so the lead can be followed up manually. |
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
7. **Fulfilment email classification.** Primarily transactional; carries the reason-for-receipt line and the business mailing address. **Legal review before launch.**

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

Deno is not installed locally and is not added. Pure logic is tested with Vitest as above. The functions themselves are exercised **against the `jitpro-staging` Supabase project** after the inspection in Section 15.2: migrations applied there first, functions deployed there first, `curl` cases for every matrix row, Resend test recipients for the email paths, and a website preview pointed at staging for the full browser flow. Production is touched only after staging passes.

### 14.3 Browser (Chrome via the Claude in Chrome tools or the gstack browse skill; Playwright headless shells for screenshots)

Desktop: CTA renders; opens dialog; mouse and keyboard; Tab order; Escape; backdrop click; validation; valid submission; submitting state; success; Download opens the PDF; focus returns to the CTA on close; layout matches the design system.

Mobile (360, 390, 430 widths) and tablet (768, 1024): dialog fits; keyboard does not hide the field; success and Download visible; no horizontal overflow; no clipped text.

Accessibility: labels, keyboard, visible focus, focus trap, Escape, error announcement, button names, ARIA minimalism, contrast, non-colour error cues. Reduced motion verified with `--force-prefers-reduced-motion` (see memory note on tooling).

Failure paths: empty email; malformed email; server 500 (point the client at a failing function or intercept the request); Turnstile failure; repeat submission; slow network throttling; missing PDF; unexpected response body.

### 14.4 Email (DECIDED, D3.9)

- Development and automated checks use Resend's documented test recipients: `delivered@resend.dev`, `bounced@resend.dev`, `complained@resend.dev`, `suppressed@resend.dev` (the first three accept `+label` suffixes). These consume sending quota, so they are used deliberately.
- Non-production deployments run with `LEAD_MAGNET_TEST_MODE` set, which makes the function refuse any recipient outside `@resend.dev` and `@jit-pro.com`. Development emails never reach real leads.
- Every send carries tags `asset` and `environment` so test traffic is filterable in the Resend dashboard, and an `Idempotency-Key` derived from the request id so retries cannot double-send.
- Real-mailbox verification uses a JiTpro-owned address: sender name and address, explicit Reply-To, subject, preheader, body copy, footer line and mailing address, link target, logo, plain-text part, mobile and desktop rendering (Gmail web and iOS Mail at minimum), one-hour cooldown behaviour, suppressed and failed paths, failure logging.
- No secrets or environment-specific credentials are hard-coded; configuration follows the existing `VITE_*` (browser) and Supabase-secrets (server) conventions.

### 14.5 Production smoke test

Listed in Section 15.

---

## 15. Deployment plan

1. Merge order matters. Database migrations and the edge functions must be live in **production** before the frontend PR that calls them is merged, and live in **staging** before that (D5.11).
2. **Staging first:** apply migrations and deploy `submit-lead-magnet-request` and `record-lead-magnet-event` to `jitpro-staging` with staging secrets; run the `curl` matrix and Resend test-recipient cases; point a website preview at staging (Cloudflare Pages preview-environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) for the full browser flow. Note: preview-environment variables apply to every preview deployment, so while they point at staging the contact form on previews would post to a project where `submit-contact` may not exist; the contact form already cannot complete on previews because of Turnstile, so this is a documented, temporary condition, not a regression.
3. **Preview:** open the PR; Cloudflare builds a preview. Verify the CTA, dialog, stable route redirect, headers, and (with G-4 done) a real submission against staging.
4. **Production backend release:** only after staging passes: `supabase db push` (migrations), `supabase functions deploy` for both functions, set production secrets (`LEAD_MAGNET_IP_SALT`; never `LEAD_MAGNET_TEST_MODE`), confirm with a `curl` against production using a JiTpro-owned test address.
5. **Merge:** squash merge once `build-and-test` passes and review threads are resolved. Ask Jeff before the final merge.
6. **Production verification (smoke test):** production CTA renders; dialog opens; test submission succeeds; `contacts` and `lead_magnet_requests` rows exist with attribution; email arrives; email link opens the correct 31-page PDF; inline Download works; analytics events appear; contact form, navigation, homepage, and Learn More still work.
7. **Rollback:** revert the PR on GitHub. The edge functions and tables can stay deployed harmlessly; the CTA simply disappears. If a function itself misbehaves, redeploy the previous version or disable the CTA.
8. Record the result in Section 22.

### 15.1 Launch checklist: items that must be verified outside the repository

These cannot be confirmed from code and are not assumed. Each is checked off, with who verified it and when, before production launch.

| # | Item | Owner | Status |
|---|---|---|---|
| L-1 | `info@jit-pro.com` Microsoft 365 mailbox exists, is monitored, and receives external mail (visitor replies and internal notifications land there) | Jeff / admin | Open |
| L-2 | JiTpro business mailing address supplied for the email footer (not invented) | Jeff | Open |
| L-3 | Legal review completed: consent checkbox wording, privacy notice, fulfilment-email classification and wording | Jeff / counsel | Open |
| L-4 | Resend dashboard confirms `jit-pro.com` and `mail.jit-pro.com` verified (DNS evidence already positive) | Jeff / assistant with dashboard access | Open |
| L-5 | Turnstile widget hostnames include the Cloudflare preview URLs so submit can be tested on previews (G-4) | Jeff / admin | Open |
| L-6 | Production Supabase secrets set: `LEAD_MAGNET_IP_SALT`, optional `LEAD_MAGNET_NOTIFY_TO`; `LEAD_MAGNET_TEST_MODE` **absent** in production | Assistant via CLI with Jeff's approval | Open |
| L-7 | Migrations applied and both functions deployed to production, after staging passed, before the frontend PR merges | Assistant via CLI with Jeff's approval | Open |
| L-8 | The approved 31-page PDF is obtained from Jeff and is the file committed (page count and title verified) | Jeff supplies; assistant verifies | Open |
| L-9 | Cloudflare Web Analytics enabled on the Pages project (Metrics → Enable) | Jeff / admin | Open |
| L-10 | Supabase production plan confirmed and the actual function-log retention period recorded here (not guessed) | Jeff / assistant with dashboard access | Open |
| L-11 | Pulsetic HTTP monitor added for `https://jit-pro.com/guides/procurement-field-guide`, following the redirect | Jeff | Open |
| L-12 | `jitpro-staging` inspected per Section 15.2 and confirmed safe as the integration-test target | Assistant inspects; Jeff confirms | Open |
| L-13 | Staging secrets set: `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `LEAD_MAGNET_IP_SALT`, `LEAD_MAGNET_TEST_MODE`, `SITE_URL`, and any other required existing secret | Assistant via CLI with Jeff's approval | Open |
| L-14 | Cloudflare Pages preview-environment variables pointed at staging for end-to-end browser testing, then reviewed after launch | Jeff / admin | Open |

None of the dashboard or account changes above is performed silently. Each is requested from Jeff, or performed with his explicit approval, when the sprint reaches it.

### 15.2 Staging inspection protocol (D5.11, before any change to `jitpro-staging`)

Before modifying `jitpro-staging`, the assistant inspects it read-only and reports:

1. what schemas, tables, functions, and secrets currently exist;
2. whether any other active development appears to depend on it (recent activity, deployed functions, table contents);
3. whether applying this project's migrations is safe (no name collisions with `contacts`, `lead_magnet_*`);
4. what secrets and configuration are already present (names only);
5. whether it can safely serve as this project's integration-test environment.

The staging project is **never reset, wiped, or destructively modified** merely because it is named staging. If the inspection raises doubt, the fallback is D5.11 option (a): production with `LEAD_MAGNET_TEST_MODE` and Resend test recipients, decided with Jeff.

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
| `LEAD_MAGNET_TEST_MODE` | When set, the function refuses recipients outside `@resend.dev` and `@jit-pro.com` (D3.9) | Edge function | **New** | Supabase, non-production or test deployments only; never set in production |

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
| D3.3 | Fulfilment copy | Section 7.1 draft plus footer additions | Draft plus reason-for-receipt line and business mailing address | **DECIDED.** Footer line: *You received this email because you requested the JiTpro Field Guide at jit-pro.com.* Business mailing address included if required or recommended for the final approved email; **never invented**; Jeff supplies it before final email implementation (L-2). Message stays primarily transactional and short. Final classification and wording get legal review before launch (L-3). Final copy approved in Round 6. | 2026-09-12 | Jeff Kaufman |
| D3.4 | Consent mechanism at capture | (A) transactional only; (B) notice-based opt-out; (C) explicit unchecked checkbox; (D) success-state opt-in | (C) | **DECIDED: (C).** Email field plus one quiet optional checkbox, unchecked by default. Working wording: *Also send me occasional JiTpro insights on construction procurement and keeping projects ahead of the field. I can unsubscribe at any time.* (not final; presented in Round 6). Unchecked → `transactional_only`; checked → `marketing_opt_in`. Recorded: status, method, text version, timestamp, placement, page path, asset. A guide request alone never silently creates `marketing_opt_in`. Prospects outside the US are assumed plausible, so no US-only notice model. Final wording to legal review (L-3). | 2026-09-12 | Jeff Kaufman |
| D3.5 | Nurture in V1 and permissions by state | | No nurture; permissions per state | **DECIDED.** No nurture sequence in V1. Permissions recorded in Section 7.3: `transactional_only` (fulfilment, cooldown-gated re-send, asset-related service messages); `marketing_opt_in` (the above, plus a future approved sequence once separately approved and built); `unsubscribed` (no marketing; transactional fulfilment still allowed on an explicit new request unless suppressed); suppressed (no delivery attempt). No marketing sequence is implemented in this project unless separately approved. | 2026-09-12 | Jeff Kaufman |
| D3.6 | Unsubscribe and suppression | (a) tokenised unsubscribe endpoint now; (b) defer until before the first marketing send | (b) | **DECIDED: (b).** No unsubscribe endpoint in V1 unless a later scope decision requires it; a proper mechanism is mandatory before any marketing email (nurture prerequisite N-1). Fulfilment email carries no marketing unsubscribe link. Schema supports unsubscribe and suppression now. Privacy notice explains how to contact JiTpro about consent and data choices via `info@`. Resend's automatic suppression is relied upon; API-reported suppression or failure is recorded as the email status; the visitor still gets immediate on-screen access with a calm message. Resend webhook receiver deferred to the nurture and email-hardening project (F-7). | 2026-09-12 | Jeff Kaufman |
| D3.7 | Add a privacy notice page to scope? | Yes / No | Yes | **DECIDED: yes.** `/privacy` added to this project, linked from the capture form's fine print and the footer. Plain English, scoped to actual behaviour, minimum contents listed in Section 10 item 1. No Terms page in V1. Legal review before production launch (L-3). | 2026-09-12 | Jeff Kaufman |
| D3.8 | Internal notification per request | Per request / daily digest / none; sender choice | Per request; From `info@` | **DECIDED with modification.** One notification per valid request To `info@jit-pro.com`, but **not From `info@` to itself**: From `JiTpro Notifications <noreply@mail.jit-pro.com>` (existing internal sender domain). `jeff@` stays out of the workflow. Concise content: requester email, CTA placement, page, source/UTM summary, repeat flag, fulfilment email status. No IP hashes or unnecessary technical data. | 2026-09-12 | Jeff Kaufman |
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
| D5.7 | Logging and observability | | As proposed plus masking and plan check | **DECIDED.** Request-id logs; internal notification per successful request; failure alert from `noreply@mail.jit-pro.com` to `info@` on persistence failure; Pulsetic monitor on the stable URL following the redirect (L-11); saved volume query. **Email addresses masked in logs**; no raw IPs or unnecessary IP hashes in logs. Supabase plan and log retention confirmed as L-10, not guessed. | 2026-09-12 | Jeff Kaufman |
| D5.8 | Test framework | (a) Vitest; (b) none; (c) Deno test | (a) | **DECIDED: (a) Vitest 5** on Vite 8; `npm test` in CI before build; pure-logic tests for the list in Section 14.1; no jsdom unless genuinely required; no abstraction solely for testability. | 2026-09-12 | Jeff Kaufman |
| D5.9 | Server platform | Supabase Edge Functions vs Cloudflare Pages Functions | Supabase | **CONFIRMED: Supabase Edge Functions.** No Cloudflare Pages Functions for this workflow. | 2026-09-12 | Jeff Kaufman |
| D5.10 | SEO and indexing | | noindex the PDF; index `/field-guide` | **DECIDED.** `X-Robots-Tag: noindex` on the actual PDF via `_headers`; `/field-guide` indexable with its own title and meta description; no `robots.txt` or sitemap work unless later approved. | 2026-09-12 | Jeff Kaufman |
| D5.11 | Backend test environment | (a) production with test mode; (b) `jitpro-staging` first | (b) if available | **DECIDED: (b), subject to verification.** `jitpro-staging` is inspected per Section 15.2 before any change (schemas, tables, functions, dependants, migration safety, existing secrets). Never reset or destructively modified. If safe: staging secrets (L-13), preview environment pointed at staging (L-14), production promoted only after staging passes. | 2026-09-12 | Jeff Kaufman |
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
| D6.8 | Fulfilment email, internal notification, and recovery alert copy | Sections 25.7 to 25.9 | **DECIDED.** Mailing address remains a placeholder until L-2. Plain-text part approved. Classification and footer wording to legal review (L-3). | 2026-09-12 | Jeff Kaufman |
| D6.9 | Privacy notice | Draft timing | **DECIDED: complete draft written now (Section 27), before Sprint 1**, from the actual architecture, no boilerplate. Marked SUBJECT TO LEGAL REVIEW BEFORE PRODUCTION LAUNCH. Mailing address placeholder until L-2. | 2026-09-12 | Jeff Kaufman |
| D6.10 | Visitor-facing failure language | Per-cause messages vs one calm shared state | One calm shared state | **DECIDED: simplify.** Three access-granting visitor states only (Section 13.2). Causes stay internal. No mention of databases, rate limits, verification, or networks to visitors. Quiet *Try again* only where genuinely useful (network, timeout). | 2026-09-12 | Jeff Kaufman |
| D6.11 | Secondary sales CTA in the success state | Yes / No | No | **DECIDED: NO.** No *Start with one project*, contact, scheduling, or other commercial CTA in the guide-success state. The guide itself carries JiTpro's commercial path. | 2026-09-12 | Jeff Kaufman |
| D6.12 | Marketing opt-in line in the internal notification | Include / omit | Include | **DECIDED: keep it.** | 2026-09-12 | Jeff Kaufman |
| D6.13 | Full requester email in the persistence-failure recovery alert | Include / mask | Include | **DECIDED: include the full address, deliberately**, for lead recovery. Ordinary logs stay masked. | 2026-09-12 | Jeff Kaufman |
| D6.14 | §26 / §48.1 hairline secondary button; §20.2 offer band; §50 amendment; §20.1 and §7.7 non-amendments | Amendments A6 to A10 | **APPROVED (A6 to A10).** Text in Section 26. | 2026-09-12 | Jeff Kaufman |
| D6.15 | Footer changes | Add items vs redesign | Add two items only | **DECIDED.** *Free field guide* in the Company column (established footer-link appearance, opens the dialog); *Privacy* in the bottom legal area. No other footer redesign. | 2026-09-12 | Jeff Kaufman |

---

## 21. Open questions (require Jeff)

**No product, data, compliance, email, analytics, security, or infrastructure decision remains open.** All six decision rounds are recorded in Section 20. What remains is external to the repository and is consolidated in Section 28:

1. Explicit authorisation to begin Sprint 1.
2. The approved 31-page PDF file (L-8).
3. JiTpro's business mailing address (L-2).
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

**Git expectations for every sprint** (from the brief, Section 18): work stays on `feature/navigation-simplification-lead-gen-guide`; before each commit review `git status` and the diff, confirm only intended files changed, run `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build`, fix failures rather than committing broken work unless Jeff approves a WIP checkpoint, write a descriptive message, and report the hash. Push only to this branch with Jeff's knowledge. One PR to `main` at the end; merge only on Jeff's explicit word after `build-and-test` passes.

### Sprint 0: Discovery and architecture (COMPLETE 2026-09-12)

- **Objective:** existing infrastructure understood; architecture and decisions approved.
- **Delivered:** repository discovery (Section 3), this plan, six decision rounds (Section 20), Design System amendment texts (Section 26), privacy notice draft (Section 27), approved copy (Section 25), sprint plan, external prerequisites (Section 28).
- **Exit criteria met:** no architectural or product question blocks implementation. Remaining items are external (Section 28).
- **Commits:** `aabcf7e` (plan), `6f4834a` (Round 2), `dde8c67` (Round 3), `953575b` (Round 4), `ea14571` (Round 5), plus the Round 6 commit recorded in Section 29.

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

### Sprint 2: Lead persistence and attribution (API, on staging)

- **Objective:** a valid request is safely recorded with approved attribution; abuse controls work; the function fails open.
- **Scope:** read-only staging inspection (Section 15.2) and report; staging secrets (L-13) with Jeff's approval; migrations for `contacts`, `lead_magnet_requests`, `lead_magnet_ip_activity`; `submit-lead-magnet-request` with validation, server honeypot, Turnstile verification, 10-per-10-minute IP rate limit (single constant), contact upsert, repeat detection, one-hour cooldown decision, consent recording, **fail-open response shape** (`stored`, `email_status`, `guide_url`, `request_id`), persistence-failure recovery alert (Section 7.2.1), masked logging; shared pure modules; `curl`-level verification against **staging**. The existing `leads` table and `submit-contact` function are not touched.
- **Out of scope:** email sending (Sprint 3, though the function's send step is stubbed to return `skipped` so the response shape is complete), UI, any change to the contact-form pipeline, production deployment (Sprint 6).
- **Dependencies:** Sprint 1a; D5.11 inspection outcome (L-12); L-13.
- **Tasks:** inspect staging and report; migrations; shared modules; function; `curl` script documented in the repo; tests.
- **Acceptance criteria:** documented `curl` cases (valid, malformed, honeypot, repeat inside and outside the hour, rate-limited, bad or missing Turnstile, simulated persistence failure) behave per Section 13.3 against staging; rows appear with attribution and consent fields; `lead_magnet_ip_activity` rows expire; the recovery alert arrives at a JiTpro mailbox with the full email.
- **Tests:** Vitest on validation, normalisation, attribution parsing, consent decisions, cooldown, rate limit, failure-state mapping, payload validation; manual function tests on staging.
- **Risks:** staging unsuitable (fallback decided with Jeff per Section 15.2); `db push` needs the database password; Deno-only APIs must stay out of `_shared`.
- **Decision dependencies:** none outstanding.
- **Definition of done:** all `curl` cases pass on staging; tests green; plan updated with the staging inspection report.
- **Commit boundaries:** (1) migrations; (2) shared modules with tests; (3) edge function and `curl` script.

### Sprint 3: Email fulfilment (on staging)

- **Objective:** a successful request reliably produces the approved guide email and the internal notification.
- **Scope:** HTML and plain-text templates per Section 25.7 with the footer line and the mailing-address placeholder; stable link; From `JiTpro <info@jit-pro.com>` with explicit Reply-To; tags `asset` and `environment`; `Idempotency-Key` from the request id; synchronous send with one retry; one-hour cooldown enforcement; `sent`, `skipped_cooldown`, `failed`, `suppressed` recorded on the row; internal notification per Section 25.8 From `JiTpro Notifications <noreply@mail.jit-pro.com>`; `LEAD_MAGNET_TEST_MODE` recipient restriction; failure logging.
- **Out of scope:** nurture, unsubscribe endpoint, Resend webhook receiver (F-7).
- **Dependencies:** Sprint 2; the mailing address (L-2) for the final footer, otherwise a clearly marked placeholder that a test asserts is replaced before production.
- **Tasks:** templates; send module; notification module; test mode; tests; delivery verification.
- **Acceptance criteria:** Section 14.4 checks pass against Resend test recipients and a JiTpro-owned mailbox (sender, Reply-To, subject, preheader, body, button link, footer, plain-text part, mobile and desktop rendering); cooldown verified; `suppressed@resend.dev` path recorded as suppressed; failure path verified with an invalid key on staging; test mode refuses an outside recipient; internal notification arrives with the approved fields and no IP data.
- **Tests:** template rendering (subject, link, footer, escaping, text part, placeholder guard); cooldown decision; notification formatting.
- **Risks:** spam placement in a real mailbox (DNS already correct); mailing address still open.
- **Decision dependencies:** none outstanding.
- **Definition of done:** real test messages verified in a mailbox; plan updated.
- **Commit boundaries:** (1) templates with tests; (2) send and cooldown logic; (3) internal notification and test mode.

### Sprint 4: Visitor capture experience

- **Objective:** a visitor can encounter a CTA, enter an email, submit, and receive the correct outcome state, on desktop, tablet, and mobile, accessibly.
- **Scope:** `LeadMagnetCTA` (band and footer-link variants), `LeadMagnetDialog` (lazy-loaded native `<dialog>` per A1), `LeadCaptureForm` with every state in Sections 13.2 and 25.6 including the unchecked checkbox, Turnstile interaction-only with expired-token handling, fine print linking `/privacy`, honeypot; `useAttribution` (`sessionStorage`); API client; the `/field-guide` landing page per Section 25.4 with its title and meta description; funnel event calls present but pointed at a no-op until Sprint 6; a single development placement for QA.
- **Out of scope:** the production placements (Sprint 5), live analytics (Sprint 6).
- **Dependencies:** Sprints 1a, 2, 3 (staging backend); Sprint 1b for the real PDF behind the route during QA; Cloudflare preview-environment variables pointed at staging (L-14) and Turnstile preview hostnames (L-5) for a full preview test.
- **Tasks:** components; states; attribution; landing page; accessibility pass; responsive pass; reduced-motion verification; failure-path QA.
- **Acceptance criteria:** Section 14.3 desktop, mobile (360, 390, 430), tablet (768, 1024), and accessibility checklists pass with screenshots recorded; every row of Section 13.3 produces the correct visitor state; keyboard-only completion; screen-reader announcement of errors and outcome headings; no horizontal overflow; Turnstile invisible in the normal path.
- **Tests:** form reducer and failure-state mapping tests; browser QA with the Chrome tools and headless screenshots; reduced-motion verification per the recorded tooling note.
- **Risks:** iOS software keyboard covering the field; preview cannot submit until L-5 and L-14 are done (fallback: production smoke test after merge).
- **Decision dependencies:** none outstanding.
- **Definition of done:** QA evidence recorded in the plan; plan updated.
- **Commit boundaries:** (1) dialog and form components with states; (2) attribution and API client; (3) landing page; (4) QA fixes.

### Sprint 5: Website integration

- **Objective:** the approved offer is live on the homepage, Learn More, and the footer, with the privacy notice published.
- **Scope:** homepage band after `HomeFinalCTA` (A7, D6.6); Learn More band after section 11 outside the guide area (A8); footer *Free field guide* item and *Privacy* link (D6.15) using token classes; the `/privacy` page from Section 27 (with the mailing-address placeholder until L-2); route registration; regression pass.
- **Out of scope:** navigation, other pages, a Terms page, any other footer change.
- **Dependencies:** Sprint 4; Section 27 approved by Jeff (done in Round 6; legal review may still be pending and does not block a preview, but does block production launch).
- **Tasks:** one commit per placement; privacy page; regression.
- **Acceptance criteria:** each placement renders and opens the dialog with the correct `placement`; §48.1 and §48.7 respected (band eyebrow is the only amber; no two primary actions in one viewport); homepage and Learn More visually unchanged above the bands; contact form, navigation, and footer regression-free; `/privacy` reachable from the form and the footer.
- **Tests:** browser QA per placement at all breakpoints; regression on contact form and navigation; lychee passes.
- **Risks:** homepage visual review by Jeff before merge (plan-then-approve rule); the Learn More guide area's grid and the band's full-bleed placement.
- **Decision dependencies:** none outstanding.
- **Definition of done:** Jeff has seen the preview of both bands and approved them; plan updated.
- **Commit boundaries:** (1) homepage band; (2) Learn More band; (3) footer; (4) privacy page.

### Sprint 6: Analytics, QA, and production readiness

- **Objective:** the complete funnel is measurable, verified, and promoted to production.
- **Scope:** `lead_magnet_events` migration and `record-lead-magnet-event` function on staging, then production; `funnel.ts` wired to the seven events with impression deduplication; the eight saved queries under `supabase/queries/`; full regression; accessibility audit; email re-verification; **promotion of migrations and both functions to production** (L-6, L-7) after staging passes; production `curl` check with a JiTpro-owned address; Cloudflare Web Analytics enablement (L-9); Pulsetic monitor (L-11); PR opened with the Section 15 summary; production smoke test after merge; results recorded.
- **Out of scope:** any nurture prerequisite (Section 21.2), Resend webhook, report page.
- **Dependencies:** Sprints 1 to 5; launch checklist L-1 to L-14 complete, including legal review (L-3) before merge to production.
- **Tasks:** events; queries; audits; promotion; PR; smoke test; documentation.
- **Acceptance criteria:** the brief's Section 38 review passes in full (functional, visual, accessibility, email, analytics, data, security, regression, CI); events appear once per action with no StrictMode duplication in the production build; queries return sensible results; all launch items checked; Jeff authorises the merge.
- **Tests:** everything in Section 14; production smoke test per Section 15 step 6.
- **Risks:** an external prerequisite still open at merge time (the PR waits); event duplication in development only.
- **Decision dependencies:** Jeff's authorisation to merge.
- **Definition of done:** merged, production smoke test recorded, post-launch measurement plan started (Section 23).
- **Commit boundaries:** (1) events table, function, client wiring; (2) saved queries; (3) QA and audit fixes; (4) documentation and launch record.

### Sprint completion records

*(Filled in as sprints close: date, commits, tests run, deviations, unresolved issues.)*

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
| Footer | You received this email because you requested the JiTpro Field Guide at jit-pro.com. ¶ JiTpro ¶ [approved business mailing address: placeholder until L-2; never invented] ¶ Questions: info@jit-pro.com |
| Plain-text part | The same content in the same order, with the stable URL written out |

### 25.8 Internal notification

| Element | Content |
|---|---|
| From | JiTpro Notifications <noreply@mail.jit-pro.com> |
| To | info@jit-pro.com |
| Subject | New Field Guide request · [placement] |
| Body (table) | Requester email · Placement · Page · Landing page · Source (UTM source / medium / campaign, or referrer host, or "direct") · Repeat request: yes/no · Marketing opt-in: yes/no · Fulfilment email status · Request id · Timestamp |
| Excluded | IP address, IP hash, user agent |

### 25.9 Persistence-failure recovery alert

| Element | Content |
|---|---|
| From | JiTpro Notifications <noreply@mail.jit-pro.com> |
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

**Contact.** JiTpro, [approved business mailing address: placeholder until L-2]. Email: info@jit-pro.com.

---

## 28. External launch prerequisites (everything that is not code)

Consolidated from the launch checklist (Section 15.1) so nothing is hidden inside implementation sections. None of these blocks Sprint 1a. Each is requested from Jeff when its sprint reaches it, and nothing requiring his approval or credentials is done silently (D5.12).

| # | Prerequisite | Owner | Needed by | Blocks |
|---|---|---|---|---|
| L-8 | The approved 31-page PDF, *What Will Stop Work Six Months From Now? The JiTpro Field Guide to Construction Procurement Control*, placed where the assistant can read it | Jeff | Sprint 1b | The asset commit and the route; Sprint 4 browser QA of the real download |
| L-2 | JiTpro's approved business mailing address | Jeff | Sprint 3 (final template) and Sprint 5 (privacy page) | Production launch only; both carry a placeholder until then |
| L-3 | Legal review: consent checkbox wording, fine print, privacy notice (Section 27), fulfilment-email classification and footer, the no-cookie analytics assumptions | Jeff / counsel | Before the production merge (Sprint 6) | Production launch |
| L-1 | `info@jit-pro.com` mailbox confirmed monitored and receiving external mail | Jeff | Sprint 3 verification | Production launch |
| L-4 | Resend dashboard confirms `jit-pro.com` and `mail.jit-pro.com` verified (DNS already positive) | Jeff, or assistant with dashboard access | Sprint 3 | Production launch |
| L-12 | `jitpro-staging` read-only inspection and Jeff's confirmation it may be used | Assistant inspects; Jeff confirms | Start of Sprint 2 | Sprint 2 |
| L-13 | Staging secrets set (`RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `LEAD_MAGNET_IP_SALT`, `LEAD_MAGNET_TEST_MODE`, `SITE_URL`, any other required existing secret) | Assistant via CLI with Jeff's approval | Sprint 2 | Sprint 2 function tests |
| L-5 | Turnstile widget allowed hostnames extended to the Cloudflare preview URLs | Jeff / admin (Cloudflare dashboard) | Sprint 4 preview QA | Full submit test on previews (fallback: production smoke test) |
| L-14 | Cloudflare Pages preview-environment variables pointed at staging (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) | Jeff / admin | Sprint 4 preview QA | Same |
| L-10 | Supabase production plan confirmed; actual function-log retention recorded here | Jeff / assistant with dashboard access | Sprint 6 | Observability record only |
| L-6 | Production secrets set (`LEAD_MAGNET_IP_SALT`, optional `LEAD_MAGNET_NOTIFY_TO`; no test mode) | Assistant via CLI with Jeff's approval | Sprint 6 promotion | Production backend |
| L-7 | Migrations applied and both functions deployed to production after staging passes | Assistant via CLI with Jeff's approval | Sprint 6, before the frontend merge | Production launch |
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
| 2026-09-12 | Privacy draft (§27) revised per Jeff: response-time sentence replaced with "as required by applicable law"; IP-hash wording changed from an absolute claim to "designed so that JiTpro does not need to retain the underlying IP address"; email bounce and suppression paragraph explicitly marked for verification against the launch implementation and Resend behaviour before publication. Still subject to legal review; not final legal approval. Sprint 1a authorised. |
| 2026-09-12 | Round 6 decided by Jeff: approved copy for every surface with his edits (§25); visitor-facing failure language simplified to three access-granting states (§13.2, D6.10); no secondary sales CTA in success (D6.11); opt-in line kept in the internal notification (D6.12); full email in the recovery alert (D6.13); footer additions only (D6.15); Design System amendments A1 to A10 approved with implementation text (§26); complete privacy notice drafted (§27, subject to legal review); sprint plan finalised with Sprint 1 split into 1a and 1b, implementation order, acceptance criteria, and commit boundaries (§22); external prerequisites consolidated (§28); §21 reduced to external items and the Sprint 1 go-ahead; G-4 closed into L-5. **Sprint 0 complete. Implementation awaits Jeff's explicit authorisation.** |
