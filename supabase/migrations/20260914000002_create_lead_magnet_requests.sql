-- Lead-magnet requests: one row per valid request ("what did this person request?").
-- Additive only (plan §15.2, S2-1, S2-3, S2-6). Requires 20260914000001_create_contacts.sql.
-- Apply individually with `supabase db query --linked --project-ref pynjyrvnokfexyudimsn -f <this file>`.
begin;

create table public.lead_magnet_requests (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts (id) on delete restrict,
  email text not null,
  asset_id text not null,
  asset_version text not null,
  -- Validated server-side against the lead-magnet registry; no database constraint (S2-6).
  placement text not null,
  page_path text,
  landing_path text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  is_repeat boolean not null default false,
  marketing_opt_in_checked boolean not null default false,
  consent_text_version text not null,
  consent_method text not null default 'checkbox' check (consent_method in ('checkbox')),
  turnstile_passed boolean not null,
  fulfilment_status text not null default 'delivered_inline'
    check (fulfilment_status in ('delivered_inline')),
  -- NULL until an email send has been attempted (S2-3).
  email_status text check (email_status in ('sent', 'failed', 'skipped_cooldown', 'suppressed')),
  email_provider_id text,
  email_error text,
  created_at timestamptz not null default now()
);

-- Repeat detection and the one-hour cooldown look up a contact's requests for an asset.
create index lead_magnet_requests_contact_asset_created_idx
  on public.lead_magnet_requests (contact_id, asset_id, created_at desc);

-- RLS on with no policies; visitors never read or write this table.
alter table public.lead_magnet_requests enable row level security;
revoke all on table public.lead_magnet_requests from anon, authenticated;

comment on table public.lead_magnet_requests is
  'One row per valid lead-magnet request. Written only by submit-lead-magnet-request.';

commit;
