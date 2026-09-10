import { useEffect, useMemo, useRef, useState } from 'react'
import {
  createCustomSection,
  deleteCustomSection,
  fetchCustomSections,
  fetchOverrides,
  moveCustomSection,
  publish,
  resetOverride,
  saveOverride,
  updateCustomSectionContent,
  uploadSiteImage,
} from '../../cms/api'
import { flattenToFields, type EditableField } from '../../cms/flatten'
import * as articlesModule from '../../data/articles'
import type { CustomSection, CustomSectionBlockType } from '../../data/customSections'
import * as servicesModule from '../../data/services'
import * as siteModule from '../../data/site'
import styles from './AdminWebsite.module.css'

// Nur die reinen Text-Exporte (keine Funktionen wie getFaqBySlug) aus den
// drei Inhalts-Modulen. Rechtstexte (data/legal.ts) sind hier BEWUSST NICHT
// dabei – Impressum/Datenschutz/AGB bleiben Entwicklerinnen-Sache, das sind
// keine Texte, die man nebenbei im Editor anpassen sollte.
const EDITABLE_SOURCE = {
  site: Object.fromEntries(Object.entries(siteModule).filter(([, v]) => typeof v !== 'function')),
  services: servicesModule.services,
  articles: articlesModule.articles,
}

const SITE_SECTION_LABELS: Record<string, string> = {
  site: 'Allgemein',
  navLinks: 'Navigation',
  hero: 'Startseite – Hero',
  ankommen: 'Startseite – Ankommen',
  jasmin: 'Startseite – Jasmin-Vorstellung',
  orientierung: 'Startseite – Orientierung',
  reise: 'Startseite – Reise/Ablauf',
  ueberJasmin: 'Startseite – Über Jasmin',
  arbeitsweise: 'Startseite – Arbeitsweise',
  fuerWen: 'Startseite – Für wen',
  bewerbung: 'Startseite – Bewerbungsbogen',
  faq: 'Startseite – Häufige Fragen',
  termine: 'Startseite – Workshops & Termine',
  newsletter: 'Startseite – Audioübung',
  abschluss: 'Startseite – Abschluss',
  kontakt: 'Kontaktformular',
}

