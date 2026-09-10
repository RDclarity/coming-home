-- Website-Editor im Backend: Jasmin kann Texte der Seite selbst ändern,
-- Fotos austauschen und neue Bereiche ("Abteilungen") aus fertigen
-- Bausteinen einfügen – siehe src/pages/crm/AdminWebsite.tsx.
--
-- WICHTIG zum Verständnis der Architektur: Diese Seite ist komplett
-- vorgerendert (statisches HTML, siehe scripts/prerender.mjs) – das macht
-- sie schnell und gut bei Google auffindbar. Diese Tabellen sind deshalb
-- NICHT die Quelle, aus der die Seite bei jedem Aufruf live liest, sondern
-- die Quelle, aus der scripts/prerender.mjs beim nächsten Build liest.
-- Jasmins "Veröffentlichen"-Knopf löst genau diesen Neu-Build aus (siehe
-- supabase/functions/trigger-rebuild/ und .github/workflows/deploy.yml).
-- Deshalb dürfen `anon` UND `authenticated` diese Tabellen lesen (der Build
-- läuft in GitHub Actions mit dem `anon`-Key) – es ist ohnehin genau der
-- Inhalt, der gleich öffentlich auf der Seite steht. Schreiben darf
-- weiterhin nur ein Admin-Account.

create table public.content_overrides (
  path text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table public.content_overrides enable row level security;

create policy "content_overrides öffentlich lesbar"
  on public.content_overrides for select
  to anon, authenticated
  using (true);

create policy "admin verwaltet content_overrides"
  on public.content_overrides for all
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

create table public.custom_sections (
  id uuid primary key default gen_random_uuid(),
  block_type text not null check (block_type in ('text', 'image_text', 'quote')),
  sort_order int not null default 0,
  -- Inhalt je nach block_type unterschiedlich, siehe AdminWebsite.tsx/
  -- CustomSections.tsx: z. B. { "heading": "...", "body": "..." } für 'text',
  -- zusätzlich { "imageUrl": "..." } für 'image_text',
  -- { "quote": "...", "attribution": "..." } für 'quote'.
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.custom_sections enable row level security;

create policy "custom_sections öffentlich lesbar"
  on public.custom_sections for select
  to anon, authenticated
  using (true);

create policy "admin verwaltet custom_sections"
  on public.custom_sections for all
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- Öffentlicher Bucket für hochgeladene Website-Fotos (bewusst public, anders
-- als "program-pdfs" – diese Bilder landen ja gerade auf der öffentlichen
-- Website, es gibt nichts zu schützen).
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

create policy "admin verwaltet Website-Fotos"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'site-images' and public.is_admin(auth.uid()))
  with check (bucket_id = 'site-images' and public.is_admin(auth.uid()));
