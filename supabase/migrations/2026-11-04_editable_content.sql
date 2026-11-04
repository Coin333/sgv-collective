-- Editable content: events, clubs, and leaders managed from /admin.
-- Run once in the Supabase SQL editor. Safe to re-run.
--
-- Until this runs (or while a table is empty) the site falls back to the
-- files in src/lib/data, so nothing on sgvc.cc breaks in between.

-- Events: human labels for date and time, because "TBA" is a real value.
alter table public.events add column if not exists date_label text;
alter table public.events add column if not exists time_label text;
alter table public.events add column if not exists is_upcoming boolean not null default false;
alter table public.events add column if not exists sort_order integer not null default 0;

-- Clubs: logo path and Instagram handles.
alter table public.clubs add column if not exists logo_url text;
alter table public.clubs add column if not exists instagrams jsonb not null default '[]'::jsonb;
alter table public.clubs add column if not exists sort_order integer not null default 0;

-- Leaders -------------------------------------------------------------
create table if not exists public.leaders (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  role text not null,
  era text not null default 'current' check (era in ('current', 'past')),
  blurb text not null default '',
  events text[] not null default '{}',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.leaders enable row level security;

drop policy if exists "leaders readable to all" on public.leaders;
create policy "leaders readable to all"
  on public.leaders for select using (true);

drop policy if exists "leaders editable by authed" on public.leaders;
create policy "leaders editable by authed"
  on public.leaders for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create index if not exists events_sort_idx on public.events(sort_order, starts_at desc);
create index if not exists clubs_sort_idx on public.clubs(sort_order, school);
create index if not exists leaders_sort_idx on public.leaders(era, sort_order, name);
