/**
 * Zentrale Stelle für alles, was mit dem Deploy-Unterpfad zu tun hat.
 *
 * Die Seite läuft als GitHub-Pages-Projektseite unter
 * https://rdclarity.github.io/coming-home/ – also nicht auf einer eigenen
 * Domain, sondern unter einem Unterordner. Vite prefixt gebündelte Assets
 * (JS/CSS aus `import`) automatisch mit diesem Pfad, aber selbst geschriebene
 * `/images/...`- oder `/impressum`-Strings tut es das NICHT. Deshalb läuft
 * jeder interne Link und jede public/-Referenz im Code durch `withBase()`.
 *
 * Zieht die Seite auf eine eigene Domain um, muss nur `base` in
 * vite.config.ts wieder auf "/" gesetzt werden – der Code hier bleibt gleich.
 */

const BASE = import.meta.env.BASE_URL // z. B. "/coming-home/" (Build) oder "/" (Dev)

/**
 * Interner Pfad ("/impressum", "/images/hero.jpg") → korrekt geprefixter Pfad.
 * Nur echte root-absolute Pfade (genau ein führender Slash) werden angefasst –
 * `mailto:...`, `tel:...`, `https://...` und relative Anker bleiben unverändert.
 */
export function withBase(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path
  return BASE + path.slice(1)
}

/**
 * Die Domain, unter der die Seite live steht – für Sitemap, robots.txt,
 * JSON-LD und Canonical-URLs. Wird nur zur Build-Zeit im Prerender-Skript
 * gebraucht, nicht im Browser-Bundle.
 */
export const SITE_ORIGIN = 'https://rdclarity.github.io'

/** Absolute URL für einen Routen-Pfad, inkl. Domain und Unterpfad. */
export function absoluteUrl(routePath: string): string {
  const base = '/coming-home/'
  const clean = routePath === '/' ? '' : routePath.replace(/^\//, '')
  return `${SITE_ORIGIN}${base}${clean}`
}
