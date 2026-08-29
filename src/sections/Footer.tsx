import { Eyebrow } from '../components/Eyebrow'
import { MultiStepContactForm } from '../components/MultiStepContactForm'
import { Reveal } from '../components/Reveal'
import { kontakt, site } from '../data/site'
import { withBase } from '../lib/url'
import styles from './Footer.module.css'

const YEAR = 2026

export function Footer() {
  return (
    <footer id="kontakt" className={styles.sec}>
      <div className={styles.inner}>
        <Reveal className={styles.contact}>
          <Eyebrow>{kontakt.eyebrow}</Eyebrow>
          <h2 className={styles.heading}>{kontakt.heading}</h2>
          <p className={styles.ctext}>{kontakt.text}</p>

          <MultiStepContactForm />
        </Reveal>

        <div className={styles.meta}>
          <div className={styles.brandBlock}>
            <span className={styles.brand}>{site.brandLong}</span>
            <p className={styles.closing}>{site.claim}</p>
          </div>

          <nav className={styles.nav} aria-label="Rechtliches und Kontakt">
            <a className={styles.link} href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <a
              className={styles.link}
              href={site.instagram}
              target="_blank"
              rel="noreferrer noopener"
            >
              Instagram
            </a>
            <a className={styles.link} href={withBase('/begleitungen')}>
              Alle Begleitungen
            </a>
            <a className={styles.link} href={withBase('/ratgeber')}>
              Ratgeber
            </a>
            {kontakt.links.map((link) => (
              <a key={link.href} className={styles.link} href={withBase(link.href)}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className={styles.bottom}>
          © {YEAR} {site.brandLong}
        </div>
      </div>
    </footer>
  )
}
