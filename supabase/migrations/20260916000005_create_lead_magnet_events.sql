-- Lead-magnet funnel events: anonymous counts with context (D4.1, §6.4, §8.1).
-- NO session id, visitor id, email, IP, IP hash, user agent, or any other
-- identifier. Write-only from record-lead-magnet-event; nothing reads from the
-- browser. Additive only (plan §15.2, S2-1).
-- The identity sequence is revoked in THIS file rather than a follow-up, per
-- S2-10, which was added after 20260914000003 needed 20260914000004 to fix it.
-- Apply individually with
-- `supabase db query --linked --project-ref pynjyrvnokfexyudimsn -f <this file>`; never `db push`.
begin;

create table public.lead_magnet_events (
  id bigint generated always as identity primary key,

  -- The seven fixed names of §8.1. Adding an event is a migration, on purpose.
  event_name text not null check (event_name in (
    'lead_magnet_cta_view',
    'lead_magnet_cta_click',
    'lead_magnet_form_view',
    'lead_magnet_form_submit',
    'lead_magnet_request_success',
    'lead_magnet_request_error',
    'lead_magnet_download_click'
  )),

  asset_id text not null,

  -- The four fixed placements (D4.3), matching the registry allow-list.
  placement text not null check (placement in (
    'home-band', 'learn-more-band', 'footer-link', 'landing-page'
  )),

  page_path text not null check (page_path like '/%' and length(page_path) <= 512),

  -- Only ever set on lead_magnet_request_error (§6.4). Nullable even there:
  -- an unclassified error is worth more than a rejected row.
  error_kind text check (error_kind in (
    'network', 'validation', 'verification', 'rate_limited', 'server'
  )),

  created_at timestamptz not null default now(),

  -- An error_kind on a non-error event would corrupt the funnel silently.
  constraint lead_magnet_events_error_kind_scope check (
    event_name = 'lead_magnet_request_error' or error_kind is null
  )
);

-- Query 4 (the placement funnel) and queries 1 and 2 drive these.
create index lead_magnet_events_name_created_idx
  on public.lead_magnet_events (event_name, created_at);

create index lead_magnet_events_placement_created_idx
  on public.lead_magnet_events (placement, created_at);

-- RLS on with no policies; visitors never read or write this table.
alter table public.lead_magnet_events enable row level security;
revoke all on table public.lead_magnet_events from anon, authenticated;
revoke all on sequence public.lead_magnet_events_id_seq from anon, authenticated;

comment on table public.lead_magnet_events is
  'Anonymous lead-magnet funnel counts (plan §8.1). No identifiers of any kind.';

commit;
