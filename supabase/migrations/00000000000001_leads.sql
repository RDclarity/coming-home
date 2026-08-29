-- Coming Home CRM: leads + notes.
-- Bewusst minimal – ein Formularsubmit legt genau einen Lead-Datensatz an.

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source text not null check (source in ('bewerbung', 'kontakt', 'newsletter')),
  status text not null default 'neu'
    check (status in ('neu', 'kontaktiert', 'gebucht', 'abgeschlossen', 'abgesagt')),
  name text not null default '',
  email text not null default '',
  phone text,
  -- Rohdaten des jeweiligen Formulars (Programm, Situation, Nachricht, ...),
  -- siehe Lead['fields'] in src/crm/types.ts.
  fields jsonb not null default '{}'::jsonb
);

create table public.lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  created_at timestamptz not null default now(),
  text text not null
);

create index lead_notes_lead_id_idx on public.lead_notes (lead_id);

alter table public.leads enable row level security;
alter table public.lead_notes enable row level security;

-- Besucher:innen (anon) dürfen NUR neue Leads anlegen – nie lesen, ändern
-- oder löschen. Das schützt Namen/E-Mail/Telefon aller Anfragen davor, über
-- den öffentlichen anon-Key auslesbar zu sein.
create policy "anon can insert leads"
  on public.leads for insert
  to anon
  with check (true);

-- Eingeloggte Nutzer:innen (Jasmins Admin-Login im CRM) haben vollen Zugriff.
create policy "authenticated full access to leads"
  on public.leads for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated full access to lead_notes"
  on public.lead_notes for all
  to authenticated
  using (true)
  with check (true);

-- lead_notes bekommt bewusst KEINE anon-Policy: Notizen legt ausschließlich
-- die eingeloggte Adminstrator:in im CRM an, niemals ein öffentliches Formular.
