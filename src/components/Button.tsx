import type { CSSProperties, MouseEventHandler, ReactNode } from 'react'
import { withBase } from '../lib/url'
import styles from './Button.module.css'

type Variant = 'solid' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

type CommonProps = {
  children: ReactNode
  variant?: Variant
  size?: Size
  full?: boolean
  style?: CSSProperties
  className?: string
}

type LinkProps = CommonProps & { href: string; type?: never; disabled?: never; onClick?: never }
type ButtonProps = CommonProps & {
  href?: never
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
}

/**
 * Flächiger Kleinkapitälchen-Button des Coming-Home-Kits.
 * Als <a> gerendert, sobald `href` gesetzt ist – sonst als <button>.
 */
export function Button(props: LinkProps | ButtonProps) {
  const { children, variant = 'solid', size = 'md', full, style, className } = props
  const cls = [styles.btn, styles[variant], styles[size], full && styles.full, className]
    .filter(Boolean)
    .join(' ')

  if ('href' in props && props.href) {
    return (
      <a className={cls} style={style} href={withBase(props.href)}>
        <span>{children}</span>
      </a>
    )
  }

  return (
    <button
      className={cls}
      style={style}
      type={props.type ?? 'button'}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      <span>{children}</span>
    </button>
  )
}
