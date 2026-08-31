/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FORM_ENDPOINT?: string
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  readonly VITE_GA_MEASUREMENT_ID?: string
  readonly VITE_GOOGLE_ADS_ID?: string
  readonly VITE_META_PIXEL_ID?: string
  readonly VITE_CONVERSION_ENDPOINT?: string
  readonly VITE_LEAD_NOTIFY_ENDPOINT?: string
  readonly VITE_SENTRY_DSN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
