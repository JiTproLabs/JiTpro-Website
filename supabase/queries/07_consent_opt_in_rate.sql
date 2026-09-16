-- §8.3 query 7: marketing consent opt-in rate.
--
-- Requesting the guide is NOT marketing consent (D3.4). The checkbox is
-- separate, optional and unchecked by default, so this measures how many
-- people deliberately ticked it.
--
-- consent_status on the contact is the durable answer:
--   transactional_only  the default; the guide and asset-related mail only
--   marketing_opt_in    the box was ticked
--   unsubscribed        withdrawn; never overwritten by a later unticked request
select
  c.consent_status,
  c.consent_text_version,
  count(*)                                                     as contacts,
  round(100.0 * count(*) / nullif(sum(count(*)) over (), 0), 1) as share_pct,
  min(c.first_seen_at)                                         as earliest,
  max(c.last_seen_at)                                          as latest
from public.contacts c
group by c.consent_status, c.consent_text_version
order by contacts desc;
