# Investor Invite System — Implementation Handoff

**Date:** 2026-04-13
**Status:** Designed, not yet implemented
**Priority:** Next up

---

## Context

The investor section at `/investor/*` is gated. Currently, the only way in is:

1. User visits the site and submits an access request form
2. Admin (Jeff) receives email notification and manually approves
3. System generates a magic link token and emails it to the investor

**Problem:** There is no way to proactively invite someone who hasn't visited the site yet.

**Goal:** Add an invite flow so Jeff can enter an email and send access directly — skipping the request form.

---

## Current System (How It Works Today)

### Flow

```
User submits AccessRequestForm
  → submit-investor-request (edge function)
  → Inserts row into investor_access (status='pending')
  → Emails admin with approve link

Admin clicks approve (or uses /admin dashboard)
  → approve-investor (edge function)
  → Generates UUID access_token, sets status='approved'
  → Emails investor with magic link: /investor?token=[UUID]

Investor clicks magic link
  → InvestorLayout.tsx extracts token from URL
  → verify-investor-token (edge function) checks DB
  → Valid → stores token in localStorage, renders investor pages
  → Invalid → shows access request form
```

### Database Table: `investor_access`

```
id                  uuid (PK)
name                text
email               text
company             text
investment_interest text (nullable)
status              text ('pending' | 'approved' | 'revoked')
access_token        uuid (unique, nullable)
created_at          timestamptz
approved_at         timestamptz (nullable)
revoked_at          timestamptz (nullable)
```

### Key Files

| File | Role |
|------|------|
| `src/components/investor/InvestorLayout.tsx` | Gate — checks token on every page load |
| `src/components/investor/AccessRequestForm.tsx` | Request form UI |
| `src/pages/Admin.tsx` | Admin dashboard (password-protected) |
| `src/pages/AdminApproved.tsx` | Post-approval confirmation |
| `supabase/functions/submit-investor-request/index.ts` | Accept requests, notify admin |
| `supabase/functions/approve-investor/index.ts` | Generate token, email investor |
| `supabase/functions/verify-investor-token/index.ts` | Validate token on each visit |
| `supabase/functions/revoke-investor/index.ts` | Invalidate access |
| `supabase/functions/list-investor-requests/index.ts` | Feed admin dashboard |
| `supabase/migrations/20260402000000_create_investor_access_table.sql` | Table schema |

### Auth Model

- No Supabase Auth (no user accounts/passwords)
- Custom UUID tokens stored in `investor_access.access_token`
- Frontend stores token in `localStorage` (`jitpro_investor_token`)
- RLS enabled but edge functions use `SERVICE_ROLE_KEY` to bypass
- Admin auth is a single shared password in edge function secrets (`ADMIN_PASSWORD`)

---

## Proposed Invite System

### What to Build

Allow Jeff to enter a name + email in the admin dashboard and send a magic link directly — creating an approved record in one step.

### Backend Changes

#### 1. New Edge Function: `invite-investor`

- **Method:** POST
- **Auth:** Admin password in request body
- **Input:** `{ name, email, company?, password }`
- **Logic:**
  - Validate admin password
  - Check for existing record with same email (avoid duplicates — if already approved, return the existing record; if pending, upgrade to approved)
  - Insert new row into `investor_access` with `status='approved'`, `source='invite'`, `approved_at=now()`
  - Generate `access_token` via `crypto.randomUUID()`
  - Send magic link email via Resend (same template as approve-investor)
- **Response:** `{ success: true, id, email }`
- **~60 lines**, closely mirrors `approve-investor`

#### 2. New Migration: Add Columns

```sql
ALTER TABLE investor_access
  ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'request',
  ADD COLUMN IF NOT EXISTS last_accessed_at TIMESTAMPTZ;
```

- `source`: `'request'` (default, existing flow) or `'invite'` (new flow)
- `last_accessed_at`: timestamp of last successful token verification

#### 3. Update `verify-investor-token`

Add ~3 lines to update `last_accessed_at` on successful verification:

```ts
// After confirming token is valid:
await supabase
  .from('investor_access')
  .update({ last_accessed_at: new Date().toISOString() })
  .eq('access_token', token);
```

### Frontend Changes

#### 1. Add "Invite" Tab to `/admin` Page

- New tab alongside existing Pending / Approved / Revoked tabs
- Simple form: Name, Email, Company (optional)
- Calls `invite-investor` edge function
- Shows success/error feedback
- ~80 lines of form UI, same styling as existing admin components

#### 2. Show Source + Last Access in Admin Dashboard

- In the Approved tab, show:
  - Source badge: "Requested" vs "Invited"
  - Last accessed date (or "Not yet" if null)
- Minor column additions to existing table UI

#### 3. No Changes to Investor Pages

- `InvestorLayout.tsx` — unchanged (already handles magic link tokens)
- `AccessRequestForm.tsx` — unchanged (existing flow preserved)
- All investor content pages — unchanged

### Complete Invite Flow

```
Jeff opens /admin → clicks "Invite" tab
  → Enters: name, email
  → Clicks "Send Invite"

invite-investor edge function
  → Validates admin password
  → Creates investor_access row (status='approved', source='invite')
  → Generates UUID access_token
  → Sends magic link email via Resend

Investor receives email
  → Clicks "Access Investor Briefing" link
  → /investor?token=[UUID]

InvestorLayout.tsx
  → Extracts token from URL
  → verify-investor-token confirms valid
  → Updates last_accessed_at
  → Stores token in localStorage
  → Investor has full access
```

---

## Implementation Order

1. Run migration (add `source` + `last_accessed_at` columns)
2. Create `invite-investor` edge function
3. Update `verify-investor-token` to set `last_accessed_at`
4. Add Invite tab to `Admin.tsx`
5. Update Approved tab to show source + last access columns
6. Test end-to-end

---

## Constraints

- Do not break existing request → approve flow
- No new dependencies
- No Supabase Auth — keep using custom token model
- Reuse existing `investor_access` table
- Reuse existing Resend email integration
- Keep it simple, secure, production-ready

---

## Known Gaps in Current System (Not Blocking, But Worth Noting)

- Tokens never expire (consider adding `expires_at` later)
- Admin password travels in URL query params on approve links
- No rate limiting on request submissions
- No duplicate email detection on requests
- `AccessRequest.tsx` page is an empty stub (unused)
