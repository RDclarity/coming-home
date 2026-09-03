import { expect, test } from '@playwright/test'
import { mockSupabaseAuth } from './helpers'

/**
 * /admin ist nicht vorgerendert (siehe scripts/prerender.mjs) und wird
 * über dist/404.html + Client-Routing erreicht – deshalb hier bewusst über
 * die Startseite + direkte Eingabe der URL statt eines einfachen `goto`,
 * damit der reale Pfad getestet wird, den Besucher:innen auch nehmen.
 *
 * Diese Tests prüfen nur die UI-Ebene (Login-Maske blockiert die Ansicht).
 * Die eigentliche Zugriffskontrolle läuft serverseitig über Supabase Row
 * Level Security (siehe SECURITY.md) – das ist hier bewusst NICHT Teil des
 * Tests, weil es keine echten Supabase-Zugangsdaten in der Testumgebung
 * geben soll.
 */

test('CRM ohne Login zeigt die Login-Maske, keine Leads', async ({ page }) => {
  await page.goto('/admin')
  await expect(page.getByRole('heading', { name: 'Coming-Home-CRM' })).toBeVisible()
  await expect(page.getByPlaceholder('E-Mail')).toBeVisible()
  await expect(page.getByPlaceholder('Passwort')).toBeVisible()
  await expect(page.getByText('Anfragen', { exact: true })).toHaveCount(0)
})

test('CRM: falsches Passwort zeigt Fehlermeldung, kein Zugriff', async ({ page }) => {
  await mockSupabaseAuth(page, 'invalid-credentials')
  await page.goto('/admin')

  await page.getByPlaceholder('E-Mail').fill('jasmin@example.com')
  await page.getByPlaceholder('Passwort').fill('falsches-passwort')
  await page.getByRole('button', { name: 'Anmelden' }).click()

  await expect(page.getByText(/invalid login credentials/i)).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Anfragen' })).toHaveCount(0)
})

test('CRM: erfolgreicher Login zeigt das Dashboard', async ({ page }) => {
  await mockSupabaseAuth(page, 'success')
  await page.goto('/admin')

  await page.getByPlaceholder('E-Mail').fill('jasmin@example.com')
  await page.getByPlaceholder('Passwort').fill('richtiges-passwort')
  await page.getByRole('button', { name: 'Anmelden' }).click()

  await expect(page.getByRole('heading', { name: 'Anfragen' })).toBeVisible()
  // Gemockte Antwort liefert bewusst 0 Leads – Leer-/Loading-Zustand aus
  // Phase 4 (crmStore.isLoading()) muss sich korrekt auflösen.
  await expect(page.getByText('Keine Anfragen in dieser Ansicht.')).toBeVisible()
})
