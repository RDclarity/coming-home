-- Platz-Reservierungen für Workshops (Nutzerwunsch 2026-10-03: "Nächster
-- Termin" auf der Startseite führt direkt zur Buchung). Besucher:innen
-- reservieren 1–4 Plätze für den nächsten Workshop; bezahlt wird danach
-- direkt bei Jasmin.
--
-- Anlage AUSSCHLIESSLICH über die Edge Function submit-workshop-buchung
-- (Service-Role-Key, umgeht RLS) – wie bei kennenlern_termine gibt es bewusst
-- keine anon-INSERT-Policy, damit jede Reservierung Honeypot, Rate-Limit und
-- Pflichtfeld-Prüfung der Function durchläuft.
create table public.workshop_buchungen (
  id uuid primary key default gen_random_uuid(),
  event_slug text not null,
  event_datum text not null,
  event_titel text not null,
  vorname text not null,
  nachname text not null,
  email text not null,
  telefon text not null,
  plaetze int not null check (plaetze between 1 and 4),
  nachricht text,
  status text not null default 'reserviert'
    check (status in ('reserviert', 'bezahlt', 'storniert')),
  notiz text,
  created_at timestamptz not null default now()
);

create index workshop_buchungen_event_idx on public.workshop_buchungen (event_slug, created_at desc);

alter table public.workshop_buchungen enable row level security;

-- Admin (Jasmins Backend-Login, is_admin() aus 00000000000003_members.sql)
-- sieht/bearbeitet alle Reservierungen.
create policy "admin verwaltet workshop_buchungen"
  on public.workshop_buchungen for all
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));
