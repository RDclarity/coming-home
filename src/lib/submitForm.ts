/**
 * Formularversand.
 *
 * Jede Anfrage landet IMMER im CRM (siehe src/crm/) – das ist die eigentliche
 * Datenquelle und läuft direkt gegen Supabase, unabhängig von allem
 * Folgenden. Zusätzlich:
 *
 *  - Automatische Benachrichtigung per E-Mail an anfrage@jasmindraxl.at über
 *    die Supabase Edge Function `notify-lead` (siehe dort für Setup –
 *    Resend-Account, Domain-Verifizierung, RESEND_API_KEY). Erst aktiv,
 *    sobald VITE_LEAD_NOTIFY_ENDPOINT gesetzt ist.
 *  - Nur mit Cookie-Einwilligung (siehe ConsentBanner.tsx) eine "Lead"-
 *    Conversion bei Google/Meta (siehe lib/tracking.ts).
 *
 * Zusätzlich lässt sich optional ein eigener Formular-Endpoint setzen:
 *
 *   VITE_FORM_ENDPOINT=https://…
 *
 * Dorthin geht ein JSON-POST mit allen Feldern plus `formType` – für
 * Formspree, Basin, n8n, Make o. ä., falls das mal zusätzlich gebraucht wird.
 * NUR wenn WEDER das (VITE_FORM_ENDPOINT) NOCH die E-Mail-Benachrichtigung
 * (VITE_LEAD_NOTIFY_ENDPOINT) konfiguriert sind, fällt der Versand auf einen
 * vorbereiteten E-Mail-Entwurf im Postfach der besuchenden Person zurück –
 * so geht nichts verloren, solange gar kein Backend dafür steht.
 */

import { crmStore } from '../crm/store'
import { trackLead } from './tracking'

const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT as string | undefined
const LEAD_NOTIFY_ENDPOINT = import.meta.env.VITE_LEAD_NOTIFY_ENDPOINT as string | undefined
const FALLBACK_MAIL = 'anfrage@jasmindraxl.at'

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
  notifyLeadSafely(type, data)

  if (!ENDPOINT) {
    // Kein externer Formular-Endpoint gesetzt – solange wenigstens die
    // E-Mail-Benachrichtigung konfiguriert ist, reicht das (plus CRM) als
    // vollständiger Versandweg, ohne dass die besuchende Person selbst noch
    // eine E-Mail abschicken müsste.
    if (!LEAD_NOTIFY_ENDPOINT) openMailDraft(type, data)
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

/**
 * Löst die automatische E-Mail-Benachrichtigung an anfrage@jasmindraxl.at aus
 * (Supabase Edge Function `notify-lead`) – nicht abgewartet, darf den
 * eigentlichen Versand niemals blockieren oder verzögern. Ohne gesetzten
 * VITE_LEAD_NOTIFY_ENDPOINT passiert einfach nichts (siehe openMailDraft-
 * Fallback oben).
 */
function notifyLeadSafely(type: FormType, data: Record<string, FormDataEntryValue>) {
  if (!LEAD_NOTIFY_ENDPOINT) return

  try {
    const fields = Object.fromEntries(
      Object.entries(data)
        .filter(([key]) => key !== 'consent' && key !== 'website' && key !== 'name' && key !== 'email' && key !== 'telefon')
        .map(([key, value]) => [key, String(value)]),
    )

    fetch(LEAD_NOTIFY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formType: type,
        name: data.name ? String(data.name) : undefined,
        email: data.email ? String(data.email) : undefined,
        telefon: data.telefon ? String(data.telefon) : undefined,
        fields,
      }),
      keepalive: true,
    }).catch(() => {
      // E-Mail-Benachrichtigung ist ein Zusatznutzen – der Lead liegt so
      // oder so schon sicher im CRM (recordLeadSafely lief vorher).
    })
  } catch {
    // s. o.
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
