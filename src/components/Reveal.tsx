import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react'
import { watch } from './revealRegistry'

/**
 * Blendet Inhalte ein, sobald sie ins Sichtfeld kommen – wie auf der bisherigen Seite.
 * Bei reduzierter Bewegung greift die Animation nicht (siehe global.css), der
 * Inhalt ist dann sofort da.
 */
export function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  className,
}: {
  children: ReactNode
  as?: ElementType
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || visible) return
    return watch(node, () => setVisible(true))
  }, [visible])

  return (
    <Tag
      ref={ref}
      className={['reveal', visible && 'is-visible', className].filter(Boolean).join(' ')}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  )
}