function isEditableValue(field: EditableField): boolean {
  if (/(^|\.)href$/.test(field.path)) return false
  if (/(^|\.)slug(\[\d+\])?$/.test(field.path)) return false
  if (/^https?:\/\//.test(field.value)) return false
  if (field.value.startsWith('/')) return false
  return true
}

function groupKey(path: string): string {
  if (path.startsWith('services[')) return `services:${/^services\[(\d+)\]/.exec(path)?.[1] ?? '0'}`
  if (path.startsWith('articles[')) return `articles:${/^articles\[(\d+)\]/.exec(path)?.[1] ?? '0'}`
  // path sieht aus wie "site.hero.titleLines[0]" – erstes Token ("site") ist
  // nur die Wurzel, das ZWEITE Token ist der eigentliche Export-Name (hero).
  const second = path.split(/[.[]/)[1]
  return `site:${second}`
}

function groupLabel(key: string): string {
  if (key.startsWith('services:')) {
    const service = servicesModule.services[Number(key.slice(9))]
    return `Begleitung: ${service?.title ?? '?'}`
  }
  if (key.startsWith('articles:')) {
    const article = articlesModule.articles[Number(key.slice(9))]
    return `Ratgeber-Artikel: ${article?.title ?? '?'}`
  }
  const raw = key.slice(5)
  return SITE_SECTION_LABELS[raw] ?? raw
}

// Welche id auf der echten Website zu welchem site.ts-Export gehört (siehe
// die jeweiligen <section id="..."> in src/sections/*.tsx) – damit die
// Vorschau beim Öffnen einer Gruppe zur passenden Stelle springen kann.
const SITE_SECTION_ANCHOR: Record<string, string> = {
  site: 'coming-home',
  navLinks: 'coming-home',
  hero: 'coming-home',
  ankommen: 'ankommen',
  jasmin: 'jasmin',
  orientierung: 'orientierung',
  reise: 'dein-weg',
  ueberJasmin: 'ueber-jasmin',
  arbeitsweise: 'arbeitsweise',
  fuerWen: 'fuer-wen',
  bewerbung: 'kennenlernen',
  faq: 'faq',
  termine: 'termine',
  newsletter: 'audiouebung',
  abschluss: 'abschluss',
  kontakt: 'kontakt',
}

/** Wohin die Vorschau springen soll, wenn diese Gruppe geöffnet wird. */
function targetForGroup(key: string): { path: string; hash?: string } {
  if (key.startsWith('services:')) {
    const service = servicesModule.services[Number(key.slice(9))]
    return { path: service ? `/begleitung/${service.slug}` : '/' }
  }
  if (key.startsWith('articles:')) {
    const article = articlesModule.articles[Number(key.slice(9))]
    return { path: article ? `/ratgeber/${article.slug}` : '/' }
  }
  return { path: '/', hash: SITE_SECTION_ANCHOR[key.slice(5)] }
}

/**
 * Website-Editor: Texte der ganzen Seite (Startseite, Begleitungen,
 * Ratgeber-Artikel) bearbeiten, neue Bereiche aus fertigen Bausteinen
 * einfügen, veröffentlichen. Siehe supabase/migrations/…_content_editor.sql
 * für die Architektur-Erklärung (warum das über einen Build-Trigger statt
 * sofort live geht).
 */
export function AdminWebsite() {
  const [tab, setTab] = useState<'texte' | 'bereiche'>('texte')
  const [publishing, setPublishing] = useState(false)
  const [publishResult, setPublishResult] = useState<string | null>(null)
  const [zeigeVorschau, setZeigeVorschau] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  /**
   * Springt in der Vorschau zur passenden Stelle. Vorschau und Backend
   * laufen auf derselben Domain (jasmindraxl.at) – deshalb "same origin"
   * und per JS direkt ansprechbar: liegt das Ziel auf derselben Seite, wird
   * nur dorthin gescrollt (kein Neuladen); nur beim Wechsel auf eine andere
   * Seite (z. B. eine andere Begleitung) lädt die Vorschau neu.
   */
  function jumpTo(path: string, hash?: string) {
    const iframe = iframeRef.current
    if (!iframe) return
    try {
      const win = iframe.contentWindow
      if (win && win.location.pathname === path) {
        if (!hash) {
          win.scrollTo({ top: 0, behavior: 'smooth' })
          return
        }
        const el = win.document.getElementById(hash)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          return
        }
      }
    } catch {
      // Vorschau lädt noch / anderer Zustand – dann einfach neu laden (unten).
    }
    iframe.src = `https://jasmindraxl.at${path}${hash ? `#${hash}` : ''}`
  }

  async function handlePublish() {
    setPublishing(true)
    setPublishResult(null)
    try {
      const result = await publish()
      setPublishResult(
        result.skipped
          ? 'Kein Grund zur Sorge: Gespeicherte Änderungen gehen ohnehin automatisch spätestens alle 15 Minuten live – dieser Knopf hätte es nur beschleunigt.'
          : 'Wird jetzt sofort veröffentlicht – in ein paar Minuten sind die Änderungen live.',
      )
    } catch {
      setPublishResult(
        'Sofort-Veröffentlichen hat gerade nicht geklappt – kein Problem, deine Änderungen sind trotzdem gespeichert und gehen spätestens in 15 Minuten von selbst live.',
      )
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div>
      <div className={styles.kopfzeile}>
        <div className={styles.tabs}>
          <button
            type="button"
            className={[styles.tabBtn, tab === 'texte' && styles.tabBtnActive].filter(Boolean).join(' ')}
            onClick={() => setTab('texte')}
          >
            Texte
          </button>
          <button
            type="button"
            className={[styles.tabBtn, tab === 'bereiche' && styles.tabBtnActive].filter(Boolean).join(' ')}
            onClick={() => setTab('bereiche')}
          >
            Bereiche
          </button>
        </div>

        <div className={styles.publishBar}>
          <button
            type="button"
            className={styles.publishBtn}
            onClick={handlePublish}
            disabled={publishing}
          >
            {publishing ? 'Wird veröffentlicht …' : 'Jetzt sofort veröffentlichen'}
          </button>
          <button type="button" className={styles.filterBtn} onClick={() => setZeigeVorschau((v) => !v)}>
            {zeigeVorschau ? 'Vorschau ausblenden' : 'Vorschau einblenden'}
          </button>
        </div>
      </div>

      {publishResult && <p className={styles.notice}>{publishResult}</p>}

      <p className={styles.notice}>
        Änderungen werden beim Verlassen eines Felds sofort gespeichert und gehen danach von ganz
        allein spätestens innerhalb von 15 Minuten live – du musst nichts weiter tun.{' '}
        <strong>„Jetzt sofort veröffentlichen"</strong> ist nur für den Fall da, dass es mal schneller
        gehen soll.
      </p>

      <div className={zeigeVorschau ? styles.mitVorschau : undefined}>
        <div>{tab === 'texte' ? <TextEditor onJump={jumpTo} /> : <BereicheEditor onJump={jumpTo} />}</div>

        {zeigeVorschau && (
          <div className={styles.vorschauSpalte}>
            <p className={styles.vorschauLabel}>
              Aktuell live (deine letzten Änderungen erscheinen hier erst, sobald automatisch neu
              gebaut wurde – spätestens nach 15 Minuten). Springt automatisch zur Stelle, die du
              gerade bearbeitest.
            </p>
            <iframe ref={iframeRef} className={styles.vorschauFrame} src="https://jasmindraxl.at/" title="Aktuelle Website" />
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Texte
// ---------------------------------------------------------------------------

function TextEditor({ onJump }: { onJump: (path: string, hash?: string) => void }) {
  const [overrides, setOverrides] = useState<Record<string, string>>({})
  const [laden, setLaden] = useState(true)
  const [search, setSearch] = useState('')
  const [offeneGruppe, setOffeneGruppe] = useState<string | null>(null)

  useEffect(() => {
    fetchOverrides()
      .then(setOverrides)
      .finally(() => setLaden(false))
  }, [])

  const allFields = useMemo(() => flattenToFields(EDITABLE_SOURCE).filter(isEditableValue), [])

  const visibleFields = useMemo(() => {
    if (!search.trim()) return allFields
    const needle = search.toLowerCase()
    return allFields.filter(
      (f) => f.label.toLowerCase().includes(needle) || f.value.toLowerCase().includes(needle),
    )
  }, [allFields, search])

  const groups = useMemo(() => {
    const map = new Map<string, EditableField[]>()
    for (const field of visibleFields) {
      const key = groupKey(field.path)
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(field)
    }
    return [...map.entries()]
  }, [visibleFields])

  function handleSaved(path: string, value: string) {
    setOverrides((o) => ({ ...o, [path]: value }))
  }

  function handleReset(path: string) {
    setOverrides((o) => {
      const next = { ...o }
      delete next[path]
      return next
    })
  }

  if (laden) return <p className={styles.empty}>Wird geladen …</p>

  return (
    <div>
      <input
        className={styles.search}
        type="search"
        placeholder="Text durchsuchen …"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className={styles.gruppenListe}>
        {groups.map(([key, fields]) => (
          <div key={key} className={styles.gruppe}>
            <button
              type="button"
              className={styles.gruppenKopf}
              onClick={() => {
                setOffeneGruppe((g) => (g === key ? null : key))
                const target = targetForGroup(key)
                onJump(target.path, target.hash)
              }}
            >
              <span>{groupLabel(key)}</span>
              <span className={styles.gruppenMeta}>{fields.length} Felder</span>
            </button>
            {(offeneGruppe === key || search.trim() !== '') && (
              <div className={styles.gruppenInhalt}>
                {fields.map((field) => (
                  <FieldRow
                    key={field.path}
                    field={field}
                    overrideValue={overrides[field.path]}
                    onSaved={handleSaved}
                    onReset={handleReset}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function FieldRow({
  field,
  overrideValue,
  onSaved,
  onReset,
}: {
  field: EditableField
  overrideValue: string | undefined
  onSaved: (path: string, value: string) => void
  onReset: (path: string) => void
}) {
  const currentValue = overrideValue ?? field.value
  const [value, setValue] = useState(currentValue)
  const [speichert, setSpeichert] = useState(false)
  const isEdited = overrideValue !== undefined && overrideValue !== field.value

  useEffect(() => setValue(currentValue), [currentValue])

  async function handleBlur() {
    if (value === currentValue) return
    setSpeichert(true)
    try {
      if (value === field.value) {
        await resetOverride(field.path)
        onReset(field.path)
      } else {
        await saveOverride(field.path, value)
        onSaved(field.path, value)
      }
    } finally {
      setSpeichert(false)
    }
  }

  async function handleReset() {
    setValue(field.value)
    setSpeichert(true)
    try {
      await resetOverride(field.path)
      onReset(field.path)
    } finally {
      setSpeichert(false)
    }
  }

  return (
    <div className={[styles.feld, isEdited && styles.feldGeaendert].filter(Boolean).join(' ')}>
      <div className={styles.feldLabel}>{field.label.split(' → ').slice(1).join(' → ') || field.label}</div>
      <div className={styles.feldZeile}>
        <textarea
          className={styles.feldInput}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          rows={value.length > 80 ? 3 : 1}
        />
        {isEdited && (
          <button type="button" className={styles.resetBtn} onClick={handleReset} title="Zurücksetzen">
            ↺
          </button>
        )}
        {speichert && <span className={styles.speichertHinweis}>speichert …</span>}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Bereiche ("Abteilungen")
// ---------------------------------------------------------------------------

const BLOCK_TYPE_LABEL: Record<CustomSectionBlockType, string> = {
  text: 'Text mit Überschrift',
  image_text: 'Bild mit Text',
  quote: 'Zitat',
}

function BereicheEditor({ onJump }: { onJump: (path: string, hash?: string) => void }) {
  const [sections, setSections] = useState<CustomSection[]>([])
  const [laden, setLaden] = useState(true)

  async function neuLaden() {
    setLaden(true)
    try {
      setSections(await fetchCustomSections())
    } finally {
      setLaden(false)
    }
  }

  useEffect(() => {
    neuLaden()
  }, [])

  async function handleAdd(blockType: CustomSectionBlockType) {
    await createCustomSection(blockType)
    await neuLaden()
  }

  async function handleMove(id: string, direction: 'up' | 'down') {
    await moveCustomSection(id, direction, sections)
    await neuLaden()
  }

  async function handleDelete(id: string) {
    if (!confirm('Diesen Bereich wirklich löschen?')) return
    await deleteCustomSection(id)
    await neuLaden()
  }

  if (laden) return <p className={styles.empty}>Wird geladen …</p>

  return (
    <div>
      <p className={styles.notice}>
        Diese Bereiche erscheinen auf der Startseite zwischen „Workshops & Termine" und der
        Audioübung, in der Reihenfolge hier unten.
      </p>

      <div className={styles.gruppenListe}>
        {sections.length === 0 && <p className={styles.empty}>Noch keine zusätzlichen Bereiche.</p>}
        {sections.map((section, index) => (
          <BereichEditor
            key={section.id}
            section={section}
            onSaved={neuLaden}
            onDelete={() => handleDelete(section.id)}
            onMoveUp={index > 0 ? () => handleMove(section.id, 'up') : undefined}
            onMoveDown={index < sections.length - 1 ? () => handleMove(section.id, 'down') : undefined}
            onJump={onJump}
          />
        ))}
      </div>

      <div className={styles.addRow}>
        {(Object.keys(BLOCK_TYPE_LABEL) as CustomSectionBlockType[]).map((type) => (
          <button key={type} type="button" className={styles.filterBtn} onClick={() => handleAdd(type)}>
            + {BLOCK_TYPE_LABEL[type]}
          </button>
        ))}
      </div>
    </div>
  )
}

function BereichEditor({
  section,
  onSaved,
  onDelete,
  onMoveUp,
  onMoveDown,
  onJump,
}: {
  section: CustomSection
  onSaved: () => void
  onDelete: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  onJump: (path: string, hash?: string) => void
}) {
  const [content, setContent] = useState(section.content)
  const [hochladen, setHochladen] = useState(false)

  useEffect(() => setContent(section.content), [section])

  async function speichern(next: Record<string, string>) {
    setContent(next)
    await updateCustomSectionContent(section.id, next)
    onSaved()
  }

  async function handleBild(file: File | null) {
    if (!file) return
    setHochladen(true)
    try {
      const url = await uploadSiteImage(file)
      await speichern({ ...content, imageUrl: url })
    } finally {
      setHochladen(false)
    }
  }

  return (
    <div className={styles.gruppe} onFocus={() => onJump('/', `bereich-${section.id}`)}>
      <div className={styles.bereichKopf}>
        <span className={styles.gruppenMeta}>{BLOCK_TYPE_LABEL[section.blockType]}</span>
        <div className={styles.bereichAktionen}>
          {onMoveUp && (
            <button type="button" className={styles.iconBtn} onClick={onMoveUp} title="Nach oben">
              ↑
            </button>
          )}
          {onMoveDown && (
            <button type="button" className={styles.iconBtn} onClick={onMoveDown} title="Nach unten">
              ↓
            </button>
          )}
          <button type="button" className={styles.dangerLink} onClick={onDelete}>
            Löschen
          </button>
        </div>
      </div>

      <div className={styles.gruppenInhalt}>
        {section.blockType === 'quote' ? (
          <>
            <textarea
              className={styles.feldInput}
              placeholder="Zitat"
              value={content.quote ?? ''}
              onChange={(e) => setContent({ ...content, quote: e.target.value })}
              onBlur={() => speichern(content)}
            />
            <input
              className={styles.feldInput}
              placeholder="Wer sagt das? (optional)"
              value={content.attribution ?? ''}
              onChange={(e) => setContent({ ...content, attribution: e.target.value })}
              onBlur={() => speichern(content)}
            />
          </>
        ) : (
          <>
            <input
              className={styles.feldInput}
              placeholder="Überschrift (optional)"
              value={content.heading ?? ''}
              onChange={(e) => setContent({ ...content, heading: e.target.value })}
              onBlur={() => speichern(content)}
            />
            <textarea
              className={styles.feldInput}
              placeholder="Text"
              value={content.body ?? ''}
              onChange={(e) => setContent({ ...content, body: e.target.value })}
              onBlur={() => speichern(content)}
              rows={4}
            />
            {section.blockType === 'image_text' && (
              <div className={styles.bildFeld}>
                {content.imageUrl && <img className={styles.bildVorschau} src={content.imageUrl} alt="" />}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleBild(e.target.files?.[0] ?? null)}
                  disabled={hochladen}
                />
                {hochladen && <span className={styles.speichertHinweis}>lädt hoch …</span>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
