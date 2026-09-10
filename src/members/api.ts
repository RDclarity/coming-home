/**
 * Datenzugriff für den Mitgliederbereich. Bewusst EIN gemeinsamer Satz
 * Funktionen für Mitglieder UND Admin (z. B. `fetchMaterials`) – welche
 * Zeilen tatsächlich zurückkommen, entscheidet allein die Datenbank per Row
 * Level Security (siehe Migration), nicht diese Datei. Ein Mitglied bekommt
 * dadurch automatisch nur freigeschaltete Inhalte, ganz ohne eigene
 * Datums-/Rechte-Logik hier im Frontend.
 */

import { getSupabase } from '../crm/supabaseClient'
import type {
  Enrollment,
  MonthMaterial,
  Profile,
  Program,
  ProgramMonth,
  Questionnaire,
  QuestionnaireResponse,
} from './types'

async function client() {
  const c = await getSupabase()
  if (!c) throw new Error('Supabase ist nicht konfiguriert.')
  return c
}

/** Zugriffs-Token der aktuellen Sitzung – für den Aufruf der
 * send-questionnaire-pdf-Edge-Function (siehe pages/members/Mitglieder.tsx),
 * die den Login serverseitig selbst prüft. */
export async function getAccessToken(): Promise<string | null> {
  const c = await client()
  const { data } = await c.auth.getSession()
  return data.session?.access_token ?? null
}

// ---------------------------------------------------------------------------
// Profil
// ---------------------------------------------------------------------------

export async function fetchMyProfile(): Promise<Profile | null> {
  const c = await client()
  // getSession() statt getUser(): liest die schon vorhandene Sitzung direkt,
  // ohne dafür extra einen Netzwerk-Request an Supabase Auth zu schicken.
  const { data: auth } = await c.auth.getSession()
  const user = auth.session?.user
  if (!user) return null
  const { data, error } = await c.from('profiles').select('*').eq('id', user.id).maybeSingle()
  if (error) throw error
  if (!data) return null
  return { id: data.id, email: data.email, fullName: data.full_name, role: data.role, createdAt: data.created_at }
}

export async function fetchProfiles(): Promise<Profile[]> {
  const c = await client()
  const { data, error } = await c.from('profiles').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map((p) => ({
    id: p.id,
    email: p.email,
    fullName: p.full_name,
    role: p.role,
    createdAt: p.created_at,
  }))
}

// ---------------------------------------------------------------------------
// Programme
// ---------------------------------------------------------------------------

export async function fetchPrograms(): Promise<Program[]> {
  const c = await client()
  const { data, error } = await c.from('programs').select('*').order('title')
  if (error) throw error
  return (data ?? []).map((p) => ({ id: p.id, slug: p.slug, title: p.title, durationMonths: p.duration_months }))
}

export async function createProgram(input: { slug: string; title: string; durationMonths: number }): Promise<void> {
  const c = await client()
  const { error } = await c
    .from('programs')
    .insert({ slug: input.slug, title: input.title, duration_months: input.durationMonths })
  if (error) throw error
}

// ---------------------------------------------------------------------------
// Einschreibungen
// ---------------------------------------------------------------------------

export async function fetchMyEnrollments(): Promise<Enrollment[]> {
  const c = await client()
  const { data: auth } = await c.auth.getSession()
  const user = auth.session?.user
  if (!user) return []
  const { data, error } = await c.from('enrollments').select('*').eq('member_id', user.id)
  if (error) throw error
  return (data ?? []).map(rowToEnrollment)
}

export async function fetchAllEnrollments(): Promise<Enrollment[]> {
  const c = await client()
  const { data, error } = await c.from('enrollments').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(rowToEnrollment)
}

export async function createEnrollment(input: {
  memberId: string
  programId: string
  startDate: string
}): Promise<void> {
  const c = await client()
  const { error } = await c
    .from('enrollments')
    .insert({ member_id: input.memberId, program_id: input.programId, start_date: input.startDate })
  if (error) throw error
}

export async function deleteEnrollment(id: string): Promise<void> {
  const c = await client()
  const { error } = await c.from('enrollments').delete().eq('id', id)
  if (error) throw error
}

function rowToEnrollment(row: {
  id: string
  member_id: string
  program_id: string
  start_date: string
}): Enrollment {
  return { id: row.id, memberId: row.member_id, programId: row.program_id, startDate: row.start_date }
}

// ---------------------------------------------------------------------------
// Monate
// ---------------------------------------------------------------------------

/** Für Mitglieder liefert RLS automatisch nur bereits freigeschaltete Monate. */
export async function fetchMonths(programId: string): Promise<ProgramMonth[]> {
  const c = await client()
  const { data, error } = await c
    .from('program_months')
    .select('*')
    .eq('program_id', programId)
    .order('month_number')
  if (error) throw error
  return (data ?? []).map((m) => ({ id: m.id, programId: m.program_id, monthNumber: m.month_number, title: m.title }))
}

