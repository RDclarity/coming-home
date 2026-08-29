import { Button } from '../components/Button'
import { Eyebrow } from '../components/Eyebrow'
import { Reveal } from '../components/Reveal'
import { jasmin } from '../data/site'
import { withBase } from '../lib/url'
import styles from './Jasmin.module.css'

export function Jasmin() {
  return (
    <section className={styles.sec}>
      <div className={styles.inner}>
        <Reveal className={styles.media}>
          <div className={styles.frame}>
            <img
              className={styles.img}
              src={withBase('/images/jasmin-dance.webp')}
              alt="Jasmin, Begleiterin für Breathwork und Körperarbeit"
              width={1277}
              height={1920}
              loading="lazy"
            />
          </div>
        </Reveal>

        <div className={styles.content}>
          <Reveal>
            <Eyebrow>{jasmin.eyebrow}</Eyebrow>
            <h2 className={styles.heading}>{jasmin.heading}</h2>
            <p className={styles.intro}>{jasmin.intro}</p>
          </Reveal>

          <Reveal className={styles.body} delay={80}>
            {jasmin.paragraphs.map((text) => (
              <p key={text} className={styles.para}>
                {text}
              </p>
            ))}
          </Reveal>

          <Reveal className={styles.creds} delay={140}>
            <h3 className={styles.credLabel}>{jasmin.credentialsLabel}</h3>
            <ul className={styles.credList}>
              {jasmin.credentials.map((cred) => (
                <li key={cred.title} className={styles.credItem}>
                  <span className={styles.credDot} aria-hidden="true" />
                  <span>
                    <strong className={styles.credTitle}>{cred.title}</strong>{' '}
                    <span className={styles.credDetail}>{cred.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={200}>
            <Button href="/#ueber-jasmin" variant="outline">
              {jasmin.cta}
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
