-- Lead-magnet abuse control: salted IP hashes for rate limiting only (D2.7, D5.5).
-- 24-hour retention, deleted by the Edge Function; no link to contacts or requests.
-- Additive only (plan §15.2, S2-1, S2-4, S2-5).
-- Apply individually with `supabase db query --linked --project-ref pynjyrvnokfexyudimsn -f <this file>`.
begin;

create table public.lead_magnet_ip_activity (
  id bigint generated always as identity primary key,
  ip_hash text not null,
  -- Separate ceilings: 10 requests and 100 events per hash per 10 minutes (S2-4).
  activity_kind text not null check (activity_kind in ('request', 'event')),
  created_at timestamptz not null default now()
);

create index lead_magnet_ip_activity_hash_kind_created_idx
  on public.lead_magnet_ip_activity (ip_hash, activity_kind, created_at);

-- Supports deleting rows older than 24 hours.
create index lead_magnet_ip_activity_created_idx
  on public.lead_magnet_ip_activity (created_at);

-- RLS on with no policies; visitors never read or write this table.
alter table public.lead_magnet_ip_activity enable row level security;
revoke all on table public.lead_magnet_ip_activity from anon, authenticated;

comment on table public.lead_magnet_ip_activity is
  'Salted IP hashes for rate limiting only; 24-hour retention; no link to contacts.';

commit;
