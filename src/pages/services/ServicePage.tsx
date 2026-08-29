import { useParams } from 'react-router-dom'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { Button } from '../../components/Button'
import { Eyebrow } from '../../components/Eyebrow'
import { Reveal } from '../../components/Reveal'
import { getFaqBySlug } from '../../data/site'
import { categoryLabels, getServiceBySlug, services } from '../../data/services'
import { withBase } from '../../lib/url'
import { Abschluss } from '../../sections/Abschluss'
import { NotFound } from '../NotFound'
import styles from './ServicePage.module.css'

// Ein Foto von Jasmin pro Angebot – dieselbe Session, aber jeweils eine
// andere Stimmung passend zum jeweiligen Format.
const HERO_IMAGES: Record<string, string> = {
  '1-1-begleitung': '/images/service-1-1-begleitung.webp',
  'coming-home-drei-monate': '/images/service-drei-monate.webp',
  'coming-home-jahresbegleitung': '/images/service-jahresbegleitung.webp',
  'feminine-power-workshop': '/images/service-feminine-power.webp',
}

export function ServicePage() {
  const { slug } = useParams()
  const service = getServiceBySlug(slug)

  if (!service) return <NotFound />

  const related = service.relatedSlugs
    .map((relatedSlug) => getServiceBySlug(relatedSlug))
    .filter((item) => item !== undefined)

  const faqs = (service.faqSlugs ?? [])
    .map((faqSlug) => getFaqBySlug(faqSlug))
    .filter((item) => item !== undefined)

  const heroImage = HERO_IMAGES[service.slug]

  return (
    <>
      <section className={styles.hero}>
        {heroImage && (
          <>
            <div
              className={styles.heroBg}
              style={{ backgroundImage: `url(${withBase(heroImage)})` }}
              aria-hidden="true"
            />
            <div className={styles.heroScrim} aria-hidden="true" />
          </>
        )}
        <div className={styles.heroInner}>
          <Reveal>
            <Breadcrumbs
              items={[
                { label: 'Begleitungen', href: '/begleitungen' },
                { label: service.shortTitle },
              ]}
            />
            <Eyebrow style={{ color: 'var(--c-key1)' }}>{categoryLabels[service.category]}</Eyebrow>
            <h1 className={styles.title}>{service.title}</h1>
            <p className={styles.tagline}>{service.tagline}</p>
          </Reveal>

          <Reveal delay={80}>
            <div className={styles.priceRow}>
              <span className={styles.price}>{service.priceLabel}</span>
              {service.priceNote && <span className={styles.priceNote}>{service.priceNote}</span>}
            </div>

            <ul className={styles.metaList}>
              <li>⏱ {service.duration}</li>
              <li>📍 {service.location}</li>
              <li>Persönlich geleitet von Jasmin</li>
            </ul>

            <div className={styles.actions}>
              <Button href="/#kennenlernen" size="lg" style={{ backgroundColor: 'var(--c-key1)', color: 'var(--c-dark)' }}>
                Kennenlerngespräch vereinbaren
              </Button>
              <Button href="/begleitungen" variant="outline" style={{ color: 'var(--c-light)' }}>
                Alle Begleitungen
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className={styles.body}>
        <div className={styles.bodyInner}>
          <Reveal>
            <p className={styles.intro}>{service.intro}</p>

            <h2 className={styles.blockTitle}>Was dich erwartet</h2>
            <ul className={styles.bulletList}>
              {service.highlights.map((item) => (
                <li key={item} className={styles.bullet}>
                  <span className={styles.dot} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>

            <h2 className={styles.blockTitle}>Für wen diese Begleitung passt</h2>
            <ul className={styles.bulletList}>
              {service.forWho.map((item) => (
                <li key={item} className={styles.bullet}>
                  <span className={styles.dot} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>

            <h2 className={styles.blockTitle}>So läuft es ab</h2>
            <ol className={styles.processList}>
              {service.process.map((step, index) => (
                <li key={step} className={styles.processItem}>
                  <span className={styles.processNum}>{String(index + 1).padStart(2, '0')}</span>
                  <span className={styles.processText}>{step}</span>
                </li>
              ))}
            </ol>
          </Reveal>

          {faqs.length > 0 && (
            <Reveal as="aside" className={styles.sidebar} delay={100}>
              <p className={styles.sidebarTitle}>Häufige Fragen dazu</p>
              {faqs.map((item) => (
                <a key={item.slug} className={styles.faqLink} href={withBase('/#faq')}>
                  {item.q}
                </a>
              ))}
            </Reveal>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className={styles.related}>
          <div className={styles.relatedInner}>
            <p className={styles.relatedHeading}>Passt eventuell auch zu dir</p>
            <div className={styles.relatedGrid}>
              {related.slice(0, 3).map((item) => (
                <a
                  key={item.slug}
                  className={styles.relatedCard}
                  href={withBase(`/begleitung/${item.slug}`)}
                >
                  <h3 className={styles.relatedCardTitle}>{item.shortTitle}</h3>
                  <span className={styles.relatedCardPrice}>{item.priceLabel}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <Abschluss />
    </>
  )
}

/** Für den Prerender: alle Slugs, für die eine statische Seite gebaut wird. */
export const serviceSlugs = services.map((service) => service.slug)
