/**
 * Entwurfs-Speicher für den Text-Editor (/intern/editor). Speichert
 * Änderungen als { Pfad → neuer Text } in localStorage – NUR im Browser
 * dieses Geräts, siehe ausführliche Erklärung in Editor.tsx.
 *
 * Cache-Hinweis: `list()` muss bei unveränderten Daten IMMER dieselbe
 * Objekt-Referenz liefern (sonst wirft `useSyncExternalStore` einen
 * Endlosschleifen-Fehler, React #185 – dieselbe Falle wie im CRM-Store,
 * siehe crm/store.ts für die ausführliche Erklärung).
 */

const STORAGE_KEY = 'coming-home:cms-draft:v1'

export type Draft = Record<string, string>

function readAll(): Draft {
  if (typeof localStorage === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

let cached: Draft | null = null
const listeners = new Set<() => void>()

function notify() {
  listeners.forEach((listener) => listener())
}

function writeAll(draft: Draft) {
  cached = null
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
  } catch {
    // Speicher voll/blockiert – Entwurf geht dann nur lokal verloren.
  }
}

export const draftStore = {
  list(): Draft {
    if (cached === null) cached = readAll()
    return cached
  },

  set(path: string, value: string) {
    const next = { ...readAll(), [path]: value }
    writeAll(next)
    notify()
  },

  /** Feld auf den Originalwert zurücksetzen (Entwurfseintrag entfernen). */
  clear(path: string) {
    const next = { ...readAll() }
    delete next[path]
    writeAll(next)
    notify()
  },

  clearAll() {
    writeAll({})
    notify()
  },

  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}
