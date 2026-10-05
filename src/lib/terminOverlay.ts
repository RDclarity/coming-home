/**
 * Öffnet die Buchungs-Fenster (components/TerminOverlay.tsx) von überall auf
 * der Seite aus – ohne Context-Provider quer durch den Baum, einfach über ein
 * Window-Event. Links auf "/#kennenlernen" bzw. "/#workshop-buchen" öffnen
 * die Fenster ebenfalls, ohne dass jeder Link angepasst werden muss.
 */

export const TERMIN_OVERLAY_EVENT = 'coming-home:termin-oeffnen'
export const TERMIN_HASH = '#kennenlernen'

export const WORKSHOP_OVERLAY_EVENT = 'coming-home:workshop-oeffnen'
export const WORKSHOP_HASH = '#workshop-buchen'
/** Link-Ziel für "Platz buchen"-Buttons (Startseite, Workshop-Seite). */
export const WORKSHOP_LINK = '/#workshop-buchen'

export function oeffneTerminOverlay() {
  window.dispatchEvent(new Event(TERMIN_OVERLAY_EVENT))
}

export function oeffneWorkshopOverlay() {
  window.dispatchEvent(new Event(WORKSHOP_OVERLAY_EVENT))
}
