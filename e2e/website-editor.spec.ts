import { expect, mockSupabaseAuth, test } from './helpers'

/**
 * Grundlegender Test für den Website-Editor (Tab "Website" im Backend) –
 * prüft, dass die Texte-Ansicht mit den erwarteten Bedienelementen rendert.
 * Ein voller Durchlauf (Feld bearbeiten, speichern, veröffentlichen) bräuchte
 * echte Supabase-Schreibzugriffe und die trigger-rebuild-Function – das ist
 * bereits manuell gegen die echte Datenbank verifiziert worden (siehe
 * Commit-Beschreibung).
 */
test('Backend: Tab „Website" zeigt den Texte-Editor', async ({ page }) => {
  await mockSupabaseAuth(page, 'success')
  await page.route('**/rest/v1/content_overrides**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  )
  await page.goto('/admin')

  await page.getByPlaceholder('E-Mail').fill('jasmin@example.com')
  await page.getByPlaceholder('Passwort').fill('richtiges-passwort')
  await page.getByRole('button', { name: 'Anmelden' }).click()
  await expect(page.getByRole('heading', { name: 'Coming-Home-Backend' })).toBeVisible()

  await page.getByRole('button', { name: 'Website', exact: true }).click()

  await expect(page.getByPlaceholder('Text durchsuchen …')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Veröffentlichen' })).toBeVisible()
  // Eine bekannte Gruppe muss auftauchen, z. B. die Startseiten-Hero-Sektion.
  await expect(page.getByText('Startseite – Hero')).toBeVisible()
})

test('Backend: Gruppe öffnen lässt die Vorschau zur passenden Stelle springen', async ({ page }) => {
  await mockSupabaseAuth(page, 'success')
  await page.route('**/rest/v1/content_overrides**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  )
  await page.goto('/admin')

  await page.getByPlaceholder('E-Mail').fill('jasmin@example.com')
  await page.getByPlaceholder('Passwort').fill('richtiges-passwort')
  await page.getByRole('button', { name: 'Anmelden' }).click()
  await page.getByRole('button', { name: 'Website', exact: true }).click()

  const vorschau = page.locator('iframe[title="Aktuelle Website"]')
  await expect(vorschau).toHaveAttribute('src', 'https://jasmindraxl.at/')

  // Backend und Vorschau laufen im Test auf unterschiedlichen Origins
  // (anders als live, wo beides auf jasmindraxl.at liegt) – dort scrollt
  // dieselbe Stelle im Frame nur, hier lädt die Vorschau deshalb neu.
  // Genau das lässt sich hier prüfen: die richtige Ziel-URL pro Gruppe.
  await page.getByRole('button', { name: 'Startseite – Hero' }).click()
  await expect(vorschau).toHaveAttribute('src', 'https://jasmindraxl.at/#coming-home')

  await page.getByRole('button', { name: /^Begleitung: Individuelle 1:1 Session/ }).click()
  await expect(vorschau).toHaveAttribute('src', 'https://jasmindraxl.at/begleitung/1-1-begleitung')
})
