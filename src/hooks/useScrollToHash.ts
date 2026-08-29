import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Springt beim Routenwechsel zum Hash-Ziel (z. B. von /impressum zu /#kontakt).
 * React Router wechselt nur die Route – das Scrollen zum Anker übernimmt sonst
 * niemand, weil das Zielelement beim ersten Render der neuen Seite noch nicht
 * im DOM steht.
 */
export function useScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0 })
      return
    }

    const id = hash.slice(1)
    // Ein Frame Vorlauf, damit die Zielsektion der neuen Route bereits gerendert ist.
    const raf = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView()
    })

    return () => cancelAnimationFrame(raf)
  }, [pathname, hash])
}
