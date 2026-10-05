// Edge Function: Platz für einen Workshop reservieren (Nutzerwunsch
// 2026-10-03). Besucher:innen wählen auf der Website 1–4 Plätze für den
// nächsten Workshop und geben Name, E-Mail und Telefon an. Diese Function:
//
//   1. prüft Honeypot, Rate-Limit und Pflichtfelder,
//   2. speichert die Reservierung in workshop_buchungen,
//   3. schickt eine Bestätigung an die buchende Person,
//   4. benachrichtigt Jasmin per Mail.
//
// Bezahlt wird danach direkt bei Jasmin – hier wird nur reserviert.
// E-Mail-Versand über Resend wie bei notify-lead/submit-termin.
//
// Deploy:   supabase functions deploy submit-workshop-buchung --project-ref kvfjmptddweoaawesqyc
// Secrets:  RESEND_API_KEY (bereits gesetzt, siehe notify-lead/index.ts)

import { createClient } from 'jsr:@supabase/supabase-js@2'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://jasmindraxl.at',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const SENDER = 'Coming Home Website <website@jasmindraxl.at>'
// Gleicher Posteingang wie alle anderen Website-Benachrichtigungen.
const EMPFAENGER = 'anfrage@jasmindraxl.at'

const E_MAIL_MUSTER = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SLUG_MUSTER = /^[a-z0-9-]{1,80}$/
const MAX_LAENGE = { name: 80, email: 200, telefon: 40, nachricht: 2000, datum: 60, titel: 120 }
const MAX_PLAETZE = 4

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
}

// Einfacher Rate-Limiter im Arbeitsspeicher der Function-Instanz – gleiches
// Muster und gleiche Einschränkung wie in submit-termin (setzt sich bei
// einem Kaltstart zurück).
const RATE_LIMIT_FENSTER_MS = 15 * 60 * 1000
const RATE_LIMIT_MAX = 5
const anfragenProIp = new Map<string, number[]>()

function clientIp(req: Request): string {
  const cf = req.headers.get('cf-connecting-ip')?.trim()
  if (cf) return cf
  const real = req.headers.get('x-real-ip')?.trim()
  if (real) return real
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unbekannt'
}

