import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  addPdfMaterial,
  addVideoMaterial,
  createEnrollment,
  createMonth,
  createProgram,
  createQuestionnaire,
  deleteEnrollment,
  deleteMaterial,
  deleteQuestionnaire,
  fetchAllEnrollments,
  fetchMaterials,
  fetchMonths,
  fetchPrograms,
  fetchProfiles,
  fetchQuestionnaires,
  updateQuestionnaireQuestions,
} from '../../members/api'
import type {
  Enrollment,
  MonthMaterial,
  Profile,
  Program,
  ProgramMonth,
  Question,
  Questionnaire,
  QuestionType,
} from '../../members/types'
import styles from './AdminMitglieder.module.css'

const QUESTION_TYPE_LABEL: Record<QuestionType, string> = {
  text: 'Kurzantwort',
  textarea: 'Langtext',
  radio: 'Einfachauswahl',
  checkbox: 'Mehrfachauswahl',
}

/**
 * Verwaltungsbereich für den Mitgliederbereich: Programme anlegen, Monate mit
 * Inhalten (PDF/Video) und Fragebogen füllen, Mitglieder einem Programm
 * zuordnen. Läuft über dieselbe Datenbank wie das CRM – welche Aktionen
 * tatsächlich erlaubt sind, entscheidet dort Row Level Security (nur
 * Accounts mit role="admin", siehe supabase/migrations/…_members.sql).
 */
