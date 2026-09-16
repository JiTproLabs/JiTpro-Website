-- §8.3 query 6: fulfilment email outcome distribution.
--
-- This is the ONLY place delivery is measured. The funnel (query 4) counts a
-- stored request as a conversion regardless of what happened to the email, so
-- the two never double-count the same fact.
--
--   sent             the guide email went out
--   skipped_cooldown a repeat inside the hour; deliberate, not a failure
--   failed           the provider rejected it or the send errored
--   suppressed       the address is suppressed; we stop sending to it
--   (null)           no send was attempted: a persistence failure, or the
--                    honeypot path, which stores nothing at all
select
  coalesce(email_status, '(no send attempted)') as email_status,
  count(*)                                      as requests,
  round(100.0 * count(*) / nullif(sum(count(*)) over (), 0), 1) as share_pct,
  count(*) filter (where email_provider_id is not null) as with_provider_id,
  count(*) filter (where email_error is not null)       as with_recorded_error
from public.lead_magnet_requests
group by email_status
order by requests desc;
