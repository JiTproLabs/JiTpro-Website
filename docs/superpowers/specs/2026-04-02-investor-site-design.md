# Investor Sub-Site Design Spec

## Overview

A gated, dark-themed investor sub-site for JiTpro, accessible via a "For Investors" link in the main site footer. The sub-site contains 7 pages presenting JiTpro's market thesis, product category, economic case, and supporting data to conservative, high-net-worth investors and family-office capital.

Access is controlled by a request-and-approve flow: visitors request access via a form, the JiTpro team approves via email, and approved investors receive a magic link that persists access in the browser.

---

## 1. Access Control System

### 1.1 User Flow

1. Visitor clicks "For Investors" in the main site footer
2. Navigates to `/investor` — sees access request form (no valid token in localStorage)
3. Form fields: name, email, company, investment interest (optional textarea)
4. Bot protection: honeypot hidden field + Cloudflare Turnstile invisible challenge
5. On submit → thank-you message: "Thank you for your interest in investing in JiTpro. Please check your email for your access link."
6. After 30 seconds → auto-redirect to homepage (`/`)

### 1.2 Approval Flow

1. Form submission triggers Supabase edge function `submit-investor-request`
2. Edge function validates Turnstile token server-side, rejects if honeypot filled
3. Stores request in `investor_access` table with status `pending`
4. Sends email to `info@jit-pro.com` via Resend with request details + "Approve" button
5. "Approve" button links to edge function `approve-investor` with the request ID and an admin password query param for authorization
6. `approve-investor` verifies admin password, generates a UUID access token, sets status to `approved`, sets `approved_at`
7. Sends email to the investor via Resend with their access link: `https://jit-pro.com/JiTpro-Website/investor?token={access_token}`
8. Returns an HTML page (not JSON) confirming: "Access granted to [name] at [email]" — so you see confirmation in the browser after clicking Approve

### 1.3 Token Verification & Persistence

1. When `/investor?token=abc123` is visited, the React app calls `verify-investor-token` edge function
2. If valid → token is stored in `localStorage` key `jitpro_investor_token`, page content loads
3. On subsequent visits to any `/investor/*` route, the app reads the token from localStorage and verifies it against the backend
4. If token is invalid/revoked → localStorage is cleared, user sees the access request form
5. Token verification happens once per session (on first `/investor/*` page load), not on every navigation between investor pages

### 1.4 Revocation

1. Admin visits `/admin` (password-protected — see section 3)
2. Admin clicks "Revoke" next to an approved investor
3. Calls `revoke-investor` edge function → sets status to `revoked`, sets `revoked_at`, nullifies token
4. Next time the investor visits, token verification fails → they see the request form

### 1.5 Data Model

**Table: `investor_access`**

| Column              | Type        | Notes                                      |
|---------------------|-------------|---------------------------------------------|
| id                  | uuid (PK)   | Auto-generated                              |
| name                | text        | Required                                    |
| email               | text        | Required                                    |
| company             | text        | Required                                    |
| investment_interest | text        | Optional                                    |
| status              | text        | `pending`, `approved`, `revoked`            |
| access_token        | uuid        | Unique, nullable — generated on approval    |
| created_at          | timestamptz | Auto-set                                    |
| approved_at         | timestamptz | Set on approval                             |
| revoked_at          | timestamptz | Set on revocation                           |

### 1.6 Supabase Edge Functions

1. **`submit-investor-request`** — validates form + Turnstile, checks honeypot, stores in DB, emails `info@jit-pro.com`
2. **`approve-investor`** — takes request ID, generates token, updates status, emails investor with access link
3. **`verify-investor-token`** — takes token, returns `{ valid: true/false, name, email }`
4. **`revoke-investor`** — takes request ID, deactivates token, updates status
5. **`list-investor-requests`** — returns all requests (password-protected for admin)

### 1.7 Bot Protection

- **Honeypot:** Hidden form field (`website` or similar), visually hidden via CSS. If filled → edge function silently returns success (no error message to tip off bots) but does not store the request
- **Cloudflare Turnstile:** Invisible challenge widget embedded in the form. Turnstile site key stored in env var `VITE_TURNSTILE_SITE_KEY`. Secret key stored in Supabase edge function env as `TURNSTILE_SECRET_KEY`. Edge function validates the token via Cloudflare's `/siteverify` endpoint before processing

