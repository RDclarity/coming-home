import { test as base, type Page } from '@playwright/test'

/**
 * Eigene `test`-Instanz statt der aus `@playwright/test` direkt – fängt für
 * JEDEN Test automatisch die Seitenaufruf-Statistik ab (siehe
 * lib/analytics.ts, wird bei jeder Navigation ausgelöst, nicht nur auf
 * CRM-Seiten). Ohne das würde jeder Testlauf echte, sinnlose Zeilen in
 * Jasmins Live-Statistik hinterlassen – jeder Spec-File importiert deshalb
 * `test`/`expect` von hier statt direkt von `@playwright/test`.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route('**/rest/v1/page_views**', (route) => {
      const status = route.request().method() === 'POST' ? 201 : 200
      return route.fulfill({ status, contentType: 'application/json', body: '[]' })
    })
    await use(page)
  },
})
export { expect } from '@playwright/test'

/**
 * Fängt Supabase-Netzwerk-Requests ab, damit Tests NIE echte Daten in Jasmins
 * Live-Datenbank schreiben – unabhängig davon, ob lokal ein echtes `.env`
 * mit Supabase-Zugangsdaten vorliegt. Siehe playwright.config.ts.
 */
export async function mockSupabaseLeadInsert(page: Page) {
  await page.route('**/rest/v1/leads**', async (route) => {
    if (route.request().method() === 'POST') {
      // Leere Erfolgsantwort reicht – die App wertet den Response-Body des
      // Inserts nicht aus (siehe Kommentar in supabaseStore.ts: bewusst kein
      // `.select()`, also auch kein RETURNING-Body zu erwarten).
      await route.fulfill({ status: 201, contentType: 'application/json', body: '[]' })
      return
    }
    await route.continue()
  })
}

/** Login-Versuch im CRM abfangen, ohne echte Supabase-Auth zu kontaktieren. */
export async function mockSupabaseAuth(page: Page, outcome: 'success' | 'invalid-credentials') {
  await page.route('**/auth/v1/token**', async (route) => {
    if (outcome === 'success') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'e2e-fake-access-token',
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: 'e2e-fake-refresh-token',
          user: {
            id: '00000000-0000-0000-0000-000000000000',
            email: 'jasmin@example.com',
            aud: 'authenticated',
            role: 'authenticated',
          },
        }),
      })
      return
    }
    await route.fulfill({
      status: 400,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'invalid_grant', error_description: 'Invalid login credentials' }),
    })
  })

  // Nach erfolgreichem Login lädt das Dashboard die Lead-Liste – auch hier
  // keine echten Daten, nur eine leere, valide Antwort.
  await page.route('**/rest/v1/leads**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  )
  await page.route('**/rest/v1/lead_notes**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  )
}
