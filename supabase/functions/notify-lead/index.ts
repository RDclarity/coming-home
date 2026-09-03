// Verschickt bei jeder neuen Anfrage automatisch eine E-Mail an
// anfrage@jasmindraxl.at – zusätzlich zum CRM-Eintrag (der läuft unabhängig
// davon direkt über den Supabase-Insert in src/crm/supabaseStore.ts und
// funktioniert auch dann noch, wenn diese Function mal ausfällt).
//
// Nutzt Resend (https://resend.com) zum Versand. Diese Function wird – wie
// die anderen Edge Functions in diesem Projekt – bewusst NICHT automatisch
// deployt. Einrichtung:
//
//   1) Bei https://resend.com einen kostenlosen Account anlegen.
//   2) Dort die Domain jasmindraxl.at hinzufügen ("Domains" → "Add Domain")
//      und die von Resend angezeigten DNS-Einträge (TXT/DKIM, meist auch
//      ein MX für Bounces) im DNS-Panel deines Hosting-Anbieters (easyname)
//      eintragen – genau wie schon bei der GitHub-Pages-Domain. Ohne diesen
//      Schritt kann Resend keine E-Mails "von jasmindraxl.at" verschicken.
//   3) Unter "API Keys" einen neuen Key erstellen (Berechtigung "Sending
//      Access" reicht).
//   4) Diese Function deployen:
//      supabase functions deploy notify-lead --project-ref kvfjmptddweoaawesqyc
//   5) Den API-Key als Secret setzen – NICHT über die Kommandozeile mit dem
//      Key im Klartext, sondern über das Supabase-Dashboard:
//      Project Settings → Edge Functions → Secrets → "Add new secret",
//      Name: RESEND_API_KEY.
//   6) Die von Schritt 4 ausgegebene URL als VITE_LEAD_NOTIFY_ENDPOINT ins
//      Frontend eintragen (.env lokal + GitHub-Secret fürs Deployment).
//
// Erst wenn RESEND_API_KEY gesetzt UND die Domain bei Resend verifiziert
// ist, kommen echte E-Mails an – bis dahin läuft alles andere unverändert
// weiter (CRM-Eintrag ist davon nie abhängig).

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://jasmindraxl.at',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const RECIPIENT = 'anfrage@jasmindraxl.at'
const SENDER = 'Coming Home Website <website@jasmindraxl.at>'

const FORM_TYPE_LABELS: Record<string, string> = {
  bewerbung: 'Bewerbungsbogen',
  kontakt: 'Kontaktformular',
  newsletter: 'Audioübung',
}

type LeadPayload = {
  formType?: string
  name?: string
  email?: string
  telefon?: string
  fields?: Record<string, string>
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildEmail(body: LeadPayload) {
  const typeLabel = FORM_TYPE_LABELS[body.formType ?? ''] ?? 'Anfrage'
  const subject = `Neue Anfrage über die Website: ${typeLabel}${body.name ? ` – ${body.name}` : ''}`

  const rows: Array<[string, string]> = [
    ['Formular', typeLabel],
    ['Name', body.name || '–'],
    ['E-Mail', body.email || '–'],
  ]
  if (body.telefon) rows.push(['Telefon', body.telefon])
  for (const [key, value] of Object.entries(body.fields ?? {})) {
    if (!value) continue
    rows.push([key, value])
  }

  const html = `
    <div style="font-family: sans-serif; font-size: 15px; color: #181817;">
      <h2 style="margin: 0 0 1rem;">Neue Anfrage – ${escapeHtml(typeLabel)}</h2>
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
      <p style="margin-top: 1.5rem; opacity: 0.7;">
        Landet zusätzlich im CRM: https://jasmindraxl.at/admin
      </p>
    </div>
  `

  const text = rows.map(([key, value]) => `${key}: ${value}`).join('\n')

  return { subject, html, text }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS })
  }
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS })
  }

  const apiKey = Deno.env.get('RESEND_API_KEY')
  if (!apiKey) {
    // Nicht konfiguriert – kein Fehler nach außen, einfach überspringen
    // (genau wie bei send-conversion). Der CRM-Eintrag ist davon unabhängig
    // längst passiert.
    return new Response(JSON.stringify({ ok: true, skipped: 'RESEND_API_KEY nicht gesetzt' }), {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  let body: LeadPayload
  try {
    body = await req.json()
  } catch {
    return new Response('Invalid JSON', { status: 400, headers: CORS_HEADERS })
  }

  const { subject, html, text } = buildEmail(body)

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: SENDER,
      to: [RECIPIENT],
      // So kann Jasmin direkt auf die E-Mail antworten und landet bei der
      // Person, die die Anfrage geschickt hat – nicht bei Resend/der Website.
      reply_to: body.email || undefined,
      subject,
      html,
      text,
    }),
  })

  const ok = resendResponse.ok
  if (!ok) {
    console.error('notify-lead: Resend-Versand fehlgeschlagen', await resendResponse.text())
  }

  return new Response(JSON.stringify({ ok }), {
    status: 200,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
})
