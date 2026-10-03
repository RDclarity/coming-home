import { Button } from '../components/Button'
import { Eyebrow } from '../components/Eyebrow'
import { Reveal } from '../components/Reveal'
import { orientierung } from '../data/site'
import styles from './Orientierung.module.css'

export function Orientierung() {
  return (
    <section id="orientierung" className={styles.sec}>
      <div className={styles.inner}>
        <Reveal className={styles.head}>
          <Eyebrow>{orientierung.eyebrow}</Eyebrow>
          <h2 className={styles.heading}>{orientierung.heading}</h2>
        </Reveal>

        <div className={styles.grid}>
          {orientierung.cards.map((card, index) => (
            <Reveal key={card.num} className={styles.card} delay={index * 110}>
              <span className={styles.cardNum}>{card.num}</span>
              <h3 className={styles.cardLabel}>{card.label}</h3>
              <p className={styles.cardTagline}>{card.tagline}</p>
              <p className={styles.cardOffers}>{card.offers}</p>
              <p className={styles.cardPrice}>{card.price}</p>
              <Button href={card.cta.href} variant="outline" size="sm">
                {card.cta.label}
              </Button>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  )
}
