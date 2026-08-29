import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from './Button'
import { Eyebrow } from './Eyebrow'
import styles from './ErrorBoundary.module.css'

type Props = { children: ReactNode }
type State = { hasError: boolean }

/**
 * Fängt Laufzeitfehler in der eingeschlossenen Seiten-Ebene ab (z. B. ein
 * kaputter Datensatz oder eine unerwartete API-Antwort), statt dass
 * Besucher:innen einen komplett weißen Bildschirm sehen. Bewusst NICHT um
 * Nav/Footer/MusicPlayer gelegt (siehe App.tsx) – die Navigation soll
 * weiterhin funktionieren, auch wenn genau eine Seite abstürzt.
 *
 * Muss laut React eine Klassenkomponente sein – dafür gibt es (Stand heute)
 * kein Hook-Äquivalent, weder bei Function Components noch bei React 19.
 *
 * Fängt NUR Fehler beim Rendern/in Lifecycle-Methoden ab, keine Fehler in
 * Event-Handlern (dafür sind die einzelnen try/catch-Stellen wie in
 * submitForm.ts zuständig) und keine Fehler, die bereits durch
 * `onRecoverableError` in main.tsx abgefangene Hydration-Mismatches sind.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary hat einen Fehler abgefangen:', error, errorInfo.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <section className={styles.sec}>
        <div className={styles.inner}>
          <Eyebrow align="center">Fehler</Eyebrow>
          <h1 className={styles.title}>Etwas ist schiefgelaufen.</h1>
          <p className={styles.text}>
            Diese Seite ist gerade nicht darstellbar. Ein Neuladen hilft meistens – falls nicht,
            komm gern über die Startseite zurück.
          </p>
          <div className={styles.actions}>
            <Button
              type="button"
              size="lg"
              style={{ backgroundColor: 'var(--c-key1)', color: 'var(--c-dark)' }}
              onClick={() => window.location.reload()}
            >
              Seite neu laden
            </Button>
            <Button href="/" variant="outline">
              Zur Startseite
            </Button>
          </div>
        </div>
      </section>
    )
  }
}
