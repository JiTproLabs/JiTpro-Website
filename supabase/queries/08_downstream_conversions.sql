-- §8.3 query 8: guide requesters who later submitted the contact form.
--
-- The whole business case for the lead magnet: does a free guide eventually
-- produce a commercial conversation?
--
-- Correlated on normalised email (D4.9). `contacts.email` is already stored
-- lowercase and trimmed by a database check; `leads.email` predates this
-- project and is normalised here rather than in place, because this project
-- does not modify the contact-form pipeline.
--
-- "Later" is strict: a lead row created BEFORE the guide request is someone
-- who already knew JiTpro, and is reported separately rather than counted.
with guide_contacts as (
  select c.id, c.email, c.first_seen_at
  from public.contacts c
),
contact_form as (
  select lower(btrim(l.email)) as email, min(l.created_at) as first_contact_at
  from public.leads l
  where l.email is not null and btrim(l.email) <> ''
  group by 1
)
select
  count(*)                                                                as guide_contacts,
  count(f.email)                                                          as also_in_leads,
  count(*) filter (where f.first_contact_at >  g.first_seen_at)           as contacted_after_guide,
  count(*) filter (where f.first_contact_at <= g.first_seen_at)           as already_known_before_guide,
  round(100.0 * count(*) filter (where f.first_contact_at > g.first_seen_at)
        / nullif(count(*), 0), 1)                                         as downstream_conversion_pct
from guide_contacts g
left join contact_form f on f.email = g.email;
