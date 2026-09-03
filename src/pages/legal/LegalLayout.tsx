import type { ReactNode } from 'react'
import { Eyebrow } from '../../components/Eyebrow'
import { Reveal } from '../../components/Reveal'
import styles from './LegalLayout.module.css'

export function LegalLayout({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string
  title: string
  updated: string
  children: ReactNode
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

        <Reveal as="div" className={styles.body}>
          {children}
        </Reveal>
      </div>
    </section>
  )
}
