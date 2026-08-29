import { useState, type FormEvent, type ReactNode } from 'react'
import { signIn, signOut, useCrmSession } from '../crm/auth'
import styles from './SupabaseLoginGate.module.css'

/**
 * Echter Login (Supabase Auth) für Seiten, die eingeloggten Zugriff auf
 * geschützte Datenbank-Zeilen brauchen (Row Level Security). Anders als
 * InternGate.tsx ist das eine ECHTE Zugriffskontrolle – der Server prüft
 * Zugehörigkeit, nicht nur eine im Frontend abgefragte Passphrase.
 */
export function SupabaseLoginGate({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  const { session, loading } = useCrmSession()

  if (loading) return null

  if (!session) return <LoginForm title={title} />

  return (
    <>
      <div className={styles.signOutBar}>
        <button type="button" className={styles.signOutBtn} onClick={() => signOut()}>
          {session.user.email} · Abmelden
        </button>
      </div>
      {children}
    </>
  )
}

function LoginForm({ title }: { title: string }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    const message = await signIn(email, password)
    setSubmitting(false)
    if (message) setError(message)
  }

  return (
    <section>
      <form className={styles.gate} onSubmit={handleSubmit}>
        <span className={styles.badge}>Intern</span>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.notice}>
          Login für dein Coming-Home-Konto. Zugänge werden im Supabase-Dashboard verwaltet
          (Authentication → Users).
        </p>
        <input
          className={styles.input}
          type="email"
          placeholder="E-Mail"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoFocus
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Passwort"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.submit} disabled={submitting}>
          {submitting ? 'Wird geprüft …' : 'Anmelden'}
        </button>
      </form>
    </section>
  )
}
