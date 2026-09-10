// Verschickt den ausgefüllten Fragebogen als PDF an die eigene E-Mail-Adresse
// des Mitglieds (Button "Als PDF an meine E-Mail senden" im Mitgliederbereich,
// siehe src/pages/members/Mitglieder.tsx). Das PDF wird bereits im Browser
// erzeugt (lazy geladenes jsPDF, siehe dort) – diese Function verschickt nur
// die fertige Datei per Resend.
//
// WICHTIG: Die Ziel-Adresse kommt NIE aus dem Request-Body, sondern
// ausschließlich aus dem echten, serverseitig geprüften Login (Authorization-
// Header) – sonst könnte ein angemeldetes Mitglied diese Function missbrauchen,
// um beliebige fremde Adressen anzuschreiben.
//
// Nutzt Resend, wie schon supabase/functions/notify-lead/ – Einrichtung ist
// identisch (selber Account, selber RESEND_API_KEY-Secret):
//   supabase functions deploy send-questionnaire-pdf --project-ref kvfjmptddweoaawesqyc
//
// Der einzige neue Schritt hier ist Punkt 1: die Function verlangt einen
// gültigen Login (Supabase prüft das "Authorization: Bearer <token>"
// automatisch selbst, bevor der Code unten überhaupt läuft – Standard-
// Verhalten für Edge Functions ohne "--no-verify-jwt").

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://jasmindraxl.at',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const SENDER = 'Coming Home Website <website@jasmindraxl.at>'
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')

type Body = {
  title?: string
  filename?: string
  pdfBase64?: string
}

/** Holt die E-Mail-Adresse zum mitgeschickten Login-Token – direkt bei
 * Supabase Auth erfragt (keine zusätzliche Bibliothek nötig), damit die
 * Adresse garantiert zum echten, gerade eingeloggten Account gehört. */
async function emailFuerToken(authHeader: string): Promise<string | null> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { Authorization: authHeader, apikey: SUPABASE_ANON_KEY },
  })
  if (!response.ok) return null
  const user = await response.json()
  return typeof user.email === 'string' ? user.email : null
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS })
  }
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS })
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response('Nicht angemeldet', { status: 401, headers: CORS_HEADERS })
  }
  const email = await emailFuerToken(authHeader)
  if (!email) {
    return new Response('Login ungültig', { status: 401, headers: CORS_HEADERS })
  }

  const apiKey = Deno.env.get('RESEND_API_KEY')
  if (!apiKey) {
    return new Response(JSON.stringify({ ok: true, skipped: 'RESEND_API_KEY nicht gesetzt' }), {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  let body: Body
  try {
    body = await req.json()
  } catch {
    return new Response('Invalid JSON', { status: 400, headers: CORS_HEADERS })
  }
  if (!body.pdfBase64) {
    return new Response('pdfBase64 fehlt', { status: 400, headers: CORS_HEADERS })
  }

  const filename = body.filename || 'fragebogen.pdf'
  const subject = body.title ? `Dein ausgefüllter Fragebogen: ${body.title}` : 'Dein ausgefüllter Fragebogen'

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: SENDER,
      to: [email],
      subject,
      html: `<p>Hallo,</p><p>im Anhang findest du deinen ausgefüllten Fragebogen als PDF.</p>`,
      text: 'Im Anhang findest du deinen ausgefüllten Fragebogen als PDF.',
      attachments: [{ filename, content: body.pdfBase64 }],
    }),
  })

  const ok = resendResponse.ok
  if (!ok) {
    console.error('send-questionnaire-pdf: Resend-Versand fehlgeschlagen', await resendResponse.text())
  }

  return new Response(JSON.stringify({ ok }), {
    status: 200,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
})
