import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { istInVorschauIframe } from '../lib/editMode'
import { TERMIN_HASH, TERMIN_OVERLAY_EVENT } from '../lib/terminOverlay'
import { TerminKalender } from './TerminKalender'
import styles from './TerminOverlay.module.css'

/**
 * Buchungs-Overlay fürs kostenlose Kennenlerngespräch. Öffnet sich
 *  - über oeffneTerminOverlay() (z. B. der Button in der Kennenlernen-Sektion),
 *  - bei jedem Klick auf einen Link nach "#kennenlernen" – auf jeder Seite,
 *    ohne Seitenwechsel (Nav, Hero, Mobile-Leiste, Service-Seiten …),
 *  - beim direkten Aufruf von jasmindraxl.at/#kennenlernen.
 *
 * Im Website-Editor (Vorschau-Iframe) bleibt es aus, damit dort Klicks
 * weiterhin den Bereich zum Bearbeiten auswählen (siehe EditModeOverlay).
 */
export function TerminOverlay() {
  const [offen, setOffen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const schliessenRef = useRef<HTMLButtonElement>(null)
  const vorherFokus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (istInVorschauIframe()) return

    const oeffnen = () => setOffen(true)

    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = (event.target as HTMLElement | null)?.closest('a')
      if (!link?.href) return
      const url = new URL(link.href, window.location.href)
      if (url.origin !== window.location.origin || url.hash !== TERMIN_HASH) return
      event.preventDefault()
      setOffen(true)
    }

    if (window.location.hash === TERMIN_HASH) setOffen(true)

    window.addEventListener(TERMIN_OVERLAY_EVENT, oeffnen)
    document.addEventListener('click', handleClick, true)
    return () => {
      window.removeEventListener(TERMIN_OVERLAY_EVENT, oeffnen)
      document.removeEventListener('click', handleClick, true)
    }
  }, [])

  useEffect(() => {
    if (!offen) return

    vorherFokus.current = document.activeElement as HTMLElement | null
    const vorherOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    schliessenRef.current?.focus()

    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOffen(false)
        return
      }
      if (event.key !== 'Tab' || !panelRef.current) return
      // Fokus im Dialog halten.
      const fokussierbar = panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
      )
      if (fokussierbar.length === 0) return
      const erstes = fokussierbar[0]!
      const letztes = fokussierbar[fokussierbar.length - 1]!
      if (event.shiftKey && document.activeElement === erstes) {
        event.preventDefault()
        letztes.focus()
      } else if (!event.shiftKey && document.activeElement === letztes) {
        event.preventDefault()
        erstes.focus()
      }
    }

    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = vorherOverflow
      // Hash entfernen, damit ein Neuladen das Overlay nicht wieder öffnet.
      if (window.location.hash === TERMIN_HASH) {
        history.replaceState(history.state, '', window.location.pathname + window.location.search)
      }
      vorherFokus.current?.focus()
    }
  }, [offen])

  if (!offen) return null

  return createPortal(
    <div className={styles.backdrop} onMouseDown={(e) => e.target === e.currentTarget && setOffen(false)}>
      <div ref={panelRef} className={styles.panel} role="dialog" aria-modal="true" aria-labelledby="termin-titel">
        <button
          ref={schliessenRef}
          type="button"
          className={styles.schliessen}
          onClick={() => setOffen(false)}
          aria-label="Schließen"
        >
          ×
        </button>
        <TerminKalender onClose={() => setOffen(false)} />
      </div>
    </div>,
    document.body,
  )
}
