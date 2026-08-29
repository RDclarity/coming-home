/**
 * Einzige Quelle für Preise. Nur das Tagesseminar hat einen festen,
 * öffentlich genannten Preis – alle anderen Begleitungen sind bewusst ohne
 * Preisangabe ("Preis auf Anfrage"), weil sie individuell im
 * Kennenlerngespräch besprochen werden.
 */

export const pricing = {
  tagesseminar: {
    label: 'Tagesseminar',
    price: 369,
    unit: 'pro Person',
    duration: 'ganztägig',
  },
} as const

/** Label für alle Begleitungen ohne festen Preis. */
export const AUF_ANFRAGE = 'Preis auf Anfrage'

/** Formatiert einen Preis als "369 €" bzw. "2.990 €". Kein `toLocaleString`,
 * siehe Kommentar unten – Node (Prerender) und Browser können sonst
 * unterschiedliche Leerzeichen als Tausendertrenner erzeugen und React beim
 * Hydrieren einen Textmismatch werfen lassen (Fehler #418). */
export function formatPrice(amount: number): string {
  const withThousands = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${withThousands} €`
}
