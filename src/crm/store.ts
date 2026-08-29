/**
 * localStorage-Adapter für das CRM – FALLBACK, wenn kein Supabase
 * konfiguriert ist (siehe `crmStore`-Export ganz unten).
 *
 * WICHTIGE EINSCHRÄNKUNG in diesem Fallback-Modus: localStorage ist pro
 * Browser und pro Gerät isoliert. Eine Anfrage, die eine Besucherin auf
 * ihrem Handy abschickt, landet dann NUR in ihrem eigenen Browser – nicht
 * bei Jasmin. Mit gesetztem VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY (siehe
 * .env.example) gilt das nicht mehr – dann übernimmt supabaseStore.ts und
 * alle Anfragen landen zentral in der Datenbank.
 */

import { supabaseConfigured } from './supabaseClient'
import { supabaseCrmStore } from './supabaseStore'
import type { CrmStore, Lead, LeadStatus } from './types'

const STORAGE_KEY = 'coming-home:crm:leads:v1'

function readAll(): Lead[] {
  if (typeof localStorage === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(leads: Lead[]) {
  cachedList = null // wird bei Bedarf in list() neu berechnet, siehe dort
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads))
  } catch {
    // Speicher voll oder blockiert (privater Modus) – Lead geht dann nur lokal verloren,
    // die eigentliche Anfrage (E-Mail/Endpoint in submitForm.ts) läuft unabhängig davon weiter.
  }
}

/**
 * `list()` wird über `useSyncExternalStore` gelesen – das verlangt, dass die
 * Snapshot-Funktion bei unveränderten Daten JEDES Mal dieselbe Referenz
 * zurückgibt. `readAll().sort(...)` würde bei jedem Aufruf ein neues Array
 * bauen; React sieht dann bei jeder Konsistenzprüfung "neue" Daten und rendert
 * endlos weiter (React-Fehler #185, "Maximum update depth exceeded"). Der
 * Cache hier wird nur bei echten Schreibvorgängen (writeAll) invalidiert.
 */
let cachedList: Lead[] | null = null

function makeId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `lead_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

const listeners = new Set<() => void>()
function notify() {
  listeners.forEach((listener) => listener())
}

export const localStorageCrmStore: CrmStore = {
  list() {
    if (cachedList === null) {
      cachedList = readAll().sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    }
    return cachedList
  },

  get(id) {
    return readAll().find((lead) => lead.id === id)
  },

  add(input) {
    const lead: Lead = {
      ...input,
      id: makeId(),
      createdAt: new Date().toISOString(),
      status: 'neu',
      notes: [],
    }
    writeAll([lead, ...readAll()])
    notify()
    return lead
  },

  updateStatus(id, status: LeadStatus) {
    const leads = readAll().map((lead) => (lead.id === id ? { ...lead, status } : lead))
    writeAll(leads)
    notify()
  },

  addNote(id, text) {
    const note = { id: makeId(), createdAt: new Date().toISOString(), text }
    const leads = readAll().map((lead) =>
      lead.id === id ? { ...lead, notes: [...lead.notes, note] } : lead,
    )
    writeAll(leads)
    notify()
  },

  remove(id) {
    writeAll(readAll().filter((lead) => lead.id !== id))
    notify()
  },

  subscribe(listener) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },

  // localStorage ist synchron – hier gibt es nie einen "lädt noch"-Zustand.
  isLoading() {
    return false
  },
}

/**
 * Der aktuell aktive Adapter. Andere Module importieren nur diesen Export.
 *
 * Nutzt Supabase (supabaseStore.ts), sobald VITE_SUPABASE_URL/
 * VITE_SUPABASE_ANON_KEY gesetzt sind (siehe .env.example) – Leads landen
 * dann zentral in der Datenbank, nicht mehr nur lokal im Browser. Ohne diese
 * Variablen (z. B. lokal ohne .env) bleibt der localStorage-Adapter aktiv,
 * damit die Seite trotzdem baut und funktioniert.
 */
export const crmStore: CrmStore = supabaseConfigured ? supabaseCrmStore : localStorageCrmStore