export function AdminMitglieder() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null)
  const [laden, setLaden] = useState(true)
  const [fehler, setFehler] = useState<string | null>(null)

  async function neuLaden() {
    try {
      const data = await fetchPrograms()
      setPrograms(data)
      setSelectedProgramId((current) => current ?? data[0]?.id ?? null)
    } catch {
      setFehler('Programme konnten nicht geladen werden.')
    } finally {
      setLaden(false)
    }
  }

  useEffect(() => {
    neuLaden()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selectedProgram = programs.find((p) => p.id === selectedProgramId) ?? null

  if (laden) return <p className={styles.empty}>Wird geladen …</p>
  if (fehler) return <p className={styles.empty}>{fehler}</p>

  return (
    <div>
      <ProgrammListe
        programs={programs}
        selectedId={selectedProgramId}
        onSelect={setSelectedProgramId}
        onCreated={neuLaden}
      />

      {selectedProgram && <ProgrammDetail program={selectedProgram} />}

      <MitgliederVerwaltung programs={programs} />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Programme
// ---------------------------------------------------------------------------

function ProgrammListe({
  programs,
  selectedId,
  onSelect,
  onCreated,
}: {
  programs: Program[]
  selectedId: string | null
  onSelect: (id: string) => void
  onCreated: () => void
}) {
  const [zeigeForm, setZeigeForm] = useState(false)
  const [titel, setTitel] = useState('')
  const [dauer, setDauer] = useState(3)
  const [speichert, setSpeichert] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!titel.trim()) return
    setSpeichert(true)
    try {
      const slug = titel
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      await createProgram({ slug: `${slug}-${Date.now().toString(36)}`, title: titel.trim(), durationMonths: dauer })
      setTitel('')
      setDauer(3)
      setZeigeForm(false)
      await onCreated()
    } finally {
      setSpeichert(false)
    }
  }

  return (
    <div className={styles.panel}>
      <p className={styles.panelTitle}>Programme</p>
      <div className={styles.pillRow}>
        {programs.map((p) => (
          <button
            key={p.id}
            type="button"
            className={[styles.pill, p.id === selectedId && styles.pillActive].filter(Boolean).join(' ')}
            onClick={() => onSelect(p.id)}
          >
            {p.title} ({p.durationMonths} Mon.)
          </button>
        ))}
        <button type="button" className={styles.pillGhost} onClick={() => setZeigeForm((v) => !v)}>
          + Neues Programm
        </button>
      </div>

      {zeigeForm && (
        <form className={styles.inlineForm} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            placeholder="Titel, z. B. „3-Monats-Begleitung“"
            value={titel}
            onChange={(e) => setTitel(e.target.value)}
            required
          />
          <input
            className={styles.inputSmall}
            type="number"
            min={1}
            value={dauer}
            onChange={(e) => setDauer(Number(e.target.value))}
            aria-label="Dauer in Monaten"
          />
          <span className={styles.inlineLabel}>Monate</span>
          <button className={styles.filterBtn} type="submit" disabled={speichert}>
            {speichert ? 'Speichert …' : 'Anlegen'}
          </button>
        </form>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Monate eines Programms
// ---------------------------------------------------------------------------

function ProgrammDetail({ program }: { program: Program }) {
  const [months, setMonths] = useState<ProgramMonth[]>([])
  const [selectedMonthId, setSelectedMonthId] = useState<string | null>(null)
  const [laden, setLaden] = useState(true)

  async function neuLaden() {
    setLaden(true)
    try {
      const data = await fetchMonths(program.id)
      setMonths(data)
      setSelectedMonthId((current) => (data.some((m) => m.id === current) ? current : (data[0]?.id ?? null)))
    } finally {
      setLaden(false)
    }
  }

  useEffect(() => {
    neuLaden()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program.id])

  const belegteMonate = new Set(months.map((m) => m.monthNumber))
  const naechsteFreieNummer = useMemo(() => {
    for (let i = 1; i <= program.durationMonths; i++) if (!belegteMonate.has(i)) return i
    return program.durationMonths + 1
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [months, program.durationMonths])

  const selectedMonth = months.find((m) => m.id === selectedMonthId) ?? null

  return (
    <div className={styles.panel}>
      <p className={styles.panelTitle}>Monate – {program.title}</p>

      <div className={styles.pillRow}>
        {months.map((m) => (
          <button
            key={m.id}
            type="button"
            className={[styles.pill, m.id === selectedMonthId && styles.pillActive].filter(Boolean).join(' ')}
            onClick={() => setSelectedMonthId(m.id)}
          >
            Monat {m.monthNumber}
            {m.title ? ` · ${m.title}` : ''}
          </button>
        ))}
        <NeuerMonatButton
          programId={program.id}
          vorgeschlageneNummer={naechsteFreieNummer}
          onCreated={neuLaden}
        />
      </div>

      {laden && <p className={styles.empty}>Wird geladen …</p>}
      {!laden && months.length === 0 && (
        <p className={styles.empty}>Noch keine Monate angelegt – oben „+ Monat hinzufügen“ klicken.</p>
      )}

      {selectedMonth && <MonatDetail month={selectedMonth} />}
    </div>
  )
}

function NeuerMonatButton({
  programId,
  vorgeschlageneNummer,
  onCreated,
}: {
  programId: string
  vorgeschlageneNummer: number
  onCreated: () => void
}) {
  const [zeigeForm, setZeigeForm] = useState(false)
  const [nummer, setNummer] = useState(vorgeschlageneNummer)
  const [titel, setTitel] = useState('')
  const [speichert, setSpeichert] = useState(false)

  useEffect(() => setNummer(vorgeschlageneNummer), [vorgeschlageneNummer])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSpeichert(true)
    try {
      await createMonth({ programId, monthNumber: nummer, title: titel.trim() })
      setTitel('')
      setZeigeForm(false)
      await onCreated()
    } finally {
      setSpeichert(false)
    }
  }

  if (!zeigeForm) {
    return (
      <button type="button" className={styles.pillGhost} onClick={() => setZeigeForm(true)}>
        + Monat hinzufügen
      </button>
    )
  }

  return (
    <form className={styles.inlineForm} onSubmit={handleSubmit}>
      <span className={styles.inlineLabel}>Monat</span>
      <input
        className={styles.inputSmall}
        type="number"
        min={1}
        value={nummer}
        onChange={(e) => setNummer(Number(e.target.value))}
        aria-label="Monatsnummer"
      />
      <input
        className={styles.input}
        placeholder="Titel (optional)"
        value={titel}
        onChange={(e) => setTitel(e.target.value)}
      />
      <button className={styles.filterBtn} type="submit" disabled={speichert}>
        {speichert ? 'Speichert …' : 'Anlegen'}
      </button>
    </form>
  )
}

// ---------------------------------------------------------------------------
// Inhalte + Fragebogen eines Monats
// ---------------------------------------------------------------------------

function MonatDetail({ month }: { month: ProgramMonth }) {
  return (
    <div className={styles.monatDetail}>
      <MaterialListe month={month} />
      <FragebogenVerwaltung month={month} />
    </div>
  )
}

function MaterialListe({ month }: { month: ProgramMonth }) {
  const [materials, setMaterials] = useState<MonthMaterial[]>([])
  const [laden, setLaden] = useState(true)
  const [videoTitel, setVideoTitel] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [pdfTitel, setPdfTitel] = useState('')
  const [pdfDatei, setPdfDatei] = useState<File | null>(null)
  const [speichert, setSpeichert] = useState(false)

  async function neuLaden() {
    setLaden(true)
    try {
      setMaterials(await fetchMaterials(month.id))
    } finally {
      setLaden(false)
    }
  }

  useEffect(() => {
    neuLaden()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month.id])

  async function handleVideoSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!videoTitel.trim() || !videoUrl.trim()) return
    setSpeichert(true)
    try {
      await addVideoMaterial({ monthId: month.id, title: videoTitel.trim(), videoUrl: videoUrl.trim() })
      setVideoTitel('')
      setVideoUrl('')
      await neuLaden()
    } finally {
      setSpeichert(false)
    }
  }

  async function handlePdfSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!pdfTitel.trim() || !pdfDatei) return
    setSpeichert(true)
    try {
      await addPdfMaterial({ monthId: month.id, title: pdfTitel.trim(), file: pdfDatei })
      setPdfTitel('')
      setPdfDatei(null)
      await neuLaden()
    } finally {
      setSpeichert(false)
    }
  }

  async function handleDelete(material: MonthMaterial) {
    if (!confirm(`„${material.title}“ wirklich löschen?`)) return
    await deleteMaterial(material)
    await neuLaden()
  }

  return (
    <div className={styles.subPanel}>
      <p className={styles.subPanelTitle}>Inhalte in Monat {month.monthNumber}</p>

      {laden && <p className={styles.empty}>Wird geladen …</p>}
      {!laden && materials.length === 0 && <p className={styles.empty}>Noch keine Inhalte in diesem Monat.</p>}

      <ul className={styles.materialListe}>
        {materials.map((m) => (
          <li key={m.id} className={styles.materialZeile}>
            <span className={styles.materialKind}>{m.kind === 'pdf' ? 'PDF' : 'Video'}</span>
            <span className={styles.materialTitel}>{m.title}</span>
            <button type="button" className={styles.dangerLink} onClick={() => handleDelete(m)}>
              Löschen
            </button>
          </li>
        ))}
      </ul>

      <div className={styles.formGrid}>
        <form className={styles.stackForm} onSubmit={handleVideoSubmit}>
          <p className={styles.formLabel}>Video hinzufügen</p>
          <input
            className={styles.input}
            placeholder="Titel"
            value={videoTitel}
            onChange={(e) => setVideoTitel(e.target.value)}
          />
          <input
            className={styles.input}
            placeholder="YouTube-/Vimeo-Link (unlisted)"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          <button className={styles.filterBtn} type="submit" disabled={speichert}>
            Video hinzufügen
          </button>
        </form>

        <form className={styles.stackForm} onSubmit={handlePdfSubmit}>
          <p className={styles.formLabel}>PDF hochladen</p>
          <input
            className={styles.input}
            placeholder="Titel"
            value={pdfTitel}
            onChange={(e) => setPdfTitel(e.target.value)}
          />
          <input
            className={styles.input}
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdfDatei(e.target.files?.[0] ?? null)}
          />
          <button className={styles.filterBtn} type="submit" disabled={speichert}>
            PDF hochladen
          </button>
        </form>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Fragebogen eines Monats (bewusst: EIN Fragebogen pro Monat im UI, auch
// wenn das Schema theoretisch mehrere erlauben würde – deckt den
// tatsächlichen Anwendungsfall ab, ohne die Bedienung zu verkomplizieren.)
// ---------------------------------------------------------------------------

function FragebogenVerwaltung({ month }: { month: ProgramMonth }) {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([])
  const [laden, setLaden] = useState(true)

  async function neuLaden() {
    setLaden(true)
    try {
      setQuestionnaires(await fetchQuestionnaires(month.id))
    } finally {
      setLaden(false)
    }
  }

  useEffect(() => {
    neuLaden()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month.id])

  if (laden) return <p className={styles.empty}>Wird geladen …</p>

  const bestehender = questionnaires[0] ?? null

  return (
    <div className={styles.subPanel}>
      <p className={styles.subPanelTitle}>Fragebogen für Monat {month.monthNumber}</p>
      {bestehender ? (
        <FragebogenEditor
          questionnaire={bestehender}
          onDeleted={neuLaden}
        />
      ) : (
        <NeuerFragebogen monthId={month.id} onCreated={neuLaden} />
      )}
    </div>
  )
}

function NeuerFragebogen({ monthId, onCreated }: { monthId: string; onCreated: () => void }) {
  const [titel, setTitel] = useState('')
  const [speichert, setSpeichert] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!titel.trim()) return
    setSpeichert(true)
    try {
      await createQuestionnaire({ monthId, title: titel.trim(), questions: [] })
      setTitel('')
      await onCreated()
    } finally {
      setSpeichert(false)
    }
  }

  return (
    <form className={styles.inlineForm} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        placeholder="Titel des Fragebogens"
        value={titel}
        onChange={(e) => setTitel(e.target.value)}
        required
      />
      <button className={styles.filterBtn} type="submit" disabled={speichert}>
        Fragebogen anlegen
      </button>
    </form>
  )
}

function FragebogenEditor({
  questionnaire,
  onDeleted,
}: {
  questionnaire: Questionnaire
  onDeleted: () => void
}) {
  const [questions, setQuestions] = useState<Question[]>(questionnaire.questions)
  const [speichert, setSpeichert] = useState(false)
  const [gespeichert, setGespeichert] = useState(false)

  useEffect(() => {
    setQuestions(questionnaire.questions)
  }, [questionnaire])

  function addQuestion() {
    setQuestions((qs) => [...qs, { id: crypto.randomUUID(), label: '', type: 'text' }])
    setGespeichert(false)
  }

  function updateQuestion(id: string, patch: Partial<Question>) {
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, ...patch } : q)))
    setGespeichert(false)
  }

  function removeQuestion(id: string) {
    setQuestions((qs) => qs.filter((q) => q.id !== id))
    setGespeichert(false)
  }

  async function handleSave() {
    setSpeichert(true)
    try {
      await updateQuestionnaireQuestions(
        questionnaire.id,
        questions.filter((q) => q.label.trim() !== ''),
      )
      setGespeichert(true)
    } finally {
      setSpeichert(false)
    }
  }

  async function handleDelete() {
    if (!confirm(`Fragebogen „${questionnaire.title}“ wirklich löschen?`)) return
    await deleteQuestionnaire(questionnaire.id)
    await onDeleted()
  }

  return (
    <div>
      <div className={styles.fragebogenKopf}>
        <p className={styles.formLabel}>{questionnaire.title}</p>
        <button type="button" className={styles.dangerLink} onClick={handleDelete}>
          Fragebogen löschen
        </button>
      </div>

      <div className={styles.fragenListe}>
        {questions.map((q) => (
          <div key={q.id} className={styles.frageZeile}>
            <input
              className={styles.input}
              placeholder="Frage"
              value={q.label}
              onChange={(e) => updateQuestion(q.id, { label: e.target.value })}
            />
            <select
              className={styles.inputSmall}
              value={q.type}
              onChange={(e) => updateQuestion(q.id, { type: e.target.value as QuestionType })}
            >
              {(Object.keys(QUESTION_TYPE_LABEL) as QuestionType[]).map((t) => (
                <option key={t} value={t}>
                  {QUESTION_TYPE_LABEL[t]}
                </option>
              ))}
            </select>
            {(q.type === 'radio' || q.type === 'checkbox') && (
              <input
                className={styles.input}
                placeholder="Antwortoptionen, mit Komma getrennt"
                value={(q.options ?? []).join(', ')}
                onChange={(e) =>
                  updateQuestion(q.id, {
                    options: e.target.value
                      .split(',')
                      .map((o) => o.trim())
                      .filter(Boolean),
                  })
                }
              />
            )}
            <button type="button" className={styles.dangerLink} onClick={() => removeQuestion(q.id)}>
              Entfernen
            </button>
          </div>
        ))}
      </div>

      <div className={styles.fragebogenAktionen}>
        <button type="button" className={styles.filterBtn} onClick={addQuestion}>
          + Frage hinzufügen
        </button>
        <button type="button" className={styles.filterBtn} onClick={handleSave} disabled={speichert}>
          {speichert ? 'Speichert …' : 'Speichern'}
        </button>
        {gespeichert && <span className={styles.gespeichertHinweis}>Gespeichert.</span>}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Mitglieder + Einschreibungen
// ---------------------------------------------------------------------------

function MitgliederVerwaltung({ programs }: { programs: Program[] }) {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [laden, setLaden] = useState(true)

  async function neuLaden() {
    setLaden(true)
    try {
      const [p, e] = await Promise.all([fetchProfiles(), fetchAllEnrollments()])
      setProfiles(p)
      setEnrollments(e)
    } finally {
      setLaden(false)
    }
  }

  useEffect(() => {
    neuLaden()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const mitglieder = profiles.filter((p) => p.role === 'member')

  return (
    <div className={styles.panel}>
      <p className={styles.panelTitle}>Mitglieder</p>
      <p className={styles.notice}>
        Neue Zugänge legt Jasmin wie beim eigenen CRM-Login im Supabase-Dashboard an
        (Authentication → Users → Add user) – sie erscheinen danach automatisch hier
        und lassen sich einem Programm zuordnen.
      </p>

      {laden && <p className={styles.empty}>Wird geladen …</p>}
      {!laden && mitglieder.length === 0 && <p className={styles.empty}>Noch keine Mitglieder-Zugänge angelegt.</p>}

      <div className={styles.mitgliederListe}>
        {mitglieder.map((m) => (
          <MitgliedZeile
            key={m.id}
            profile={m}
            programs={programs}
            enrollment={enrollments.find((e) => e.memberId === m.id) ?? null}
            onChanged={neuLaden}
          />
        ))}
      </div>
    </div>
  )
}

function MitgliedZeile({
  profile,
  programs,
  enrollment,
  onChanged,
}: {
  profile: Profile
  programs: Program[]
  enrollment: Enrollment | null
  onChanged: () => void
}) {
  const [programId, setProgramId] = useState(programs[0]?.id ?? '')
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [speichert, setSpeichert] = useState(false)

  const programTitel = enrollment ? programs.find((p) => p.id === enrollment.programId)?.title : null

  async function handleEinschreiben(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!programId) return
    setSpeichert(true)
    try {
      await createEnrollment({ memberId: profile.id, programId, startDate })
      await onChanged()
    } finally {
      setSpeichert(false)
    }
  }

  async function handleEntfernen() {
    if (!enrollment) return
    if (!confirm('Einschreibung wirklich entfernen?')) return
    await deleteEnrollment(enrollment.id)
    await onChanged()
  }

  return (
    <div className={styles.mitgliedZeile}>
      <div className={styles.mitgliedInfo}>
        <span className={styles.mitgliedEmail}>{profile.email}</span>
        {enrollment && programTitel && (
          <span className={styles.mitgliedProgramm}>
            {programTitel} · seit {new Date(enrollment.startDate).toLocaleDateString('de-AT')}
          </span>
        )}
      </div>

      {enrollment ? (
        <button type="button" className={styles.dangerLink} onClick={handleEntfernen}>
          Einschreibung entfernen
        </button>
      ) : (
        <form className={styles.inlineForm} onSubmit={handleEinschreiben}>
          <select
            className={styles.inputSmall}
            value={programId}
            onChange={(e) => setProgramId(e.target.value)}
            aria-label="Programm wählen"
          >
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
          <input
            className={styles.inputSmall}
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            aria-label="Startdatum"
          />
          <button className={styles.filterBtn} type="submit" disabled={speichert || !programId}>
            {speichert ? 'Speichert …' : 'Einschreiben'}
          </button>
        </form>
      )}
    </div>
  )
}
