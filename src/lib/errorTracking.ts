/**
 * Frontend-Fehler-Tracking via Sentry – lädt NICHTS, solange VITE_SENTRY_DSN
 * nicht gesetzt ist (dasselbe Prinzip wie bei Supabase/Tracking: ohne
 * Konfiguration passiert einfach nichts, kein Byte zusätzlich im Bundle
 * referenziert). Siehe AUDIT.md H3.
 *
 * Bewusst `@sentry/browser` statt `@sentry/react`: kein Bedarf an React-
 * spezifischer Instrumentierung – der Component-Stack eines abgefangenen
 * Fehlers kommt schon über die eigene ErrorBoundary (siehe
 * components/ErrorBoundary.tsx), das spart Bundle-Gewicht.
 *
 * Einrichtung: kostenlosen Account auf https://sentry.io anlegen, ein
 * "React"-Projekt erstellen, den angezeigten DSN als VITE_SENTRY_DSN in
 * .env (lokal) und als GitHub-Secret (Deploy) eintragen. Bis dahin läuft
 * alles unverändert weiter, nur ohne Fehler-Tracking.
 */

const DSN = import.meta.env.VITE_SENTRY_DSN as string | undefined

export const errorTrackingConfigured = Boolean(DSN)

let initPromise: Promise<typeof import('@sentry/browser')> | null = null

function ensureInit() {
  if (!DSN) return null
  if (!initPromise) {
    initPromise = import('@sentry/browser').then((Sentry) => {
      Sentry.init({
        dsn: DSN,
        environment: import.meta.env.MODE,
        // Nur Fehler, kein Performance-Tracing – hält Sentry-Traffic/Kosten
        // minimal, für eine Marketing-Site ohne komplexe Client-Logik reicht
        // reines Error-Tracking völlig.
        tracesSampleRate: 0,
      })
      return Sentry
    })
  }
  return initPromise
}

/** Meldet einen Fehler an Sentry – no-op ohne konfigurierten DSN. */
export function reportError(error: unknown, context?: Record<string, unknown>) {
  const promise = ensureInit()
  if (!promise) return
  promise.then((Sentry) => {
    Sentry.captureException(error, context ? { extra: context } : undefined)
  })
}

/**
 * Einmalig beim App-Start aufrufen (siehe main.tsx) – fängt zusätzlich zur
 * ErrorBoundary auch Fehler außerhalb des React-Baums ab (z. B. in
 * Event-Handlern oder unbehandelte Promise-Rejections).
 */
export function installGlobalErrorTracking() {
  if (!DSN) return
  window.addEventListener('error', (event) => {
    reportError(event.error ?? event.message)
  })
  window.addEventListener('unhandledrejection', (event) => {
    reportError(event.reason)
  })
}
