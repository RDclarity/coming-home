/**
 * Einzige Quelle für alle Preise der Seite. Alle Service- und Angebotsseiten
 * greifen hierauf zu, damit ein Preis nie an zwei Stellen unterschiedlich steht.
 */

export const pricing = {
  einzelstunde: {
    label: 'Einzelstunde',
    price: 140,
    unit: 'pro Session',
    duration: '90 Minuten',
  },
  tagesseminar: {
    label: 'Tagesseminar',
    price: 369,
    unit: 'pro Person',
    duration: 'ganztägig',
  },
  begleitungDreiMonate: {
    label: '3-Monats-Begleitung',
    price: 2990,
    unit: 'gesamt',
    duration: '3 Monate',
  },
  begleitungZwoelfMonate: {
    label: '12-Monats-Begleitung',
    price: 9590,
    unit: 'gesamt',
    duration: '12 Monate',
  },
} as const

export type PricingKey = keyof typeof pricing

/**
 * Formatiert einen Preis als "140 €" bzw. "2.990 €".
 *
 * Bewusst ohne `toLocaleString('de-AT')`: Node (beim Prerendern) und der
 * Browser können dafür unterschiedliche Unicode-Leerzeichen als
 * Tausendertrenner verwenden (schmales geschütztes Leerzeichen vs. normales) –
 * das lässt React beim Hydrieren einen Textmismatch werfen (Fehler #418),
 * weil der serverseitig gerenderte Text nicht exakt zum clientseitig neu
 * berechneten passt. Diese manuelle Formatierung liefert auf Server und
 * Client garantiert dasselbe Zeichen.
 */
export function formatPrice(amount: number): string {
  const withThousands = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${withThousands} €`
}
