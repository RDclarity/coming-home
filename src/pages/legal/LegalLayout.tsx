import type { ReactNode } from 'react'
import { Eyebrow } from '../../components/Eyebrow'
import { Reveal } from '../../components/Reveal'
import styles from './LegalLayout.module.css'

export function LegalLayout({
  eyebrow,
  title,
  updated,
  showPlaceholderNotice = true,
  children,
  source,
}: {
  eyebrow: string
  title: string
  updated: string
  showPlaceholderNotice?: boolean
  children: ReactNode
  source?: ReactNode
}) {
  return (
    <section className={styles.sec}>
      <div className={styles.inner}>
        <Reveal>
          <div className={styles.eyebrowRow}>
            <Eyebrow>{eyebrow}</Eyebrow>
          </div>
          <h1 className={styles.heading}>{title}</h1>
          <p className={styles.updated}>Stand: {updated}</p>
        </Reveal>

        {showPlaceholderNotice && (
          <Reveal>
            <p className={styles.placeholderNotice}>
              <strong>Hinweis für Jasmin:</strong> Textstellen in eckigen Klammern (
              <code>[Platzhalter: …]</code>) sind noch keine echten Angaben und müssen vor
              Veröffentlichung ausgefüllt werden. Bitte diese Seite anschließend von einer
              Rechtsberatung gegenlesen lassen – sie ersetzt keine Rechtsberatung.
            </p>
          </Reveal>
        )}

        <Reveal as="div" className={styles.body}>
          {children}
        </Reveal>

        {source && (
          <Reveal as="div" className={styles.source}>
            {source}
          </Reveal>
        )}
      </div>
    </section>
  )
}
