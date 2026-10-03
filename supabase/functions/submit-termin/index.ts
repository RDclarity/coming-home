// Edge Function: Kennenlerngespräch direkt buchen (kostenloses 20-Minuten-
// Telefonat). Ersetzt den alten Bewerbungsbogen-Trichter für dieses eine
// Gespräch (Nutzerwunsch 2026-10-03): Besucher:innen wählen auf der Website
// direkt einen freien 20-Minuten-Slot (Mo–Fr 9–17 Uhr, Wiener Ortszeit) und
// buchen ihn sofort – ohne Formular, ohne Freigabe durch Jasmin. Diese
// Function:
//
//   1. prüft Honeypot, Rate-Limit, Pflichtfelder und den gewählten Slot
//      (siehe _shared/termin-zeiten.ts – serverseitige Prüfung, der Client
//      kann die Zeit NICHT frei erfinden),
//   2. speichert die Buchung in kennenlern_termine (ein eindeutiger Index
//      auf `beginn`, siehe Migration, verhindert Doppelbuchungen – zwei
//      Besucher:innen, die im selben Moment denselben Slot wählen, bekommen
//      dort einen 409),
//   3. schickt eine Bestätigung an die buchende Person,
//   4. benachrichtigt Jasmin per Mail.
//
// E-Mail-Versand über Resend, wie schon supabase/functions/notify-lead/ –
// Einrichtung ist identisch (selber Account, selbe verifizierte Domain,
// selbes RESEND_API_KEY-Secret, siehe dort für die Schritt-für-Schritt-
// Anleitung).
//
// Deploy:   supabase functions deploy submit-termin --project-ref kvfjmptddweoaawesqyc
// Secrets:  RESEND_API_KEY (siehe notify-lead/index.ts)
//           SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY stehen Edge Functions
//           immer automatisch zur Verfügung, müssen nicht gesetzt werden.
//
// WICHTIG: _shared/termin-zeiten.ts ist absichtlich eine 1:1-Kopie von
// src/lib/terminZeiten.ts (kein Deno-/DOM-Code darin) – bei einer Änderung
// der Zeiten/Slot-Logik IMMER beide Dateien anpassen, siehe Kommentar dort.

import { createClient } from 'jsr:@supabase/supabase-js@2'
import { DAUER_MINUTEN, ZEITZONE, istBuchbarerSlot } from '../_shared/termin-zeiten.ts'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://jasmindraxl.at',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const SENDER = 'Coming Home Website <website@jasmindraxl.at>'
// Dieselbe Adresse, an die notify-lead schon jede andere Website-
// Benachrichtigung schickt (siehe supabase/functions/notify-lead/index.ts,
// RECIPIENT). Bewusst NICHT site.ts' allgemeine öffentliche Kontaktadresse
// (hallo@jasmindraxl.at) – damit landen alle automatischen
// Website-Benachrichtigungen weiterhin in genau einem Posteingang.
const EMPFAENGER = 'anfrage@jasmindraxl.at'

const E_MAIL_MUSTER = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_LAENGE = { name: 80, email: 200, telefon: 40, wuensche: 2000 }

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
}

// ---------------------------------------------------------------------------
// Minimaler, bewusst einfacher Rate-Limiter.
//
// Coming Home hat (Stand 2026-10-03) an keiner bestehenden Stelle einen
// Rate-Limit-Mechanismus (geprüft: notify-lead, send-questionnaire-pdf,
// send-conversion, trigger-rebuild – keine Treffer). Das Schwesterprojekt
// tischlerkultur-relaunch löst das über eine eigene DB-Tabelle
// (`formular_anfragen`, siehe supabase/functions/_shared/rate-limit.ts dort).
// Um für diese Aufgabe keine zusätzliche Tabelle/Datei über die fünf
// vorgesehenen Dateien hinaus einzuführen, zählt diese Function die
// Anfragen nur im Arbeitsspeicher der laufenden Function-Instanz.
//
// Einschränkung: der Zähler setzt sich bei einem Kaltstart (neue Instanz)
// zurück – schwächer als eine DB-Lösung, aber eine wirksame erste Bremse
// gegen automatisiertes Massen-Buchen innerhalb einer laufenden Instanz.
// Bei Bedarf später durch eine Tabelle nach demselben Muster wie im
// Schwesterprojekt ersetzen.
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

