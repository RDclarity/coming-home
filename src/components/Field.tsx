import type { ReactNode } from 'react'
import styles from './Field.module.css'

type BaseProps = {
  label?: string
  name: string
  required?: boolean
  autoComplete?: string
  placeholder?: string
}

function Label({ label, required }: { label?: string; required?: boolean }) {
  if (!label) return null
  return (
    <span className={styles.label}>
      {label}
      {required && (
        <em className={styles.req} aria-hidden="true">
          *
        </em>
      )}
    </span>
  )
}

export function TextField({
  type = 'text',
  ...props
}: BaseProps & { type?: 'text' | 'email' | 'tel' }) {
  return (
    <label className={styles.field}>
      <Label label={props.label} required={props.required} />
      <input
        className={styles.input}
        type={type}
        name={props.name}
        required={props.required}
        autoComplete={props.autoComplete}
        placeholder={props.placeholder}
        aria-label={props.label ? undefined : props.placeholder}
      />
    </label>
  )
}

export function TextArea({ rows = 4, ...props }: BaseProps & { rows?: number }) {
  return (
    <label className={styles.field}>
      <Label label={props.label} required={props.required} />
      <textarea
        className={styles.input}
        name={props.name}
        rows={rows}
        required={props.required}
        placeholder={props.placeholder}
      />
    </label>
  )
}

export function SelectField({
  options,
  ...props
}: BaseProps & { options: readonly string[] }) {
  return (
    <label className={styles.field}>
      <Label label={props.label} required={props.required} />
      <select className={styles.input} name={props.name} required={props.required}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  )
}

/** Wrapper, damit Formulare eigene Zusatzelemente in die Feld-Optik einreihen können. */
export function FieldShell({ children }: { children: ReactNode }) {
  return <div className={styles.field}>{children}</div>
}
