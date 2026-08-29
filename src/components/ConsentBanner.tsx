import { useEffect, useState } from 'react'
import { getConsent, loadTracking, setConsent, trackingConfigured } from '../lib/tracking'
import styles from './ConsentBanner.module.css'

/**
 * Cookie-Banner für Google Analytics / Google Ads / Meta Pixel – erscheint
 * nur, wenn mindestens eines dieser Tools per Umgebungsvariable konfiguriert
 * ist (siehe .env.example). Ohne Konfiguration ist diese Komponente komplett
 * unsichtbar, es gibt schlicht nichts zuzustimmen.
 *
 * "Nur Notwendiges" lädt gar nichts – die Seite selbst (Formulare, CRM,
 * Musik) funktioniert unabhängig davon vollständig, das ist alles technisch
 * notwendig und braucht keine Einwilligung.
 */
export function ConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!trackingConfigured) return
    const consent = getConsent()
    if (consent === 'accepted') {
      loadTracking()
    } else if (consent === null) {
      setVisible(true)
    }
  }, [])

  if (!trackingConfigured || !visible) return null

  return (
    <div className={styles.banner} role="dialog" aria-label="Cookie-Einstellungen">
      <p className={styles.text}>
        Diese Seite nutzt optionale Analyse- und Marketing-Tools (u. a. Google Analytics, Google
        Ads, Meta Pixel), um zu verstehen, wie die Seite genutzt wird. Diese werden erst geladen,
        wenn du zustimmst. Mehr dazu in der{' '}
        <a href="/datenschutz#analyse-marketing">Datenschutzerklärung</a>.
      </p>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.declineBtn}
          onClick={() => {
            setConsent('declined')
            setVisible(false)
          }}
        >
          Nur Notwendiges
        </button>
        <button
          type="button"
          className={styles.acceptBtn}
          onClick={() => {
            setConsent('accepted')
            setVisible(false)
          }}
        >
          Akzeptieren
        </button>
      </div>
    </div>
  )
}
