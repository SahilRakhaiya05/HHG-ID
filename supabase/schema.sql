-- HH Goa 2026 · Frame In Goa
-- Run in Supabase SQL Editor (full setup)
-- Reverse-engineered map/pin + optional share pipeline

-- ── Pins (public builder map) ──────────────────────────────
create table if not exists public.pins (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Builder',
  stack text default '',
  title text default '',
  handle text default '',
  city text default '',
  id_number text default '',
  format text default 'pass' check (format in ('pass', 'pfp', 'team')),
  theme text default 'official',
  filter text default 'natural',
  finish text default 'goa',
  lat double precision not null,
  lng double precision not null,
  photo_url text,
  card_url text,
  visible boolean not null default true,
  likes int not null default 0,
  created_at timestamptz not null default now()
);

-- migrate older tables
alter table public.pins add column if not exists theme text default 'official';
alter table public.pins add column if not exists filter text default 'natural';
alter table public.pins add column if not exists finish text default 'goa';
alter table public.pins add column if not exists likes int not null default 0;
alter table public.pins add column if not exists shared_card_id uuid;

-- allow team format on older DBs
-- (recreate check if needed — safe no-op if already correct)
do $$
begin
  alter table public.pins drop constraint if exists pins_format_check;
  alter table public.pins add constraint pins_format_check
    check (format in ('pass', 'pfp', 'team'));
exception when others then null;
end $$;

create index if not exists pins_visible_created on public.pins (visible, created_at desc);
create index if not exists pins_geo on public.pins (lat, lng);
create index if not exists pins_likes on public.pins (likes desc);
create index if not exists pins_shared_card on public.pins (shared_card_id);

alter table public.pins enable row level security;

drop policy if exists "Public read visible pins" on public.pins;
create policy "Public read visible pins"
  on public.pins for select
  using (visible = true);

drop policy if exists "Anon can insert pins" on public.pins;
create policy "Anon can insert pins"
  on public.pins for insert
  with check (true);

drop policy if exists "Anon update pins" on public.pins;
drop policy if exists "Anon delete pins" on public.pins;
-- Updates/deletes are server-admin only through SUPABASE_SERVICE_ROLE_KEY.

-- ── Optional leaderboard / radar frames ────────────────────
create table if not exists public.frames (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Builder',
  handle text default '',
  stack text default '',
  title text default '',
  city text default '',
  id_number text default '',
  mood text default 'LOCKED IN',
  format text default 'pass',
  theme text default 'official',
  card_url text,
  visible boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.frames add column if not exists stack text default '';
alter table public.frames add column if not exists title text default '';
alter table public.frames add column if not exists city text default '';
alter table public.frames add column if not exists id_number text default '';
alter table public.frames add column if not exists mood text default 'LOCKED IN';

create index if not exists frames_featured on public.frames (featured, created_at desc);

alter table public.frames enable row level security;

drop policy if exists "Public read frames" on public.frames;
create policy "Public read frames"
  on public.frames for select
  using (visible = true);

drop policy if exists "Anon insert frames" on public.frames;
create policy "Anon insert frames"
  on public.frames for insert
  with check (true);

-- ── Storage ────────────────────────────────────────────────
-- Dashboard → Storage → New bucket: pins (Public: YES)
insert into storage.buckets (id, name, public)
values ('pins', 'pins', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read pin images" on storage.objects;
create policy "Public read pin images"
  on storage.objects for select
  using (bucket_id = 'pins');

drop policy if exists "Anon upload pin images" on storage.objects;
create policy "Anon upload pin images"
  on storage.objects for insert
  with check (bucket_id = 'pins');

drop policy if exists "Anon update pin images" on storage.objects;
drop policy if exists "Anon delete pin images" on storage.objects;
-- Storage updates/deletes are server-admin only. Public clients upload unique paths.
