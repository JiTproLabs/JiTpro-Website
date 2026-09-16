-- §8.3 query 2: requests by placement.
-- Which surface actually produces leads, which is what decides where the offer
-- belongs next.
select
  placement,
  count(*)                                                     as requests,
  count(distinct contact_id)                                   as distinct_contacts,
  count(*) filter (where is_repeat)                            as repeat_requests,
  min(created_at)                                              as first_request,
  max(created_at)                                              as latest_request
from public.lead_magnet_requests
group by placement
order by requests desc;
