import { Button } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { abschluss, site } from '../data/site'
import { withBase } from '../lib/url'
import styles from './Abschluss.module.css'

export function Abschluss() {
  return (
    <section id="abschluss" className={styles.sec}>
      {/* Hintergrundbild als Inline-Style statt CSS url() – ein "/"-Pfad in
          .module.css würde den GitHub-Pages-Unterpfad nicht mitbekommen. */}
      <div
        className={styles.bg}
        style={{ backgroundImage: `url(${withBase('/images/jasmin-silhouette.webp')})` }}
        aria-hidden="true"
      />
      <div className={styles.scrim} aria-hidden="true" />

      {/* Signatur-Moment der Seite: der Inhalt steht in einem großen,
          hellen Torbogen – der Durchgang nach Hause. */}
      <Reveal className={styles.inner}>
        <div className={styles.arch}>
          <h2 className={styles.heading}>{abschluss.heading}</h2>
          <p className={styles.text}>{abschluss.text}</p>
          <Button href="/#kennenlernen" variant="solid" size="lg">
            {site.ctaLabel}
          </Button>
          <p className={styles.sub}>{abschluss.sub}</p>
        </div>
      </Reveal>
    </section>
  )
}