---

## 2. Investor Sub-Site Pages

### 2.1 Routing

All investor pages live under `/investor/`:

| Route                  | Page                         |
|------------------------|------------------------------|
| `/investor`            | Request form OR Homepage     |
| `/investor/market`     | Market Opportunity           |
| `/investor/hidden-cost`| Hidden Cost of Early Ambiguity|
| `/investor/why-now`    | Why Now                      |
| `/investor/product`    | Product / Category           |
| `/investor/economics`  | Economic Case                |
| `/investor/appendix`   | Investor Appendix            |

### 2.2 Shared Layout

**Investor Navigation Bar** (distinct from main site nav):
- Dark background (`slate-900`)
- JiTpro amber logo (`public/assets/logo/JiTpro_Amber.svg`)
- Nav links: Home, Market, Hidden Cost, Why Now, Product, Economics, Appendix
- Mobile: hamburger menu
- Does NOT show the main site navigation — completely separate chrome

**Investor Footer** (shared across all investor pages):
- "Create Investor Account" CTA section — present on every page
  - For now: a teaser card with heading "Investor Dashboard — Coming Soon" and an email interest form (just email field + submit) or a simple "Notify me when the dashboard launches" button
  - This stores interest in a future `investor_dashboard_interest` table or appends a flag to the existing `investor_access` record
- Link back to main JiTpro site
- JiTpro logo + copyright

### 2.3 Design Direction

**Theme:** Dark, premium, institutional
- **Backgrounds:** `slate-950` (page), `slate-900` (sections), `slate-800` (cards)
- **Text:** `slate-100` (headings), `slate-300` (body), `slate-400` (secondary)
- **Accent:** `amber-500` (`rgb(245, 158, 11)`) for highlights, active states, CTAs, stat values, chart accents
- **Borders:** `slate-700`
- **Typography:** Restrained, strong hierarchy. Large headings, comfortable body text width (max ~65ch). Generous whitespace.
- **Motion:** Subtle only — fade-in on scroll for sections, gentle count-up on stat cards. No bouncing, no parallax, no blobs.
- **Charts:** Rendered from local structured data. Muted color palette with amber accent. Clean grid lines on dark backgrounds.

### 2.4 Page Content

Content follows the user-provided investor prompt exactly. Pages are:

1. **Homepage** — stat-led overview: hero with headline options, proof band (stat cards), core thesis, "Why JiTpro exists" left/right comparison, "Where JiTpro sits" positioning map, charts preview, investor CTA
2. **Market Opportunity** — TAM/SAM framing, segment fragmentation, growth-stage GC profile, market size bars, fragmentation pyramid
3. **Hidden Cost of Early Ambiguity** — economics of incomplete design clarity, rework costs, margin fragility, delay economics, RFI density. Visuals: margin leakage funnel, cost-of-delay explainer, ambiguity-to-compression timeline
4. **Why Now** — supply chain volatility, labor constraints, rising complexity, owner expectations, spreadsheet failure at scale. Visuals: lead-time chart, labor card, complexity stack, manual workflow risk
5. **Product / Category** — what JiTpro is/isn't, how it works, procurement control, weekly rhythm, system not point fix. Visuals: pre-mobilization workflow, constraint ownership map, decision-to-install diagram
6. **Economic Case** — margin sensitivity, delay avoidance ROI, pricing logic, illustrative $10M project model with sober ranges (labeled as illustrative). No aggressive ROI claims.
7. **Investor Appendix** — full stat library with source labels, verification status (verified/provisional/derived), notes, caveats, glossary. Clean, institutional presentation.

### 2.5 Content Architecture

All content lives in structured data files, not hardcoded inline:

```
src/content/
  investorStats.ts      — all stats with: value, label, sourceShortName, confidenceLevel, verificationStatus, footnoteKey
  investorCopy.ts       — page copy organized by page/section
  appendixSources.ts    — full source entries with verification fields
```

