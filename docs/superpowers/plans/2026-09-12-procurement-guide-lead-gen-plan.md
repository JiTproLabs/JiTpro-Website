# Procurement Field Guide Lead-Generation System: Project Plan

| | |
|---|---|
| Status | **Sprint 0: discovery complete; Rounds 1 and 2 decided; Rounds 3 to 6 in progress.** No implementation has started. |
| Owner / approver | Jeff Kaufman |
| Document created | 2026-09-12 |
| Last updated | 2026-09-12 (Round 2 decisions recorded; email identity rule; IP-hash retention recommendation) |
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

## 4. Proposed architecture (recommended; items marked *pending* await a decision)

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
| `src/components/lead-magnet/funnel.ts` | Thin analytics helper (*pending* Decision Round 4). |
| `src/pages/FieldGuide.tsx` (route `/field-guide`, decided D1.1) | Campaign landing route rendering the same form inline. Also the no-JavaScript fallback destination for CTAs. |

Turnstile: reuse `src/components/Turnstile.tsx`, extended to accept `appearance: 'interaction-only'` so the widget is invisible unless Cloudflare needs a challenge. This keeps the dialog to one visible field.

### 4.3 Backend (Supabase Edge Function)

`supabase/functions/submit-lead-magnet-request/index.ts` (Deno), plus `supabase/functions/_shared/lead-magnet/` for pure, testable logic (validation, normalisation, attribution parsing, email template rendering, asset registry). The shared modules use no Deno-specific APIs so Vitest can test them from the Node toolchain.

Server-side registry (authoritative for fulfilment): asset id → current version, versioned filename, stable public path, email subject and body. A unit test asserts the client registry and server registry agree on ids and versions.

Why an edge function rather than a Cloudflare Pages Function: the secrets, database access, Resend integration, logging conventions, and the team's operational familiarity all already live in Supabase. Adding a second serverless platform for one endpoint creates a second place to manage secrets and deploys. (*pending* D5.9)

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

Optionally `lead_magnet_events` for first-party funnel events (*pending* Decision Round 4).

Abuse data is kept apart from prospect data: the salted IP hash used for rate limiting lives in a short-lived `lead_magnet_ip_activity` table and never on a `contacts` or `lead_magnet_requests` row (D2.7, recommendation documented in Section 9.1).

### 4.5 Email (sender DECIDED in Round 2; copy, reply-to, consent *pending* Round 3)

Resend, sent synchronously from the edge function so the response can truthfully tell the visitor whether the email went out. HTML plus a plain-text part. The link in the email is the stable guide URL, never the versioned filename. Copy in Section 7 is a draft for approval.

**Visitor-facing email identity (Jeff, 2026-09-12):**

- From: **`JiTpro <info@jit-pro.com>`**. This is the sender already used for the contact-form visitor confirmation, and DNS shows `jit-pro.com` is verified in Resend (DKIM at `resend._domainkey.jit-pro.com`, bounce subdomain `send.jit-pro.com`, root SPF including `amazonses.com`, DMARC `p=quarantine`).
- Visitor replies stay associated with `info@jit-pro.com`. Reply-To behaviour is recommended in Round 3.
- **`jeff@jit-pro.com` must never be exposed through the lead-generation workflow** as a sender, reply-to, or visible address. It is the repository's git identity only (G-5).

### 4.6 PDF delivery and versioning (*pending* Decision Round 5)

- The PDF is committed to `public/guides/` under a versioned filename (about 100 to 120 KB; git is fine for this).
- A stable path, proposed `/guides/procurement`, is a **302 redirect** in `public/_redirects` to the current versioned file. Updating the guide is: add the new file, change one line, bump the registry version, open a PR.
- `public/_headers` adds `X-Robots-Tag: noindex` to the PDF path and the redirect path so the PDF is not indexed independently of the capture experience (Section 33 of the brief; *pending* D5.10).
- The registry records which version was current; each request row stores it, so JiTpro can always tell which version a lead received.

### 4.7 Analytics (*pending* Decision Round 4)

Recommended minimum: first-party funnel events recorded through the same edge-function pipeline (no third-party script, no cookie banner implication) for CTA view, CTA click, form view, submit, success, download click; plus Cloudflare Web Analytics enabled at the dashboard for page-view denominators. GA4 is the main alternative if standard marketing tooling is preferred. Metric definitions are in Section 8.

### 4.8 Deployment

Frontend changes ship through PR → preview → squash merge → Cloudflare. Database migrations ship with `supabase db push` (requires the database password) and the edge function with `supabase functions deploy submit-lead-magnet-request` (the CLI is authenticated on this machine). Both are manual steps that must happen **before** the frontend that depends on them is merged. Section 15 has the ordered plan.

---

## 5. User journey (detailed)

