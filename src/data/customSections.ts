/**
 * Frei hinzufügbare "Abteilungen"/Bereiche, die Jasmin selbst im
 * Website-Editor (Backend → Tab "Website") aus fertigen Bausteinen
 * zusammenstellt – siehe src/sections/CustomSections.tsx für die Darstellung
 * und src/pages/crm/AdminWebsite.tsx für die Verwaltung.
 *
 * Startet bewusst leer. scripts/prerender.mjs befüllt dieses Array beim
 * Build mit dem Inhalt aus der Datenbank (Tabelle `custom_sections`) –
 * MUTIERT das Array (push), ersetzt es nicht, weil sonst die bereits an
 * anderer Stelle importierte Referenz nicht mehr dieselbe wäre.
 */

export type CustomSectionBlockType = 'text' | 'image_text' | 'quote'

export type CustomSection = {
  id: string
  blockType: CustomSectionBlockType
  /**
   * Je nach blockType:
   *  - 'text':       { heading, body }
   *  - 'image_text': { heading, body, imageUrl }
   *  - 'quote':      { quote, attribution }
   */
  content: Record<string, string>
}

export const customSections: CustomSection[] = []
