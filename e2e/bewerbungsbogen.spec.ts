import { expect, mockSupabaseLeadInsert, test, type Page } from './helpers'

/**
 * Bewerbungsbogen (#kennenlernen, MultiStepBewerbungForm) – deckt speziell
 * die CRO-Änderung ab: "Wo stehst du gerade in deinem Leben?" und "Warum
 * möchtest du diesen Weg jetzt gehen?" dürfen NICHT mehr zum Blockieren
 * führen, wenn sie leer bleiben (siehe currentStepIsValid()).
 *
 * Gescoped auf `#kennenlernen`, weil die Startseite mehrere Formulare mit
 * teils identischen Fragen hat (siehe contact-form.spec.ts).
 */

function bewerbungsForm(page: Page) {
  return page.locator('#kennenlernen')
}

test('Bewerbungsbogen: Situation/Motivation lassen sich überspringen', async ({ page }) => {
  await mockSupabaseLeadInsert(page)
  const insertRequest = page.waitForRequest(
    (req) => req.url().includes('/rest/v1/leads') && req.method() === 'POST',
  )

  await page.goto('/')
  const form = bewerbungsForm(page)

  await form.getByLabel('Wie heißt du?').fill('Maria')
  await form.getByRole('button', { name: 'Weiter →' }).click()
  await form.getByLabel('Und dein Nachname?').fill('Testfrau')
  await form.getByRole('button', { name: 'Weiter →' }).click()
  await form.getByLabel('Wie erreiche ich dich telefonisch?').fill('+43 660 1234567')
  await form.getByRole('button', { name: 'Weiter →' }).click()
  await form.getByLabel('Und deine E-Mail-Adresse?').fill('e2e-test@example.com')
  await form.getByRole('button', { name: 'Weiter →' }).click()

  // "Welche Begleitung interessiert dich?" (optional, Vorauswahl reicht).
  await form.getByRole('button', { name: 'Weiter →' }).click()

  // "Wo stehst du gerade in deinem Leben?" – bewusst NICHT ausgefüllt.
  await expect(form.getByLabel('Wo stehst du gerade in deinem Leben?')).toBeVisible()
  await form.getByRole('button', { name: 'Weiter →' }).click()

  // "Warum möchtest du diesen Weg jetzt gehen?" – bewusst NICHT ausgefüllt.
  await expect(form.getByLabel('Warum möchtest du diesen Weg jetzt gehen?')).toBeVisible()
  await form.getByRole('button', { name: 'Weiter →' }).click()

  // Kein Fehlertext darf erschienen sein, weil beide Felder leer blieben.
  await expect(form.getByText('Das brauche ich noch, bevor es weitergeht.')).toHaveCount(0)

  await form.getByRole('checkbox').check()
  await form.getByRole('button', { name: 'Anfrage senden' }).click()

  await expect(page).toHaveURL(/\/danke$/)
  await expect(insertRequest).resolves.toBeTruthy()
})
