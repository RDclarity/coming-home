import { useEffect, useState, type FormEvent } from 'react'
import { SupabaseLoginGate } from '../../components/SupabaseLoginGate'
import {
  fetchMaterials,
  fetchMonths,
  fetchMyEnrollments,
  fetchMyResponse,
  fetchPrograms,
  fetchQuestionnaires,
  getAccessToken,
  pdfSignedUrl,
  submitResponse,
} from '../../members/api'
import type {
  Enrollment,
  MonthMaterial,
  Program,
  ProgramMonth,
  Question,
  Questionnaire,
  QuestionnaireResponse,
} from '../../members/types'
import { useProfile } from '../../members/useProfile'
import styles from './Mitglieder.module.css'

/**
 * Mitgliederbereich für die 3-/12-Monats-Begleitungen: pro Monat die
 * freigeschalteten PDFs/Videos sowie ein Fragebogen zum Videokurs, den man
 * ausfüllen und sich als PDF an die eigene E-Mail-Adresse senden kann.
 *
 * WICHTIG: Welche Monate überhaupt sichtbar sind, entscheidet ausschließlich
 * die Datenbank per Row Level Security (siehe
 * supabase/migrations/…_members.sql, Funktion `month_unlocked`) – diese
 * Seite fragt nur "gib mir die Monate zu meinem Programm" ab und bekommt
 * serverseitig automatisch nur die bereits freigeschalteten zurück.
 */
export function Mitglieder() {
  return (
    <SupabaseLoginGate title="Coming-Home-Mitgliederbereich">
      <MemberArea />
    </SupabaseLoginGate>
  )
}

function MemberArea() {
  const { profile, loading: profileLoading } = useProfile()
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [program, setProgram] = useState<Program | null>(null)
  const [months, setMonths] = useState<ProgramMonth[]>([])
  const [selectedMonthId, setSelectedMonthId] = useState<string | null>(null)
  const [laden, setLaden] = useState(true)
  const [fehler, setFehler] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const enrollments = await fetchMyEnrollments()
        const e = enrollments[0] ?? null
        if (cancelled) return
        setEnrollment(e)

        if (e) {
          const [programs, monthList] = await Promise.all([fetchPrograms(), fetchMonths(e.programId)])
          if (cancelled) return
          setProgram(programs.find((p) => p.id === e.programId) ?? null)
          setMonths(monthList)
          setSelectedMonthId(monthList[monthList.length - 1]?.id ?? null)
        }
      } catch {
        if (!cancelled) setFehler('Dein Bereich konnte nicht geladen werden.')
      } finally {
        if (!cancelled) setLaden(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  if (profileLoading || laden) {
    return (
      <section className={styles.sec}>
        <p className={styles.empty}>Wird geladen …</p>
      </section>
    )
  }

  const selectedMonth = months.find((m) => m.id === selectedMonthId) ?? null

  return (
    <section className={styles.sec}>
      <div className={styles.inner}>
        <span className={styles.badge}>Mitgliederbereich</span>
        <h1 className={styles.title}>Hallo{profile?.fullName ? `, ${profile.fullName}` : ''}.</h1>

        {fehler && <p className={styles.notice}>{fehler}</p>}

        {!fehler && (!enrollment || !program) && (
          <p className={styles.notice}>
            Für deinen Zugang ist aktuell keine Begleitung hinterlegt. Melde dich gern bei Jasmin, falls das nicht
            stimmen sollte.
          </p>
        )}

        {program && enrollment && (
          <>
            <p className={styles.notice}>
              {program.title} · gestartet am {new Date(enrollment.startDate).toLocaleDateString('de-AT')}
            </p>

            {months.length === 0 ? (
              <p className={styles.empty}>Der erste Monat wird in Kürze für dich freigeschaltet.</p>
            ) : (
              <div className={styles.pillRow}>
                {months.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className={[styles.pill, m.id === selectedMonthId && styles.pillActive]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => setSelectedMonthId(m.id)}
                  >
                    Monat {m.monthNumber}
                    {m.title ? ` · ${m.title}` : ''}
                  </button>
                ))}
              </div>
            )}

            {selectedMonth && <MonatInhalt month={selectedMonth} />}
          </>
        )}
      </div>
    </section>
  )
}

