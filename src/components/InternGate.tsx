import { useState, type FormEvent, type ReactNode } from 'react'
import styles from './InternGate.module.css'

/**
 * Gemeinsamer Passphrase-Sichtschutz für /intern/*-Seiten (CRM, Editor).
 * KEINE echte Zugriffskontrolle – siehe Hinweistext. Eine rein statische
 * Seite ohne Backend kann eine Passphrase nicht serverseitig prüfen.
 */
export function InternGate({
  storageKey,
  passphrase,
  title,
  notice,
  children,
}: {
  storageKey: string
  passphrase: string
  title: string
  notice: ReactNode
  children: ReactNode
}) {
  const [unlocked, setUnlocked] = useState(
    () => typeof sessionStorage !== 'undefined' && sessionStorage.getItem(storageKey) === '1',
  )
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  if (unlocked) return <>{children}</>

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (value === passphrase) {
      try {
        sessionStorage.setItem(storageKey, '1')
      } catch {
        // Sitzung merkt sich das dann halt nicht – kein kritischer Pfad.
      }
      setUnlocked(true)
    } else {
      setError(true)
    }
  }

  return (
    <section>
      <form className={styles.gate} onSubmit={handleSubmit}>
        <span className={styles.badge}>Intern</span>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.notice}>{notice}</p>
        <input
          className={styles.input}
          type="password"
          placeholder="Passphrase"
          value={value}
          onChange={(event) => {
            setValue(event.target.value)
            setError(false)
          }}
          autoFocus
        />
        {error && <p className={styles.error}>Das war nicht die richtige Passphrase.</p>}
        <button type="submit" className={styles.submit}>
          Öffnen
        </button>
      </form>
    </section>
  )
}
