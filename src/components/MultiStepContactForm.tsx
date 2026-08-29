import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { submitForm } from '../lib/submitForm'
import styles from './MultiStepContactForm.module.css'

type StepId = 'vorname' | 'nachname' | 'telefon' | 'email' | 'nachricht' | 'final'

const STEPS: StepId[] = ['vorname', 'nachname', 'telefon', 'email', 'nachricht', 'final']

/**
 * Schritt-für-Schritt-Kontaktformular (eine Frage pro Bildschirm statt eines
 * langen Formulars) – das erhöht bei kurzen Lead-Formularen erfahrungsgemäß
 * die Abschlussquote gegenüber einem einzigen langen Formular deutlich.
 *
 * Technisch bleibt es EIN natives <form>-Element – alle Felder liegen die
 * ganze Zeit im DOM, nur unsichtbar außerhalb des aktuellen Schritts. So
 * funktioniert `new FormData(form)` in submitForm.ts unverändert weiter.
 */
export function MultiStepContactForm() {
  const [stepIndex, setStepIndex] = useState(0)
  const [values, setValues] = useState({
    vorname: '',
    nachname: '',
    telefon: '',
    email: '',
    nachricht: '',
  })
  const [consent, setConsent] = useState(false)
  const [newsletter, setNewsletter] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  // Je ein Ref pro Schritt-Feld, damit wir beim Weiterklicken gezielt
  // dorthin fokussieren können – siehe Erklärung beim Effekt unten.
  const vornameRef = useRef<HTMLInputElement>(null)
  const nachnameRef = useRef<HTMLInputElement>(null)
  const telefonRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const nachrichtRef = useRef<HTMLTextAreaElement>(null)
  const stepRefs: Record<StepId, { current: HTMLElement | null } | null> = {
    vorname: vornameRef,
    nachname: nachnameRef,
    telefon: telefonRef,
    email: emailRef,
    nachricht: nachrichtRef,
    final: null,
  }
  const isFirstRender = useRef(true)

  const step = STEPS[stepIndex]
  const isFirst = stepIndex === 0
  const isLast = step === 'final'

  useEffect(() => {
    // NICHT beim ersten Rendern fokussieren – das Formular liegt im Footer,
    // also am Ende jeder Seite. Ein `autoFocus` auf das erste Feld holt sich
    // den Fokus trotzdem sofort beim Laden und klappt auf Mobilgeräten die
    // Tastatur auf, obwohl das Formular noch gar nicht sichtbar ist. Der
    // Fokus soll nur springen, wenn man WIRKLICH einen Schritt weiterklickt.
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    stepRefs[step]?.current?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  function setValue(key: keyof typeof values, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  function currentStepIsValid(): boolean {
    if (step === 'nachricht' || step === 'final') return true // optional / geprüft beim Absenden
    return values[step].trim().length > 0
  }

  function goNext() {
    if (!currentStepIsValid()) {
      setError('Das brauche ich noch, bevor es weitergeht.')
      return
    }
    setError(null)
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1))
  }

  function goBack() {
    setError(null)
    setStepIndex((i) => Math.max(i - 1, 0))
  }

  function handleStepKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault()
      goNext()
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!consent) {
      setError('Bitte bestätige die Datenschutzerklärung, damit ich mich melden darf.')
      return
    }
    if (!formRef.current) return

    setStatus('sending')
    setError(null)

    const result = await submitForm('kontakt', formRef.current)

    if (result.ok) {
      setStatus('done')
    } else {
      setStatus('idle')
      setError(result.message)
    }
  }

  if (status === 'done') {
    return <p className={styles.success}>Deine Nachricht ist angekommen. Ich melde mich bald bei dir.</p>
  }

  return (
    <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
      {/* `name` fürs CRM/den Versand, zusammengesetzt aus Vor- und Nachname. */}
      <input type="hidden" name="name" value={`${values.vorname} ${values.nachname}`.trim()} readOnly />

      <div className={styles.progress} aria-hidden="true">
        {STEPS.map((s, index) => (
          <span key={s} className={styles.progressDot}>
            <span
              className={[styles.progressDotFill, index <= stepIndex && styles.progressDotFillActive]
                .filter(Boolean)
                .join(' ')}
            />
          </span>
        ))}
      </div>

      <div className={styles.stepWrap}>
        <div className={[styles.step, step === 'vorname' && styles.stepActive].filter(Boolean).join(' ')}>
          <span className={styles.stepLabel}>Schritt 1 von 5</span>
          <label className={styles.stepQuestion} htmlFor="cf-vorname">
            Wie heißt du?
          </label>
          <input
            ref={vornameRef}
            id="cf-vorname"
            className={styles.input}
            name="vorname"
            placeholder="Dein Vorname"
            autoComplete="given-name"
            value={values.vorname}
            onChange={(event) => setValue('vorname', event.target.value)}
            onKeyDown={handleStepKeyDown}
            tabIndex={step === 'vorname' ? 0 : -1}
          />
        </div>

        <div className={[styles.step, step === 'nachname' && styles.stepActive].filter(Boolean).join(' ')}>
          <span className={styles.stepLabel}>Schritt 2 von 5</span>
          <label className={styles.stepQuestion} htmlFor="cf-nachname">
            Und dein Nachname?
          </label>
          <input
            ref={nachnameRef}
            id="cf-nachname"
            className={styles.input}
            name="nachname"
            placeholder="Dein Nachname"
            autoComplete="family-name"
            value={values.nachname}
            onChange={(event) => setValue('nachname', event.target.value)}
            onKeyDown={handleStepKeyDown}
            tabIndex={step === 'nachname' ? 0 : -1}
          />
        </div>

        <div className={[styles.step, step === 'telefon' && styles.stepActive].filter(Boolean).join(' ')}>
          <span className={styles.stepLabel}>Schritt 3 von 5</span>
          <label className={styles.stepQuestion} htmlFor="cf-telefon">
            Wie erreiche ich dich telefonisch?
          </label>
          <input
            ref={telefonRef}
            id="cf-telefon"
            className={styles.input}
            type="tel"
            name="telefon"
            placeholder="Deine Telefonnummer"
            autoComplete="tel"
            value={values.telefon}
            onChange={(event) => setValue('telefon', event.target.value)}
            onKeyDown={handleStepKeyDown}
            tabIndex={step === 'telefon' ? 0 : -1}
          />
        </div>

        <div className={[styles.step, step === 'email' && styles.stepActive].filter(Boolean).join(' ')}>
          <span className={styles.stepLabel}>Schritt 4 von 5</span>
          <label className={styles.stepQuestion} htmlFor="cf-email">
            Und deine E-Mail-Adresse?
          </label>
          <input
            ref={emailRef}
            id="cf-email"
            className={styles.input}
            type="email"
            name="email"
            placeholder="deine@email.at"
            autoComplete="email"
            value={values.email}
            onChange={(event) => setValue('email', event.target.value)}
            onKeyDown={handleStepKeyDown}
            tabIndex={step === 'email' ? 0 : -1}
          />
        </div>

        <div className={[styles.step, step === 'nachricht' && styles.stepActive].filter(Boolean).join(' ')}>
          <span className={styles.stepLabel}>
            Schritt 5 von 5 <span className={styles.stepOptional}>(optional)</span>
          </span>
          <label className={styles.stepQuestion} htmlFor="cf-nachricht">
            Magst du mir schon sagen, worum es geht?
          </label>
          <textarea
            ref={nachrichtRef}
            id="cf-nachricht"
            className={styles.input}
            name="nachricht"
            placeholder="Deine Nachricht (optional)"
            rows={3}
            value={values.nachricht}
            onChange={(event) => setValue('nachricht', event.target.value)}
            tabIndex={step === 'nachricht' ? 0 : -1}
          />
        </div>

        <div className={[styles.step, step === 'final' && styles.stepActive].filter(Boolean).join(' ')}>
          <div className={styles.finalStep}>
            <p className={styles.summary}>
              <strong>{values.vorname} {values.nachname}</strong>
              {values.telefon && <> · {values.telefon}</>}
              {values.email && <> · {values.email}</>}
            </p>

            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                name="consent"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                tabIndex={step === 'final' ? 0 : -1}
              />
              <span>
                Ich bin damit einverstanden, dass Jasmin meine Angaben laut{' '}
                <a href="/datenschutz">Datenschutzerklärung</a> zur Kontaktaufnahme verwendet. *
              </span>
            </label>

            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                name="newsletter"
                checked={newsletter}
                onChange={(event) => setNewsletter(event.target.checked)}
                tabIndex={step === 'final' ? 0 : -1}
              />
              <span>
                Ich möchte außerdem gelegentlich Impulse und Termine per E-Mail erhalten (jederzeit
                abbestellbar).
              </span>
            </label>
          </div>
        </div>
      </div>

      {error && (
        <p className={styles.err} role="alert">
          {error}
        </p>
      )}

      <div className={styles.nav}>
        <button
          type="button"
          className={[styles.backBtn, isFirst && styles.backBtnHidden].filter(Boolean).join(' ')}
          onClick={goBack}
        >
          ← Zurück
        </button>

        {isLast ? (
          <button
            type="submit"
            className={`${styles.navBtn} ${styles.navBtnSubmit}`}
            disabled={status === 'sending'}
          >
            {status === 'sending' ? 'Wird gesendet …' : 'Nachricht senden'}
          </button>
        ) : (
          <button type="button" className={styles.navBtn} onClick={goNext}>
            Weiter →
          </button>
        )}
      </div>
    </form>
  )
}
