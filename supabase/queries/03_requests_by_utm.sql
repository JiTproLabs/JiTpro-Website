-- §8.3 query 3: requests by UTM source, medium and campaign.
-- First-touch attribution: the UTMs are the ones captured on the visitor's
-- first page of the session, not the page they happened to convert on.
select
  coalesce(utm_source,   '(none)') as utm_source,
  coalesce(utm_medium,   '(none)') as utm_medium,
  coalesce(utm_campaign, '(none)') as utm_campaign,
  coalesce(utm_content,  '(none)') as utm_content,
  count(*)                         as requests,
  count(distinct contact_id)       as distinct_contacts
from public.lead_magnet_requests
group by 1, 2, 3, 4
order by requests desc;
