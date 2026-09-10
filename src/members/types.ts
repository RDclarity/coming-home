/** Typen für den Mitgliederbereich – siehe supabase/migrations/00000000000003_members.sql. */

export type Role = 'admin' | 'member'

export type Profile = {
  id: string
  email: string
  fullName: string | null
  role: Role
  createdAt: string
}

export type Program = {
  id: string
  slug: string
  title: string
  durationMonths: number
}

export type Enrollment = {
  id: string
  memberId: string
  programId: string
  startDate: string
}

export type ProgramMonth = {
  id: string
  programId: string
  monthNumber: number
  title: string | null
}

export type MaterialKind = 'pdf' | 'video'

export type MonthMaterial = {
  id: string
  monthId: string
  kind: MaterialKind
  title: string
  storagePath: string | null
  videoUrl: string | null
  sortOrder: number
}

export type QuestionType = 'text' | 'textarea' | 'radio' | 'checkbox'

export type Question = {
  id: string
  label: string
  type: QuestionType
  options?: string[]
}

export type Questionnaire = {
  id: string
  monthId: string
  title: string
  questions: Question[]
}

export type QuestionnaireResponse = {
  id: string
  questionnaireId: string
  memberId: string
  answers: Record<string, string | string[]>
  submittedAt: string
}
