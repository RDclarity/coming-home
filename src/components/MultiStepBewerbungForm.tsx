import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { bewerbung } from '../data/site'
import { submitForm } from '../lib/submitForm'
import styles from './MultiStepBewerbungForm.module.css'

type StepId =
  | 'vorname'
  | 'nachname'
  | 'telefon'
  | 'email'
  | 'begleitung'
  | 'situation'
  | 'motivation'
  | 'final'

const STEPS: StepId[] = [
  'vorname',
  'nachname',
  'telefon',
  'email',
  'begleitung',
  'situation',
  'motivation',
  'final',
]

const QUESTION_COUNT = STEPS.length - 1 // "final" ist kein eigener Frageschritt

/**
 * Schritt-für-Schritt-Bewerbungsbogen – eine Frage pro Bildschirm statt eines
 * langen Formulars, gleiches Muster wie MultiStepContactForm.tsx im Footer.
 * Ziel: Leads einsammeln, ohne dass ein langes Formular abschreckt.
 *
 * Technisch bleibt es EIN natives <form>-Element – alle Felder liegen die
 * ganze Zeit im DOM, nur unsichtbar außerhalb des aktuellen Schritts. So
 * funktioniert `new FormData(form)` in submitForm.ts unverändert weiter.
 */
export function MultiStepBewerbungForm() {
  const [stepIndex, setStepIndex] = useState(0)
  const [values, setValues] = useState({
    vorname: '',
    nachname: '',
    telefon: '',
    email: '',
    begleitung: bewerbung.programs[0],
    situation: '',
    motivation: '',
  })
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const vornameRef = useRef<HTMLInputElement>(null)
  const nachnameRef = useRef<HTMLInputElement>(null)
  const telefonRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const begleitungRef = useRef<HTMLSelectElement>(null)
  const situationRef = useRef<HTMLTextAreaElement>(null)
  const motivationRef = useRef<HTMLTextAreaElement>(null)
  const stepRefs: Record<StepId, { current: HTMLElement | null } | null> = {
    vorname: vornameRef,
    nachname: nachnameRef,
    telefon: telefonRef,
    email: emailRef,
    begleitung: begleitungRef,
    situation: situationRef,
    motivation: motivationRef,
    final: null,
  }
  const isFirstRender = useRef(true)

  const step = STEPS[stepIndex]
  const isFirst = stepIndex === 0
  const isLast = step === 'final'

  useEffect(() => {
    // Wie im Footer-Formular: NICHT beim ersten Rendern fokussieren, sonst
    // klappt auf Mobilgeräten die Tastatur schon beim Laden der Seite auf.
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
    if (step === 'begleitung' || step === 'final') return true // optional / beim Absenden geprüft
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

    const result = await submitForm('bewerbung', formRef.current)

    if (result.ok) {
      setStatus('done')
    } else {
      setStatus('idle')
      setError(result.message)
    }
  }

  if (status === 'done') {
    return (
      <div className={styles.success}>
        <span className={styles.dot} aria-hidden="true" />
        <h3 className={styles.successTitle}>{bewerbung.successTitle}</h3>
        <p className={styles.successText}>{bewerbung.successText}</p>
      </div>
    )
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
          <span className={styles.stepLabel}>Schritt 1 von {QUESTION_COUNT}</span>
          <label className={styles.stepQuestion} htmlFor="bw-vorname">
            Wie heißt du?
          </label>
          <input
            ref={vornameRef}
            id="bw-vorname"
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
          <span className={styles.stepLabel}>Schritt 2 von {QUESTION_COUNT}</span>
          <label className={styles.stepQuestion} htmlFor="bw-nachname">
            Und dein Nachname?
          </label>
          <input
            ref={nachnameRef}
            id="bw-nachname"
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
          <span className={styles.stepLabel}>Schritt 3 von {QUESTION_COUNT}</span>
          <label className={styles.stepQuestion} htmlFor="bw-telefon">
            Wie erreiche ich dich telefonisch?
          </label>
          <input
            ref={telefonRef}
            id="bw-telefon"
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
          <span className={styles.stepLabel}>Schritt 4 von {QUESTION_COUNT}</span>
          <label className={styles.stepQuestion} htmlFor="bw-email">
            Und deine E-Mail-Adresse?
          </label>
          <input
            ref={emailRef}
            id="bw-email"
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

        <div
          className={[styles.step, step === 'begleitung' && styles.stepActive].filter(Boolean).join(' ')}
        >
          <span className={styles.stepLabel}>
            Schritt 5 von {QUESTION_COUNT} <span className={styles.stepOptional}>(optional)</span>
          </span>
          <label className={styles.stepQuestion} htmlFor="bw-begleitung">
            Welche Begleitung interessiert dich?
          </label>
          <select
            ref={begleitungRef}
            id="bw-begleitung"
            className={styles.input}
            name="begleitung"
            value={values.begleitung}
            onChange={(event) => setValue('begleitung', event.target.value)}
            tabIndex={step === 'begleitung' ? 0 : -1}
          >
            {bewerbung.programs.map((program) => (
              <option key={program} value={program}>
                {program}
              </option>
            ))}
          </select>
        </div>

        <div
          className={[styles.step, step === 'situation' && styles.stepActive].filter(Boolean).join(' ')}
        >
          <span className={styles.stepLabel}>Schritt 6 von {QUESTION_COUNT}</span>
          <label className={styles.stepQuestion} htmlFor="bw-situation">
            Wo stehst du gerade in deinem Leben?
          </label>
          <textarea
            ref={situationRef}
            id="bw-situation"
            className={styles.input}
            name="situation"
            placeholder="Ein paar Sätze reichen"
            rows={3}
            value={values.situation}
            onChange={(event) => setValue('situation', event.target.value)}
            tabIndex={step === 'situation' ? 0 : -1}
          />
        </div>

        <div
          className={[styles.step, step === 'motivation' && styles.stepActive].filter(Boolean).join(' ')}
        >
          <span className={styles.stepLabel}>Schritt 7 von {QUESTION_COUNT}</span>
          <label className={styles.stepQuestion} htmlFor="bw-motivation">
            Warum möchtest du diesen Weg jetzt gehen?
          </label>
          <textarea
            ref={motivationRef}
            id="bw-motivation"
            className={styles.input}
            name="motivation"
            placeholder="Was bewegt dich gerade dazu"
            rows={3}
            value={values.motivation}
            onChange={(event) => setValue('motivation', event.target.value)}
            tabIndex={step === 'motivation' ? 0 : -1}
          />
        </div>

        <div className={[styles.step, step === 'final' && styles.stepActive].filter(Boolean).join(' ')}>
          <div className={styles.finalStep}>
            <p className={styles.summary}>
              <strong>
                {values.vorname} {values.nachname}
              </strong>
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
              <span>{bewerbung.consent} *</span>
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
            {status === 'sending' ? 'Wird gesendet …' : bewerbung.submit}
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
