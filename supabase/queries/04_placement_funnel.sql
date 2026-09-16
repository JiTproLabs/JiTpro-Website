-- §8.3 query 4: the placement funnel, views to downloads, with the §8.2 ratios.
--
-- Read entirely from lead_magnet_events so the whole funnel comes from one
-- table and the steps cannot disagree about their denominators.
--
-- CONVERSION IS STORAGE, NOT DELIVERY (§8.1). lead_magnet_request_success
-- means the lead was recorded and access granted; an email that hit the
-- one-hour cooldown, failed, or went to a suppressed address is still a
-- successful request here. Delivery is query 6's question.
with counts as (
  select
    placement,
    count(*) filter (where event_name = 'lead_magnet_cta_view')         as cta_views,
    count(*) filter (where event_name = 'lead_magnet_cta_click')        as cta_clicks,
    count(*) filter (where event_name = 'lead_magnet_form_view')        as form_views,
    count(*) filter (where event_name = 'lead_magnet_form_submit')      as form_submits,
    count(*) filter (where event_name = 'lead_magnet_request_success')  as successes,
    count(*) filter (where event_name = 'lead_magnet_request_error')    as errors,
    count(*) filter (where event_name = 'lead_magnet_download_click')   as downloads
  from public.lead_magnet_events
  group by placement
)
select
  placement,
  cta_views, cta_clicks, form_views, form_submits, successes, errors, downloads,
  -- cta_view is deduplicated per placement per session in the browser, so this
  -- is click-through per visitor-session rather than per impression.
  round(100.0 * cta_clicks   / nullif(cta_views,    0), 1) as click_through_pct,
  round(100.0 * form_submits / nullif(form_views,   0), 1) as form_completion_pct,
  round(100.0 * successes    / nullif(form_submits, 0), 1) as submit_success_pct,
  round(100.0 * successes    / nullif(cta_views,    0), 1) as overall_conversion_pct,
  round(100.0 * downloads    / nullif(successes,    0), 1) as download_pct
from counts
order by cta_views desc;
