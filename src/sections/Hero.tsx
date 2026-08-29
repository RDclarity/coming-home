import { Button } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { hero, site } from '../data/site'
import { withBase } from '../lib/url'
import styles from './Hero.module.css'

export function Hero() {
  return (
    <section id="coming-home" className={styles.hero}>
      <div className={styles.bgLayer} aria-hidden="true">
        <img
          className={styles.bgImg}
          src={withBase('/images/hero.webp')}
          alt=""
          width={1920}
          height={2885}
          fetchPriority="high"
        />
        <span className={styles.scrim} />
      </div>

      <div className={styles.inner}>
        <div className={styles.textCol}>
          <Reveal as="span" className={styles.overline}>
            <span className={styles.overlineDash} aria-hidden="true" />
            {hero.overline}
          </Reveal>

          <Reveal as="h1" className={styles.title} delay={80}>
            {hero.titleLines.map((line, index) => (
              <span
                key={line}
                className={[styles.tLine, index === 1 && styles.emph].filter(Boolean).join(' ')}
              >
                {line}
              </span>
            ))}
          </Reveal>

          <Reveal as="p" className={styles.lead} delay={160}>
            {hero.lead}
          </Reveal>

          <Reveal as="p" className={styles.modalities} delay={220}>
            {hero.modalities}
          </Reveal>

          <Reveal className={styles.actions} delay={280}>
            <Button href="/#kennenlernen" size="lg" style={{ backgroundColor: 'var(--c-key1)', color: 'var(--c-dark)' }}>
              {site.ctaLabel}
            </Button>
          </Reveal>

          <Reveal as="p" className={styles.brand} delay={340}>
            {hero.brandLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
