-- Verlauf/Rückgängig für den Website-Editor (Tab "Website" → Texte): vor
-- jedem Überschreiben eines Feldes wird der bisherige Wert hier abgelegt,
-- damit man nicht nur zum Original-Text im Code zurück kann, sondern auch
-- zu einer vorherigen eigenen Version. Rein Admin-Sache, dieselbe
-- öffentliche Lesbarkeit wie bei content_overrides ist hier NICHT nötig
-- (der Verlauf fließt nirgends in den Build ein).

create table public.content_override_history (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  value text not null,
  created_at timestamptz not null default now()
);

create index content_override_history_path_idx on public.content_override_history (path, created_at desc);

alter table public.content_override_history enable row level security;

create policy "admin verwaltet content_override_history"
  on public.content_override_history for all
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));
