# Lead-magnet integration tests

`submit-request-curl-tests.sh` exercises the deployed `submit-lead-magnet-request` Edge Function from the command line. It is the Sprint 2 `curl` matrix in the lead-gen plan (`docs/superpowers/plans/2026-09-12-procurement-guide-lead-gen-plan.md`, §14.2, §15.2, Sprint 2).

The website has **one** Supabase project, `jitpro_website` (plan decision G-8). These tests therefore run against the live website project, and every safeguard below exists to keep them from touching real prospects or existing website data.

## Before running (each step needs Jeff's approval)

1. `submit-lead-magnet-request` is deployed to `jitpro_website`.
2. These secrets are set on `jitpro_website`:
   - `LEAD_MAGNET_TEST_MODE=true` (refuses recipients outside `@resend.dev` and `@jit-pro.com`, before anything is stored)
   - `LEAD_MAGNET_TURNSTILE_TEST_SECRET` = Cloudflare's always-pass test secret, so the script can use Cloudflare's dummy token. Honoured only while test mode is on; the shared `TURNSTILE_SECRET_KEY` is never changed.
   - `LEAD_MAGNET_TEST_FAULT_SECRET` = a random value of at least 32 characters. The simulated persistence failure needs test mode, the fault header, **and** this value.
   - `LEAD_MAGNET_IP_SALT` = a random value.
3. No earlier run from the same network in the last 10 minutes (the rate-limit case counts attempts per address).

## Running

```bash
LEAD_MAGNET_FUNCTION_URL=https://pynjyrvnokfexyudimsn.supabase.co/functions/v1/submit-lead-magnet-request \
SUPABASE_ANON_KEY=<the site's VITE_SUPABASE_ANON_KEY> \
LEAD_MAGNET_TEST_FAULT_SECRET=<the value set on jitpro_website> \
scripts/lead-magnet/submit-request-curl-tests.sh <run-id>
```

`<run-id>` is 3 to 32 lowercase letters, digits, or hyphens and must be new for every run (for example `20260916a`). The script refuses any other function URL, prints `PASS` or `FAIL` per case, and exits non-zero on any failure. Never print or commit the fault secret.

## Cases

| # | Case | Expected |
|---|---|---|
| 01 | New contact A, checkbox unchecked | 200, `stored:true`, `email_status:null`, guide URL |
| 02 | Contact A again, unchecked | 200, `stored:true` |
| 03 | Contact A again, checked | 200, `stored:true`; A becomes `marketing_opt_in` |
| 04 | New contact B, checked | 200, `stored:true` |
| 05 | Invalid email | 400 `invalid_email`, no guide URL |
| 06 | Unknown asset | 400 `invalid_request`, no guide URL |
| 07 | Unknown placement | 400 `invalid_request`, guide URL |
| 08 | Unknown consent text version | 400 `invalid_request` |
| 09 | Body is not JSON | 400 `invalid_request` |
| 10 | Honeypot filled (C) | 200 ordinary-looking success; nothing stored |
| 11 | Turnstile token missing (D) | 403 `verification_failed`, guide URL; nothing stored |
| 12 | `lm-test-<run-id>@example.com` | 403 `test_mode_refused`, guide URL; nothing stored |
| 13 | Fault header without secret (E) | 200, `stored:true` (hook not activated) |
| 14 | Fault header with wrong secret (F) | 200, `stored:true` (hook not activated) |
| 15 | Fault header with correct secret (G) | 200, `stored:false`, guide URL; recovery alert emailed to info@jit-pro.com |
| 16 | Preflight from `https://jit-pro.com` | 204, origin echoed |
| 17 | Preflight from `https://evil.example` | 403, no `Access-Control-Allow-Origin` |
| 18 | `GET` | 405 |
| 19 | Contact H four times | 200, 200, 200, then 429 `rate_limited` with guide URL |

## Rows one run creates

Addresses are `delivered+lm-test-<run-id>-<letter>@resend.dev`. Every request row has `utm_source=lm-test-script`, `utm_medium=cli`, `utm_campaign=lm-test`, `utm_content=<run-id>`, `placement=landing-page`, `page_path=/field-guide`, `landing_path=/field-guide`, `referrer=https://www.linkedin.com/feed/` (query strings and fragments stripped), `asset_id=procurement-field-guide`, `asset_version=2026-09`, `consent_text_version=v1`, `consent_method=checkbox`, `turnstile_passed=true`, `fulfilment_status=delivered_inline`, `email_status=null`.

| Table | Rows |
|---|---|
| `contacts` | **5**: A (`marketing_opt_in` after case 03), B (`marketing_opt_in`), E, F, H (`transactional_only`) |
| `lead_magnet_requests` | **9**: A ×3 (`is_repeat` false, true, true; checkbox false, false, true), B ×1, E ×1, F ×1, H ×3 (`is_repeat` false, true, true) |
| `lead_magnet_ip_activity` | **11** `request` rows sharing one salted hash (cases 01-04, 13-15, and the four case-19 attempts); removed automatically by the function's 24-hour retention |

Nothing is stored for C, D, G, the `example.com` address, or cases 05-09. The only email sent is one recovery alert to info@jit-pro.com naming G's address.

## Read-only verification

```sql
select email, consent_status, marketing_opt_in_at is not null as opted_in, first_source, first_campaign, first_landing_path, first_referrer
from public.contacts
where email like 'delivered+lm-test-<run-id>-%@resend.dev'
order by email;

select email, is_repeat, marketing_opt_in_checked, placement, page_path, landing_path, referrer, utm_content, email_status
from public.lead_magnet_requests
where utm_campaign = 'lm-test' and utm_content = '<run-id>'
order by created_at;

select activity_kind, count(*)
from public.lead_magnet_ip_activity
where created_at > now() - interval '1 hour'
group by activity_kind;
```

## Cleanup (never automatic)

Test rows are removed only after Jeff approves the exact statements (plan decision S2-9). Never `TRUNCATE`. `lead_magnet_ip_activity` rows are not deleted by hand; they expire through the function's 24-hour retention.
