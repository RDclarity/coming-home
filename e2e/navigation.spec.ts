import { expect, test } from '@playwright/test'

/**
 * Smoke-Test über die wichtigsten Routen: prüft, dass Prerendering +
 * Hydration für jeden Seitentyp funktionieren (Startseite, Service-Seite,
 * Ratgeber-Artikel, Rechtstexte, 404) – kein Weißbildschirm, kein
 * Hydration-Crash, Kerninhalt sichtbar.
 */

test('Startseite lädt mit Kerninhalt', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByRole('link', { name: /kennenlerngespräch vereinbaren/i }).first()).toBeVisible()
})

test('Navigation führt zur Begleitungen-Übersicht', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Begleitungen', exact: true }).click()
  await expect(page).toHaveURL(/\/begleitungen\/?$/)
  await expect(page.getByRole('heading', { name: 'Alle Begleitungen im Überblick' })).toBeVisible()
  await expect(page.getByText('Coming Home trägt meine Handschrift.')).toBeVisible()
})

test('Service-Detailseite (1:1 Session) zeigt Preis und CTA', async ({ page }) => {
  await page.goto('/begleitung/1-1-begleitung')
  await expect(page.getByRole('heading', { name: 'Individuelle 1:1 Session' })).toBeVisible()
  await expect(page.getByText('160 € – 220 €')).toBeVisible()
  await expect(page.getByRole('link', { name: /1:1 session anfragen/i })).toBeVisible()
})

test('Ratgeber-Artikel lädt vollständig', async ({ page }) => {
  await page.goto('/ratgeber/achtsame-beruehrung-erklaert')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Achtsame Berührung')
  await expect(page.getByText('Drei Prinzipien achtsamer Berührung')).toBeVisible()
})

test('Rechtstexte laden ohne Absturz', async ({ page }) => {
  for (const path of ['/impressum', '/datenschutz', '/agb']) {
    await page.goto(path)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  }
})

test('Unbekannte Route zeigt 404-Seite', async ({ page }) => {
  await page.goto('/diese-seite-gibt-es-nicht')
  await expect(page.getByText('Diese Seite gibt es nicht.')).toBeVisible()
})

test('Keine Konsolenfehler auf der Startseite', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  await page.goto('/')
  // Bewusst kein 'networkidle' – die Seite hält u. a. wegen des
  // <audio preload="none">-Elements dauerhaft eine Verbindung offen, "idle"
  // würde also nie erreicht. Ein fixes Zeitfenster reicht, um asynchrone
  // Konsolenfehler (z. B. aus useEffect) zuverlässig einzufangen.
  await page.waitForTimeout(2000)
  expect(errors).toEqual([])
})
