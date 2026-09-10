// Löst den Button "Jetzt sofort veröffentlichen" im Website-Editor aus
// (siehe src/pages/crm/AdminWebsite.tsx): stößt einen echten Neu-Build +
// Deploy der Website an, damit die zuletzt gespeicherten
// Text-/Foto-/Bereichs-Änderungen sofort statt erst beim nächsten
// automatischen Lauf live gehen.
//
// WICHTIG: Diese Function ist rein optional. .github/workflows/deploy.yml
// baut die Seite ohnehin automatisch spätestens alle 15 Minuten neu (Cron)
// und übernimmt dabei dieselben gespeicherten Änderungen (siehe
// scripts/prerender.mjs) – ganz ohne dass irgendjemand etwas einrichten
// muss. Diese Function beschleunigt das nur auf ein paar Minuten, FALLS
// irgendwann ein GitHub-Token eingerichtet wird. Ein dafür geeigneter,
// eng auf genau dieses Repo begrenzter Token lässt sich nicht automatisiert
// erzeugen (nur per Web-UI) – deshalb bleibt das bewusst ein optionaler
// Schritt für später statt einer Voraussetzung.
//
// Einrichtung (einmalig, optional):
//   1) GitHub → Settings → Developer settings → Fine-grained tokens → neuen
//      Token NUR für das Repository "coming-home" erstellen, Berechtigung
//      "Actions: Read and write" (löst den Workflow aus), zusätzlich
//      "Contents: Read".
//   2) Diese Function deployen:
//      supabase functions deploy trigger-rebuild --project-ref kvfjmptddweoaawesqyc
//   3) Token als Secret setzen – NICHT über die Kommandozeile im Klartext,
//      sondern über das Supabase-Dashboard: Project Settings → Edge
//      Functions → Secrets → "Add new secret", Name: GITHUB_TOKEN.
//
// Ohne gesetztes GITHUB_TOKEN passiert nichts Schädliches – die Function
// meldet das nur zurück, alles andere (Speichern, automatisches
// Veröffentlichen alle 15 Minuten) funktioniert unabhängig davon immer.

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://jasmindraxl.at',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')
const REPO = 'RDclarity/coming-home'

/** Prüft per RLS (die "eigenes Profil lesen"-Policy erlaubt nur die eigene
 * Zeile), ob der mitgeschickte Login zu einem Admin-Account gehört. */
async function istAdmin(authHeader: string): Promise<boolean> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return false
  const userResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { Authorization: authHeader, apikey: SUPABASE_ANON_KEY },
  })
  if (!userResponse.ok) return false
  const user = await userResponse.json()

  const profileResponse = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}&select=role`,
    { headers: { Authorization: authHeader, apikey: SUPABASE_ANON_KEY } },
  )
  if (!profileResponse.ok) return false
  const rows = await profileResponse.json()
  return Array.isArray(rows) && rows[0]?.role === 'admin'
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS })
  }
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS })
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader || !(await istAdmin(authHeader))) {
    return new Response('Kein Admin-Zugriff', { status: 403, headers: CORS_HEADERS })
  }

  const githubToken = Deno.env.get('GITHUB_TOKEN')
  if (!githubToken) {
    return new Response(
      JSON.stringify({
        ok: true,
        skipped: 'GITHUB_TOKEN nicht gesetzt – kein Problem, die Seite baut sich ohnehin automatisch spätestens alle 15 Minuten neu.',
      }),
      { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
    )
  }

  const dispatchResponse = await fetch(`https://api.github.com/repos/${REPO}/dispatches`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${githubToken}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ event_type: 'publish-content' }),
  })

  const ok = dispatchResponse.status === 204
  if (!ok) {
    console.error('trigger-rebuild: GitHub-Dispatch fehlgeschlagen', dispatchResponse.status, await dispatchResponse.text())
  }

  return new Response(JSON.stringify({ ok }), {
    status: 200,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
})
