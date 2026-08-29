/**
 * Supabase-Adapter fürs CRM – eigenes Supabase-Projekt "coming-home"
 * (getrennt von allen anderen Ventures), Schema in supabase/migrations/.
 *
 * Sicherheitsmodell (Row Level Security, siehe Migration):
 *  - Anonyme Besucher:innen (der `anon`-Key im Frontend) dürfen NUR neue
 *    Leads ANLEGEN (INSERT) – nie lesen, ändern oder löschen. Der `anon`-Key
 *    landet zwangsläufig im öffentlichen JS-Bundle, deshalb darf er niemals
 *    mehr Rechte haben als "Formular abschicken".
 *  - Nur eingeloggte Nutzer:innen (Jasmins Admin-Login, siehe
 *    src/crm/auth.ts) dürfen Leads lesen/bearbeiten/löschen.
 *
 * `list()`/`get()` liefern deshalb nur dann Daten, wenn eine eingeloggte
 * Session besteht – für anonyme Besucher:innen bleibt die Liste leer, das
 * ist erwartetes Verhalten (kein Fehler).
 *
 * Der eigentliche `@supabase/supabase-js`-Client wird per `getSupabase()`
 * erst bei Bedarf nachgeladen (siehe supabaseClient.ts) – alle Methoden
 * hier sind deshalb so gebaut, dass sie diesen Ladevorgang im Hintergrund
 * abwarten, ohne die (laut CrmStore-Interface synchrone) Aufrufstelle zu
 * blockieren.
 */

import { getSupabase } from './supabaseClient'
import type { CrmStore, Lead, LeadNote, LeadStatus } from './types'

type LeadRow = {
  id: string
  created_at: string
  source: Lead['source']
  status: LeadStatus
  name: string
  email: string
  phone: string | null
  fields: Record<string, string> | null
}

type NoteRow = {
  id: string
  lead_id: string
  created_at: string
  text: string
}

let cache: Lead[] = []
let initialized = false
let loaded = false
const listeners = new Set<() => void>()

function notify() {
  listeners.forEach((listener) => listener())
}

function rowsToLeads(leadRows: LeadRow[], noteRows: NoteRow[]): Lead[] {
  const notesByLead = new Map<string, LeadNote[]>()
  for (const row of noteRows) {
    const list = notesByLead.get(row.lead_id) ?? []
    list.push({ id: row.id, createdAt: row.created_at, text: row.text })
    notesByLead.set(row.lead_id, list)
  }

  return leadRows.map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    source: row.source,
    status: row.status,
    name: row.name,
    email: row.email,
    phone: row.phone ?? undefined,
    fields: row.fields ?? {},
    notes: notesByLead.get(row.id) ?? [],
  }))
}

async function fetchAll() {
  // Gilt auch für einen erneuten Aufruf (z. B. refreshCrmData() nach Login) –
  // während des Nachladens soll das UI wieder "lädt", nicht fälschlich
  // "keine Anfragen" zeigen.
  const wasLoaded = loaded
  loaded = false
  if (wasLoaded) notify()

  const client = await getSupabase()
  if (!client) {
    loaded = true
    notify()
    return
  }

  const [{ data: leadRows, error: leadsError }, { data: noteRows, error: notesError }] = await Promise.all([
    client.from('leads').select('*').order('created_at', { ascending: false }),
    client.from('lead_notes').select('*').order('created_at', { ascending: true }),
  ])

  if (leadsError) {
    // Für anonyme Besucher:innen ohne Login ist das erwartet (RLS verweigert
    // SELECT) – kein console.error, um die Konsole auf der echten Seite
    // nicht mit "Fehlern" vollzuspammen, die keine sind.
    cache = []
    loaded = true
    notify()
    return
  }

  cache = rowsToLeads(leadRows ?? [], notesError ? [] : (noteRows ?? []))
  loaded = true
  notify()
}

/** Holt einmalig alle Daten und hält sie per Realtime aktuell – nur nötig, sobald wirklich gelesen wird. */
function ensureInitialized() {
  if (initialized) return
  initialized = true

  fetchAll()

  getSupabase()?.then((client) => {
    client
      .channel('crm-leads-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => fetchAll())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lead_notes' }, () => fetchAll())
      .subscribe()
  })
}

/** Nach Login/Logout neu synchronisieren, weil RLS dann andere Zeilen sieht. */
export function refreshCrmData() {
  fetchAll()
}

export const supabaseCrmStore: CrmStore = {
  list() {
    ensureInitialized()
    return cache
  },

  get(id) {
    ensureInitialized()
    return cache.find((lead) => lead.id === id)
  },

  add(input) {
    // Bewusst OHNE ensureInitialized()/Cache-Update: add() wird praktisch
    // immer von anonymen Besucher:innen auf einer ganz anderen Seite/einem
    // anderen Gerät als das CRM aufgerufen – der lokale Cache hier ist dann
    // sowieso nicht das CRM-Fenster. Jasmins offenes CRM bekommt den neuen
    // Lead stattdessen über die Realtime-Subscription oben.
    const optimistic: Lead = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: 'neu',
      notes: [],
    }

    // WICHTIG: hier absichtlich KEIN `.select()` anhängen. `anon` darf laut
    // RLS-Policy nur einfügen, nicht lesen – Postgres verlangt für die
    // Rückgabe der eingefügten Zeile (RETURNING/`return=representation`)
    // aber zusätzlich eine passende SELECT-Policy. Mit `.select()` würde
    // dieser Insert fehlschlagen, obwohl er ohne genau richtig funktioniert.
    getSupabase()
      ?.then((client) =>
        client.from('leads').insert({
          id: optimistic.id,
          source: input.source,
          name: input.name,
          email: input.email,
          phone: input.phone ?? null,
          fields: input.fields,
        }),
      )
      .then((result) => {
        if (result?.error) console.error('CRM: Lead konnte nicht gespeichert werden.', result.error)
      })

    return optimistic
  },

  updateStatus(id, status) {
    cache = cache.map((lead) => (lead.id === id ? { ...lead, status } : lead))
    notify()
    getSupabase()
      ?.then((client) => client.from('leads').update({ status }).eq('id', id))
      .then((result) => {
        if (result?.error) console.error('CRM: Status konnte nicht gespeichert werden.', result.error)
      })
  },

  addNote(id, text) {
    const note: LeadNote = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), text }
    cache = cache.map((lead) => (lead.id === id ? { ...lead, notes: [...lead.notes, note] } : lead))
    notify()
    getSupabase()
      ?.then((client) => client.from('lead_notes').insert({ id: note.id, lead_id: id, text }))
      .then((result) => {
        if (result?.error) console.error('CRM: Notiz konnte nicht gespeichert werden.', result.error)
      })
  },

  remove(id) {
    cache = cache.filter((lead) => lead.id !== id)
    notify()
    getSupabase()
      ?.then((client) => client.from('leads').delete().eq('id', id))
      .then((result) => {
        if (result?.error) console.error('CRM: Lead konnte nicht gelöscht werden.', result.error)
      })
  },

  subscribe(listener) {
    ensureInitialized()
    listeners.add(listener)
    return () => listeners.delete(listener)
  },

  isLoading() {
    ensureInitialized()
    return !loaded
  },
}
