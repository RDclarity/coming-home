-- Mitgliederbereich: eigene Teilnehmer-Logins für die 3-/12-Monats-
-- Begleitungen, mit monatsweise freigeschalteten PDFs/Videos + Fragebögen.
--
-- WICHTIG (Sicherheit): Teilnehmer:innen-Logins laufen über DASSELBE
-- Supabase-Auth wie Jasmins eigener CRM-Login (sie legt jeden Zugang selbst
-- im Dashboard an, siehe README). Bisher durfte laut RLS-Policy JEDE
-- eingeloggte Person (`to authenticated`) uneingeschränkt auf `leads` etc.
-- zugreifen – das wäre ab jetzt falsch, weil dann auch ein neu angelegtes
-- Teilnehmer-Konto vollen CRM-Zugriff auf alle Kundenanfragen hätte. Diese
-- Migration führt deshalb eine echte Rollen-Prüfung (`is_admin()`) ein und
-- ersetzt alle bisherigen "jede:r Eingeloggte darf alles"-Policies damit.

-- ---------------------------------------------------------------------------
-- Profile + Rolle
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'member' check (role in ('admin', 'member')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- `security definer`: umgeht RLS für den internen Lookup selbst – ohne das
-- würde eine Policy auf `profiles`, die `profiles` selbst abfragt, sich
-- endlos rekursiv aufrufen (bekannte Postgres-RLS-Falle).
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = uid and role = 'admin')
$$;

-- Legt bei jeder neuen Supabase-Auth-Registrierung automatisch eine
-- Profil-Zeile an (Standard-Rolle "member") – Jasmin muss nach dem Anlegen
-- eines Zugangs im Dashboard also nichts weiter tun, das Profil erscheint
-- von selbst im Verwaltungsbereich und sie ordnet dort Rolle/Programm zu.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Einmalige Übernahme des einzigen zum Zeitpunkt dieser Migration
-- existierenden Accounts (Jasmins eigener CRM-Login) als Admin.
insert into public.profiles (id, email, role)
select id, email, 'admin' from auth.users
on conflict (id) do update set role = 'admin';

create policy "eigenes Profil lesen"
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or public.is_admin(auth.uid()));

create policy "admin verwaltet Profile"
  on public.profiles for update
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- Bestehende Policies auf echte Rollen-Prüfung umstellen
-- ---------------------------------------------------------------------------

drop policy "authenticated full access to leads" on public.leads;
create policy "admin voller Zugriff auf leads"
  on public.leads for all
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

drop policy "authenticated full access to lead_notes" on public.lead_notes;
create policy "admin voller Zugriff auf lead_notes"
  on public.lead_notes for all
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

drop policy "authenticated can read page views" on public.page_views;
create policy "admin liest page_views"
  on public.page_views for select
  to authenticated
  using (public.is_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- Programme, Einschreibungen, Monate, Inhalte, Fragebögen
-- ---------------------------------------------------------------------------

create table public.programs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  duration_months int not null check (duration_months > 0),
  created_at timestamptz not null default now()
);

create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.profiles (id) on delete cascade,
  program_id uuid not null references public.programs (id) on delete cascade,
  start_date date not null default current_date,
  created_at timestamptz not null default now()
);

create index enrollments_member_idx on public.enrollments (member_id);

create table public.program_months (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs (id) on delete cascade,
  month_number int not null check (month_number > 0),
  title text,
  unique (program_id, month_number)
);

create table public.month_materials (
  id uuid primary key default gen_random_uuid(),
  month_id uuid not null references public.program_months (id) on delete cascade,
  kind text not null check (kind in ('pdf', 'video')),
  title text not null,
  -- Bei kind='pdf': Pfad im privaten Storage-Bucket "program-pdfs".
  -- Bei kind='video': eingebettete YouTube/Vimeo-URL (unlisted/privat).
  storage_path text,
  video_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  constraint pdf_hat_pfad check (kind <> 'pdf' or storage_path is not null),
  constraint video_hat_url check (kind <> 'video' or video_url is not null)
);

