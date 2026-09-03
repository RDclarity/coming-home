import { Button } from '../components/Button'
import { Eyebrow } from '../components/Eyebrow'
import styles from './NotFound.module.css'

/**
 * Wird sowohl als Route "*" gerendert als auch – separat vom Prerender –
 * als dist/404.html gebaut, das GitHub Pages für alle nicht vorgerenderten
 * Pfade ausliefert (etwa /admin). Siehe scripts/prerender.mjs.
 */
export function NotFound() {
  return (
    <section className={styles.sec}>
      <div className={styles.inner}>
        <Eyebrow>404</Eyebrow>
        <h1 className={styles.title}>Diese Seite gibt es nicht.</h1>
        <p className={styles.text}>
          Der Link war vielleicht falsch oder die Seite wurde verschoben. Von hier aus findest
          du sicher zurück.
        </p>
        <div className={styles.actions}>
          <Button href="/" style={{ backgroundColor: 'var(--c-key1)', color: 'var(--c-dark)' }}>
            Zur Startseite
          </Button>
          <Button href="/begleitungen" variant="outline">
            Alle Begleitungen
          </Button>
        </div>
      </div>
    </section>
  )
}
