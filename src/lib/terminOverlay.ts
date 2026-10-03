/**
 * Öffnet das Buchungs-Overlay fürs Kennenlerngespräch (siehe
 * components/TerminOverlay.tsx) von überall auf der Seite aus – ohne
 * Context-Provider quer durch den Baum, einfach über ein Window-Event.
 *
 * Links auf "/#kennenlernen" (Nav, Hero, Mobile-Leiste, Service-Seiten …)
 * öffnen das Overlay ebenfalls, ohne dass jeder einzelne Link angepasst
 * werden muss – TerminOverlay fängt sie zentral ab.
 */

export const TERMIN_OVERLAY_EVENT = 'coming-home:termin-oeffnen'
export const TERMIN_HASH = '#kennenlernen'

export function oeffneTerminOverlay() {
  window.dispatchEvent(new Event(TERMIN_OVERLAY_EVENT))
}
