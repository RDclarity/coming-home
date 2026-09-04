import { useMemo, useState, useSyncExternalStore } from 'react'
import { InternGate } from '../../components/InternGate'
import { flattenToFields, type EditableField } from '../../cms/flatten'
import { draftStore } from '../../cms/draftStore'
import * as siteModule from '../../data/site'
import { INTERN_PASSPHRASE } from '../../lib/internAuth'
import styles from './Editor.module.css'

// Nur die reinen Text-Exporte aus site.ts (keine Funktionen wie getFaqBySlug).
const EDITABLE_SOURCE = Object.fromEntries(
  Object.entries(siteModule).filter(([, value]) => typeof value !== 'function'),
)

/** Felder, die zwar Strings sind, aber technische Pfade/Links statt Texte – nicht anfassen. */
function isEditableValue(field: EditableField): boolean {
  if (/(^|\.)href$/.test(field.path)) return false
  if (/^https?:\/\//.test(field.value)) return false
  if (field.value.startsWith('/')) return false
  if (/(^|\.)slug(\[\d+\])?$/.test(field.path)) return false
  return true
}

function useDraft() {
  return useSyncExternalStore(draftStore.subscribe, draftStore.list, draftStore.list)
}

export function Editor() {
  return (
    <InternGate
      storageKey="coming-home:editor:unlocked"
      passphrase={INTERN_PASSPHRASE}
      title="Coming-Home-Texteditor"
      notice="Interner Bereich."
    >
      <EditorDashboard />
    </InternGate>
  )
}

function EditorDashboard() {
  const draft = useDraft()
  const [search, setSearch] = useState('')

  const allFields = useMemo(
    () => flattenToFields(EDITABLE_SOURCE).filter(isEditableValue),
    [],
  )

  const editedCount = Object.keys(draft).length

  const visibleFields = useMemo(() => {
    if (!search.trim()) return allFields
    const needle = search.toLowerCase()
    return allFields.filter(
      (field) =>
        field.label.toLowerCase().includes(needle) || field.value.toLowerCase().includes(needle),
    )
  }, [allFields, search])

  function handleExport() {
    const lines = Object.entries(draft).map(([path, value]) => {
      const original = allFields.find((field) => field.path === path)
      return [
        `Feld: ${original?.label ?? path}`,
        `Pfad: ${path}`,
        `Bisher:  ${original?.value ?? '(unbekannt)'}`,
        `Neu:     ${value}`,
        '',
      ].join('\n')
    })

    const content =
      `Coming Home – Textänderungen (Entwurf)\n` +
      `Exportiert: ${new Date().toLocaleString('de-AT')}\n` +
      `${editedCount} geänderte(s) Feld(er)\n\n` +
      `${lines.join('\n') || '(keine Änderungen)'}`

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `coming-home-textaenderungen-${new Date().toISOString().slice(0, 10)}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className={styles.sec}>
      <div className={styles.inner}>
        <span className={styles.badge}>Intern</span>
        <h1 className={styles.title}>Texte bearbeiten</h1>

        <div className={styles.explainer}>
          <p>
            <strong>Was das hier ist:</strong> Eine Liste aller Texte der Startseite. Änderungen
            werden sofort als Entwurf in diesem Browser gespeichert (Original und neuer Text siehst
            du direkt hier nebeneinander) – noch nicht live auf der echten Seite, siehe unten.
          </p>
          <p>
            <strong>Was das (noch) nicht ist:</strong> Kein WordPress. Die Seite ist komplett
            statisch und hat (bewusst, wie besprochen) noch kein Backend – deshalb sieht hier
            niemand außer dir selbst, in diesem Browser, den Entwurf. Um eine Änderung wirklich für
            alle live zu schalten: Text hier anpassen, unten <strong>„Änderungen exportieren"</strong>{' '}
            klicken und die heruntergeladene Datei weitergeben – sie wird dann im Code übernommen
            und neu veröffentlicht. Neue Sektionen hinzufügen (echtes WordPress-Verhalten) und
            Änderungen ohne diesen Umweg sofort live schalten braucht ein eigenes Backend – sag
            Bescheid, wenn das der nächste Schritt sein soll.
          </p>
        </div>

        <div className={styles.toolbar}>
          <span className={styles.stats}>
            {allFields.length} bearbeitbare Textfelder · {editedCount} geändert
          </span>
          <div className={styles.actions}>
            <button className={styles.actionBtn} type="button" onClick={() => draftStore.clearAll()}>
              Entwurf zurücksetzen
            </button>
            <button
              className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
              type="button"
              onClick={handleExport}
              disabled={editedCount === 0}
            >
              Änderungen exportieren
            </button>
          </div>
        </div>

        <input
          className={styles.search}
          type="search"
          placeholder="Text durchsuchen …"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <div className={styles.list}>
          {visibleFields.length === 0 && <p className={styles.empty}>Keine Treffer.</p>}
          {visibleFields.map((field) => (
            <FieldRow key={field.path} field={field} draftValue={draft[field.path]} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FieldRow({ field, draftValue }: { field: EditableField; draftValue: string | undefined }) {
  const isEdited = draftValue !== undefined && draftValue !== field.value
  const currentValue = draftValue ?? field.value

  return (
    <div className={[styles.field, isEdited && styles.fieldEdited].filter(Boolean).join(' ')}>
      <div className={styles.fieldLabel}>{field.label}</div>
      <div className={styles.fieldRow}>
        <textarea
          className={[styles.fieldInput, isEdited && styles.fieldInputEdited].filter(Boolean).join(' ')}
          value={currentValue}
          onChange={(event) => draftStore.set(field.path, event.target.value)}
          rows={currentValue.length > 80 ? 3 : 1}
        />
        {isEdited && (
          <button
            type="button"
            className={styles.resetBtn}
            onClick={() => draftStore.clear(field.path)}
            title="Auf Originaltext zurücksetzen"
          >
            ↺
          </button>
        )}
      </div>
    </div>
  )
}
