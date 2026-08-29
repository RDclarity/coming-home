import { useState, type FormEvent } from 'react'
import { Button } from '../components/Button'
import { Eyebrow } from '../components/Eyebrow'
import { Reveal } from '../components/Reveal'
import { newsletter } from '../data/site'
import { submitForm } from '../lib/submitForm'
import fieldStyles from '../components/Field.module.css'
import styles from './Newsletter.module.css'

export function Newsletter() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('sending')
    setError(null)

    const result = await submitForm('newsletter', event.currentTarget)

    if (result.ok) {
      setStatus('done')
    } else {
      setStatus('idle')
      setError(result.message)
    }
  }

  return (
    <section id="audiouebung" className={styles.sec}>
      <div className={styles.inner}>
        <Reveal>
          <Eyebrow>{newsletter.eyebrow}</Eyebrow>
          <h2 className={styles.heading}>{newsletter.heading}</h2>
          <p className={styles.sub}>{newsletter.sub}</p>
          <p className={styles.body}>{newsletter.body}</p>
        </Reveal>

        <Reveal delay={100}>
          {status === 'done' ? (
            <p className={styles.success}>{newsletter.success}</p>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.row}>
                <label className={`${fieldStyles.field} ${styles.emailField}`}>
                  <input
                    className={fieldStyles.input}
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    placeholder="Deine E-Mail-Adresse"
                    aria-label="E-Mail-Adresse"
                  />
                </label>
                <Button type="submit" size="lg" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Moment …' : newsletter.submit}
                </Button>
              </div>

              <label className={styles.consent}>
                <input type="checkbox" name="consent" required />
                <span>{newsletter.consent}</span>
              </label>

              {error && (
                <p className={styles.err} role="alert">
                  {error}
                </p>
              )}

              <p className={styles.disclaimer}>{newsletter.disclaimer}</p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}
