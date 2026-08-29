import { useState, type FormEvent } from 'react'
import { Button } from '../components/Button'
import { Eyebrow } from '../components/Eyebrow'
import { TextArea, TextField } from '../components/Field'
import { Reveal } from '../components/Reveal'
import { kontakt, site } from '../data/site'
import { withBase } from '../lib/url'
import { submitForm } from '../lib/submitForm'
import styles from './Footer.module.css'

const YEAR = 2026

export function Footer() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('sending')
    setError(null)

    const result = await submitForm('kontakt', event.currentTarget)

    if (result.ok) {
      setStatus('done')
    } else {
      setStatus('idle')
      setError(result.message)
    }
  }

  return (
    <footer id="kontakt" className={styles.sec}>
      <div className={styles.inner}>
        <Reveal className={styles.contact}>
          <Eyebrow>{kontakt.eyebrow}</Eyebrow>
          <h2 className={styles.heading}>{kontakt.heading}</h2>
          <p className={styles.ctext}>{kontakt.text}</p>

          {status === 'done' ? (
            <p className={styles.success}>{kontakt.success}</p>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.row}>
                <TextField label="Name" name="name" required autoComplete="name" />
                <TextField label="E-Mail" name="email" type="email" required autoComplete="email" />
              </div>

              <TextArea label="Nachricht" name="nachricht" required rows={5} />

              {error && (
                <p className={styles.err} role="alert">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={status === 'sending'}
                style={{ backgroundColor: 'var(--c-key1)', color: 'var(--c-dark)' }}
              >
                {status === 'sending' ? 'Wird gesendet …' : kontakt.submit}
              </Button>
            </form>
          )}
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
