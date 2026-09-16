-- §8.3 query 1: requests per day and per week.
-- Every row in lead_magnet_requests is one guide request, including repeats
-- within the cooldown, because the request happened even when no email went out.
select
  date_trunc('day',  created_at at time zone 'UTC')::date as day,
  date_trunc('week', created_at at time zone 'UTC')::date as week,
  count(*)                                                as requests,
  count(*) filter (where not is_repeat)                   as first_time_requests,
  count(*) filter (where is_repeat)                       as repeat_requests
from public.lead_magnet_requests
group by 1, 2
order by 1 desc;
