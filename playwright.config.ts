import { defineConfig, devices } from '@playwright/test'

/**
 * E2E-Tests laufen gegen einen ECHTEN Production-Build (`npm run build` +
 * `npm run preview`, also `scripts/serve-dist.mjs`) – bewusst NICHT gegen
 * `npm run dev`. Nur so wird tatsächlich geprüft, was live ausgeliefert wird:
 * Prerendering, Hydration, Base-Pfad. `vite preview` wird hier absichtlich
 * nicht verwendet (SPA-Fallback verschleiert Routing-Fehler, siehe Kommentar
 * in scripts/serve-dist.mjs).
 *
 * WICHTIG zu Supabase: Die Tests schicken NIE echte Netzwerk-Requests an
 * Supabase – jeder Test, der ein Formular abschickt oder das CRM aufruft,
 * fängt die relevanten Requests über `page.route()` ab (siehe e2e/*.spec.ts).
 * Das gilt unabhängig davon, ob lokal ein echtes `.env` mit Supabase-Zugangs-
 * daten vorliegt oder nicht – die echte Datenbank wird durch Testläufe nie
 * verändert.
 *
 * Für CI: Damit die Supabase-Login-Maske (statt des localStorage-Fallbacks)
 * getestet wird, müssen VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY beim Build
 * gesetzt sein (dieselben GitHub-Secrets wie im Deploy-Workflow).
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4300',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4300',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
