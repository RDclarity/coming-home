/**
 * Gemeinsame Sichtbarkeitsprüfung für alle Reveal-Elemente.
 *
 * Ein IntersectionObserver allein reicht hier nicht: Springt man per Anker-Link
 * (oder bei reduzierter Bewegung) über eine Section hinweg, wechselt deren
 * Schnittzustand nie – die Inhalte blieben unsichtbar. Diese Registry prüft
 * stattdessen die Position und blendet auch alles ein, was bereits nach oben
 * aus dem Bild gescrollt ist.
 */

type Entry = { el: Element; show: () => void }

const pending = new Set<Entry>()
let attached = false
let queued = false

function flush() {
  queued = false

  // Bei ausgeblendetem Tab ist die Fensterhöhe 0 – dann später erneut prüfen.
  if (window.innerHeight === 0) return

  for (const entry of pending) {
    const rect = entry.el.getBoundingClientRect()
    const inView = rect.top < window.innerHeight * 0.92
    if (inView) {
      pending.delete(entry)
      entry.show()
    }
  }

  if (pending.size === 0) detach()
}

function schedule() {
  if (queued) return
  queued = true
  requestAnimationFrame(flush)
}

function attach() {
  if (attached) return
  attached = true
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule, { passive: true })
  document.addEventListener('visibilitychange', schedule)
}

function detach() {
  if (!attached) return
  attached = false
  window.removeEventListener('scroll', schedule)
  window.removeEventListener('resize', schedule)
  document.removeEventListener('visibilitychange', schedule)
}

export function watch(el: Element, show: () => void) {
  const entry: Entry = { el, show }
  pending.add(entry)
  attach()
  schedule()

  return () => {
    pending.delete(entry)
    if (pending.size === 0) detach()
  }
}
