
-- Ensure pgcrypto is available for gen_random_uuid()
create extension if not exists pgcrypto;

-- Create table to store website applications (Quick Apply)
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source text not null default 'quick', -- 'quick' | 'full' (future use)
  full_name text not null,
  business_name text not null,
  email text not null,
  phone text not null,
  monthly_revenue_range text not null,   -- e.g., "10k-25k"
  funding_needed_range text not null,    -- e.g., "25k-50k"
  purpose text not null,                 -- e.g., "working-capital"
  contact_consent boolean not null default false,
  terms_consent boolean not null default false
);

comment on table public.applications is 'Applications submitted via website forms (Quick/Full). No public read access.';

-- Enable RLS
alter table public.applications enable row level security;

-- Allow anonymous inserts from the website (no public reads or updates/deletes)
create policy "Allow anonymous inserts from website"
  on public.applications
  for insert
  to anon
  with check (true);