function MonatInhalt({ month }: { month: ProgramMonth }) {
  const [materials, setMaterials] = useState<MonthMaterial[]>([])
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([])
  const [laden, setLaden] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLaden(true)
    Promise.all([fetchMaterials(month.id), fetchQuestionnaires(month.id)])
      .then(([m, q]) => {
        if (cancelled) return
        setMaterials(m)
        setQuestionnaires(q)
      })
      .finally(() => {
        if (!cancelled) setLaden(false)
      })
    return () => {
      cancelled = true
    }
  }, [month.id])

  if (laden) return <p className={styles.empty}>Wird geladen …</p>

  const pdfs = materials.filter((m) => m.kind === 'pdf')
  const videos = materials.filter((m) => m.kind === 'video')

  return (
    <div className={styles.monatInhalt}>
      {materials.length === 0 && <p className={styles.empty}>In diesem Monat sind noch keine Inhalte hinterlegt.</p>}

      {videos.map((v) => (
        <div key={v.id} className={styles.materialBlock}>
          <p className={styles.materialTitel}>{v.title}</p>
          <div className={styles.videoWrap}>
            <iframe
              src={embedUrl(v.videoUrl ?? '')}
              title={v.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      ))}

      {pdfs.map((p) => (
        <PdfBlock key={p.id} material={p} />
      ))}

      {questionnaires.map((q) => (
        <FragebogenBlock key={q.id} questionnaire={q} />
      ))}
    </div>
  )
}

function PdfBlock({ material }: { material: MonthMaterial }) {
  const [laden, setLaden] = useState(false)

  async function oeffnen() {
    if (!material.storagePath) return
    setLaden(true)
    try {
      const url = await pdfSignedUrl(material.storagePath)
      window.open(url, '_blank', 'noopener')
    } finally {
      setLaden(false)
    }
  }

  return (
    <div className={styles.materialBlock}>
      <p className={styles.materialTitel}>{material.title}</p>
      <button type="button" className={styles.btn} onClick={oeffnen} disabled={laden}>
        {laden ? 'Öffnet …' : 'PDF öffnen'}
      </button>
    </div>
  )
}

function embedUrl(url: string): string {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtu.be')) {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`
    }
    if (u.hostname.includes('youtube.com')) {
      const id = u.searchParams.get('v')
      if (id) return `https://www.youtube.com/embed/${id}`
      return url
    }
    if (u.hostname.includes('vimeo.com') && !u.hostname.includes('player.vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean).pop()
      if (id) return `https://player.vimeo.com/video/${id}`
    }
    return url
  } catch {
    return url
  }
}

