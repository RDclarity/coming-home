// Nimmt Conversion-Events vom Frontend entgegen (siehe src/lib/tracking.ts,
// trackLead()) und leitet sie SERVERSEITIG weiter an:
//
//  - Meta Conversions API   (zuverlässiger als das reine Browser-Pixel –
//    läuft auch bei Adblockern/Safari-ITP durch, die Client-Pixel oft
//    blockieren; E-Mail/Telefon werden dafür gehasht übertragen, siehe
//    sha256Hex(), NIE im Klartext)
//  - GA4 Measurement Protocol (gleicher Vorteil für Google Analytics)
//
// Diese Function wird – wie die anderen Edge Functions in diesem Projekt –
// bewusst NICHT automatisch deployt. Selbst einrichten:
//
//   1) Function deployen:
//      supabase functions deploy send-conversion --project-ref kvfjmptddweoaawesqyc
//
//   2) Nur die Secrets setzen, die ihr wirklich nutzt (alles andere bleibt
//      leer und wird einfach übersprungen, kein Fehler):
//      supabase secrets set \
//        META_PIXEL_ID=... META_CAPI_ACCESS_TOKEN=... \
//        GA4_MEASUREMENT_ID=... GA4_API_SECRET=...
//
//   3) Die von Schritt 1 ausgegebene URL als VITE_CONVERSION_ENDPOINT ins
//      Frontend eintragen (.env lokal + GitHub-Secret fürs Deployment).
//
// Meta Pixel ID + Access Token: Meta Events Manager → Datenquellen → euer
// Pixel → Einstellungen → Conversions API → Zugriffstoken generieren.
// GA4 Measurement ID + API Secret: GA4 → Verwaltung → Datenstreams → euer
// Stream → Measurement Protocol-API-Geheimnisse.

// Bewusst NICHT '*': Diese Function schickt Events an Meta/GA4 weiter, die
// dort als "echte" Conversions zählen – ein offenes CORS würde es jeder
// beliebigen fremden Website erlauben, gefälschte Conversions in Jasmins
// Werbekonten einzuspeisen. Nur die eigene Domain darf sie aufrufen.
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://jasmindraxl.at',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

type ConversionPayload = {
  eventId?: string
  eventName?: string
  formType?: string
  email?: string
  phone?: string
  pageUrl?: string
}

async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value.trim().toLowerCase())
  const hash = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function forwardToMeta(body: ConversionPayload, eventId: string, eventTimeSeconds: number) {
  const pixelId = Deno.env.get('META_PIXEL_ID')
  const accessToken = Deno.env.get('META_CAPI_ACCESS_TOKEN')
  if (!pixelId || !accessToken) return // nicht konfiguriert – wird übersprungen

  const userData: Record<string, string> = {}
  if (body.email) userData.em = await sha256Hex(body.email)
  if (body.phone) userData.ph = await sha256Hex(body.phone.replace(/[^0-9]/g, ''))

  const payload = {
    data: [
      {
        event_name: body.eventName ?? 'Lead',
        event_time: eventTimeSeconds,
        event_id: eventId,
        event_source_url: body.pageUrl,
        action_source: 'website',
        user_data: userData,
      },
    ],
  }

  await fetch(`https://graph.facebook.com/v20.0/${pixelId}/events?access_token=${accessToken}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

async function forwardToGa4(body: ConversionPayload, eventId: string) {
  const measurementId = Deno.env.get('GA4_MEASUREMENT_ID')
  const apiSecret = Deno.env.get('GA4_API_SECRET')
  if (!measurementId || !apiSecret) return // nicht konfiguriert – wird übersprungen

  // Das GA4 Measurement Protocol erwartet eine client_id aus dem Browser-
  // Cookie (_ga), die wir hier serverseitig nicht haben. eventId als Ersatz
  // sorgt zumindest für eine stabile, eindeutige Kennung pro Event – für
  // exakte Nutzerzuordnung im Google-Ads-Konto zusätzlich Enhanced
  // Conversions clientseitig aktivieren (siehe README).
  const payload = {
    client_id: eventId,
    events: [
      {
        name: (body.eventName ?? 'Lead') === 'Lead' ? 'generate_lead' : body.eventName,
        params: { form_type: body.formType },
      },
    ],
  }

  await fetch(
    `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
    { method: 'POST', body: JSON.stringify(payload) },
  )
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS })
  }
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS })
  }

  let body: ConversionPayload
  try {
    body = await req.json()
  } catch {
    return new Response('Invalid JSON', { status: 400, headers: CORS_HEADERS })
  }

  const eventId = body.eventId ?? crypto.randomUUID()
  const eventTimeSeconds = Math.floor(Date.now() / 1000)

  const results = await Promise.allSettled([
    forwardToMeta(body, eventId, eventTimeSeconds),
    forwardToGa4(body, eventId),
  ])

  return new Response(JSON.stringify({ ok: true, results: results.map((r) => r.status) }), {
    status: 200,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
})
