-- Prepared for a new Supabase project. Not applied to the hosted D1 demo.
begin;

create table public.tbilisi_places (
  id text primary key,
  sort_order integer not null,
  content jsonb not null check (jsonb_typeof(content) = 'object'),
  updated_at timestamptz not null default now()
);

create table public.tbilisi_trips (
  user_id uuid primary key references auth.users(id) on delete cascade,
  title text not null default 'My Tbilisi day' check (char_length(trim(title)) between 1 and 120),
  trip_date date,
  notes text not null default '' check (char_length(notes) <= 2000),
  revision integer not null default 1 check (revision > 0),
  updated_at timestamptz not null default now()
);

create table public.tbilisi_trip_stops (
  user_id uuid not null references public.tbilisi_trips(user_id) on delete cascade,
  place_id text not null references public.tbilisi_places(id),
  position integer not null check (position >= 0),
  primary key (user_id, place_id),
  unique (user_id, position)
);

create table public.tbilisi_favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  place_id text not null references public.tbilisi_places(id),
  created_at timestamptz not null default now(),
  primary key (user_id, place_id)
);

alter table public.tbilisi_places enable row level security;
alter table public.tbilisi_trips enable row level security;
alter table public.tbilisi_trip_stops enable row level security;
alter table public.tbilisi_favorites enable row level security;

revoke all on public.tbilisi_places, public.tbilisi_trips,
  public.tbilisi_trip_stops, public.tbilisi_favorites from anon, authenticated;

grant select on public.tbilisi_places to anon, authenticated;
grant select, insert, update, delete on public.tbilisi_trips,
  public.tbilisi_trip_stops, public.tbilisi_favorites to authenticated;

create policy "Read city guide" on public.tbilisi_places
  for select to anon, authenticated using (true);
create policy "Manage own trip" on public.tbilisi_trips
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "Manage own stops" on public.tbilisi_trip_stops
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "Manage own favorites" on public.tbilisi_favorites
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

commit;
