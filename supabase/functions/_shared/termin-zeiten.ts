// Verfügbarkeit für Jasmins kostenloses 20-Minuten-"Kennenlerngespräch"
// (Telefonat) – Besucher:innen buchen direkt selbst einen freien Slot,
// Mo–Fr 9–17 Uhr, Wiener Ortszeit. Ersetzt den alten Bewerbungsbogen-
// Trichter für dieses eine Gespräch (Nutzerwunsch 2026-10-03).
//
// ACHTUNG: Diese Datei existiert zweimal, identisch:
//   src/lib/terminZeiten.ts                       (Website, zeigt die Slots an)
//   supabase/functions/_shared/termin-zeiten.ts   (Server, prüft jede Buchung)
// Bei einer Änderung der Zeiten BEIDE Dateien anpassen – sonst zeigt die
// Seite Termine an, die der Server ablehnt (oder umgekehrt).
//
// Bewusst ohne jede Abhängigkeit (kein Deno, kein DOM), damit dieselbe
// Logik in beiden Laufzeitumgebungen läuft. Alle Zeiten in Wiener Ortszeit –
// egal, in welcher Zeitzone der Browser des Besuchers steht. Angepasst aus
// dem Schwesterprojekt tischlerkultur-relaunch (src/lib/videocallZeiten.ts):
// hier nur EIN Gesprächstyp (Telefonat), 20-Minuten-Slots, ohne die dortige
// Gesprächsart-/Erreichbarkeits-Unterscheidung.

export const ZEITZONE = 'Europe/Vienna'
/** Länge eines Gesprächs = Raster der buchbaren Startzeiten. */
export const DAUER_MINUTEN = 20
/** Frühestens so viele Minuten ab jetzt buchbar (Vorlauf für Jasmin). */
export const VORLAUF_MINUTEN = 60
/** So viele Tage im Voraus ist der Kalender offen. */
export const BUCHBAR_TAGE = 28

/**
 * Wochentag (0 = Sonntag … 6 = Samstag) → Zeitfenster [von, bis) in Wiener
 * Ortszeit. Der letzte Slot endet genau zur „bis"-Zeit (09:00–17:00 → letzter
 * Start 16:40).
 */
export const ZEITFENSTER: Readonly<Record<number, ReadonlyArray<readonly [string, string]>>> = {
  1: [['09:00', '17:00']], // Montag
  2: [['09:00', '17:00']], // Dienstag
  3: [['09:00', '17:00']], // Mittwoch
  4: [['09:00', '17:00']], // Donnerstag
  5: [['09:00', '17:00']], // Freitag
}

/** Kurzbeschreibung der Zeitfenster für die Buchungsseite – bei Änderung oben mitziehen. */
export const ZEITFENSTER_TEXT = 'Mo–Fr 9–17 Uhr'

export interface Tag {
  jahr: number
  /** 1–12 */
  monat: number
  tag: number
}

const FORMAT = new Intl.DateTimeFormat('en-US', {
  timeZone: ZEITZONE,
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hourCycle: 'h23',
})

function wienTeile(d: Date): Tag & { stunde: number; minute: number } {
  const teile: Record<string, number> = {}
  for (const p of FORMAT.formatToParts(d)) if (p.type !== 'literal') teile[p.type] = Number(p.value)
  return { jahr: teile.year, monat: teile.month, tag: teile.day, stunde: teile.hour % 24, minute: teile.minute }
}

/** Abstand Wiener Ortszeit ↔ UTC in ms zum Zeitpunkt d (Sommer-/Winterzeit). */
function wienOffsetMs(d: Date): number {
  const t = wienTeile(d)
  const minuteGenau = Math.floor(d.getTime() / 60000) * 60000
  return Date.UTC(t.jahr, t.monat - 1, t.tag, t.stunde, t.minute) - minuteGenau
}

/** Wiener Ortszeit (Tag + "HH:MM") → echter Zeitpunkt. */
export function wienZuDate(tag: Tag, hhmm: string): Date {
  const [h, m] = hhmm.split(':').map(Number)
  const naiv = Date.UTC(tag.jahr, tag.monat - 1, tag.tag, h, m)
  const ersterVersuch = naiv - wienOffsetMs(new Date(naiv))
  return new Date(naiv - wienOffsetMs(new Date(ersterVersuch)))
}

/** Kalendertag in Wien, auf den der Zeitpunkt d fällt. */
export function tagInWien(d: Date = new Date()): Tag {
  const { jahr, monat, tag } = wienTeile(d)
  return { jahr, monat, tag }
}

/** Uhrzeit "HH:MM" in Wiener Ortszeit. */
export function uhrzeitInWien(d: Date): string {
  const t = wienTeile(d)
  return `${String(t.stunde).padStart(2, '0')}:${String(t.minute).padStart(2, '0')}`
}

export function wochentag(tag: Tag): number {
  return new Date(Date.UTC(tag.jahr, tag.monat - 1, tag.tag)).getUTCDay()
}

export function tagPlus(tag: Tag, tage: number): Tag {
  const d = new Date(Date.UTC(tag.jahr, tag.monat - 1, tag.tag + tage))
  return { jahr: d.getUTCFullYear(), monat: d.getUTCMonth() + 1, tag: d.getUTCDate() }
}

export function tagSchluessel(tag: Tag): string {
  return `${tag.jahr}-${String(tag.monat).padStart(2, '0')}-${String(tag.tag).padStart(2, '0')}`
}

function tageZwischen(von: Tag, bis: Tag): number {
  return Math.round((Date.UTC(bis.jahr, bis.monat - 1, bis.tag) - Date.UTC(von.jahr, von.monat - 1, von.tag)) / 86400000)
}

/** Alle grundsätzlich buchbaren Startzeiten eines Tages (ohne Rücksicht auf bereits vergebene). */
export function slotsFuerTag(tag: Tag, jetzt: Date = new Date()): Date[] {
  const abstand = tageZwischen(tagInWien(jetzt), tag)
  if (abstand < 0 || abstand > BUCHBAR_TAGE) return []
  const fruehestens = jetzt.getTime() + VORLAUF_MINUTEN * 60000
  const slots: Date[] = []
  for (const [von, bis] of ZEITFENSTER[wochentag(tag)] ?? []) {
    const ende = wienZuDate(tag, bis).getTime()
    for (let t = wienZuDate(tag, von).getTime(); t + DAUER_MINUTEN * 60000 <= ende; t += DAUER_MINUTEN * 60000) {
      if (t >= fruehestens) slots.push(new Date(t))
    }
  }
  return slots
}

/** Serverseitige Prüfung: liegt der Zeitpunkt exakt auf einem buchbaren Slot? */
export function istBuchbarerSlot(beginn: Date, jetzt: Date = new Date()): boolean {
  if (Number.isNaN(beginn.getTime())) return false
  return slotsFuerTag(tagInWien(beginn), jetzt).some((s) => s.getTime() === beginn.getTime())
}
