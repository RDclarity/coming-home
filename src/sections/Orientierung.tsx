import { Button } from '../components/Button'
import { Eyebrow } from '../components/Eyebrow'
import { Reveal } from '../components/Reveal'
import { orientierung } from '../data/site'
import styles from './Orientierung.module.css'

/** Angebote auf Moos: drei Karten mit Torbogen-Oberkante. Die mittlere
 *  (1:1) ist leicht hervorgehoben und trägt den Haupt-Button. */
export function Orientierung() {
  return (
    <section id="orientierung" className={styles.sec}>
      <div className={styles.inner}>
        <Reveal className={styles.head}>
          <Eyebrow align="center">{orientierung.eyebrow}</Eyebrow>
          <h2 className={styles.heading}>{orientierung.heading}</h2>
        </Reveal>

        <div className={styles.grid}>
          {orientierung.cards.map((card, index) => {
            const featured = index === 1
            return (
              <Reveal
                key={card.num}
                className={[styles.cell, featured && styles.cellFeatured].filter(Boolean).join(' ')}
                delay={index * 110}
              >
                <article className={[styles.card, featured && styles.featured].filter(Boolean).join(' ')}>
                  <span className={styles.cardNum}>{card.num}</span>
                  <h3 className={styles.cardLabel}>{card.label}</h3>
                  <p className={styles.cardTagline}>{card.tagline}</p>
                  <p className={styles.cardOffers}>{card.offers}</p>
                  <p className={styles.cardPrice}>{card.price}</p>
                  <Button href={card.cta.href} variant={featured ? 'solid' : 'outline'} size="md">
                    {card.cta.label}
                  </Button>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