create table public.questionnaires (
  id uuid primary key default gen_random_uuid(),
  month_id uuid not null references public.program_months (id) on delete cascade,
  title text not null,
  -- [{ "id": "...", "label": "...", "type": "text"|"textarea"|"radio"|"checkbox", "options": ["..."] }]
  questions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table public.questionnaire_responses (
  id uuid primary key default gen_random_uuid(),
  questionnaire_id uuid not null references public.questionnaires (id) on delete cascade,
  member_id uuid not null references public.profiles (id) on delete cascade,
  answers jsonb not null default '{}'::jsonb,
  submitted_at timestamptz not null default now()
);

create index questionnaire_responses_member_idx on public.questionnaire_responses (member_id);

-- Prüft, ob ein bestimmter Monat für ein Mitglied schon freigeschaltet ist:
-- Monat 1 ab dem Startdatum, Monat 2 nach einem vollen Monat usw.
create or replace function public.month_unlocked(p_program_id uuid, p_month_number int, p_member_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.enrollments e
    where e.program_id = p_program_id
      and e.member_id = p_member_id
      and p_month_number <= (
        extract(year from age(current_date, e.start_date)) * 12
        + extract(month from age(current_date, e.start_date))
        + 1
      )
  )
$$;

alter table public.programs enable row level security;
alter table public.enrollments enable row level security;
alter table public.program_months enable row level security;
alter table public.month_materials enable row level security;
alter table public.questionnaires enable row level security;
alter table public.questionnaire_responses enable row level security;

-- Programme: Mitglieder sehen nur Programme, in die sie eingeschrieben sind.
create policy "eingeschriebene sehen ihr Programm"
  on public.programs for select
  to authenticated
  using (
    public.is_admin(auth.uid())
    or exists (select 1 from public.enrollments e where e.program_id = programs.id and e.member_id = auth.uid())
  );
create policy "admin verwaltet Programme"
  on public.programs for all
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- Einschreibungen: Mitglieder sehen nur ihre eigene.
create policy "eigene Einschreibung lesen"
  on public.enrollments for select
  to authenticated
  using (member_id = auth.uid() or public.is_admin(auth.uid()));
create policy "admin verwaltet Einschreibungen"
  on public.enrollments for all
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- Monate: nur sichtbar, sobald freigeschaltet (oder für Admin immer).
create policy "freigeschaltete Monate lesen"
  on public.program_months for select
  to authenticated
  using (public.is_admin(auth.uid()) or public.month_unlocked(program_id, month_number, auth.uid()));
create policy "admin verwaltet Monate"
  on public.program_months for all
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- Inhalte (PDFs/Videos): nur sichtbar, wenn der zugehörige Monat freigeschaltet ist.
create policy "Inhalte freigeschalteter Monate lesen"
  on public.month_materials for select
  to authenticated
  using (
    public.is_admin(auth.uid())
    or exists (
      select 1 from public.program_months pm
      where pm.id = month_materials.month_id
        and public.month_unlocked(pm.program_id, pm.month_number, auth.uid())
    )
  );
create policy "admin verwaltet Inhalte"
  on public.month_materials for all
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- Fragebögen: dieselbe Freischalt-Logik wie die Inhalte des Monats.
create policy "Fragebögen freigeschalteter Monate lesen"
  on public.questionnaires for select
  to authenticated
  using (
    public.is_admin(auth.uid())
    or exists (
      select 1 from public.program_months pm
      where pm.id = questionnaires.month_id
        and public.month_unlocked(pm.program_id, pm.month_number, auth.uid())
    )
  );
create policy "admin verwaltet Fragebögen"
  on public.questionnaires for all
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- Antworten: jede:r sieht/schreibt ausschließlich die eigenen.
create policy "eigene Antworten verwalten"
  on public.questionnaire_responses for all
  to authenticated
  using (member_id = auth.uid() or public.is_admin(auth.uid()))
  with check (member_id = auth.uid() or public.is_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- Storage: privater Bucket für die monatlichen PDFs
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('program-pdfs', 'program-pdfs', false)
on conflict (id) do nothing;

create policy "admin verwaltet PDF-Dateien"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'program-pdfs' and public.is_admin(auth.uid()))
  with check (bucket_id = 'program-pdfs' and public.is_admin(auth.uid()));

create policy "freigeschaltete PDFs lesen"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'program-pdfs'
    and exists (
      select 1 from public.month_materials mm
      join public.program_months pm on pm.id = mm.month_id
      where mm.storage_path = storage.objects.name
        and public.month_unlocked(pm.program_id, pm.month_number, auth.uid())
    )
  );
