/**
 * Zentrale Stelle für alles, was mit dem Deploy-Pfad zu tun hat.
 *
 * Die Seite läuft auf der eigenen Domain https://jasmindraxl.at/ (Root, kein
 * Unterordner mehr – vorher lief sie als GitHub-Pages-Projektseite unter
 * .../coming-home/, siehe Git-Historie). `withBase()` bleibt trotzdem
 * bestehen und wird weiter überall verwendet: falls die Seite je wieder
 * unter einem Unterpfad läuft, reicht dann wieder eine einzige Änderung in
 * vite.config.ts.
 */

const BASE = import.meta.env.BASE_URL // aktuell "/" (Root), s. o.

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
export const SITE_ORIGIN = 'https://jasmindraxl.at'

/** Absolute URL für einen Routen-Pfad, inkl. Domain. */
export function absoluteUrl(routePath: string): string {
  const clean = routePath === '/' ? '' : routePath.replace(/^\//, '')
  return `${SITE_ORIGIN}/${clean}`
}
