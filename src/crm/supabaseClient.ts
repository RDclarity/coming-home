import type { SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * Ob Supabase konfiguriert ist – rein synchron aus den Build-Time-
 * Umgebungsvariablen, entscheidet in crm/store.ts, welcher Adapter aktiv
 * ist. Sagt nichts darüber, ob die Verbindung schon aufgebaut wurde.
 */
export const supabaseConfigured = Boolean(url && anonKey)

let clientPromise: Promise<SupabaseClient> | null = null

/**
 * Lädt `@supabase/supabase-js` erst bei der ERSTEN tatsächlichen Nutzung
 * nach (dynamisches `import()`), statt die komplette Bibliothek in jede
 * Seite einzubacken. Ohne das würde jede:r Besucher:in – auch auf der
 * Startseite, ohne je ein Formular abzuschicken – die Supabase-Bibliothek
 * mitladen, nur weil submitForm.ts sie potenziell braucht.
 */
export function getSupabase(): Promise<SupabaseClient> | null {
  if (!supabaseConfigured) return null

  if (!clientPromise) {
    clientPromise = import('@supabase/supabase-js').then(({ createClient }) =>
      createClient(url!, anonKey!),
    )
  }

  return clientPromise
}