// ---------------------------------------------------------------------------

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function terminText(beginn: Date): string {
  const datum = beginn.toLocaleDateString('de-AT', {
    timeZone: ZEITZONE,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const von = beginn.toLocaleTimeString('de-AT', { timeZone: ZEITZONE, hour: '2-digit', minute: '2-digit' })
  const bis = new Date(beginn.getTime() + DAUER_MINUTEN * 60000).toLocaleTimeString('de-AT', {
    timeZone: ZEITZONE,
    hour: '2-digit',
    minute: '2-digit',
  })
  return `${datum}, ${von}–${bis} Uhr`
}

/** Ein Resend-Versand – wirft nie, meldet Erfolg/Fehler nur über den Rückgabewert
 * (Aufrufer entscheidet selbst, ob/wie geloggt wird). Gleiches HTTP-Muster wie
 * notify-lead/index.ts und send-questionnaire-pdf/index.ts. */
async function sendeResendMail(apiKey: string, payload: Record<string, unknown>): Promise<boolean> {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    console.error('submit-termin: Resend-Versand fehlgeschlagen', await response.text())
  }
  return response.ok
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS })
  }
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400)
  }

  // Honeypot: ein für Menschen unsichtbares Feld namens "website" (gleiches
  // Muster wie src/lib/submitForm.ts/notify-lead). Bots füllen es erfahrungs-
  // gemäß blind aus – ist es befüllt, tun wir so, als hätte alles geklappt
  // (kein Hinweis an den Bot), legen aber weder eine Buchung an noch senden
  // wir etwas.
  if (String(body.website ?? '').trim() !== '') {
    return jsonResponse({ ok: true })
  }

  if (!rateLimitErlaubt(clientIp(req))) {
    return jsonResponse({ error: 'Zu viele Anfragen – bitte in ein paar Minuten erneut versuchen.' }, 429)
  }

  const text = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
  const vorname = text(body.vorname, MAX_LAENGE.name)
  const nachname = text(body.nachname, MAX_LAENGE.name)
  const email = text(body.email, MAX_LAENGE.email)
  const telefon = text(body.telefon, MAX_LAENGE.telefon)
  const wuensche = text(body.wuensche, MAX_LAENGE.wuensche)

  for (const [feld, wert] of Object.entries({ vorname, nachname, email, telefon })) {
    if (!wert) return jsonResponse({ error: `Feld fehlt: ${feld}` }, 400)
  }
  if (!E_MAIL_MUSTER.test(email)) {
    return jsonResponse({ error: 'E-Mail-Adresse ungültig' }, 400)
  }
  if (body.datenschutzAkzeptiert !== true) {
    return jsonResponse({ error: 'Datenschutz nicht akzeptiert' }, 400)
  }

  const beginn = new Date(String(body.beginn ?? ''))
  if (!istBuchbarerSlot(beginn)) {
    return jsonResponse({ error: 'Dieser Termin ist nicht (mehr) buchbar.' }, 409)
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('submit-termin: SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY fehlen – kann nicht speichern.')
    return jsonResponse({ error: 'Buchung konnte nicht verarbeitet werden' }, 500)
  }
  const supabase = createClient(supabaseUrl, serviceRoleKey)

  // Service-Role-Client umgeht RLS bewusst – anon darf laut Migration NICHT
  // direkt in kennenlern_termine schreiben, genau damit JEDE Buchung diese
  // Function (und damit die Slot-/Rate-Limit-/Pflichtfeld-Prüfung oben)
  // durchläuft. Der eindeutige Index auf `beginn` (siehe Migration) ist die
  // eigentliche, serverseitige Quelle der Wahrheit gegen Doppelbuchungen –
  // nicht die Prüfung weiter oben, die nur den Normalfall schnell und
  // freundlich abfängt.
  const { data: neu, error: dbFehler } = await supabase
    .from('kennenlern_termine')
    .insert({
      beginn: beginn.toISOString(),
      dauer_minuten: DAUER_MINUTEN,
      vorname,
      nachname,
      email,
      telefon,
      wuensche: wuensche || null,
    })
    .select('id')
    .single()

  if (dbFehler) {
    if (dbFehler.code === '23505') {
      return jsonResponse({ error: 'Dieser Termin wurde gerade vergeben.' }, 409)
    }
    console.error('submit-termin: Insert fehlgeschlagen', dbFehler)
    return jsonResponse({ error: 'Buchung konnte nicht verarbeitet werden' }, 500)
  }

  const wann = terminText(beginn)

  // Ab hier ist die Buchung bereits sicher gespeichert. Ein Fehler beim
  // E-Mail-Versand darf das NIE mehr rückgängig machen – deshalb läuft jeder
  // Versand in seinem eigenen try/catch und wird nur geloggt, nicht nach
  // außen als Fehler der Buchung gemeldet.
  const apiKey = Deno.env.get('RESEND_API_KEY')
  if (!apiKey) {
    console.error('submit-termin: RESEND_API_KEY nicht gesetzt – keine E-Mails verschickt, Buchung steht aber.')
    return jsonResponse({ ok: true, id: neu.id })
  }

  try {
    const html = `
      <div style="font-family: sans-serif; font-size: 15px; color: #181817;">
        <p>Hallo ${escapeHtml(vorname)},</p>
        <p>dein Kennenlerngespräch steht:</p>
        <p style="font-size: 17px; font-weight: 600; margin: 0.5rem 0 1rem;">${escapeHtml(wann)}</p>
        <p>Jasmin ruft dich an unter ${escapeHtml(telefon)}.</p>
        <p>Falls dazwischen etwas dazwischenkommt, antworte einfach auf diese E-Mail.</p>
        <p style="margin-top: 1.5rem;">Bis bald,<br>Jasmin</p>
      </div>
    `
    const plain =
      `Hallo ${vorname},\n\n` +
      `dein Kennenlerngespräch steht: ${wann}.\n` +
      `Jasmin ruft dich an unter ${telefon}.\n\n` +
      `Falls dazwischen etwas dazwischenkommt, antworte einfach auf diese E-Mail.\n\n` +
      `Bis bald,\nJasmin`

    await sendeResendMail(apiKey, {
      from: SENDER,
      to: [email],
      // So landet eine Antwort direkt bei Jasmin, nicht bei Resend/der Website.
      reply_to: EMPFAENGER,
      subject: `Dein Kennenlerngespräch – ${wann}`,
      html,
      text: plain,
    })
  } catch (e) {
    console.error('submit-termin: Bestätigungsmail an die buchende Person fehlgeschlagen', e)
  }

  try {
    const rows: Array<[string, string]> = [
      ['Termin', wann],
      ['Name', `${vorname} ${nachname}`],
      ['E-Mail', email],
      ['Telefon', telefon],
    ]
    if (wuensche) rows.push(['Wünsche', wuensche])

    const html = `
      <div style="font-family: sans-serif; font-size: 15px; color: #181817;">
        <h2 style="margin: 0 0 1rem;">Neues Kennenlerngespräch gebucht</h2>
        <table cellpadding="6" style="border-collapse: collapse;">
          ${rows
            .map(
              ([key, value]) => `
            <tr>
              <td style="font-weight: 600; vertical-align: top; padding-right: 1rem;">${escapeHtml(key)}</td>
              <td style="white-space: pre-wrap;">${escapeHtml(value)}</td>
            </tr>`,
            )
            .join('')}
        </table>
      </div>
    `
    const plain = rows.map(([key, value]) => `${key}: ${value}`).join('\n')

    await sendeResendMail(apiKey, {
      from: SENDER,
      to: [EMPFAENGER],
      // So kann Jasmin direkt antworten und landet bei der buchenden Person.
      reply_to: email,
      subject: `Neues Kennenlerngespräch: ${vorname} ${nachname} – ${wann}`,
      html,
      text: plain,
    })
  } catch (e) {
    console.error('submit-termin: Benachrichtigungsmail an Jasmin fehlgeschlagen', e)
  }

  return jsonResponse({ ok: true, id: neu.id })
})
