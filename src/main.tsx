import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { installGlobalErrorTracking, reportError } from './lib/errorTracking'
import './styles/global.css'

// No-op ohne VITE_SENTRY_DSN – siehe lib/errorTracking.ts.
installGlobalErrorTracking()

// react-router möchte den Basename ohne abschließenden Slash
// ("/coming-home", nicht "/coming-home/") – import.meta.env.BASE_URL liefert
// aber immer mit Slash am Ende (Vite-Konvention).
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Vorgerenderte Seiten (dist/*/index.html) haben bereits Inhalt im Root-Div –
// dort wird hydriert statt neu gerendert. Im Dev-Server (`npm run dev`) ist
// das Div leer, dort läuft ganz normales CSR.
if (container.hasChildNodes()) {
  hydrateRoot(container, app, {
    // React fängt Hydration-Mismatches ab und rendert die betroffene Stelle
    // clientseitig neu (kein Absturz für Besucher:innen) – aber ohne dieses
    // Logging bliebe das im Produktions-Build unsichtbar. Wer die Konsole
    // aufmacht, sieht so wenigstens WELCHE Komponente betroffen war.
    onRecoverableError: (error, errorInfo) => {
      console.warn('Hydration recovered:', error, errorInfo?.componentStack)
      reportError(error, { componentStack: errorInfo?.componentStack, kind: 'hydration-recovered' })
    },
  })
} else {
  createRoot(container).render(app)
}
