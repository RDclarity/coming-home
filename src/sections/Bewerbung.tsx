import { useState, type FormEvent } from 'react'
import { Button } from '../components/Button'
import { Eyebrow } from '../components/Eyebrow'
import { SelectField, TextArea, TextField } from '../components/Field'
import { Reveal } from '../components/Reveal'
import { bewerbung } from '../data/site'
import { submitForm } from '../lib/submitForm'
import styles from './Bewerbung.module.css'

export function Bewerbung() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('sending')
    setError(null)

    const result = await submitForm('bewerbung', event.currentTarget)

    if (result.ok) {
      setStatus('done')
    } else {
      setStatus('idle')
      setError(result.message)
    }
  }

  return (
    <section id="kennenlernen" className={styles.sec}>
      <div className={styles.inner}>
        <Reveal className={styles.left}>
          <Eyebrow>{bewerbung.eyebrow}</Eyebrow>
          <h2 className={styles.heading}>{bewerbung.heading}</h2>
          <p className={styles.intro}>{bewerbung.intro}</p>
          <p className={styles.intro2}>{bewerbung.intro2}</p>
        </Reveal>

        <Reveal className={styles.card} delay={100}>
          {status === 'done' ? (
            <div className={styles.success}>
              <span className={styles.dot} aria-hidden="true" />
              <h3 className={styles.successTitle}>{bewerbung.successTitle}</h3>
              <p className={styles.successText}>{bewerbung.successText}</p>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <h3 className={styles.formTitle}>{bewerbung.formTitle}</h3>

              <TextField label="Name" name="name" required autoComplete="name" />

              <div className={styles.row}>
                <TextField label="E-Mail" name="email" type="email" required autoComplete="email" />
                <TextField label="Telefon" name="telefon" type="tel" autoComplete="tel" />
              </div>

              <SelectField
                label="Welche Begleitung interessiert dich?"
                name="begleitung"
                options={bewerbung.programs}
              />

              <TextArea
                label="Wo stehst du gerade in deinem Leben?"
                name="situation"
                required
                rows={4}
              />

              <TextArea
                label="Warum möchtest du diesen Weg jetzt gehen?"
                name="motivation"
                required
                rows={4}
              />

              <label className={styles.consent}>
                <input type="checkbox" name="consent" required />
                <span>{bewerbung.consent}</span>
              </label>

              {error && (
                <p className={styles.err} role="alert">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                full
                disabled={status === 'sending'}
                style={{ backgroundColor: 'var(--c-key1)', color: 'var(--c-dark)' }}
              >
                {status === 'sending' ? 'Wird gesendet …' : bewerbung.submit}
              </Button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}
