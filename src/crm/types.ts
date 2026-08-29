/**
 * Datenmodell des CRM. Bewusst backend-unabhängig gehalten: `Lead` beschreibt
 * nur die Daten, `CrmStore` nur die Operationen darauf – keine Zeile hier
 * weiß, WO die Daten liegen. Siehe store.ts für die aktuelle Implementierung.
 */

export type LeadSource = 'bewerbung' | 'kontakt' | 'newsletter'

export type LeadStatus = 'neu' | 'kontaktiert' | 'gebucht' | 'abgeschlossen' | 'abgesagt'

export type Lead = {
  id: string
  createdAt: string // ISO-String
  source: LeadSource
  status: LeadStatus
  name: string
  email: string
  phone?: string
  /** Rohdaten des jeweiligen Formulars – Programm, Situation, Nachricht, … */
  fields: Record<string, string>
  notes: LeadNote[]
}

export type LeadNote = {
  id: string
  createdAt: string
  text: string
}

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  bewerbung: 'Bewerbungsbogen',
  kontakt: 'Kontaktformular',
  newsletter: 'Audioübung',
}

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  neu: 'Neu',
  kontaktiert: 'Kontaktiert',
  gebucht: 'Gebucht',
  abgeschlossen: 'Abgeschlossen',
  abgesagt: 'Abgesagt',
}

/**
 * Austauschbare Speicher-Schnittstelle. Der aktuelle Adapter (store.ts)
 * schreibt in localStorage. Ein späterer Supabase-Adapter müsste nur dieses
 * Interface erfüllen – der Rest der App (Formulare, CRM-Seite) bliebe
 * unverändert.
 */
export type CrmStore = {
  list(): Lead[]
  get(id: string): Lead | undefined
  add(input: Omit<Lead, 'id' | 'createdAt' | 'status' | 'notes'>): Lead
  updateStatus(id: string, status: LeadStatus): void
  addNote(id: string, text: string): void
  remove(id: string): void
  subscribe(listener: () => void): () => void
}