**Stat data structure:**
```typescript
interface InvestorStat {
  id: string;
  value: string;
  label: string;
  sourceShortName: string;
  confidenceLevel: 'high' | 'medium' | 'low';
  verificationStatus: 'verified' | 'provisional' | 'derived';
  footnoteKey: string;
  note?: string;
}
```

Stats marked as provisional/derived are labeled as such in the appendix and carry footnote markers when displayed in stat cards.

### 2.6 Reusable Components

Built for the investor sub-site:

- `InvestorStatCard` — displays a stat with value, label, footnote marker, verification badge
- `InvestorSectionHeader` — heading + subtitle with consistent spacing
- `InvestorChartWrapper` — container for chart components with title, source citation
- `CitationBadge` — small inline badge showing source + verification status
- `AppendixTable` — filterable table for the appendix page
- `CalloutPanel` — highlighted insight/quote block
- `InvestorNav` — dark navigation bar with amber logo
- `InvestorFooter` — shared footer with dashboard CTA
- `InvestorLayout` — wraps all investor pages with nav, footer, token verification
- `AccessRequestForm` — the gated entry form with Turnstile + honeypot

### 2.7 Charts

Built with a lightweight charting approach (CSS-based or a library like Recharts if already in the project, otherwise simple SVG/CSS):

1. Market size comparison (bar chart)
2. Fragmentation pyramid (layered visual)
3. Margin leakage funnel (funnel diagram)
4. Lead-time volatility (line/area chart)
5. Pre-mobilization risk timeline (horizontal timeline)
6. Spreadsheet vs structured control comparison (side-by-side)

All charts render from data in `investorStats.ts`. Amber accent color on dark backgrounds.

### 2.8 Writing Style

- Calm, exact, authoritative
- No marketing fluff, no buzzwords ("disrupt," "revolutionary," "game-changing," "10x," "massive opportunity")
- Sentence-driven, not slogan-heavy
- Every claim should feel like it could survive scrutiny from a skeptical investor
- Private capital briefing tone, not pitch deck

---

## 3. Admin Panel

### 3.1 Access

- Route: `/admin`
- Protected by a single password (stored as env var `VITE_ADMIN_PASSWORD` for client-side check, and `ADMIN_PASSWORD` in Supabase edge function env for API-level protection)
- Simple password input → stores auth state in sessionStorage (cleared on browser close)
- Not visible in any navigation — accessed by direct URL only

### 3.2 Features

- **Pending Requests tab:** list of pending investor requests with Approve/Deny buttons
- **Approved Investors tab:** list of approved investors with Revoke button
- **Revoked tab:** list of revoked investors (read-only history)

Each row shows: name, email, company, investment interest, date requested, date approved/revoked

### 3.3 Design

- Uses the same dark theme as the investor sub-site
- Simple, functional layout — not heavily styled

---

## 4. Main Site Changes

### 4.1 Footer Update

Add a "For Investors" link to the existing main site footer. Placement: in its own small section or as an additional link in an existing column. Subtle, not prominent — matches the exclusive positioning.

### 4.2 No Navigation Changes

The main site navigation bar is not modified. The investor link lives only in the footer.

---

## 5. Environment Variables

### Frontend (Vite)
- `VITE_TURNSTILE_SITE_KEY` — Cloudflare Turnstile site key
- `VITE_ADMIN_PASSWORD` — admin panel password (for client-side gate)

### Supabase Edge Functions
- `RESEND_API_KEY` — already exists
- `SUPABASE_URL` — already exists
- `SUPABASE_SERVICE_ROLE_KEY` — already exists
- `TURNSTILE_SECRET_KEY` — Cloudflare Turnstile secret key
- `ADMIN_PASSWORD` — admin panel password (for API-level verification)

---

## 6. Future Dashboard Hook

Every investor page includes a shared "Investor Dashboard — Coming Soon" section in the investor footer. For now, this is a visual placeholder with an optional "Notify me" email capture. The `investor_access` table's `email` field provides the future link point when proper auth accounts are built for the dashboard.

---

## 7. Out of Scope

- Investor dashboard (future)
- Multi-user admin (single password is sufficient)
- OAuth/social login for investors
- Real-time analytics on investor page views
- PDF export of investor materials