function rateLimitErlaubt(ip: string): boolean {
  const jetzt = Date.now()
  const bisherige = (anfragenProIp.get(ip) ?? []).filter((t) => jetzt - t < RATE_LIMIT_FENSTER_MS)
  if (bisherige.length >= RATE_LIMIT_MAX) {
    anfragenProIp.set(ip, bisherige)
    return false
  }
  bisherige.push(jetzt)
  anfragenProIp.set(ip, bisherige)
  return true
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

async function sendeResendMail(apiKey: string, payload: Record<string, unknown>): Promise<boolean> {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    console.error('submit-workshop-buchung: Resend-Versand fehlgeschlagen', await response.text())
  }
  return response.ok
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS_HEADERS })
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS })

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400)
  }

  // Honeypot: still "erfolgreich" antworten, damit der Bot nichts lernt.
  if (String(body.website ?? '').trim() !== '') return jsonResponse({ ok: true, id: 'ok' })

  if (!rateLimitErlaubt(clientIp(req))) {
    return jsonResponse({ error: 'Zu viele Anfragen – bitte in ein paar Minuten erneut versuchen.' }, 429)
  }

  const text = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
  const eventSlug = text(body.eventSlug, 80)
  const eventDatum = text(body.eventDatum, MAX_LAENGE.datum)
  const eventTitel = text(body.eventTitel, MAX_LAENGE.titel)
  const vorname = text(body.vorname, MAX_LAENGE.name)
  const nachname = text(body.nachname, MAX_LAENGE.name)
  const email = text(body.email, MAX_LAENGE.email)
  const telefon = text(body.telefon, MAX_LAENGE.telefon)
  const nachricht = text(body.nachricht, MAX_LAENGE.nachricht)
  const plaetze = Number(body.plaetze)

  for (const [feld, wert] of Object.entries({ eventDatum, eventTitel, vorname, nachname, email, telefon })) {
    if (!wert) return jsonResponse({ error: `Feld fehlt: ${feld}` }, 400)
  }
  if (!SLUG_MUSTER.test(eventSlug)) return jsonResponse({ error: 'Workshop ungültig' }, 400)
  if (!E_MAIL_MUSTER.test(email)) return jsonResponse({ error: 'E-Mail-Adresse ungültig' }, 400)
  if (!Number.isInteger(plaetze) || plaetze < 1 || plaetze > MAX_PLAETZE) {
    return jsonResponse({ error: 'Anzahl Plätze ungültig' }, 400)
  }
  if (body.datenschutzAkzeptiert !== true) return jsonResponse({ error: 'Datenschutz nicht akzeptiert' }, 400)

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('submit-workshop-buchung: SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY fehlen.')
    return jsonResponse({ error: 'Buchung konnte nicht verarbeitet werden' }, 500)
  }
  const supabase = createClient(supabaseUrl, serviceRoleKey)

  const { data: neu, error: dbFehler } = await supabase
    .from('workshop_buchungen')
    .insert({
      event_slug: eventSlug,
      event_datum: eventDatum,
      event_titel: eventTitel,
      vorname,
      nachname,
      email,
      telefon,
      plaetze,
      nachricht: nachricht || null,
    })
    .select('id')
    .single()

  if (dbFehler) {
    console.error('submit-workshop-buchung: Insert fehlgeschlagen', dbFehler)
    return jsonResponse({ error: 'Buchung konnte nicht verarbeitet werden' }, 500)
  }

  // Ab hier steht die Reservierung. Mail-Fehler dürfen sie nie kippen.
  const apiKey = Deno.env.get('RESEND_API_KEY')
  if (!apiKey) {
    console.error('submit-workshop-buchung: RESEND_API_KEY fehlt – keine Mails, Reservierung steht aber.')
    return jsonResponse({ ok: true, id: neu.id })
  }

  const plaetzeText = plaetze === 1 ? '1 Platz' : `${plaetze} Plätze`

  try {
    await sendeResendMail(apiKey, {
      from: SENDER,
      to: [email],
      reply_to: EMPFAENGER,
      subject: `Dein Platz ist reserviert – ${eventTitel}, ${eventDatum}`,
      html: `
        <div style="font-family: sans-serif; font-size: 15px; color: #1e2520;">
          <p>Hallo ${escapeHtml(vorname)},</p>
          <p>danke für deine Reservierung:</p>
          <p style="font-size: 17px; font-weight: 600; margin: 0.5rem 0 1rem;">
            ${escapeHtml(eventTitel)}<br>${escapeHtml(eventDatum)}<br>${escapeHtml(plaetzeText)}
          </p>
          <p>Ich melde mich in den nächsten Tagen mit allen Infos zur Zahlung.</p>
          <p>Falls etwas dazwischenkommt, antworte einfach auf diese E-Mail.</p>
          <p style="margin-top: 1.5rem;">Bis bald,<br>Jasmin</p>
        </div>`,
      text:
        `Hallo ${vorname},\n\ndanke für deine Reservierung:\n${eventTitel}\n${eventDatum}\n${plaetzeText}\n\n` +
        `Ich melde mich in den nächsten Tagen mit allen Infos zur Zahlung.\n` +
        `Falls etwas dazwischenkommt, antworte einfach auf diese E-Mail.\n\nBis bald,\nJasmin`,
    })
  } catch (e) {
    console.error('submit-workshop-buchung: Bestätigungsmail fehlgeschlagen', e)
  }

  try {
    const rows: Array<[string, string]> = [
      ['Workshop', `${eventTitel} – ${eventDatum}`],
      ['Plätze', String(plaetze)],
      ['Name', `${vorname} ${nachname}`],
      ['E-Mail', email],
      ['Telefon', telefon],
    ]
    if (nachricht) rows.push(['Nachricht', nachricht])
    await sendeResendMail(apiKey, {
      from: SENDER,
      to: [EMPFAENGER],
      reply_to: email,
      subject: `Neue Workshop-Reservierung: ${vorname} ${nachname} (${plaetzeText}) – ${eventDatum}`,
      html: `
        <div style="font-family: sans-serif; font-size: 15px; color: #1e2520;">
          <h2 style="margin: 0 0 1rem;">Neue Workshop-Reservierung</h2>
          <table cellpadding="6" style="border-collapse: collapse;">
            ${rows
              .map(
                ([k, v]) =>
                  `<tr><td style="font-weight: 600; vertical-align: top; padding-right: 1rem;">${escapeHtml(k)}</td><td style="white-space: pre-wrap;">${escapeHtml(v)}</td></tr>`,
              )
              .join('')}
          </table>
        </div>`,
      text: rows.map(([k, v]) => `${k}: ${v}`).join('\n'),
    })
  } catch (e) {
    console.error('submit-workshop-buchung: Benachrichtigung an Jasmin fehlgeschlagen', e)
  }

  return jsonResponse({ ok: true, id: neu.id })
})
