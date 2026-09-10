import { useEffect, useState } from 'react'
import { fetchMyProfile } from './api'
import type { Profile } from './types'

/** Lädt das Profil (inkl. Rolle) der gerade eingeloggten Person – erst NACH
 * einem echten Login sinnvoll aufrufbar (siehe SupabaseLoginGate). */
export function useProfile(): { profile: Profile | null; loading: boolean } {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchMyProfile()
      .then((p) => {
        if (!cancelled) setProfile(p)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { profile, loading }
}
