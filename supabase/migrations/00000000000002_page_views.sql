-- Besucherstatistik fürs CRM-Backend (/admin) – siehe src/lib/analytics.ts.
-- Komplett anonym: kein Cookie, keine personenbezogenen Daten. Gespeichert
-- wird nur Pfad, eine rein zufällige Sitzungs-ID (nicht mit einer Person
-- verknüpfbar), ein grober Gerätetyp und die Herkunfts-Domain.

create table public.page_views (
  id bigint generated always as identity primary key,
  path text not null,
  viewed_at timestamptz not null default now(),
  session_id uuid not null,
  geraet text,
  quelle text
);

create index page_views_viewed_at_idx on public.page_views (viewed_at);

alter table public.page_views enable row level security;

-- Gleiches Sicherheitsmodell wie bei leads: Besucher:innen (anon) dürfen NUR
-- neue Zeilen einfügen, nie lesen. Nur ein eingeloggter Account (Jasmins
-- CRM-Login) darf die Statistik auswerten.
create policy "anon can insert page views"
  on public.page_views for insert
  to anon
  with check (true);

create policy "authenticated can read page views"
  on public.page_views for select
  to authenticated
  using (true);