1. **Arrival.** The visitor lands on any page, possibly with UTM parameters from LinkedIn or email. `useAttribution` stores `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `document.referrer`, and the first landing path in `sessionStorage` if not already present. Nothing is sent anywhere yet.
2. **CTA impression.** The visitor scrolls to a placement carrying the offer. An impression event may be recorded once per placement per session (*pending* Round 4).
3. **CTA click.** The dialog chunk loads (if not already), the dialog opens with `showModal()`, focus moves to the email field, the page behind is inert, body scroll is locked. Escape or the Close control closes it and returns focus to the CTA.
4. **Entry.** The visitor types an email. Client validation runs on submit only (not on every keystroke): required, syntactically plausible. Turnstile runs invisibly; if Cloudflare needs an interactive challenge it appears inside the dialog.
5. **Submit.** The button enters the submitting state (label changes, control disabled, layout stable). The request carries email, asset id, placement, current page, landing page, referrer, UTMs, Turnstile token, honeypot value.
6. **Server.** Validates, rate-limits, records the contact and request, sends the email, returns the result.
7. **Success.** The dialog swaps to the success state: "Your guide is ready." with the primary **Download** action opening the stable guide URL in a new tab, and a line confirming the email was sent. If the email failed but the lead was stored, the line instead says the email could not be sent and the download still works (*pending* D5.6).
8. **Errors.** Invalid email: inline message beneath the field, field marked invalid, focus moved to it. Server or network error: message in the dialog with a retry action, form values preserved. Rate-limited: a calm message saying the guide was already sent to that address recently, with the download still offered (*pending* D5.3).
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
| `consent_status` | text (`transactional_only` / `marketing_opt_in` / `unsubscribed`) | Lead vs subscriber state (D2.5). Exact values and transitions finalised in Round 3. |
| `consent_text_version`, `consent_recorded_at`, `consent_method`, `consent_placement` | text / timestamptz / text / text | Consent evidence: which sentence, when, how (notice or checkbox), where (Round 3) |
| `marketing_opt_in_at`, `unsubscribed_at`, `unsubscribe_source` | timestamptz / timestamptz / text | Subscriber lifecycle and suppression (Round 3) |
| `email_suppressed_at`, `email_suppression_reason` | timestamptz / text (`bounce` / `complaint` / `manual`) | Deliverability suppression, distinct from consent (Round 3) |
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

**Deliberately not captured (Round 2):** user agent, raw IP address, name, company, phone number, job title, geolocation, enrichment data. The principle is to collect what is needed for funnel performance, attribution, fulfilment, and abuse prevention, and nothing because it is technically possible.

RLS is enabled on all tables; only the service role writes; nothing reads from the browser.

---

## 7. Email behaviour

### 7.1 Fulfilment email (DRAFT, not approved)

- From: `JiTpro <info@jit-pro.com>` (*pending* D3.2)
- Reply-to: `jeff@jit-pro.com` (*pending* D3.2)
- Subject: **Your JiTpro Construction Procurement Field Guide**
- Preheader: *What Will Stop Work Six Months From Now? Your download link is inside.*
- Body:

> Thanks for requesting **What Will Stop Work Six Months From Now?**
>
> The JiTpro Field Guide to Construction Procurement Control explains how general contractors can connect field demand to the decisions, information, approvals, products, materials, services, and commitments required to keep work moving.
>
> **Download the Field Guide →** (stable link)
>
> Construction problems discovered six months from now often already exist today. JiTpro helps you find them while there is still time to act.
>
> JiTpro
> Construction Procurement Control

- Footer: postal or contact line and the consent-appropriate sentence (*pending* Round 3). No unsubscribe link is needed for a purely transactional send, but including a "you received this because you requested the guide at jit-pro.com" line is recommended regardless.
- Plain-text alternative generated from the same content.

### 7.2 Internal notification (*pending* D3.8)

One short email per request to `info@jit-pro.com` (email, placement, source, page, repeat flag), consistent with the contact form. Can be switched off or moved to a daily digest later.

### 7.3 Marketing and nurture

Version 1 sends **only** the fulfilment email. No nurture sequence is built. The `contacts.consent_status` column and the consent sentence shown at capture are what make a future sequence possible without re-permissioning everyone. Round 3 decides the sentence.

---

## 8. Analytics and conversion measurement (proposed)

### 8.1 Event model (names follow the `noun_verb` shape; no convention exists to inherit)

| Event | When | Properties |
|---|---|---|
| `lead_magnet_cta_view` | Placement scrolls into view, once per placement per session | asset, placement, page |
| `lead_magnet_cta_click` | CTA activated | asset, placement, page |
| `lead_magnet_form_view` | Dialog or landing form rendered | asset, placement, page |
| `lead_magnet_form_submit` | Submit pressed with a plausible email | asset, placement, page |
| `lead_magnet_request_success` | Server returned ok | asset, placement, page, email_sent |
| `lead_magnet_download_click` | Download action pressed | asset, placement, page |
| `lead_magnet_request_error` | Server or network failure | asset, placement, error_kind |

`request_success` is redundant with the database row and exists only so the funnel can be read from one place.

### 8.2 Metric definitions

| Metric | Formula |
|---|---|
| CTA conversion | `request_success` ÷ `cta_click`, per placement |
| Form completion | `request_success` ÷ `form_view` |
| Page conversion | `request_success` on page P ÷ page views of P (page views from Cloudflare Web Analytics or GA4) |
| Source conversion | `lead_magnet_requests` grouped by `utm_source`, `utm_medium`, `utm_campaign` |
| Access rate | `download_click` ÷ `request_success` |
| Downstream conversion | contacts with a request row who later appear in `leads` (contact-form submissions), by email |

Do not act on small samples. The first weeks establish a baseline.

---

## 9. Security and abuse

- Server-side validation of everything the client sends: JSON shape, email syntax and length, allowed `asset_id`, allowed `placement`, string length caps on attribution fields, UTM values truncated.
- Honeypot field checked on the server (silently succeeds without storing), matching the investor function.
- Turnstile verified server-side on every request (existing pattern).
- Rate limiting in the function: at most M requests per salted IP hash per 10 minutes (exact M *pending* D5.5). Turnstile and this rate limit are the primary abuse controls; legitimate repeat requesters are never made to wait.
- Repeat handling (DECIDED D2.2): for every valid request the function normalises the email, upserts the single `contacts` row, inserts a new `lead_magnet_requests` row, marks `is_repeat` when that contact already requested the asset, and always grants immediate access. The fulfilment email is re-sent only if the last **successful** fulfilment email to that address is more than **one hour** old; inside the hour the request is recorded with `email_status = skipped_cooldown` and no email is sent. The request is never rejected and no duplicate contact is created.

### 9.1 Salted IP hash: purpose and retention (recommendation, D2.7)

- **Purpose:** rate limiting and abuse investigation only. It is never used for attribution, profiling, or reporting.
- **Where:** a separate `lead_magnet_ip_activity` table (Section 6.3), not on request or contact rows.
- **Salt:** `LEAD_MAGNET_IP_SALT` (secret) combined with the current UTC date, so the same address produces a different hash each day and cannot be correlated across days even inside the table.
- **Retention:** **24 hours.** The rate-limit window is 10 minutes; 24 hours leaves room to look at a burst after the fact. The function deletes rows older than 24 hours on each invocation, so no scheduler is needed and the table cannot grow.
- **Logging:** the raw IP is never written to function logs by this code. (Supabase's own platform request logs are outside this project's control and are covered by Supabase's retention.)
- Secrets stay in Supabase secrets. The browser sees only the anon key and the Turnstile site key, as today.
- Error responses to the browser are generic; detail goes to function logs with a request id.
- No raw IP addresses or user agents in logs beyond what Supabase records by default.
- The PDF is public by design. No tokens, no DRM.

---

## 10. Privacy and compliance (flags, not legal advice)

The following need a decision and, where noted, professional legal review. Nothing here is legal advice.

1. **No privacy policy exists.** Collecting email addresses for marketing purposes without a privacy notice is a gap regardless of jurisdiction. Recommendation: add a short, plain-English privacy notice page in this project and link it from the capture form and the footer (scope addition, D3.7). Content should be reviewed by counsel.
2. **Consent model.** US CAN-SPAM permits opt-out marketing with clear identification and unsubscribe; Canada's CASL and the EU/UK GDPR generally expect opt-in for marketing email. JiTpro's audience is US general contractors. Round 3 decides between transactional-only, notice-based follow-up, and a separate checkbox.
3. **Unsubscribe and suppression.** Not needed for the fulfilment email alone. Required the moment a second, non-requested email is sent. The `contacts` consent and suppression columns exist from day one so that later work is additive.
4. **Turnstile.** Cloudflare Turnstile processes visitor data; Cloudflare's terms expect the site's privacy notice to disclose its use. Include it in the notice.
5. **Data retention.** Decide whether request rows are kept indefinitely (recommended for attribution history) and document it in the notice.
6. **Cookies and storage.** `sessionStorage` for attribution is first-party and session-scoped; no consent banner is implied. Adding GA4 would change that analysis.

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

## 13. Failure modes and the recommended failure matrix (*pending* D5.6)

Operations, in order: (1) validate, (2) record request, (3) send fulfilment email, (4) present access, (5) record analytics.

| Failure | Technically | Visitor sees | Guide access | Retry | Logged | JiTpro notified |
|---|---|---|---|---|---|---|
| Empty or malformed email | Client validation fails; no request sent | Inline field error, focus on field | No | Immediate | No | No |
| Server rejects email format | 400 | Same inline error | No | Immediate | Yes (request id) | No |
| Turnstile fails or expires | 403 | "Verification did not complete. Please try again." with widget reset | No | Immediate | Yes | No |
| Repeat within the one-hour email cooldown | 200 with `email_status: skipped_cooldown` | Success state; "We emailed this guide to that address within the last hour, so we did not send it again." | **Yes** | n/a | Yes | No |
| Rate-limited (IP) | 429 | "Too many requests. Please try again in a few minutes." | No | After window | Yes | Only if sustained (manual log review) |
| Network error or timeout | fetch rejects | "We could not reach the server. Check your connection and try again." Values preserved | No | Button-driven | Client console only | No |
| Lead storage fails | 500 | "Something went wrong on our side. Please try again in a moment." plus a fallback line offering `info@jit-pro.com` | **No** (recommended: do not hand out the guide when nothing was recorded; the visitor can retry and the failure is rare) | Yes | Yes, error level | Yes, via log alerting if available; otherwise internal email on next success is not enough, so add a failure notification email from the function |
| Email send fails, lead stored | 200 with `email_sent: false` | Success state; "Your guide is ready. We could not send the email copy, so please download it now." | **Yes** | Automatic retry once inside the function | Yes, with provider error | Internal notification includes `email_status: failed` |
| Internal notification fails | Swallowed | Nothing | Yes | No | Yes | No |
| PDF route unavailable (bad redirect, missing file) | 404 on click | Browser 404 | No | n/a | CI lychee check prevents merge; production smoke test verifies | Yes, by monitoring the URL |
| Duplicate submission (double click) | Second request in flight | Button disabled while submitting; second request is treated as a repeat server-side | Yes | n/a | Yes | No |
| Visitor closes the dialog mid-submit | Request continues | Nothing; reopening shows the idle form (or success if the response arrived) | Via email | n/a | Yes | No |
| Slow network | Long submitting state | Submitting label persists; after 15 seconds a "still working" line appears; hard timeout at 30 seconds becomes the network error | Depends | Yes | Yes | No |
| JavaScript disabled or errored | Dialog cannot open | The CTA is a real link to `/field-guide`, which renders a normal HTML form (decided D1.1) | Depends | n/a | n/a | No |

The visitor should never be left wondering. Every terminal state says what happened and what to do next.

---

## 14. Testing plan

Testing is built into every sprint, not deferred.

### 14.1 Automated (Vitest, to be added; *pending* D5.8)

- Email validation and normalisation (accepts plausible addresses, rejects malformed, trims, lowercases).
- Attribution parsing from a URL and referrer; truncation; missing values.
- Lead-magnet registry: every client asset id exists server-side; versions agree; public paths and `_redirects` entries agree; the versioned file exists in `public/guides/`.
- Email template rendering: subject, link equals the stable URL, HTML escaping of any interpolated value, plain-text part present.
- Request payload building (client) and request validation (server shared module).
- Rate-limit and repeat-request decision logic (pure functions with injected "recent requests" data).
- Analytics event construction (names and properties).
- `LeadCaptureForm` state machine, if Testing Library is added; otherwise the reducer is extracted and tested as a pure function.

`npm test` is added to `package.json` and to CI before the build step.

### 14.2 Edge function

Deno is not installed locally. Options: install Deno for `deno test` on the function's pure modules, or keep pure logic in `_shared` and test it with Vitest (recommended), with the function itself exercised against the deployed preview using `curl` and the Supabase logs. Decision D5.8.

### 14.3 Browser (Chrome via the Claude in Chrome tools or the gstack browse skill; Playwright headless shells for screenshots)

Desktop: CTA renders; opens dialog; mouse and keyboard; Tab order; Escape; backdrop click; validation; valid submission; submitting state; success; Download opens the PDF; focus returns to the CTA on close; layout matches the design system.

Mobile (360, 390, 430 widths) and tablet (768, 1024): dialog fits; keyboard does not hide the field; success and Download visible; no horizontal overflow; no clipped text.

Accessibility: labels, keyboard, visible focus, focus trap, Escape, error announcement, button names, ARIA minimalism, contrast, non-colour error cues. Reduced motion verified with `--force-prefers-reduced-motion` (see memory note on tooling).

Failure paths: empty email; malformed email; server 500 (point the client at a failing function or intercept the request); Turnstile failure; repeat submission; slow network throttling; missing PDF; unexpected response body.

### 14.4 Email

Send real test messages to test addresses only. Verify sender name and address, reply-to, subject, preheader, body copy, link target, logo, mobile and desktop rendering (Gmail web, iOS Mail at minimum), plain-text part, duplicate-send throttle, failure logging. Never send development emails to real leads: development uses a `+test` address owned by JiTpro, and the function refuses to send when `LEAD_MAGNET_TEST_MODE` restricts recipients (*pending* D3.x).

### 14.5 Production smoke test

Listed in Section 15.

---

## 15. Deployment plan

1. Merge order matters. Database migrations and the edge function must be live **before** the frontend PR that calls them is merged.
2. **Preview:** open the PR; Cloudflare builds a preview. Verify the CTA, dialog, stable route redirect, headers, and (if the Turnstile hostname allowlist is extended) a real submission. If Turnstile cannot run on preview, verify everything except the final submit there and verify submit in production immediately after merge with a test address.
3. **Backend release:** `supabase db push` (migrations), `supabase functions deploy submit-lead-magnet-request`, set any new secrets, confirm with a `curl` against production using a test email.
4. **Merge:** squash merge once `build-and-test` passes and review threads are resolved. Ask Jeff before the final merge.
5. **Production verification (smoke test):** production CTA renders; dialog opens; test submission succeeds; `contacts` and `lead_magnet_requests` rows exist with attribution; email arrives; email link opens the correct PDF version; inline Download works; analytics events appear; contact form, navigation, homepage, and Learn More still work.
6. **Rollback:** revert the PR on GitHub. The edge function and tables can stay deployed harmlessly; the CTA simply disappears. If the function itself misbehaves, redeploy the previous version or disable the CTA.
7. Record the result in Section 22.

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
| `LEAD_MAGNET_IP_SALT` | Salt for IP hashing | Edge function | **New** | Supabase |
| `LEAD_MAGNET_NOTIFY_TO` | Internal notification recipient | Edge function | **New**, optional (default `info@jit-pro.com`) | Supabase |
| `LEAD_MAGNET_TEST_MODE` | Restrict outbound email to JiTpro-owned addresses during testing | Edge function | **New**, optional | Supabase, set only while testing |

No secrets in source. New secrets are set with `supabase secrets set` and listed here when added. Production readiness is not claimed until this table is verified against the dashboards.

---

## 17. PDF versioning

- Asset id: `procurement-field-guide` (stable forever).
- Version label: date-based, for example `2026-09`, stored in the registry and on every request row.
- Filename: `public/guides/jitpro-field-guide-six-months-<version>.pdf` (proposed; *pending* D5.1). Previous versions may remain in the folder so old email links that somehow captured a versioned path still work; the stable path always points at the current one.
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
| G-4 | Extend the Turnstile widget's allowed hostnames to Cloudflare preview URLs? | Yes / No | **Yes**: enables end-to-end testing on PR previews, which CONTRIBUTING notes is impossible today. Cloudflare dashboard change; no code. | RECOMMENDED | 2026-09-12 | Jeff or an admin performs it. |
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
| D2.7 | Retention and handling of the salted IP hash | Column on request rows with scheduled clearing / separate short-lived table / no IP data at all | **Separate `lead_magnet_ip_activity` table, 24-hour retention, daily-rotating salt, deleted opportunistically by the function** (Section 9.1). Meets "abuse control only, never profile data" without a scheduler. | RECOMMENDED (documented per Jeff's instruction; approve with Round 3 or Round 5) | 2026-09-12 | |

### Round 3: Email and consent

| ID | Question | Options | Recommendation | Decision | Date | Notes |
|---|---|---|---|---|---|---|
| D3.1 | Provider | Resend (existing) | Resend | RECOMMENDED | 2026-09-12 | Confirm domain verification in the Resend dashboard. |
| D3.2 | From name/address and reply-to | `info@` vs `jeff@` vs `noreply@mail.` | From `JiTpro <info@jit-pro.com>`; reply-to recommendation in Round 3 | **From DECIDED (Round 2): `JiTpro <info@jit-pro.com>`.** Visitor-facing replies stay associated with `info@jit-pro.com`. **`jeff@jit-pro.com` is never exposed** by this workflow. Reply-To behaviour: OPEN, recommendation presented in Round 3 after verifying the existing Resend and DNS configuration. | 2026-09-12 | Jeff Kaufman. Do not change email or domain configuration until Round 3 is decided. |
| D3.3 | Fulfilment copy | Section 7.1 draft | Approve or edit in Round 3/6 | OPEN | | |
| D3.4 | Consent sentence at capture | (a) "We'll email you the guide. Nothing else." (b) "We'll email you the guide and occasional notes on keeping projects ahead of the field. Unsubscribe any time." (c) Separate unchecked marketing checkbox | **(b)** for a US audience under CAN-SPAM, with an unsubscribe mechanism required before any second email is sent; store the sentence version. Legal review recommended. | RECOMMENDED | 2026-09-12 | Not legal advice. |
| D3.5 | Nurture enrollment in V1 | Yes / No | **No.** Fulfilment only. Architecture supports it later. | RECOMMENDED | 2026-09-12 | |
| D3.6 | Unsubscribe and suppression | | Not needed for V1's single transactional email; columns exist; a Resend unsubscribe link or Broadcasts audience is the likely V2 mechanism | RECOMMENDED | 2026-09-12 | |
| D3.7 | Add a privacy notice page to scope? | Yes / No | **Yes.** A short `/privacy` page linked from the form and footer. Counsel review recommended. | RECOMMENDED | 2026-09-12 | Scope addition; needs Jeff's approval. |
| D3.8 | Internal notification per request | Per request / daily digest / none | Per request to `info@jit-pro.com` in V1 | RECOMMENDED | 2026-09-12 | |

### Round 4: Analytics

| ID | Question | Options | Recommendation | Decision | Date | Notes |
|---|---|---|---|---|---|---|
| D4.1 | Tooling | (a) First-party events in Supabase plus Cloudflare Web Analytics for page views. (b) GA4. (c) Plausible or similar paid tool. | **(a)**. No third-party script, no consent-banner question, data in the same database as the leads, sufficient for the six questions in Section 8. GA4 if Jeff wants standard marketing dashboards. | RECOMMENDED | 2026-09-12 | |
| D4.2 | Event set | Section 8.1 | As listed | RECOMMENDED | 2026-09-12 | |
| D4.3 | Conversion definitions | Section 8.2 | As listed | RECOMMENDED | 2026-09-12 | |
| D4.4 | Attribution persistence | Per page vs session vs 30-day cookie | `sessionStorage` (session-scoped, first-touch within the visit) | RECOMMENDED | 2026-09-12 | |
| D4.5 | Reporting | SQL in Supabase vs an admin page | Saved SQL queries in Supabase for V1; a small internal page later if needed | RECOMMENDED | 2026-09-12 | |

### Round 5: Technical and security behaviour

| ID | Question | Options | Recommendation | Decision | Date | Notes |
|---|---|---|---|---|---|---|
| D5.1 | PDF hosting | `public/guides/` on Cloudflare Pages vs Supabase Storage | `public/guides/`, versioned filename | RECOMMENDED | 2026-09-12 | |
| D5.2 | Stable route | `/guides/procurement` via `_redirects` 302 vs a React page | `_redirects` 302 (no JS, works in email clients) | RECOMMENDED | 2026-09-12 | Verify redirect precedence over the SPA catch-all on a preview. |
| D5.3 | Repeat requests | | Always show the download; re-send email only if the last send is older than 24 hours | RECOMMENDED | 2026-09-12 | |
| D5.4 | Bot protection | Turnstile visible / Turnstile interaction-only / honeypot only | Honeypot (server-checked) plus Turnstile `interaction-only` plus server validation | RECOMMENDED | 2026-09-12 | |
| D5.5 | Rate limiting | | 5 requests per IP hash per 10 minutes; email throttle per D5.3 | RECOMMENDED | 2026-09-12 | |
| D5.6 | Failure behaviour | Section 13 matrix | Approve the matrix; key call: email fails → still grant access and say so; storage fails → do not grant, offer retry | RECOMMENDED | 2026-09-12 | |
| D5.7 | Logging and monitoring | | Request-id logs in the function; a failure-notification email from the function on storage errors; Pulsetic monitor on the stable guide URL | RECOMMENDED | 2026-09-12 | |
| D5.8 | Test framework | Vitest / none / Deno test | **Add Vitest** (Vite-native, tiny) with `npm test` in CI; pure server logic tested via `_shared` modules | RECOMMENDED | 2026-09-12 | The brief allows a new framework when the project lacks the capability. |
| D5.9 | Server platform | Supabase Edge Function vs Cloudflare Pages Function | Supabase Edge Function | RECOMMENDED | 2026-09-12 | |
| D5.10 | SEO and indexing | Index the PDF / noindex the PDF / noindex everything | `noindex` the PDF and its redirect; index the landing route (it is the capture experience) | RECOMMENDED | 2026-09-12 | |

### Round 6: Final UX, content, and Design System amendments

| ID | Question | Recommendation | Decision | Date | Notes |
|---|---|---|---|---|---|
| D6.1 | All visitor-facing copy (CTA, dialog, states, email) | Presented together before implementation | OPEN | | |
| D6.2 | §28 Modals: define the marketing capture dialog (anatomy, size, scrim, close, focus) | Propose: §27.1 card as the panel; scrim `--jp-background` at about 88% as in the lightbox; Close as a labelled quiet control; native `<dialog>` required | OPEN | | Must be approved before coding (§41, §49). |
| D6.3 | §24 Forms: field anatomy for marketing capture | Propose: the contact-form field recipe, label above, error beneath with icon, validation on submit | OPEN | | |
| D6.4 | §33 Error / §32 Loading states for marketing forms | Propose: neutral-token error box with icon and text; submitting = label change and disabled control, no spinner | OPEN | | |
| D6.5 | §34/§36 minimum touch target | Propose 44 by 44 CSS px | OPEN | | Also resolves the 2026-09-03 open TODO. |
| D6.6 | Homepage composition: add the guide band after the final CTA | Needs explicit approval and a Decision Log entry | OPEN | | |

---

## 21. Open questions (require Jeff)

1. Delivery of the approved 31-page PDF file (G-3 is decided; the file itself is still needed before Sprint 1's asset commit).
2. Round 3 decisions (email, consent, unsubscribe, suppression, privacy), including Reply-To, the D2.7 IP-hash retention recommendation, and whether the privacy notice (D3.7) is in scope.
3. Whether GA4 is wanted despite the first-party recommendation (D4.1).
4. Whether a paid or scheduled LinkedIn campaign is planned for launch (affects how much the landing route and UTM discipline matter).
5. Whether Jeff or another admin will perform the Cloudflare dashboard actions (Turnstile hostnames, Web Analytics toggle) and the Supabase deploy steps, or whether the assistant should run the Supabase CLI commands.
6. Whether `info@jit-pro.com` is an actively monitored mailbox (it is a Microsoft 365 address per the domain's MX records), since visitor replies will land there.

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

---

## 22. Sprint plan (DRAFT: to be finalised after decision rounds)

Organised by working capability. Order differs from the brief's draft in one respect: the persistence API is built **before** the visitor UI so that the UI sprint can be verified end to end against the real contract rather than a mock.

### Sprint 0: Discovery and architecture

- **Objective:** existing infrastructure understood; architecture and decisions approved.
- **Scope:** repository discovery, this plan, decision rounds, Design System amendments drafted, backlog.
- **Out of scope:** any production change.
- **Dependencies:** none.
- **Tasks:** discovery (done), plan (done), Rounds 1 to 6, DS amendment proposals, sprint finalisation.
- **Acceptance:** no architectural or product question blocks Sprint 1.
- **Tests:** none.
- **Risks:** decisions drift if not recorded; mitigated by this document.
- **Decision dependencies:** all rounds.
- **Definition of done:** Decision Log has no OPEN items in Rounds 1 to 5; Round 6 copy approved or scheduled.
- **Git:** branch decided (G-1: `feature/navigation-simplification-lead-gen-guide`); plan committed there as a docs-only commit; further decision rounds each land as their own docs commit.

### Sprint 1: Lead-magnet foundation

- **Objective:** the site can represent and serve the Field Guide reliably.
- **Scope:** commit the approved PDF under a versioned name; `_redirects` stable route; `_headers` noindex; client registry `leadMagnets.ts`; server registry in `_shared`; Vitest installed with `npm test` in CI; registry consistency tests; Design System amendments (§28, §24, §32/§33, touch target, §50.5, homepage composition) recorded.
- **Out of scope:** UI, API, email.
- **Dependencies:** the approved 31-page PDF file supplied by Jeff (G-3), D5.1, D5.2, D5.8, D5.10, Round 6 DS approvals.
- **Acceptance:** `/guides/procurement` on a preview 302s to the PDF; lychee passes; `npm test` runs in CI; DS Decision Log updated.
- **Tests:** registry and redirect consistency; file existence.
- **Risks:** Cloudflare redirect precedence vs the SPA catch-all (verify on preview).
- **Git:** 2 to 3 commits: tooling, asset and route, docs.

### Sprint 2: Lead persistence and attribution (API)

- **Objective:** a valid request is safely recorded with approved attribution; abuse controls work.
- **Scope:** migrations for `contacts`, `lead_magnet_requests`, and `lead_magnet_ip_activity`; edge function with validation, honeypot, Turnstile, IP rate limit, contact upsert, repeat detection, one-hour email cooldown decision, logging; shared pure modules; `curl`-level verification against a deployed function. The existing `leads` table and `submit-contact` function are not touched.
- **Out of scope:** email sending, UI, any change to the contact-form pipeline.
- **Dependencies:** Round 2 (decided), D2.7, D5.3 to D5.7, D5.9.
- **Acceptance:** documented `curl` cases (valid, malformed, honeypot, repeat, rate-limited, bad Turnstile) behave per the matrix; rows appear with attribution.
- **Tests:** Vitest on validation, normalisation, attribution parsing, repeat and rate-limit logic; manual function tests.
- **Risks:** Deno not installed locally (tests target `_shared`; function verified deployed); `db push` needs the DB password.
- **Git:** migrations commit; function commit; tests commit.

### Sprint 3: Email fulfilment

- **Objective:** a successful request reliably produces the approved guide email.
- **Scope:** template (HTML and text), stable link, sender config, synchronous send with one retry, status recorded on the row, internal notification, test-mode recipient restriction, failure logging.
- **Out of scope:** nurture, unsubscribe.
- **Dependencies:** Round 3, D6.1 email copy.
- **Acceptance:** real test sends verified per Section 14.4; throttle verified; failure path verified by using an invalid API key on a test deploy.
- **Tests:** template rendering tests; manual delivery checks.
- **Risks:** domain verification; spam placement (SPF/DKIM already set up for existing sends, verify).
- **Git:** template commit; send logic commit.

### Sprint 4: Visitor capture experience

- **Objective:** a visitor can encounter a CTA, enter an email, submit, and get the correct success or error experience.
- **Scope:** `LeadMagnetCTA`, `LeadMagnetDialog` (lazy), `LeadCaptureForm` with all states, `useAttribution`, API client, Turnstile interaction-only, accessibility, responsive behaviour, reduced motion, landing route (if D1.1c).
- **Out of scope:** final placements beyond a single development placement; analytics events (stubbed).
- **Dependencies:** Sprints 1 to 3; Round 1; Round 6 copy and DS approvals.
- **Acceptance:** browser checklist in Section 14.3 passes on desktop, tablet, mobile; failure paths behave per the matrix.
- **Tests:** form reducer tests; browser QA with screenshots; keyboard and screen-reader pass.
- **Risks:** software keyboard covering the field on iOS; dialog styling conventions must exist in the DS first.
- **Git:** components commit; attribution commit; landing route commit; QA fixes.

### Sprint 5: Website integration

- **Objective:** approved CTAs are live on the correct pages.
- **Scope:** homepage band, Learn More band, footer link, privacy notice page (if D3.7), footer legal link.
- **Out of scope:** nav, other pages.
- **Dependencies:** D1.2, D1.7, D6.6, D3.7.
- **Acceptance:** each placement renders and opens the dialog; placement ids recorded correctly; §48.1/§48.7 amber budgets respected; no regression on homepage or Learn More.
- **Tests:** browser QA per placement; regression pass on contact form and navigation.
- **Risks:** homepage composition approval; §50.5 amendment.
- **Git:** one commit per placement.

### Sprint 6: Analytics, QA, and production readiness

- **Objective:** the complete funnel is measurable and production-ready.
- **Scope:** funnel events (D4.1), Cloudflare Web Analytics enablement, saved queries, full regression, accessibility audit, email re-verification, production smoke-test plan, documentation update, PR.
- **Dependencies:** Round 4; all prior sprints.
- **Acceptance:** Section 38 of the brief (functional, visual, accessibility, email, analytics, data, security, regression, CI) all pass.
- **Tests:** everything in Section 14.
- **Risks:** event duplication under React StrictMode in development; verify in the production build.
- **Git:** events commit; QA fixes; docs; PR opened with the Section 15 summary; merge only on Jeff's word.

### Sprint completion records

*(Filled in as sprints close: date, commits, tests run, deviations, unresolved issues.)*

---

## 23. Post-launch measurement plan

- Week 1: verify events and rows daily; no optimisation.
- Weeks 2 to 6: establish a baseline for CTA impressions, clicks, form views, requests, conversion rate by placement and source, download rate, and any contact-form submissions from guide leads.
- Review monthly with the saved queries. Only test changes (placement, wording, fields, modal vs page, follow-up) when the baseline has enough volume to make a difference visible.

---

## 24. Document change history

| Date | Change |
|---|---|
| 2026-09-12 | Created after repository discovery. Current state, proposed architecture, data model, failure matrix, testing and deployment plans, Decision Log opened with recommendations, draft sprint plan. |
| 2026-09-12 | Round 1 decided by Jeff: G-1 (stay on the existing branch), G-2, G-3 (approved asset is the new 31-page PDF, not yet supplied), D1.1 to D1.7 accepted as recommended. Follow-up items F-1 to F-5 recorded in §21.1 as out of scope. |
| 2026-09-12 | Round 2 decided by Jeff: D2.1 two new tables (`contacts`, `lead_magnet_requests`), `leads` untouched; D2.2 one-hour email cooldown; D2.3 attribution set with no user agent and no raw IP; D2.4 no CRM; D2.5 lead vs subscriber; D2.6 no contact-form integration (F-6 added); D2.7 IP-hash retention recommendation documented (§9.1, §6.3). G-5 git identity (repository-local, metadata only). Visitor-facing sender fixed as `JiTpro <info@jit-pro.com>`; `jeff@jit-pro.com` never exposed. Sections 4.4, 4.5, 6, 9, 13 updated. |
