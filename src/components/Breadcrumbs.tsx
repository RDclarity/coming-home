import { withBase } from '../lib/url'
import styles from './Breadcrumbs.module.css'

export type Crumb = { label: string; href?: string }

/**
 * Kleine Brotkrumen-Navigation. Liefert nebenbei die Struktur für das
 * BreadcrumbList-JSON-LD, das der Prerender pro Seite generiert – deshalb
 * bekommen Service- und Ratgeberseiten hier immer die exakt gleichen Labels
 * wie im generierten Schema (siehe scripts/prerender.mjs).
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className={styles.nav} aria-label="Brotkrümelnavigation">
      {items.map((item, index) => (
        <span key={item.label}>
          {index > 0 && (
            <span className={styles.sep} aria-hidden="true">
              /
            </span>
          )}{' '}
          {item.href ? (
            <a href={withBase(item.href)}>{item.label}</a>
          ) : (
            <span className={styles.current} aria-current="page">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
