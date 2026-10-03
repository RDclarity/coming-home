/**
 * Client-API für Jasmins kostenloses 20-Minuten-"Kennenlerngespräch"
 * (Telefonat) – direkte Selbstbuchung, kein Formular, keine Freigabe.
 * Ersetzt den alten Bewerbungsbogen-Trichter für dieses eine Gespräch
 * (Nutzerwunsch 2026-10-03). Siehe:
 *
 *  - supabase/migrations/00000000000007_kennenlern_termine.sql (Tabelle +
 *    öffentliche RPC `kennenlern_belegte_slots`)
 *  - supabase/functions/submit-termin/ (Buchung inkl. serverseitiger
 *    Slot-Prüfung, Doppelbuchungsschutz, Bestätigungsmails)
 *  - src/lib/terminZeiten.ts (Zeitzonen-/Slot-Logik – von hier re-exportiert,
 *    damit die UI-Komponente nur aus DIESER Datei importieren muss)
 *
 * Diese Datei liefert absichtlich NUR die Daten-/API-Schicht, keine UI –
 * die Buchungskomponente selbst baut ein Teammitglied separat.
 *
 * "Supabase nicht konfiguriert"-Fall: anders als crm/store.ts (das dafür
 * einen kompletten localStorage-Adapter führt, weil das CRM auch offline
 * funktionieren soll) gibt es für eine Live-Terminbuchung keinen sinnvollen
 * Offline-Ersatz – ohne Supabase-Konfiguration bleibt der Kalender einfach
 * leer bzw. meldet eine klare Fehlermeldung, genau wie getSupabase() es an
 * anderen Stellen im Projekt (z. B. supabaseStore.ts) schon vorsieht.
 */

import { getSupabase } from '../crm/supabaseClient'
import {
  BUCHBAR_TAGE,
  DAUER_MINUTEN,
  ZEITFENSTER_TEXT,
  ZEITZONE,
  slotsFuerTag,
  tagInWien,
  tagPlus,
  tagSchluessel,
  uhrzeitInWien,
  wochentag,
  type Tag,
} from './terminZeiten'

export {
  BUCHBAR_TAGE,
  DAUER_MINUTEN,
  ZEITFENSTER_TEXT,
  ZEITZONE,
  slotsFuerTag,
  tagInWien,
  tagPlus,
  tagSchluessel,
  uhrzeitInWien,
  wochentag,
}
export type { Tag }

/** Fehler mit HTTP-Status (409 = Slot vergeben, 429 = zu viele Anfragen). */
export class BuchungsFehler extends Error {
  constructor(message: string, readonly status?: number) {
    super(message)
  }
}

export interface KennenlernBuchung {
  vorname: string
  nachname: string
  email: string
  telefon: string
  wuensche?: string
  beginn: Date
  datenschutzAkzeptiert: boolean
  /** Honeypot – bleibt bei Menschen leer. */
  website?: string
}

/** Bereits vergebene Startzeiten (ms seit Epoche) im gesamten buchbaren Zeitraum. */
export async function fetchBelegteSlots(): Promise<Set<number>> {
  const client = await getSupabase()
  if (!client) return new Set()

  const heute = tagInWien()
  const von = new Date(Date.UTC(heute.jahr, heute.monat - 1, heute.tag))
  const bisTag = tagPlus(heute, BUCHBAR_TAGE + 1)
  const bis = new Date(Date.UTC(bisTag.jahr, bisTag.monat - 1, bisTag.tag))

  const { data, error } = await client.rpc('kennenlern_belegte_slots', {
    p_von: von.toISOString(),
    p_bis: bis.toISOString(),
  })
  if (error) {
    console.error('termin: belegte Slots konnten nicht geladen werden', error)
    throw error
  }
  return new Set(((data as string[] | null) ?? []).map((iso) => new Date(iso).getTime()))
}

/** Termin buchen. Löst bei Erfolg KEINE Supabase-RLS aus (die Function nutzt
 * den Service-Role-Key) – scheitert die Slot-Prüfung/Rate-Limit/Validierung
 * oder ist der Slot inzwischen vergeben, wirft dies BuchungsFehler mit dem
 * passenden HTTP-Status. */
export async function bucheTermin(input: KennenlernBuchung): Promise<string> {
  const client = await getSupabase()
  if (!client) {
    throw new BuchungsFehler('Buchung ist aktuell nicht verfügbar. Bitte versuch es später erneut.')
  }

  const { data, error } = await client.functions.invoke('submit-termin', {
    body: {
      vorname: input.vorname.trim(),
      nachname: input.nachname.trim(),
      email: input.email.trim(),
      telefon: input.telefon.trim(),
      wuensche: (input.wuensche ?? '').trim(),
      beginn: input.beginn.toISOString(),
      datenschutzAkzeptiert: input.datenschutzAkzeptiert,
      website: input.website ?? '',
    },
  })

  if (error) {
    const status = (error as { context?: { status?: number } }).context?.status
    throw new BuchungsFehler(error.message, status)
  }

  const id = (data as { id?: string } | null)?.id
  if (!id) {
    throw new BuchungsFehler('Buchung konnte nicht verarbeitet werden.')
  }
  return id
}
