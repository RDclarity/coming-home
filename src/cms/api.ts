/**
 * Datenzugriff für den Website-Editor im Backend (Tab "Website", siehe
 * pages/crm/AdminWebsite.tsx). Speichert Text-/Foto-Änderungen und frei
 * hinzugefügte Bereiche in Supabase (siehe
 * supabase/migrations/…_content_editor.sql) – scripts/prerender.mjs liest
 * das beim nächsten Build und backt es in die statische Seite ein.
 */

import { getSupabase } from '../crm/supabaseClient'
import type { CustomSection, CustomSectionBlockType } from '../data/customSections'

async function client() {
  const c = await getSupabase()
  if (!c) throw new Error('Supabase ist nicht konfiguriert.')
  return c
}

// ---------------------------------------------------------------------------
// Text-/Foto-Überschreibungen
// ---------------------------------------------------------------------------

export async function fetchOverrides(): Promise<Record<string, string>> {
  const c = await client()
  const { data, error } = await c.from('content_overrides').select('path, value')
  if (error) throw error
  return Object.fromEntries((data ?? []).map((row) => [row.path, row.value]))
}

export async function saveOverride(path: string, value: string): Promise<void> {
  const c = await client()

  // Verlauf: bisherigen Wert (egal ob eigene Überschreibung oder das erste
  // Mal) VOR dem Überschreiben wegsichern, damit "Verlauf" später auch zu
  // einer eigenen vorherigen Version zurück kann, nicht nur zum Original
  // im Code. Darf das eigentliche Speichern nie verhindern.
  try {
    const { data: bestehend } = await c.from('content_overrides').select('value').eq('path', path).maybeSingle()
    if (bestehend) {
      await c.from('content_override_history').insert({ path, value: bestehend.value })
    }
  } catch {
    // Verlauf ist ein Zusatznutzen, kein kritischer Pfad.
  }

  const { error } = await c
    .from('content_overrides')
    .upsert({ path, value, updated_at: new Date().toISOString() }, { onConflict: 'path' })
  if (error) throw error
}

/** Feld auf den Original-Text im Code zurücksetzen (Überschreibung löschen). */
export async function resetOverride(path: string): Promise<void> {
  const c = await client()
  const { error } = await c.from('content_overrides').delete().eq('path', path)
  if (error) throw error
}

/** Die letzten eigenen Versionen eines Feldes, neueste zuerst. */
export async function fetchOverrideHistory(path: string, limit = 5): Promise<{ value: string; createdAt: string }[]> {
  const c = await client()
  const { data, error } = await c
    .from('content_override_history')
    .select('value, created_at')
    .eq('path', path)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data ?? []).map((row) => ({ value: row.value, createdAt: row.created_at }))
}

// ---------------------------------------------------------------------------
// Fotos
// ---------------------------------------------------------------------------

/** Lädt ein Foto in den öffentlichen Bucket hoch und liefert die dauerhafte
 * öffentliche URL – die trägt man dann als Wert in ein Bild-Feld ein. */
export async function uploadSiteImage(file: File): Promise<string> {
  const c = await client()
  const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
  const upload = await c.storage.from('site-images').upload(path, file)
  if (upload.error) throw upload.error
  return c.storage.from('site-images').getPublicUrl(path).data.publicUrl
}

export type SiteImage = { path: string; url: string; createdAt: string }

/** Alle bisher hochgeladenen Fotos – für die Foto-Bibliothek (schon
 * hochgeladene Bilder wiederverwenden statt jedes Mal neu hochzuladen). */
export async function fetchSiteImages(): Promise<SiteImage[]> {
  const c = await client()
  const { data, error } = await c.storage.from('site-images').list('', {
    sortBy: { column: 'created_at', order: 'desc' },
  })
  if (error) throw error
  return (data ?? [])
    .filter((entry) => entry.name && entry.id) // Ordner-Platzhalter rausfiltern
    .map((entry) => ({
      path: entry.name,
      url: c.storage.from('site-images').getPublicUrl(entry.name).data.publicUrl,
      createdAt: entry.created_at ?? '',
    }))
}

// ---------------------------------------------------------------------------
// Frei hinzugefügte Bereiche ("Abteilungen")
// ---------------------------------------------------------------------------

type SectionRow = {
  id: string
  block_type: CustomSectionBlockType
  sort_order: number
  content: Record<string, string>
}

export async function fetchCustomSections(): Promise<CustomSection[]> {
  const c = await client()
  const { data, error } = await c
    .from('custom_sections')
    .select('id, block_type, sort_order, content')
    .order('sort_order')
  if (error) throw error
  return ((data ?? []) as SectionRow[]).map((row) => ({
    id: row.id,
    blockType: row.block_type,
    content: row.content,
  }))
}

export async function createCustomSection(blockType: CustomSectionBlockType): Promise<void> {
  const c = await client()
  const { data: existing, error: countError } = await c
    .from('custom_sections')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
  if (countError) throw countError
  const nextOrder = ((existing?.[0]?.sort_order as number | undefined) ?? -1) + 1

  const { error } = await c
    .from('custom_sections')
    .insert({ block_type: blockType, sort_order: nextOrder, content: {} })
  if (error) throw error
}

export async function updateCustomSectionContent(id: string, content: Record<string, string>): Promise<void> {
  const c = await client()
  const { error } = await c.from('custom_sections').update({ content }).eq('id', id)
  if (error) throw error
}

export async function deleteCustomSection(id: string): Promise<void> {
  const c = await client()
  const { error } = await c.from('custom_sections').delete().eq('id', id)
  if (error) throw error
}

export async function moveCustomSection(id: string, direction: 'up' | 'down', all: CustomSection[]): Promise<void> {
  const index = all.findIndex((s) => s.id === id)
  const swapWith = direction === 'up' ? index - 1 : index + 1
  if (index < 0 || swapWith < 0 || swapWith >= all.length) return

  const c = await client()
  const a = all[index]
  const b = all[swapWith]
  const { error } = await c.from('custom_sections').upsert([
    { id: a.id, block_type: a.blockType, content: a.content, sort_order: swapWith },
    { id: b.id, block_type: b.blockType, content: b.content, sort_order: index },
  ])
  if (error) throw error
}

// ---------------------------------------------------------------------------
// Veröffentlichen
// ---------------------------------------------------------------------------

/** Löst den echten Neu-Build + Deploy aus (siehe
 * supabase/functions/trigger-rebuild/). Dauert ca. 1–3 Minuten, bis die
 * Änderungen wirklich live sind. */
export async function publish(): Promise<{ ok: boolean; skipped?: string }> {
  const c = await client()
  const { data } = await c.auth.getSession()
  const token = data.session?.access_token
  if (!token) throw new Error('Nicht angemeldet.')

  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/trigger-rebuild`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error('Veröffentlichen fehlgeschlagen.')
  return response.json()
}
