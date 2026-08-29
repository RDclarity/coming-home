import { useEffect, useState } from 'react'
import styles from './CyclingWord.module.css'

const WORDS = ['Atem', 'Stille', 'Präsenz', 'Weichheit', 'Verbindung', 'Vertrauen']

/**
 * Ambientes, sich langsam überblendendes Wort am Rand des Hero-Videos – ein
 * leiser eigener Rhythmus, kein Werbe-Textkarussell. Rein dekorativ
 * (aria-hidden), der eigentliche Inhalt steht bereits in Titel/Lead daneben.
 * Bei reduzierter Bewegung bleibt es beim ersten Wort stehen, ohne zu wechseln.
 */
export function CyclingWord() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % WORDS.length)
    }, 3200)
    return () => clearInterval(id)
  }, [])

  return (
    <div className={styles.wrap} aria-hidden="true">
      <span className={styles.line} />
      <span key={index} className={styles.word}>
        {WORDS[index]}
      </span>
    </div>
  )
}
