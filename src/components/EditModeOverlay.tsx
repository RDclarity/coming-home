import { useEffect, useRef, useState } from 'react'
import { istInVorschauIframe, postEditSelect } from '../lib/editMode'
import styles from './EditModeOverlay.module.css'

/**
 * Klick-zum-Bearbeiten für die Live-Vorschau im Website-Editor (Tab
 * "Website" unter /admin). Rendert und tut NICHTS, solange die Seite nicht
 * innerhalb dieser Vorschau läuft – für echte Besucher:innen ist das hier
 * komplett unsichtbar und wirkungslos (istInVorschauIframe() ist bei denen
 * immer false).
 *
 * Technik: fängt Klicks in der Capture-Phase ab (bevor Links/Buttons selbst
 * reagieren), sucht den nächsten Bereich mit einer bekannten id (jede
 * Sektion hat eine, siehe die jeweiligen <section id="..."> sowie die frei
 * hinzugefügten Bereiche in CustomSections.tsx) und schickt per
 * `postMessage` ans Eltern-Fenster (das Backend), WELCHER Bereich das war –
 * das Backend springt dann im Textfeld-Editor genau dorthin (siehe
 * AdminWebsite.tsx). Die eigentliche Bearbeitung/Speicherung passiert also
 * weiterhin im bewährten Editor, nicht direkt im Iframe.
 */
export function EditModeOverlay() {
  const [aktiv, setAktiv] = useState(false)
  const [hoverLabel, setHoverLabel] = useState<{ text: string; x: number; y: number } | null>(null)
  const umrandetesElement = useRef<HTMLElement | null>(null)

  useEffect(() => {
    setAktiv(istInVorschauIframe())
  }, [])

  useEffect(() => {
    if (!aktiv) return

    function zielElement(event: Event): HTMLElement | null {
      const target = event.target as HTMLElement | null
      return target?.closest<HTMLElement>('section[id], footer[id]') ?? null
    }

    function umrandungSetzen(el: HTMLElement | null) {
      if (umrandetesElement.current === el) return
      umrandetesElement.current?.classList.remove('coming-home-edit-hover')
      umrandetesElement.current = el
      el?.classList.add('coming-home-edit-hover')
    }

    function handleClick(event: MouseEvent) {
      const el = zielElement(event)
      if (!el) return
      event.preventDefault()
      event.stopPropagation()
      postEditSelect(el.id)
    }

    function handleOver(event: MouseEvent) {
      const el = zielElement(event)
      umrandungSetzen(el)
      if (!el) {
        setHoverLabel(null)
        return
      }
      const rect = el.getBoundingClientRect()
      setHoverLabel({ text: 'Hier klicken zum Bearbeiten', x: rect.left + 12, y: rect.top + 12 })
    }

    function handleOut(event: MouseEvent) {
      // Nur zurücksetzen, wenn die Maus den Bereich wirklich verlässt (nicht
      // bei jedem Wechsel zwischen Kind-Elementen innerhalb desselben Bereichs).
      const el = zielElement(event)
      const to = event.relatedTarget as HTMLElement | null
      if (el && to && el.contains(to)) return
      umrandungSetzen(null)
      setHoverLabel(null)
    }

    document.addEventListener('click', handleClick, true)
    document.addEventListener('mouseover', handleOver, true)
    document.addEventListener('mouseout', handleOut, true)
    return () => {
      document.removeEventListener('click', handleClick, true)
      document.removeEventListener('mouseover', handleOver, true)
      document.removeEventListener('mouseout', handleOut, true)
      umrandungSetzen(null)
    }
  }, [aktiv])

  if (!aktiv) return null

  return (
    <>
      <div className={styles.banner}>Bearbeitungsmodus – auf einen Bereich klicken, um ihn im Editor zu öffnen</div>
      {hoverLabel && (
        <div className={styles.hoverLabel} style={{ left: hoverLabel.x, top: hoverLabel.y }}>
          {hoverLabel.text}
        </div>
      )}
    </>
  )
}
