# Saved reporting queries

The eight queries of lead-gen plan §8.3, versioned here so the numbers Jeff
reviews each month come from one agreed definition rather than from whatever
was typed into the SQL editor that day.

**Read-only.** Every file is a `select`. None writes, and none is applied as a
migration.

**Where the numbers come from.** `lead_magnet_requests` and `contacts` are the
system of record for leads, attribution, consent and fulfilment outcomes.
`lead_magnet_events` holds anonymous funnel counts only. Page views, visits,
referrers, countries, devices and Core Web Vitals come from the Cloudflare Web
Analytics dashboard, not from here; Cloudflare keeps unsampled data for 7 days
and aggregates for six months, so the monthly review records the page-view
denominators in its notes (§8.3).

**One definition of conversion (§8.1).** `lead_magnet_request_success` means
the lead was stored and access was granted. It does **not** mean the email was
delivered. Delivery is a separate question, answered by query 6 from
`lead_magnet_requests.email_status`, so the same fact is never counted twice in
two places where the two could disagree.

Run one with:

```
npx supabase db query --linked --project-ref pynjyrvnokfexyudimsn -f supabase/queries/<file>.sql
```