function FragebogenBlock({ questionnaire }: { questionnaire: Questionnaire }) {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [bestehendeAntwort, setBestehendeAntwort] = useState<QuestionnaireResponse | null>(null)
  const [laden, setLaden] = useState(true)
  const [speichert, setSpeichert] = useState(false)
  const [gesendet, setGesendet] = useState(false)
  const [sendeFehler, setSendeFehler] = useState<string | null>(null)
  const [sendetGerade, setSendetGerade] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchMyResponse(questionnaire.id)
      .then((r) => {
        if (cancelled) return
        setBestehendeAntwort(r)
        if (r) setAnswers(r.answers)
      })
      .finally(() => {
        if (!cancelled) setLaden(false)
      })
    return () => {
      cancelled = true
    }
  }, [questionnaire.id])

  function setAnswer(id: string, value: string | string[]) {
    setAnswers((a) => ({ ...a, [id]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSpeichert(true)
    try {
      await submitResponse(questionnaire.id, answers)
      setBestehendeAntwort({
        id: bestehendeAntwort?.id ?? '',
        questionnaireId: questionnaire.id,
        memberId: '',
        answers,
        submittedAt: new Date().toISOString(),
      })
    } finally {
      setSpeichert(false)
    }
  }

  async function handleAlsPdfSenden() {
    setSendetGerade(true)
    setSendeFehler(null)
    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF()
      let y = 20
      doc.setFontSize(16)
      doc.text(questionnaire.title, 14, y)
      y += 10
      doc.setFontSize(11)
      for (const q of questionnaire.questions) {
        const value = answers[q.id]
        const antwortText = Array.isArray(value) ? value.join(', ') : value || '–'
        const zeilen = doc.splitTextToSize(`${q.label}: ${antwortText}`, 180)
        if (y + zeilen.length * 6 > 280) {
          doc.addPage()
          y = 20
        }
        doc.text(zeilen, 14, y)
        y += zeilen.length * 6 + 4
      }

      const base64 = doc.output('datauristring').split(',')[1]
      const token = await getAccessToken()
      if (!token) throw new Error('Nicht angemeldet.')

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-questionnaire-pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: questionnaire.title,
          filename: `${questionnaire.title}.pdf`,
          pdfBase64: base64,
        }),
      })
      if (!response.ok) throw new Error('Versand fehlgeschlagen.')
      setGesendet(true)
    } catch {
      setSendeFehler('Der Versand hat leider nicht geklappt. Versuch es gern nochmal.')
    } finally {
      setSendetGerade(false)
    }
  }

  if (laden) return null

  return (
    <div className={styles.materialBlock}>
      <p className={styles.materialTitel}>{questionnaire.title}</p>

      <form className={styles.fragebogenForm} onSubmit={handleSubmit}>
        {questionnaire.questions.map((q) => (
          <FrageFeld key={q.id} question={q} value={answers[q.id]} onChange={(v) => setAnswer(q.id, v)} />
        ))}
        <div className={styles.fragebogenAktionen}>
          <button type="submit" className={styles.btn} disabled={speichert}>
            {speichert ? 'Speichert …' : bestehendeAntwort ? 'Antworten aktualisieren' : 'Absenden'}
          </button>
          {bestehendeAntwort && (
            <button type="button" className={styles.btnGhost} onClick={handleAlsPdfSenden} disabled={sendetGerade}>
              {sendetGerade ? 'Wird gesendet …' : 'Als PDF an meine E-Mail senden'}
            </button>
          )}
        </div>
        {gesendet && <p className={styles.hinweis}>Ist unterwegs – schau in dein Postfach.</p>}
        {sendeFehler && <p className={styles.hinweis}>{sendeFehler}</p>}
      </form>
    </div>
  )
}

function FrageFeld({
  question,
  value,
  onChange,
}: {
  question: Question
  value: string | string[] | undefined
  onChange: (value: string | string[]) => void
}) {
  if (question.type === 'textarea') {
    return (
      <label className={styles.feld}>
        <span className={styles.feldLabel}>{question.label}</span>
        <textarea
          className={styles.textarea}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    )
  }

  if (question.type === 'radio') {
    return (
      <fieldset className={styles.feld}>
        <legend className={styles.feldLabel}>{question.label}</legend>
        {(question.options ?? []).map((option) => (
          <label key={option} className={styles.option}>
            <input
              type="radio"
              name={question.id}
              checked={value === option}
              onChange={() => onChange(option)}
            />
            {option}
          </label>
        ))}
      </fieldset>
    )
  }

  if (question.type === 'checkbox') {
    const selected = Array.isArray(value) ? value : []
    return (
      <fieldset className={styles.feld}>
        <legend className={styles.feldLabel}>{question.label}</legend>
        {(question.options ?? []).map((option) => (
          <label key={option} className={styles.option}>
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={(e) =>
                onChange(e.target.checked ? [...selected, option] : selected.filter((o) => o !== option))
              }
            />
            {option}
          </label>
        ))}
      </fieldset>
    )
  }

  return (
    <label className={styles.feld}>
      <span className={styles.feldLabel}>{question.label}</span>
      <input className={styles.input} value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} />
    </label>
  )
}
