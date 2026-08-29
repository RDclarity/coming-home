import { useEffect, useRef, useState } from 'react'

/**
 * Liefert einen Fortschrittswert 0–1, wie weit ein Element schon durch den
 * Viewport gescrollt wurde – für scroll-gebundene Animationen (siehe der
 * sich aufbauende Ring in Arbeitsweise.tsx).
 *
 * 0 = Element beginnt gerade unten im Viewport aufzutauchen.
 * 1 = Element ist (bis auf etwas Puffer) durchgescrollt.
 *
 * Bei reduzierter Bewegung bleibt der Wert fix bei 1 – alles ist sofort
 * fertig aufgebaut, ohne Scroll-Kopplung, wie schon bei Reveal/Hero.
 */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(1)
      return
    }

    let frame = 0

    function update() {
      frame = 0
      const rect = node!.getBoundingClientRect()
      const vh = window.innerHeight
      // Start etwas VOR dem eigentlichen Eintreten (vh * 1.15 statt vh) und
      // kürzerer Nenner – auf kleinen/mobilen Viewports ist das Element
      // selbst relativ klein und der sichtbare Scrollweg kurz, ohne diesen
      // Vorlauf wäre die Animation oft schon fertig, bevor man sie sieht.
      const raw = (vh * 1.15 - rect.top) / (rect.height + vh * 0.35)
      setProgress(Math.min(1, Math.max(0, raw)))
    }

    function onScroll() {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return { ref, progress }
}
