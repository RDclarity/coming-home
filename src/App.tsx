import { Navigate, Route, Routes } from 'react-router-dom'
import { ConsentBanner } from './components/ConsentBanner'
import { ErrorBoundary } from './components/ErrorBoundary'
import { MusicPlayer } from './components/MusicPlayer'
import { useScrollToHash } from './hooks/useScrollToHash'
import { withBase } from './lib/url'
import { Crm } from './pages/crm/Crm'
import { Danke } from './pages/Danke'
import { Editor } from './pages/editor/Editor'
import { Home } from './pages/Home'
import { Agb } from './pages/legal/Agb'
import { Datenschutz } from './pages/legal/Datenschutz'
import { Impressum } from './pages/legal/Impressum'
import { NotFound } from './pages/NotFound'
import { ArticlePage } from './pages/ratgeber/ArticlePage'
import { RatgeberIndex } from './pages/ratgeber/RatgeberIndex'
import { BegleitungenIndex } from './pages/services/BegleitungenIndex'
import { ServicePage } from './pages/services/ServicePage'
import { Footer } from './sections/Footer'
import { Nav } from './sections/Nav'

export default function App() {
  useScrollToHash()

  return (
    <>
      <a className="skipLink" href={withBase('/#coming-home')}>
        Zum Inhalt springen
      </a>
      <MusicPlayer />
      <ConsentBanner />
      <Nav />
      <main>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/begleitungen" element={<BegleitungenIndex />} />
            <Route path="/begleitung/:slug" element={<ServicePage />} />

            <Route path="/ratgeber" element={<RatgeberIndex />} />
            <Route path="/ratgeber/:slug" element={<ArticlePage />} />

            <Route path="/impressum" element={<Impressum />} />
            <Route path="/datenschutz" element={<Datenschutz />} />
            <Route path="/agb" element={<Agb />} />

            {/* Dankeseite nach Formularversand statt Popup/mailto – siehe
                pages/Danke.tsx und lib/submitForm.ts. Nicht in Sitemap/
                robots.txt gelistet (nur über Client-Navigation erreichbar). */}
            <Route path="/danke" element={<Danke />} />

            {/* Interne Werkzeuge – nicht in Sitemap/robots.txt gelistet, siehe README.
                /admin ist der Zugang fürs CRM (Lead-Übersicht); /intern/crm bleibt als
                Weiterleitung erhalten, falls die alte Adresse noch irgendwo verlinkt ist. */}
            <Route path="/admin" element={<Crm />} />
            <Route path="/intern/crm" element={<Navigate to="/admin" replace />} />
            <Route path="/intern/editor" element={<Editor />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </main>
      <Footer />
    </>
  )
}
