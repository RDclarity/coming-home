/**
 * Anonyme Seitenaufruf-Statistik fürs CRM-Backend (Besucherstatistik-Panel,
 * siehe pages/crm/Crm.tsx) – komplett ohne externen Dienst (kein Google
 * Analytics o. Ä.), läuft über dieselbe eigene Supabase-Instanz wie das CRM.
 *
 * Bewusst KEIN Consent-Banner nötig: keine Cookies, keine personenbezogenen
 * Daten. Gespeichert wird pro Aufruf nur:
 *  - der aufgerufene Pfad
 *  - eine rein zufällige, nicht mit einer Person verknüpfbare Sitzungs-ID
 *    (nur in sessionStorage, verschwindet beim Schließen des Tabs)
 *  - ein grober Gerätetyp (Desktop/Mobil/Tablet), aus dem User-Agent
 *    abgeleitet – der rohe UA-String selbst wird nie gespeichert
 *  - die Herkunfts-Domain (z. B. "google.com") oder "Direkt", aus
 *    document.referrer beim ersten Aufruf der Sitzung
 *
 * Same-Origin-Prinzip wie beim CRM: der `anon`-Key darf laut Row Level
 * Security (siehe supabase/migrations/) nur neue Zeilen einfügen, nie lesen –
 * nur ein eingeloggter Account (Jasmins CRM-Login) sieht die Auswertung.
 */

import { getSupabase } from '../crm/supabaseClient'

export type PageView = {
  path: string
  viewed_at: string
  session_id: string
  geraet: string | null
  quelle: string | null
}

const SESSION_KEY = 'coming-home:analytics:session'
const QUELLE_KEY = 'coming-home:analytics:quelle'

function sessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY)
    if (!id) {
      id = crypto.randomUUID()
      sessionStorage.setItem(SESSION_KEY, id)
    }
    return id
  } catch {
    // sessionStorage blockiert (privater Modus) – pro Aufruf eine neue ID,
    // zählt dann als eigene Sitzung statt zusammengeführt zu werden.
    return crypto.randomUUID()
  }
}

function geraetTyp(): string {
  const ua = navigator.userAgent
  if (/iPad|Android(?!.*Mobile)|Tablet/i.test(ua)) return 'Tablet'
  if (/Mobi|iPhone|Android/i.test(ua)) return 'Mobil'
  return 'Desktop'
}

function quelle(): string {
  try {
    const gespeichert = sessionStorage.getItem(QUELLE_KEY)
    if (gespeichert) return gespeichert

    let q = 'Direkt'
    if (document.referrer) {
      try {
        const host = new URL(document.referrer).hostname.replace(/^www\./, '')
        if (host && host !== location.hostname.replace(/^www\./, '')) q = host
      } catch {
        // ungültiger referrer – bei "Direkt" bleiben
      }
    }
    sessionStorage.setItem(QUELLE_KEY, q)
    return q
  } catch {
    return 'Direkt'
  }
}

/** Seitenaufruf zählen – darf die Seite niemals stören, egal was passiert. */
export function trackPageView(path: string): void {
  try {
    const view: PageView = {
      path,
      viewed_at: new Date().toISOString(),
      session_id: sessionId(),
      geraet: geraetTyp(),
      quelle: quelle(),
    }

    getSupabase()
      ?.then((client) => client.from('page_views').insert(view))
      .then((result) => {
        if (result?.error) console.error('Seitenaufruf-Tracking fehlgeschlagen:', result.error)
      })
  } catch {
    // Tracking ist ein Zusatznutzen, kein kritischer Pfad
  }
}

/** Holt alle Seitenaufrufe seit einem Zeitpunkt – nur mit eingeloggter Session
 * (RLS) erfolgreich, siehe Datei-Kommentar oben. Seitenweise (PostgREST liefert
 * sonst nur die ersten 1000 Zeilen), damit auch bei viel Besuch nichts fehlt. */
export async function fetchPageViews(since: Date): Promise<PageView[]> {
  const client = await getSupabase()
  if (!client) return []

  const SEITENGROESSE = 1000
  const alle: PageView[] = []
  let von = 0
  while (true) {
    const { data, error } = await client
      .from('page_views')
      .select('path, viewed_at, session_id, geraet, quelle')
      .gte('viewed_at', since.toISOString())
      .order('viewed_at', { ascending: true })
      .range(von, von + SEITENGROESSE - 1)
    if (error) throw error
    alle.push(...((data ?? []) as PageView[]))
    if (!data || data.length < SEITENGROESSE) break
    von += SEITENGROESSE
  }
  return alle
}
