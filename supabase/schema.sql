-- SGV Christian Club Collective :: Supabase schema
-- Run this in the Supabase SQL editor before deploying.

create extension if not exists "uuid-ossp";

-- RSVPs --------------------------------------------------------------
create table if not exists public.rsvps (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  school text,
  event_slug text not null,
  guests integer not null default 1,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.rsvps enable row level security;

drop policy if exists "anyone can rsvp" on public.rsvps;
create policy "anyone can rsvp"
  on public.rsvps for insert
  with check (true);

drop policy if exists "only authed can read rsvps" on public.rsvps;
create policy "only authed can read rsvps"
  on public.rsvps for select
  using (auth.role() = 'authenticated');

-- Contact / Join ------------------------------------------------------
create table if not exists public.contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  school text,
  interest text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

drop policy if exists "anyone can contact" on public.contact_messages;
create policy "anyone can contact"
  on public.contact_messages for insert
  with check (true);

drop policy if exists "only authed can read contact" on public.contact_messages;
create policy "only authed can read contact"
  on public.contact_messages for select
  using (auth.role() = 'authenticated');

-- Events --------------------------------------------------------------
create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  title text not null,
  tagline text,
  description text,
  starts_at timestamptz,
  location text,
  rsvp_url text,
  image_url text,
  featured boolean not null default false,
  category text,
  created_at timestamptz not null default now()
);

alter table public.events enable row level security;

drop policy if exists "events readable to all" on public.events;
create policy "events readable to all"
  on public.events for select using (true);

drop policy if exists "events editable by authed" on public.events;
create policy "events editable by authed"
  on public.events for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Clubs --------------------------------------------------------------
create table if not exists public.clubs (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  school text not null,
  short_name text,
  city text,
  description text,
  leader_contact text,
  created_at timestamptz not null default now()
);

alter table public.clubs enable row level security;

drop policy if exists "clubs readable to all" on public.clubs;
create policy "clubs readable to all"
  on public.clubs for select using (true);

drop policy if exists "clubs editable by authed" on public.clubs;
create policy "clubs editable by authed"
  on public.clubs for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Announcements ------------------------------------------------------
create table if not exists public.announcements (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.announcements enable row level security;

drop policy if exists "announcements readable to all" on public.announcements;
create policy "announcements readable to all"
  on public.announcements for select using (true);

drop policy if exists "announcements editable by authed" on public.announcements;
create policy "announcements editable by authed"
  on public.announcements for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create index if not exists rsvps_event_slug_idx on public.rsvps(event_slug);
create index if not exists rsvps_created_at_idx on public.rsvps(created_at desc);
create index if not exists contact_created_at_idx
  on public.contact_messages(created_at desc);

-- Editable content (2026-11-04) -----------------------------------------
-- Columns and the leaders table used by /admin. Also in
-- supabase/migrations/2026-11-04_editable_content.sql.
alter table public.events add column if not exists date_label text;
alter table public.events add column if not exists time_label text;
alter table public.events add column if not exists is_upcoming boolean not null default false;
alter table public.events add column if not exists sort_order integer not null default 0;
alter table public.clubs add column if not exists logo_url text;
alter table public.clubs add column if not exists instagrams jsonb not null default '[]'::jsonb;
alter table public.clubs add column if not exists sort_order integer not null default 0;

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
