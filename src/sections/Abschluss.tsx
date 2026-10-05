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

      <Reveal className={styles.inner}>
        <h2 className={styles.heading}>{abschluss.heading}</h2>
        <p className={styles.text}>{abschluss.text}</p>
        <Button
          href="/#kennenlernen"
          size="lg"
          style={{ backgroundColor: 'var(--c-key1)', color: 'var(--c-dark)' }}
        >
          {site.ctaLabel}
        </Button>
        <p className={styles.sub}>{abschluss.sub}</p>
      </Reveal>
    </section>
  )
}
