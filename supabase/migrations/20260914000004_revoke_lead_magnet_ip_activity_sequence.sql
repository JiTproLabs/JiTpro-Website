-- jitpro_website's default privileges grant anon/authenticated rights on new sequences.
-- The identity sequence created by 20260914000003 must not be reachable by visitors (S2-1, §15.2).
-- Additive only. Apply individually with
-- `supabase db query --linked --project-ref pynjyrvnokfexyudimsn -f <this file>`; never `db push`.
begin;

revoke all on sequence public.lead_magnet_ip_activity_id_seq from anon, authenticated;

commit;
