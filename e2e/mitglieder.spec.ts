import { expect, mockMemberAuth, mockSupabaseAuth, test } from './helpers'

/**
 * Grundlegende Tests für den Mitgliederbereich (/mitglieder) und den
 * dazugehörigen Verwaltungsbereich im Backend (Tab „Mitgliederbereich“ unter
 * /admin). Ein voller Durchlauf mit freigeschaltetem Monat, Video, PDF und
 * Fragebogen bräuchte deutlich mehr gemockte Tabellen – hier geht es um die
 * beiden Fälle, die jede:r Nutzer:in zuerst sieht: die Login-Maske und der
 * Zustand ohne (noch) hinterlegte Einschreibung.
 */

test('Mitgliederbereich ohne Login zeigt die Login-Maske', async ({ page }) => {
  await page.goto('/mitglieder')
  await expect(page.getByRole('heading', { name: 'Coming-Home-Mitgliederbereich' })).toBeVisible()
  await expect(page.getByPlaceholder('E-Mail')).toBeVisible()
  await expect(page.getByPlaceholder('Passwort')).toBeVisible()
})

test('Mitgliederbereich ohne Einschreibung zeigt einen Hinweis', async ({ page }) => {
  await mockMemberAuth(page)
  await page.goto('/mitglieder')

  await page.getByPlaceholder('E-Mail').fill('teilnehmerin@example.com')
  await page.getByPlaceholder('Passwort').fill('richtiges-passwort')
  await page.getByRole('button', { name: 'Anmelden' }).click()

  await expect(page.getByRole('heading', { name: 'Hallo, Teilnehmerin.' })).toBeVisible()
  await expect(page.getByText('Für deinen Zugang ist aktuell keine Begleitung hinterlegt.')).toBeVisible()
})

test('Backend: Tab „Mitgliederbereich“ zeigt die Programmverwaltung', async ({ page }) => {
  await mockSupabaseAuth(page, 'success')
  await page.route('**/rest/v1/programs**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  )
  await page.route('**/rest/v1/enrollments**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  )
  await page.goto('/admin')

  await page.getByPlaceholder('E-Mail').fill('jasmin@example.com')
  await page.getByPlaceholder('Passwort').fill('richtiges-passwort')
  await page.getByRole('button', { name: 'Anmelden' }).click()
  await expect(page.getByRole('heading', { name: 'Coming-Home-Backend' })).toBeVisible()

  await page.getByRole('button', { name: 'Mitgliederbereich', exact: true }).click()

  await expect(page.getByText('Programme', { exact: true })).toBeVisible()
  await expect(page.getByText('+ Neues Programm')).toBeVisible()
})
