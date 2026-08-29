import { Breadcrumbs } from '../../components/Breadcrumbs'
import { Reveal } from '../../components/Reveal'
import { categoryLabels, services, type Service } from '../../data/services'
import { withBase } from '../../lib/url'
import { Abschluss } from '../../sections/Abschluss'
import styles from './BegleitungenIndex.module.css'

const ORDER: Service['category'][] = ['einzelsession', 'begleitung', 'workshop']

export function BegleitungenIndex() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <Reveal>
            <Breadcrumbs items={[{ label: 'Begleitungen' }]} />
            <h1 className={styles.title}>Alle Begleitungen im Überblick</h1>
            <p className={styles.lead}>
              Jede dieser Begleitungen führe ich, Jasmin, persönlich durch – keine Vertretung,
              kein Team, kein Franchise. Von der einzelnen Session bis zur Jahresbegleitung
              findest du hier alle Angebote mit Preis, Dauer und Ablauf.
            </p>
          </Reveal>
        </div>
      </section>

      <section className={styles.list}>
        <div className={styles.listInner}>
          {ORDER.map((category) => {
            const items = services.filter((service) => service.category === category)
            if (items.length === 0) return null

            return (
              <Reveal key={category}>
                <h2 className={styles.groupTitle}>{categoryLabels[category]}</h2>
                <div className={styles.grid}>
                  {items.map((service) => (
                    <a
                      key={service.slug}
                      className={styles.card}
                      href={withBase(`/begleitung/${service.slug}`)}
                    >
                      <h3 className={styles.cardTitle}>{service.shortTitle}</h3>
                      <p className={styles.cardTagline}>{service.tagline}</p>
                      <div className={styles.cardFoot}>
                        <span className={styles.cardPrice}>{service.priceLabel}</span>
                        <span className={styles.cardDuration}>{service.duration}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </Reveal>
            )
          })}
        </div>
      </section>

      <Abschluss />
    </>
  )
}
