-- Lead-magnet contacts: one row per normalised email ("who is this person?").
-- Additive only (plan §15.2, S2-1, S2-2). Apply individually with
-- `supabase db query --linked --project-ref pynjyrvnokfexyudimsn -f <this file>`; never `db push`.
begin;

create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  first_source text,
  first_medium text,
  first_campaign text,
  first_landing_path text,
  first_referrer text,
  consent_status text not null default 'transactional_only'
    check (consent_status in ('transactional_only', 'marketing_opt_in', 'unsubscribed')),
  consent_text_version text,
  consent_recorded_at timestamptz,
  consent_method text check (consent_method in ('checkbox')),
  consent_placement text,
  consent_page_path text,
  consent_asset_id text,
  marketing_opt_in_at timestamptz,
  unsubscribed_at timestamptz,
  unsubscribe_source text,
  email_suppressed_at timestamptz,
  email_suppression_reason text
    check (email_suppression_reason in ('bounce', 'complaint', 'manual', 'provider')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint contacts_email_key unique (email),
  constraint contacts_email_normalised
    check (email = lower(btrim(email)) and length(email) between 3 and 254)
);

-- RLS on with no policies; visitors never read or write this table.
-- The submit-lead-magnet-request Edge Function uses the service role.
alter table public.contacts enable row level security;
revoke all on table public.contacts from anon, authenticated;

comment on table public.contacts is
  'Lead-magnet identity (one row per normalised email). Written only by submit-lead-magnet-request.';

commit;
