-- Investor access request and approval tracking
create table if not exists investor_access (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text not null,
  investment_interest text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'revoked')),
  access_token uuid unique,
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  revoked_at timestamptz
);

-- RLS: edge functions use service role key to bypass RLS
alter table investor_access enable row level security;
