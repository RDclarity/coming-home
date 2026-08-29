import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
// In react-router-dom v7 lebt StaticRouter im Haupt-Export, nicht unter /server (das war v6).
import { StaticRouter } from 'react-router-dom'
import App from './App'

// Re-Exports rein für scripts/prerender.mjs: Das Skript ist plain Node (kein
// TS-Loader), importiert also die TS-Datenmodule nicht direkt, sondern liest
// sie aus diesem bereits kompilierten SSR-Bundle heraus.
export { articles } from './data/articles'
export { business } from './data/legal'
export { faq, jasmin, site } from './data/site'
export { services } from './data/services'
export { seoPages } from './seo/pages'
export { absoluteUrl, SITE_ORIGIN } from './lib/url'

/**
 * Server-Einstieg fürs Prerendering (scripts/prerender.mjs). Wird per
 * `vite build --ssr src/entry-server.tsx` zu einem Node-Bundle gebaut und dort
 * für jede Route in src/seo/pages.ts einmal aufgerufen. Rendert dieselbe
 * <App/> wie der Browser, nur mit einer festen URL statt echtem window.location.
 *
 * Alles in App/Nav/Footer/den Sections, das `window`/`document`/localStorage
 * anfasst, tut das ausschließlich in useEffect – das läuft bei renderToString
 * nicht mit, deshalb ist die App ohne Sonderfälle SSR-sicher.
 */
export function render(url: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  )
}
