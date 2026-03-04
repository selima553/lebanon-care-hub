create extension if not exists "pgcrypto";

create table if not exists public.shelters (
  id text primary key,
  name text not null,
  description text,
  address text not null,
  phone text not null,
  lat double precision,
  lng double precision,
  capacity integer,
  pricing text not null check (pricing in ('free', 'paid')),
  price_amount numeric,
  creator_id text,
  status text not null check (status in ('available', 'limited', 'full')),
  community_status text check (community_status in ('available', 'limited', 'full')),
  community_status_comment text,
  community_status_updated_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.help_requests (
  id text primary key,
  type text not null check (type in ('transport', 'medicine', 'food', 'shelter', 'elderly', 'baby', 'blood', 'disability', 'medical', 'other')),
  description text,
  name text,
  phone text not null,
  lat double precision,
  lng double precision,
  address text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.donations (
  id text primary key,
  type text not null check (type in ('food', 'water', 'medicine', 'shelter', 'transport', 'financial', 'blood', 'clothes', 'other')),
  description text,
  is_ngo boolean not null default false,
  name text,
  phone text not null,
  lat double precision,
  lng double precision,
  address text not null,
  created_at timestamptz not null default now()
);

alter table public.shelters enable row level security;
alter table public.help_requests enable row level security;
alter table public.donations enable row level security;

create policy if not exists "public can read shelters"
  on public.shelters
  for select
  using (true);

create policy if not exists "public can insert shelters"
  on public.shelters
  for insert
  with check (true);

create policy if not exists "public can update shelters"
  on public.shelters
  for update
  using (true)
  with check (true);

create policy if not exists "public can read help requests"
  on public.help_requests
  for select
  using (true);

create policy if not exists "public can insert help requests"
  on public.help_requests
  for insert
  with check (true);

create policy if not exists "public can read donations"
  on public.donations
  for select
  using (true);

create policy if not exists "public can insert donations"
  on public.donations
  for insert
  with check (true);
