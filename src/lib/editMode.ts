/**
 * Erkennung + Nachrichtenformat für den Klick-zum-Bearbeiten-Modus in der
 * Live-Vorschau des Website-Editors (siehe components/EditModeOverlay.tsx
 * und pages/crm/AdminWebsite.tsx). Betrifft NIEMALS echte Besucher:innen –
 * die laden die Seite nie innerhalb eines Iframes unter /admin.
 */

/** Same-Origin-Check: läuft diese Seite gerade in der Vorschau des
 * Website-Editors? Bewusst kein Query-Parameter (könnte sich versehentlich
 * verbreiten, z. B. wenn jemand einen Link teilt) und kein Cookie – reine
 * Fenster-Beziehung, die sich nicht "mitschicken" lässt. */
export function istInVorschauIframe(): boolean {
  try {
    return window.self !== window.top && window.top !== null && window.top.location.pathname.startsWith('/admin')
  } catch {
    // Cross-Origin-Zugriffsfehler auf window.top.location – kommt bei einer
    // echten Besucherin nie vor, da diese Seite niemals in einem fremden
    // Iframe eingebettet wird, aber sicherheitshalber: dann kein Edit-Modus.
    return false
  }
}

export type EditSelectMessage = {
  source: 'coming-home-edit-mode'
  sectionId: string
  pathname: string
}

export function postEditSelect(sectionId: string) {
  window.top?.postMessage(
    { source: 'coming-home-edit-mode', sectionId, pathname: window.location.pathname } satisfies EditSelectMessage,
    window.location.origin,
  )
}
