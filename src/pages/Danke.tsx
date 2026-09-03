import { useLocation } from 'react-router-dom'
import { Button } from '../components/Button'
import { Eyebrow } from '../components/Eyebrow'
import type { FormType } from '../lib/submitForm'
import styles from './Danke.module.css'

type DankeState = { formType?: FormType } | null

const COPY: Record<FormType, { title: string; text: string }> = {
  kontakt: {
    title: 'Danke für deine Nachricht.',
    text: 'Sie ist angekommen. Ich melde mich bald persönlich bei dir.',
  },
  bewerbung: {
    title: 'Danke für dein Vertrauen.',
    text: 'Deine Bewerbung ist angekommen. Ich melde mich innerhalb der nächsten Tage persönlich bei dir.',
  },
  newsletter: {
    title: 'Danke.',
    text: 'Schau in dein Postfach – die Audioübung ist unterwegs zu dir.',
  },
}

const DEFAULT_COPY = {
  title: 'Danke.',
  text: 'Deine Anfrage ist angekommen. Ich melde mich bald persönlich bei dir.',
}

/**
 * Eigene Route statt einer nur eingeblendeten Erfolgsmeldung innerhalb des
 * jeweiligen Formulars – nach dem Absenden landet man wirklich auf dieser
 * Seite (siehe MultiStepContactForm.tsx, MultiStepBewerbungForm.tsx,
 * Newsletter.tsx: navigate('/danke', { state: { formType } })).
 *
 * Wird bewusst NICHT vorgerendert/in der Sitemap geführt (siehe
 * src/seo/pages.ts) – sie ist nur nach einem echten Formularversand über
 * Client-Navigation erreichbar, nicht über einen öffentlichen Link.
 */
export function Danke() {
  const location = useLocation()
  const formType = (location.state as DankeState)?.formType
  const copy = formType ? COPY[formType] : DEFAULT_COPY

  return (
    <section className={styles.sec}>
      <div className={styles.inner}>
        <Eyebrow align="center">Angekommen</Eyebrow>
        <h1 className={styles.title}>{copy.title}</h1>
        <p className={styles.text}>{copy.text}</p>
        <div className={styles.actions}>
          <Button href="/" style={{ backgroundColor: 'var(--c-key1)', color: 'var(--c-dark)' }}>
            Zur Startseite
          </Button>
          <Button href="/begleitungen" variant="outline">
            Alle Begleitungen
          </Button>
        </div>
      </div>
    </section>
  )
}
