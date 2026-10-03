-- Direkte Online-Buchung für Jasmins kostenloses 20-Minuten-
-- "Kennenlerngespräch" (Telefonat) – ersetzt den alten Bewerbungsbogen-
-- Trichter für dieses eine Gespräch (Nutzerwunsch 2026-10-03). Besucher:innen
-- wählen auf der Website direkt einen freien Slot (Mo–Fr 9–17 Uhr, Wiener
-- Ortszeit, siehe src/lib/terminZeiten.ts) und buchen ihn sofort – ohne
-- Formular, ohne Freigabe durch Jasmin.
--
-- Anlage AUSSCHLIESSLICH über die Edge Function submit-termin (Service-Role-
-- Key, umgeht RLS). Anders als bei `leads` (siehe 00000000000001_leads.sql,
-- "anon can insert leads") gibt es hier BEWUSST KEINE anon-INSERT-Policy:
-- eine Buchung ist nur gültig, wenn sie den serverseitigen Slot-, Rate-Limit-
-- und Pflichtfeld-Check der Function durchlaufen hat. Mit einer offenen
-- anon-INSERT-Policy könnte jede:r diese Prüfung umgehen und beliebige
-- Zeiten/Daten direkt eintragen. Der eindeutige Index auf `beginn` unten ist
-- die eigentliche Sperre gegen Doppelbuchungen (vgl. tischlerkultur-relaunch,
-- supabase/migrations/20260924000000_videocall_termine.sql).
create table public.kennenlern_termine (
  id uuid primary key default gen_random_uuid(),
  beginn timestamptz not null,
  dauer_minuten int not null default 20,
  vorname text not null,
  nachname text not null,
  email text not null,
  telefon text not null,
  wuensche text,
  status text not null default 'geplant'
    check (status in ('geplant', 'durchgefuehrt', 'abgesagt', 'nicht_erschienen')),
  notiz text,
  created_at timestamptz not null default now()
);

-- Doppelbuchung verhindern: ein Slot kann nur einmal aktiv vergeben sein.
-- Ein abgesagter Termin gibt den Slot wieder frei (gleiches Muster wie im
-- Schwesterprojekt).
create unique index kennenlern_termine_slot_eindeutig
  on public.kennenlern_termine (beginn)
  where status <> 'abgesagt';

create index kennenlern_termine_beginn_idx on public.kennenlern_termine (beginn desc);

alter table public.kennenlern_termine enable row level security;

-- Admin (Jasmins Backend-Login, siehe is_admin() aus
-- 00000000000003_members.sql) sieht/bearbeitet/löscht alle Termine – vorbereitet
-- für einen künftigen Backend-Tab, dessen UI hier nicht Teil dieses Auftrags ist.
create policy "admin verwaltet kennenlern_termine"
  on public.kennenlern_termine for all
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- Die öffentliche Buchungsseite muss wissen, welche Slots schon vergeben sind
-- – aber ohne jeden Zugriff auf Namen/E-Mail/Telefon. Diese Funktion liefert
-- daher ganz bewusst NUR die Startzeiten, nie ganze Zeilen.
--
-- `security definer` (statt `security invoker` + einer eigenen Public-Select-
-- Policy): eine zusätzliche RLS-Policy, die anon SELECT auf `beginn`
-- erlaubt, müsste entweder die ganze Zeile freigeben (PII-Leck) oder mit
-- column-level GRANTs kombiniert werden, was in Postgres mit RLS-Policies
-- nicht sauber zusammenspielt. Eine `security definer`-Funktion, die intern
-- nur die eine benötigte Spalte zurückgibt, ist hier das einfachere und
-- klar auditierbare Modell (gleiches Muster wie
-- public.videocall_belegte_termine im Schwesterprojekt).
create or replace function public.kennenlern_belegte_slots(p_von timestamptz, p_bis timestamptz)
returns setof timestamptz
language sql
stable
security definer set search_path = public
as $$
  select beginn
  from public.kennenlern_termine
  where status <> 'abgesagt'
    and beginn >= p_von
    and beginn < least(p_bis, p_von + interval '60 days')
  order by beginn
$$;

-- Explizit statt dem Default-PUBLIC-Grant: diese Funktion ist bewusst
-- öffentlich UND PII-frei (liefert ausschließlich Zeitstempel, keine Namen/
-- Kontaktdaten) – deshalb hier klar sichtbar an anon und authenticated
-- vergeben, nicht stillschweigend über die Postgres-Voreinstellung.
revoke all on function public.kennenlern_belegte_slots(timestamptz, timestamptz) from public;
grant execute on function public.kennenlern_belegte_slots(timestamptz, timestamptz) to anon, authenticated;
