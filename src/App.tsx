import { Route, Routes } from 'react-router-dom'
import { MusicPlayer } from './components/MusicPlayer'
import { useScrollToHash } from './hooks/useScrollToHash'
import { withBase } from './lib/url'
import { Crm } from './pages/crm/Crm'
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
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/begleitungen" element={<BegleitungenIndex />} />
          <Route path="/begleitung/:slug" element={<ServicePage />} />

          <Route path="/ratgeber" element={<RatgeberIndex />} />
          <Route path="/ratgeber/:slug" element={<ArticlePage />} />

          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
          <Route path="/agb" element={<Agb />} />

          {/* Internes Werkzeug – nicht in Sitemap/robots.txt gelistet, siehe README. */}
          <Route path="/intern/crm" element={<Crm />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
