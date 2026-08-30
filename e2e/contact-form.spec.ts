import { expect, test, type Page } from '@playwright/test'
import { mockSupabaseLeadInsert } from './helpers'

/**
 * Das Schritt-für-Schritt-Kontaktformular im Footer (MultiStepContactForm,
 * Section #kontakt) – auf jeder Seite vorhanden. Testet den kompletten Happy
 * Path sowie den Honeypot-Spamschutz aus Phase 3 (SECURITY.md).
 *
 * WICHTIG: Auf der Startseite gibt es DREI Formulare mit teils identischen
 * Fragen/Labels (Bewerbungsbogen #kennenlernen, Kontaktformular #kontakt,
 * Newsletter #audiouebung) – alle Locator sind deshalb bewusst auf
 * `#kontakt` gescoped, sonst schlägt Playwrights Strict Mode fehl
 * (mehrdeutiger Locator).
 */

function contactForm(page: Page) {
  return page.locator('#kontakt')
}

async function fillContactForm(page: Page) {
  const form = contactForm(page)
  await form.getByLabel('Wie heißt du?').fill('Maria')
  await form.getByRole('button', { name: 'Weiter →' }).click()

  await form.getByLabel('Und dein Nachname?').fill('Testfrau')
  await form.getByRole('button', { name: 'Weiter →' }).click()

  await form.getByLabel('Wie erreiche ich dich telefonisch?').fill('+43 660 1234567')
  await form.getByRole('button', { name: 'Weiter →' }).click()

  await form.getByLabel('Und deine E-Mail-Adresse?').fill('e2e-test@example.com')
  await form.getByRole('button', { name: 'Weiter →' }).click()

  // Nachricht-Schritt ist optional – bewusst übersprungen, um auch diesen
  // Pfad (kein Pflichtfeld) abzudecken.
  await form.getByRole('button', { name: 'Weiter →' }).click()

  await form.getByRole('checkbox', { name: /einverstanden.*Jasmin meine Angaben/s }).check()
}

test('Kontaktformular: kompletter Happy Path führt zu Erfolgsmeldung', async ({ page }) => {
  await mockSupabaseLeadInsert(page)

  // Der Insert läuft in supabaseStore.ts bewusst als nicht-abgewartetes
  // Hintergrund-Promise (siehe add()) – deshalb hier auf den tatsächlichen
  // Request warten statt direkt nach dem Klick eine Flag-Variable zu prüfen,
  // sonst race'd der Test gegen den dynamischen `import('@supabase/supabase-js')`.
  const insertRequest = page.waitForRequest(
    (req) => req.url().includes('/rest/v1/leads') && req.method() === 'POST',
  )

  await page.goto('/')
  await fillContactForm(page)
  await contactForm(page).getByRole('button', { name: 'Nachricht senden' }).click()

  await expect(contactForm(page).getByText('Deine Nachricht ist angekommen.')).toBeVisible()
  await expect(insertRequest).resolves.toBeTruthy()
})

test('Kontaktformular: Absenden ohne Datenschutz-Zustimmung schlägt fehl', async ({ page }) => {
  await mockSupabaseLeadInsert(page)
  await page.goto('/')

  const form = contactForm(page)
  await form.getByLabel('Wie heißt du?').fill('Maria')
  await form.getByRole('button', { name: 'Weiter →' }).click()
  await form.getByLabel('Und dein Nachname?').fill('Testfrau')
  await form.getByRole('button', { name: 'Weiter →' }).click()
  await form.getByLabel('Wie erreiche ich dich telefonisch?').fill('+43 660 1234567')
  await form.getByRole('button', { name: 'Weiter →' }).click()
  await form.getByLabel('Und deine E-Mail-Adresse?').fill('e2e-test@example.com')
  await form.getByRole('button', { name: 'Weiter →' }).click()
  await form.getByRole('button', { name: 'Weiter →' }).click()

  // Kein Consent-Haken gesetzt.
  await form.getByRole('button', { name: 'Nachricht senden' }).click()

  await expect(form.getByText('Bitte bestätige die Datenschutzerklärung')).toBeVisible()
})

test('Kontaktformular: Honeypot verhindert Bot-Submits (kein echter Insert)', async ({ page }) => {
  await mockSupabaseLeadInsert(page)

  let insertCalled = false
  page.on('request', (req) => {
    if (req.url().includes('/rest/v1/leads') && req.method() === 'POST') insertCalled = true
  })

  await page.goto('/')

  // Simuliert einen Bot, der blind auch das für Menschen unsichtbare Feld
  // ausfüllt (siehe submitForm.ts – name="website").
  await contactForm(page).locator('input[name="website"]').fill('http://spam.example', { force: true })

  await fillContactForm(page)
  await contactForm(page).getByRole('button', { name: 'Nachricht senden' }).click()

  // Der Bot bekommt bewusst KEINEN Hinweis (wirkt wie Erfolg) – aber es
  // wird nichts gespeichert.
  await expect(contactForm(page).getByText('Deine Nachricht ist angekommen.')).toBeVisible()
  expect(insertCalled).toBe(false)
})
