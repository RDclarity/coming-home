/**
 * Formularversand.
 *
 * Die Seite ist bewusst backend-frei gebaut. Setz in `.env` eine Zieladresse:
 *
 *   VITE_FORM_ENDPOINT=https://…
 *
 * Dorthin geht ein JSON-POST mit allen Feldern plus `formType`. Das funktioniert
 * mit Formspree, Basin, einer Supabase Edge Function, n8n, Make – oder jedem
 * eigenen Endpoint.
 *
 * Ohne gesetzten Endpoint fällt der Versand auf einen vorbereiteten E-Mail-Entwurf
 * zurück: Das Postfach des Besuchers öffnet sich mit fertig ausgefülltem Text.
 * So geht nichts verloren, solange das Backend noch nicht steht.
 *
 * Zusätzlich landet jede Anfrage im CRM (siehe src/crm/) und – nur mit
 * Cookie-Einwilligung, siehe ConsentBanner.tsx – als "Lead"-Conversion bei
 * Google/Meta (siehe lib/tracking.ts). Beides läuft rein im Hintergrund und
 * beeinflusst den eigentlichen Versand nicht.
 */

import { crmStore } from '../crm/store'
import { trackLead } from './tracking'

const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT as string | undefined
const FALLBACK_MAIL = 'hallo@cominghome.de'

export type FormType = 'bewerbung' | 'kontakt' | 'newsletter'

export type SubmitResult = { ok: true } | { ok: false; message: string }

const LABELS: Record<FormType, string> = {
  bewerbung: 'Bewerbung Coming-Home-Begleitung',
  kontakt: 'Nachricht über die Website',
  newsletter: 'Anfrage Audioübung',
}

export async function submitForm(
  type: FormType,
  form: HTMLFormElement,
): Promise<SubmitResult> {
  const data = Object.fromEntries(new FormData(form).entries())

  // Honeypot: ein für Menschen unsichtbares Feld namens "website" (siehe die
  // drei Formulare). Bots füllen erfahrungsgemäß blind alle Felder aus,
  // echte Besucher:innen sehen und befüllen es nie. Ist es trotzdem befüllt,
  // tun wir so, als hätte alles geklappt (kein Hinweis an den Bot), legen
  // aber weder einen CRM-Lead an noch senden wir etwas.
  if (String(data.website ?? '').trim() !== '') {
    return { ok: true }
  }

  recordLeadSafely(type, data)
  trackLeadSafely(type, data)

  if (!ENDPOINT) {
    openMailDraft(type, data)
    return { ok: true }
  }

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ formType: type, ...data }),
    })

    if (!response.ok) {
      return {
        ok: false,
        message: 'Das hat leider nicht geklappt. Schreib mir gern direkt an ' + FALLBACK_MAIL + '.',
      }
    }

    return { ok: true }
  } catch {
    return {
      ok: false,
      message: 'Verbindung nicht möglich. Schreib mir gern direkt an ' + FALLBACK_MAIL + '.',
    }
  }
}

/** Legt einen CRM-Lead an – darf den eigentlichen Versand niemals blockieren. */
function recordLeadSafely(type: FormType, data: Record<string, FormDataEntryValue>) {
  try {
    const fields = Object.fromEntries(
      Object.entries(data)
        .filter(([key]) => key !== 'consent' && key !== 'website')
        .map(([key, value]) => [key, String(value)]),
    )

    crmStore.add({
      source: type,
      name: String(data.name ?? ''),
      email: String(data.email ?? ''),
      phone: data.telefon ? String(data.telefon) : undefined,
      fields,
    })
  } catch {
    // Lokales CRM ist ein Zusatznutzen, kein kritischer Pfad – Fehler hier
    // (z. B. localStorage blockiert) dürfen die eigentliche Anfrage nicht stoppen.
  }
}

/** Feuert die Lead-Conversion (Google/Meta) – darf den Versand niemals blockieren. */
function trackLeadSafely(type: FormType, data: Record<string, FormDataEntryValue>) {
  try {
    trackLead(type, {
      email: data.email ? String(data.email) : undefined,
      telefon: data.telefon ? String(data.telefon) : undefined,
    })
  } catch {
    // Tracking ist ein Zusatznutzen, kein kritischer Pfad
  }
}

function openMailDraft(type: FormType, data: Record<string, FormDataEntryValue>) {
  const body = Object.entries(data)
    .filter(([key]) => key !== 'consent' && key !== 'website')
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')

  const href =
    `mailto:${FALLBACK_MAIL}` +
    `?subject=${encodeURIComponent(LABELS[type])}` +
    `&body=${encodeURIComponent(body)}`

  window.location.href = href
}
