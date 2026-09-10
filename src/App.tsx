import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { ConsentBanner } from './components/ConsentBanner'
import { ErrorBoundary } from './components/ErrorBoundary'
import { MobileCtaBar } from './components/MobileCtaBar'
import { MusicPlayer } from './components/MusicPlayer'
import { useScrollToHash } from './hooks/useScrollToHash'
import { trackPageView } from './lib/analytics'
import { withBase } from './lib/url'
import { Crm } from './pages/crm/Crm'
import { Danke } from './pages/Danke'
import { Home } from './pages/Home'
import { Mitglieder } from './pages/members/Mitglieder'
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

/** Eingeloggte Bereiche (Backend unter /admin, Mitgliederbereich unter
 * /mitglieder, plus /intern/* als alte Weiterleitungen) bekommen bewusst
 * KEINE Website-Chrome (Nav, Footer, Musikplayer, Cookie-Banner) – wer sich
 * dort einloggt, soll nur den jeweiligen Bereich sehen, nicht die
 * Marketing-Seite drumherum. Bleiben außerdem von der Seitenaufruf-Statistik
 * ausgenommen (siehe lib/analytics.ts) – dafür fehlt eingeloggten Accounts
 * ohnehin die nötige `anon`-Einfüge-Berechtigung auf `page_views`. */
function istEingeloggterBereich(pathname: string): boolean {
  return pathname.startsWith('/admin') || pathname.startsWith('/intern/') || pathname.startsWith('/mitglieder')
}

export default function App() {
  useScrollToHash()
  const location = useLocation()
  const ohneChrome = istEingeloggterBereich(location.pathname)

  useEffect(() => {
    // Seitenaufrufe fürs Besucherstatistik-Panel im CRM – interne Werkzeuge
    // selbst bleiben ausgenommen (Jasmins eigene Login-/Bearbeitungsklicks
    // sind kein Besuchssignal), siehe lib/analytics.ts.
    if (!ohneChrome) trackPageView(location.pathname)
  }, [location.pathname, ohneChrome])

  return (
    <>
      {!ohneChrome && (
        <a className="skipLink" href={withBase('/#coming-home')}>
          Zum Inhalt springen
        </a>
      )}
      {!ohneChrome && <MusicPlayer />}
      {!ohneChrome && <ConsentBanner />}
      {!ohneChrome && <MobileCtaBar />}
      {!ohneChrome && <Nav />}
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
                /admin ist der Zugang fürs CRM/Backend (Tabs Anfragen, Statistik,
                Mitgliederbereich, Website); /intern/crm und /intern/editor bleiben als
                Weiterleitungen erhalten, falls die alten Adressen noch irgendwo
                verlinkt sind (der frühere lokale Text-Editor ist im Tab "Website"
                aufgegangen). */}
            <Route path="/admin" element={<Crm />} />
            <Route path="/intern/crm" element={<Navigate to="/admin" replace />} />
            <Route path="/intern/editor" element={<Navigate to="/admin" replace />} />

            {/* Mitgliederbereich für die 3-/12-Monats-Begleitungen – eigener
                Supabase-Login (siehe pages/members/Mitglieder.tsx), ebenfalls
                nicht in Sitemap/robots.txt gelistet. */}
            <Route path="/mitglieder" element={<Mitglieder />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </main>
      {!ohneChrome && <Footer />}
    </>
  )
}
