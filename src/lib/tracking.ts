/**
 * Tracking (Google Analytics, Google Ads, Meta Pixel) – DSGVO-konform:
 *
 *  - Es wird NICHTS geladen, bevor eine besuchende Person aktiv zugestimmt
 *    hat (siehe ConsentBanner.tsx). Zustimmung/Ablehnung landet in
 *    localStorage, damit die Wahl nicht bei jedem Besuch neu gefragt wird.
 *  - Jedes einzelne Tool bleibt aus, solange die zugehörige ID nicht gesetzt
 *    ist (siehe .env.example) – exakt dasselbe Prinzip wie beim Supabase-CRM
 *    (crm/supabaseClient.ts): ohne Konfiguration passiert einfach nichts.
 *
 * Serverseitige Ergänzung: Bei jeder erfolgreichen Formular-Anfrage (siehe
 * submitForm.ts) wird zusätzlich ein Event an eine Supabase Edge Function
 * geschickt (supabase/functions/send-conversion/), die es SERVERSEITIG an
 * die Meta Conversions API und das GA4 Measurement Protocol weiterleitet.
 * Vorteil: Das funktioniert auch dann noch zuverlässig, wenn ein Adblocker
 * das Browser-Pixel blockiert – ein bekanntes Problem bei reinem
 * Client-Side-Tracking, das Werbekonten sonst Conversions unterzählen lässt.
 */

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined
const GOOGLE_ADS_ID = import.meta.env.VITE_GOOGLE_ADS_ID as string | undefined
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined
const CONVERSION_ENDPOINT = import.meta.env.VITE_CONVERSION_ENDPOINT as string | undefined

/** Ob überhaupt irgendein Tracking-Tool konfiguriert ist – steuert, ob der Consent-Banner erscheint. */
export const trackingConfigured = Boolean(GA_MEASUREMENT_ID || GOOGLE_ADS_ID || META_PIXEL_ID)

const CONSENT_KEY = 'coming-home:consent'
type Consent = 'accepted' | 'declined'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    fbq?: ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[] }
  }
}

export function getConsent(): Consent | null {
  try {
    const value = localStorage.getItem(CONSENT_KEY)
    return value === 'accepted' || value === 'declined' ? value : null
  } catch {
    return null
  }
}

export function setConsent(value: Consent) {
  try {
    localStorage.setItem(CONSENT_KEY, value)
  } catch {
    // localStorage blockiert (privater Modus) – Wahl gilt dann nur für diesen Aufruf
  }
  if (value === 'accepted') loadTracking()
}

let alreadyLoaded = false

/** Lädt die Tracking-Skripte. Nur nach Einwilligung aufrufen – siehe ConsentBanner.tsx. */
export function loadTracking() {
  if (alreadyLoaded || typeof window === 'undefined') return
  alreadyLoaded = true

  if (GA_MEASUREMENT_ID || GOOGLE_ADS_ID) {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID ?? GOOGLE_ADS_ID}`
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer ?? []
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer!.push(args)
    }
    window.gtag('js', new Date())
    if (GA_MEASUREMENT_ID) window.gtag('config', GA_MEASUREMENT_ID)
    if (GOOGLE_ADS_ID) window.gtag('config', GOOGLE_ADS_ID)
  }

  if (META_PIXEL_ID) {
    // Klassisches Meta-Pixel-Boilerplate (sonst als inline-<script> verteilt) –
    // bewusst locker typisiert, das ist reiner Ladeglue für ein Fremdscript.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stub: any = function (...args: unknown[]) {
      stub.queue.push(args)
    }
    stub.queue = []
    window.fbq = stub

    const script = document.createElement('script')
    script.async = true
    script.src = 'https://connect.facebook.net/en_US/fbevents.js'
    document.head.appendChild(script)

    stub('init', META_PIXEL_ID)
    stub('track', 'PageView')
  }
}

/**
 * Feuert ein "Lead"-Event – client-seitig (Pixel/gtag, sofern geladen) UND
 * serverseitig (Edge Function, sofern VITE_CONVERSION_ENDPOINT gesetzt ist).
 * `eventId` ist für beide Wege identisch, damit Meta Client-Pixel und
 * Server-CAPI dasselbe Ereignis erkennen und nicht doppelt zählen
 * (offizielle Meta-Empfehlung zur "Event Deduplication").
 *
 * Wird von submitForm.ts nach jeder erfolgreich versendeten Anfrage
 * aufgerufen – nie blockierend, nie mit Fehlern nach außen.
 */
export function trackLead(formType: string, data: { email?: string; telefon?: string }) {
  if (getConsent() !== 'accepted') return

  const eventId =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `lead_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`

  try {
    if (window.gtag) {
      window.gtag('event', 'generate_lead', { event_id: eventId, form_type: formType })
      if (GOOGLE_ADS_ID) window.gtag('event', 'conversion', { send_to: GOOGLE_ADS_ID })
    }
    if (window.fbq) {
      window.fbq('track', 'Lead', { content_name: formType }, { eventID: eventId })
    }
  } catch {
    // Tracking darf niemals den eigentlichen Formularversand stören
  }

  if (CONVERSION_ENDPOINT) {
    fetch(CONVERSION_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId,
        eventName: 'Lead',
        formType,
        email: data.email,
        phone: data.telefon,
        pageUrl: window.location.href,
      }),
      keepalive: true,
    }).catch(() => {
      // serverseitige Weiterleitung ist ein Zusatznutzen, kein kritischer Pfad
    })
  }
}
