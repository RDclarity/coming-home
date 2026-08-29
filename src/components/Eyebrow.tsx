import type { CSSProperties, ReactNode } from 'react'
import styles from './Eyebrow.module.css'

/** Kleine Überzeile mit vorangestelltem Strich – das wiederkehrende Section-Label. */
export function Eyebrow({
  children,
  align,
  style,
}: {
  children: ReactNode
  align?: 'left' | 'center'
  style?: CSSProperties
}) {
  return (
    <span
      className={[styles.eyebrow, align === 'center' && styles.center].filter(Boolean).join(' ')}
      style={style}
    >
      <span className={styles.dash} aria-hidden="true" />
      {children}
    </span>
  )
}
