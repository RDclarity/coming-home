import { useEffect, useState } from 'react'
import { getConsent, trackingConfigured } from '../lib/tracking'
import { site } from '../data/site'
import { Button } from './Button'
import styles from './MobileCtaBar.module.css'

/**
 * Fixierte Leiste ganz unten, NUR auf schmalen Bildschirmen sichtbar (siehe
 * Media Query im CSS) – die Haupt-CTA war auf Mobil bisher nur über das
 * Hamburger-Menü erreichbar (Nav.module.css blendet den Button dort
 * komplett aus), auf einer Seite ohne feste Kopfzeilen-CTA ein bekannter
 * Grund für weniger ausgefüllte Formulare auf dem Handy.
 *
 * Bewusst erst NACH einer Cookie-Entscheidung sichtbar (bzw. sofort, wenn
 * gar kein Tracking konfiguriert ist und es also kein Cookie-Banner gibt) –
 * beide sind unten fixiert, so überlappen sie sich nie.
 */
export function MobileCtaBar() {
  const [zeigen, setZeigen] = useState(!trackingConfigured)

  useEffect(() => {
    if (!trackingConfigured) return
    setZeigen(getConsent() !== null)
    // Kein Live-Listener nötig: die Cookie-Wahl passiert praktisch immer
    // vor jeder Scroll-Interaktion, ein erneutes Prüfen beim nächsten
    // Seitenaufruf reicht.
  }, [])

  if (!zeigen) return null

  return (
    <div className={styles.bar}>
      <Button href="/#kennenlernen" full style={{ backgroundColor: 'var(--c-key1)', color: 'var(--c-dark)' }}>
        {site.ctaLabel}
      </Button>
    </div>
  )
}
