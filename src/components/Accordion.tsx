import { useId, useState } from 'react'
import styles from './Accordion.module.css'

export type AccordionItem = { q: string; a: string }

/** Aufklappbare Frage-Antwort-Liste. Immer nur eine Antwort ist offen. */
export function Accordion({ items }: { items: readonly AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const baseId = useId()

  return (
    <div className={styles.root}>
      {items.map((item, index) => {
        const open = openIndex === index
        const panelId = `${baseId}-panel-${index}`
        const buttonId = `${baseId}-button-${index}`

        return (
          <div key={item.q} className={[styles.entry, open && styles.open].filter(Boolean).join(' ')}>
            <button
              id={buttonId}
              className={styles.trigger}
              type="button"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpenIndex(open ? null : index)}
            >
              <span className={styles.q}>{item.q}</span>
              <span className={styles.icon} aria-hidden="true">
                +
              </span>
            </button>
            <div id={panelId} role="region" aria-labelledby={buttonId} className={styles.body}>
              <div className={styles.bodyInner}>
                <p className={styles.answer}>{item.a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
