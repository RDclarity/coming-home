/**
 * Client-API für die Platz-Reservierung beim Workshop (Nutzerwunsch
 * 2026-10-03: "Nächster Termin" führt direkt zur Buchung). Siehe
 * supabase/migrations/00000000000008_workshop_buchungen.sql und die Edge
 * Function submit-workshop-buchung. Bezahlt wird danach direkt bei Jasmin –
 * hier wird nur der Platz reserviert.
 */

import { getSupabase } from '../crm/supabaseClient'
import { BuchungsFehler } from './termin'

export { BuchungsFehler }

export const MAX_PLAETZE = 4

export interface WorkshopBuchungEingabe {
  eventSlug: string
  eventDatum: string
  eventTitel: string
  vorname: string
  nachname: string
  email: string
  telefon: string
  plaetze: number
  nachricht?: string
  datenschutzAkzeptiert: boolean
  /** Honeypot – bleibt bei Menschen leer. */
  website?: string
}

export async function bucheWorkshop(input: WorkshopBuchungEingabe): Promise<string> {
  const client = await getSupabase()
  if (!client) {
    throw new BuchungsFehler('Buchung ist aktuell nicht verfügbar. Bitte versuch es später erneut.')
  }

  const { data, error } = await client.functions.invoke('submit-workshop-buchung', {
    body: {
      eventSlug: input.eventSlug,
      eventDatum: input.eventDatum,
      eventTitel: input.eventTitel,
      vorname: input.vorname.trim(),
      nachname: input.nachname.trim(),
      email: input.email.trim(),
      telefon: input.telefon.trim(),
      plaetze: input.plaetze,
      nachricht: (input.nachricht ?? '').trim(),
      datenschutzAkzeptiert: input.datenschutzAkzeptiert,
      website: input.website ?? '',
    },
  })

  if (error) {
    const status = (error as { context?: { status?: number } }).context?.status
    throw new BuchungsFehler(error.message, status)
  }

  const id = (data as { id?: string } | null)?.id
  if (!id) throw new BuchungsFehler('Buchung konnte nicht verarbeitet werden.')
  return id
}
