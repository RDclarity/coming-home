/**
 * Echter Login fürs CRM, sobald Supabase konfiguriert ist (siehe
 * supabaseClient.ts). Nur eingeloggte Nutzer:innen dürfen laut Row Level
 * Security (supabase/migrations/) Leads lesen/bearbeiten – die Passphrase
 * aus InternGate.tsx reicht dafür nicht mehr aus, das ist echte
 * Zugriffskontrolle statt nur ein Sichtschutz.
 *
 * Den ersten Account (Jasmins Zugang) legt ihr selbst im Supabase-Dashboard
 * an: Authentication → Users → Add user. Bewusst nicht von hier aus
 * automatisch angelegt – das E-Mail/Passwort für Jasmins Login ist eure
 * Entscheidung, keine, die eine KI für sie treffen sollte.
 */

import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { getSupabase } from './supabaseClient'
import { refreshCrmData } from './supabaseStore'

export function useCrmSession(): { session: Session | null; loading: boolean } {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const clientPromise = getSupabase()
    if (!clientPromise) {
      setLoading(false)
      return
    }

    let unsubscribe: (() => void) | undefined

    clientPromise.then((client) => {
      client.auth.getSession().then(({ data }) => {
        setSession(data.session)
        setLoading(false)
      })

      const { data: subscription } = client.auth.onAuthStateChange((_event, nextSession) => {
        setSession(nextSession)
        refreshCrmData()
      })
      unsubscribe = () => subscription.subscription.unsubscribe()
    })

    return () => unsubscribe?.()
  }, [])

  return { session, loading }
}

export async function signIn(email: string, password: string): Promise<string | null> {
  const clientPromise = getSupabase()
  if (!clientPromise) return 'Kein Supabase konfiguriert.'
  const client = await clientPromise
  const { error } = await client.auth.signInWithPassword({ email, password })
  return error ? error.message : null
}

export async function signOut(): Promise<void> {
  const client = await getSupabase()
  await client?.auth.signOut()
}