export async function createMonth(input: { programId: string; monthNumber: number; title: string }): Promise<void> {
  const c = await client()
  const { error } = await c
    .from('program_months')
    .insert({ program_id: input.programId, month_number: input.monthNumber, title: input.title || null })
  if (error) throw error
}

// ---------------------------------------------------------------------------
// Inhalte (PDF/Video)
// ---------------------------------------------------------------------------

export async function fetchMaterials(monthId: string): Promise<MonthMaterial[]> {
  const c = await client()
  const { data, error } = await c
    .from('month_materials')
    .select('*')
    .eq('month_id', monthId)
    .order('sort_order')
  if (error) throw error
  return (data ?? []).map((m) => ({
    id: m.id,
    monthId: m.month_id,
    kind: m.kind,
    title: m.title,
    storagePath: m.storage_path,
    videoUrl: m.video_url,
    sortOrder: m.sort_order,
  }))
}

export async function addVideoMaterial(input: { monthId: string; title: string; videoUrl: string }): Promise<void> {
  const c = await client()
  const { error } = await c
    .from('month_materials')
    .insert({ month_id: input.monthId, kind: 'video', title: input.title, video_url: input.videoUrl })
  if (error) throw error
}

/** Lädt eine PDF-Datei in den privaten Storage-Bucket hoch und legt die
 * dazugehörige Inhalts-Zeile an. Pfad enthält die Monats-ID, damit
 * gleichnamige Dateien in unterschiedlichen Monaten nicht kollidieren. */
export async function addPdfMaterial(input: { monthId: string; title: string; file: File }): Promise<void> {
  const c = await client()
  const path = `${input.monthId}/${Date.now()}-${input.file.name}`
  const upload = await c.storage.from('program-pdfs').upload(path, input.file, { contentType: 'application/pdf' })
  if (upload.error) throw upload.error

  const { error } = await c
    .from('month_materials')
    .insert({ month_id: input.monthId, kind: 'pdf', title: input.title, storage_path: path })
  if (error) throw error
}

export async function deleteMaterial(material: MonthMaterial): Promise<void> {
  const c = await client()
  if (material.kind === 'pdf' && material.storagePath) {
    await c.storage.from('program-pdfs').remove([material.storagePath])
  }
  const { error } = await c.from('month_materials').delete().eq('id', material.id)
  if (error) throw error
}

/** Kurzlebiger, signierter Link zum Anzeigen/Herunterladen einer PDF – der
 * private Bucket lässt sonst niemanden direkt per URL zugreifen. */
export async function pdfSignedUrl(storagePath: string): Promise<string> {
  const c = await client()
  const { data, error } = await c.storage.from('program-pdfs').createSignedUrl(storagePath, 60 * 10)
  if (error) throw error
  return data.signedUrl
}

// ---------------------------------------------------------------------------
// Fragebögen
// ---------------------------------------------------------------------------

export async function fetchQuestionnaires(monthId: string): Promise<Questionnaire[]> {
  const c = await client()
  const { data, error } = await c.from('questionnaires').select('*').eq('month_id', monthId)
  if (error) throw error
  return (data ?? []).map((q) => ({ id: q.id, monthId: q.month_id, title: q.title, questions: q.questions ?? [] }))
}

export async function createQuestionnaire(
  input: Pick<Questionnaire, 'monthId' | 'title' | 'questions'>,
): Promise<void> {
  const c = await client()
  const { error } = await c
    .from('questionnaires')
    .insert({ month_id: input.monthId, title: input.title, questions: input.questions })
  if (error) throw error
}

export async function updateQuestionnaireQuestions(id: string, questions: Questionnaire['questions']): Promise<void> {
  const c = await client()
  const { error } = await c.from('questionnaires').update({ questions }).eq('id', id)
  if (error) throw error
}

export async function deleteQuestionnaire(id: string): Promise<void> {
  const c = await client()
  const { error } = await c.from('questionnaires').delete().eq('id', id)
  if (error) throw error
}

export async function fetchMyResponse(questionnaireId: string): Promise<QuestionnaireResponse | null> {
  const c = await client()
  const { data: auth } = await c.auth.getSession()
  const user = auth.session?.user
  if (!user) return null
  const { data, error } = await c
    .from('questionnaire_responses')
    .select('*')
    .eq('questionnaire_id', questionnaireId)
    .eq('member_id', user.id)
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  return {
    id: data.id,
    questionnaireId: data.questionnaire_id,
    memberId: data.member_id,
    answers: data.answers ?? {},
    submittedAt: data.submitted_at,
  }
}

export async function submitResponse(
  questionnaireId: string,
  answers: Record<string, string | string[]>,
): Promise<void> {
  const c = await client()
  const { data: auth } = await c.auth.getSession()
  const user = auth.session?.user
  if (!user) throw new Error('Nicht angemeldet.')
  const { error } = await c
    .from('questionnaire_responses')
    .upsert(
      { questionnaire_id: questionnaireId, member_id: user.id, answers, submitted_at: new Date().toISOString() },
      { onConflict: 'questionnaire_id,member_id' },
    )
  if (error) throw error
}
