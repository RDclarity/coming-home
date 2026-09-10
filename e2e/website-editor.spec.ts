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

test('Backend: Verlauf zeigt frühere Versionen eines Felds und stellt sie wieder her', async ({ page }) => {
  await mockSupabaseAuth(page, 'success')
  await page.route('**/rest/v1/content_overrides**', (route) => {
    if (route.request().method() === 'GET') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
    }
    return route.fulfill({ status: 201, contentType: 'application/json', body: '[]' })
  })
  await page.route('**/rest/v1/content_override_history**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{ value: 'Ältere Version des Texts', created_at: new Date().toISOString() }]),
    }),
  )
  await page.goto('/admin')

  await page.getByPlaceholder('E-Mail').fill('jasmin@example.com')
  await page.getByPlaceholder('Passwort').fill('richtiges-passwort')
  await page.getByRole('button', { name: 'Anmelden' }).click()
  await page.getByRole('button', { name: 'Website', exact: true }).click()
  await page.getByRole('button', { name: 'Startseite – Hero' }).click()

  await page.getByTitle('Verlauf').first().click()
  await expect(page.getByText('Ältere Version des Texts')).toBeVisible()

  await page.getByRole('button', { name: 'Wiederherstellen' }).click()
  await expect(page.locator('textarea').first()).toHaveValue('Ältere Version des Texts')
})

test('Backend: Foto-Bibliothek zeigt vorhandene Fotos zur Wiederverwendung', async ({ page }) => {
  await mockSupabaseAuth(page, 'success')
  await page.route('**/rest/v1/custom_sections**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: 'test-section-1',
          block_type: 'image_text',
          sort_order: 0,
          content: { heading: 'Testüberschrift', body: 'Testtext' },
        },
      ]),
    }),
  )
  await page.route('**/storage/v1/object/list/site-images**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { name: 'foto-1.jpg', id: '1', created_at: new Date().toISOString() },
      ]),
    }),
  )
  await page.goto('/admin')

  await page.getByPlaceholder('E-Mail').fill('jasmin@example.com')
  await page.getByPlaceholder('Passwort').fill('richtiges-passwort')
  await page.getByRole('button', { name: 'Anmelden' }).click()
  await page.getByRole('button', { name: 'Website', exact: true }).click()
  await page.getByRole('button', { name: 'Bereiche', exact: true }).click()

  await expect(page.getByPlaceholder('Überschrift (optional)')).toHaveValue('Testüberschrift')
  await page.getByRole('button', { name: 'Vorhandenes Foto wählen' }).click()

  await expect(page.getByTitle('foto-1.jpg')).toBeVisible()
})

/**
 * Klick-zum-Bearbeiten (EditModeOverlay.tsx in der Live-Vorschau schickt
 * beim Klick auf einen Bereich eine postMessage ans Backend, siehe
 * lib/editMode.ts). Die Vorschau selbst lädt im Test die echte Seite über
 * eine andere Origin als /admin (anders als live, wo beides auf
 * jasmindraxl.at liegt) – deshalb wird hier direkt die Nachricht simuliert,
 * die die Vorschau schicken würde, statt echt im Iframe zu klicken. Das
 * deckt genau den Teil ab, der die eigentliche Logik enthält: welcher Tab,
 * welche Gruppe geht auf.
 */
test('Backend: Klick-Nachricht aus der Vorschau öffnet die passende Gruppe', async ({ page }) => {
  await mockSupabaseAuth(page, 'success')
  await page.route('**/rest/v1/content_overrides**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  )
  await page.goto('/admin')

  await page.getByPlaceholder('E-Mail').fill('jasmin@example.com')
  await page.getByPlaceholder('Passwort').fill('richtiges-passwort')
  await page.getByRole('button', { name: 'Anmelden' }).click()
  await page.getByRole('button', { name: 'Website', exact: true }).click()

  // Simuliert: Klick auf die "Arbeitsweise"-Sektion in der Vorschau.
  await page.evaluate(() => {
    window.postMessage(
      { source: 'coming-home-edit-mode', sectionId: 'arbeitsweise', pathname: '/' },
      window.location.origin,
    )
  })
  await expect(page.locator('#gruppe-site\\:arbeitsweise')).toBeVisible()
  await expect(page.locator('#gruppe-site\\:arbeitsweise textarea').first()).toBeFocused()

  // Simuliert: Klick auf der 1:1-Session-Seite -> passende Begleitungs-Gruppe.
  await page.evaluate(() => {
    window.postMessage(
      { source: 'coming-home-edit-mode', sectionId: 'coming-home', pathname: '/begleitung/1-1-begleitung' },
      window.location.origin,
    )
  })
  await expect(page.getByText('Begleitung: Individuelle 1:1 Session')).toBeVisible()
})
