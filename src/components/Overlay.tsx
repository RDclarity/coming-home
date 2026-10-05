import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { istInVorschauIframe } from '../lib/editMode'
import styles from './TerminOverlay.module.css'

/**
 * Gemeinsame Hülle der Buchungs-Fenster (Kennenlerngespräch, Workshop-Platz).
 * Öffnet sich
 *  - über ein Window-Event (`eventName`, siehe lib/terminOverlay.ts),
 *  - bei jedem Klick auf einen Link nach `hash` – auf jeder Seite, ohne
 *    Seitenwechsel,
 *  - beim direkten Aufruf einer Adresse mit diesem `hash`.
 * Kümmert sich um Fokus-Falle, Escape, Scroll-Sperre und das Entfernen des
 * Hashs beim Schließen. Im Website-Editor (Vorschau-Iframe) bleibt es aus,
 * damit Klicks dort weiter Bereiche zum Bearbeiten auswählen.
 */
export function Overlay({
  hash,
  eventName,
  labelledBy,
  children,
}: {
  hash: string
  eventName: string
  labelledBy: string
  children: (schliessen: () => void) => ReactNode
}) {
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
      if (url.origin !== window.location.origin || url.hash !== hash) return
      event.preventDefault()
      setOffen(true)
    }

    if (window.location.hash === hash) setOffen(true)

    window.addEventListener(eventName, oeffnen)
    document.addEventListener('click', handleClick, true)
    return () => {
      window.removeEventListener(eventName, oeffnen)
      document.removeEventListener('click', handleClick, true)
    }
  }, [hash, eventName])

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
      // Hash entfernen, damit ein Neuladen das Fenster nicht wieder öffnet.
      if (window.location.hash === hash) {
        history.replaceState(history.state, '', window.location.pathname + window.location.search)
      }
      vorherFokus.current?.focus()
    }
  }, [offen, hash])

  if (!offen) return null

  const schliessen = () => setOffen(false)

  return createPortal(
    <div className={styles.backdrop} onMouseDown={(e) => e.target === e.currentTarget && schliessen()}>
      <div ref={panelRef} className={styles.panel} role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
        <button ref={schliessenRef} type="button" className={styles.schliessen} onClick={schliessen} aria-label="Schließen">
          ×
        </button>
        {children(schliessen)}
      </div>
    </div>,
    document.body,
  )
}
