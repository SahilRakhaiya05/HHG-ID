-- HH Goa 2026 · Builder pins
-- Run in Supabase SQL Editor

-- Pins table
create table if not exists public.pins (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Builder',
  stack text default '',
  title text default '',
  handle text default '',
  city text default '',
  id_number text default '',
  format text default 'pass' check (format in ('pass', 'pfp')),
  lat double precision not null,
  lng double precision not null,
  photo_url text,
  card_url text,
  visible boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists pins_visible_created on public.pins (visible, created_at desc);
create index if not exists pins_geo on public.pins (lat, lng);

-- Public read (only visible pins)
alter table public.pins enable row level security;

drop policy if exists "Public read visible pins" on public.pins;
create policy "Public read visible pins"
  on public.pins for select
  using (visible = true);

-- Allow anon insert (no login wall — task requirement)
drop policy if exists "Anon can insert pins" on public.pins;
create policy "Anon can insert pins"
  on public.pins for insert
  with check (true);

-- Anon can update/delete own rows is hard without auth;
-- admin uses service role OR we allow delete with matching id via anon for demo.
-- Prefer Edge Function in production. For Task #1 demo:
drop policy if exists "Anon update pins" on public.pins;
create policy "Anon update pins"
  on public.pins for update
  using (true)
  with check (true);

drop policy if exists "Anon delete pins" on public.pins;
create policy "Anon delete pins"
  on public.pins for delete
  using (true);

-- Storage bucket: create in Dashboard → Storage → New bucket
-- Name: pins
-- Public: YES
-- Then policies:

-- insert for anon
-- select for public

-- Example storage policies (run after bucket exists):
/*
insert into storage.buckets (id, name, public) values ('pins', 'pins', true)
  on conflict (id) do update set public = true;

create policy "Public read pin images"
  on storage.objects for select
  using (bucket_id = 'pins');

create policy "Anon upload pin images"
  on storage.objects for insert
  with check (bucket_id = 'pins');

create policy "Anon update pin images"
  on storage.objects for update
  using (bucket_id = 'pins');

create policy "Anon delete pin images"
  on storage.objects for delete
  using (bucket_id = 'pins');
*/
