-- §8.3 query 5: repeat-request rate.
-- A repeat is someone asking for the guide again, which is interest, not an
-- error. It is the reason the one-hour email cooldown exists (D2.2).
select
  count(*)                                                        as requests,
  count(distinct contact_id)                                      as distinct_contacts,
  count(*) filter (where is_repeat)                               as repeat_requests,
  round(100.0 * count(*) filter (where is_repeat)
        / nullif(count(*), 0), 1)                                 as repeat_rate_pct,
  round(count(*)::numeric / nullif(count(distinct contact_id), 0), 2)
                                                                  as requests_per_contact
from public.lead_magnet_requests;
