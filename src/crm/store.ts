/**
 * localStorage-Adapter für das CRM.
 *
 * WICHTIGE EINSCHRÄNKUNG, die beim Einsatz unbedingt klar sein muss:
 * localStorage ist pro Browser und pro Gerät isoliert. Eine Anfrage, die
 * eine Besucherin auf ihrem Handy abschickt, landet NUR in ihrem eigenen
 * Browser – nicht bei Jasmin. Dieses CRM sammelt also aktuell nur Leads, die
 * über DASSELBE Gerät/denselben Browser eingehen, auf dem später auch
 * /intern/crm geöffnet wird (z. B. zum Testen, oder wenn Jasmin selbst am
 * eigenen Gerät für sich Notizen führt).
 *
 * Damit echte Website-Besuche zentral bei Jasmin ankommen, braucht es einen
 * Backend-Adapter (z. B. Supabase) – bewusst noch NICHT angebunden. Sobald
 * es so weit ist: eine neue Datei erstellen, die `CrmStore` aus types.ts
 * implementiert, und in `crmStore` unten austauschen. Der Rest der App
 * (submitForm.ts, die CRM-Seite) muss dafür nicht angefasst werden.
 */

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
}

/** Der aktuell aktive Adapter. Andere Module importieren nur diesen Export. */
export const crmStore: CrmStore = localStorageCrmStore
