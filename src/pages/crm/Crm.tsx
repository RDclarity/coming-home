import { useMemo, useState, useSyncExternalStore, type FormEvent } from 'react'
import { InternGate } from '../../components/InternGate'
import { crmStore } from '../../crm/store'
import { LEAD_SOURCE_LABELS, LEAD_STATUS_LABELS, type Lead, type LeadStatus } from '../../crm/types'
import { INTERN_PASSPHRASE } from '../../lib/internAuth'
import styles from './Crm.module.css'

const STATUS_ORDER: LeadStatus[] = ['neu', 'kontaktiert', 'gebucht', 'abgeschlossen', 'abgesagt']

function useLeads(): Lead[] {
  return useSyncExternalStore(crmStore.subscribe, crmStore.list, crmStore.list)
}

export function Crm() {
  return (
    <InternGate
      storageKey="coming-home:crm:unlocked"
      passphrase={INTERN_PASSPHRASE}
      title="Coming-Home-CRM"
      notice="Nur ein Sichtschutz, keine echte Zugriffskontrolle – die Seite ist rein clientseitig. Für echten Zugriffsschutz braucht es später ein Backend."
    >
      <Dashboard />
    </InternGate>
  )
}

function Dashboard() {
  const leads = useLeads()
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'alle'>('alle')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = useMemo(
    () => (statusFilter === 'alle' ? leads : leads.filter((lead) => lead.status === statusFilter)),
    [leads, statusFilter],
  )

  const selected = selectedId ? crmStore.get(selectedId) : filtered[0]

  return (
    <section className={styles.sec}>
      <div className={styles.inner}>
        <span className={styles.badge}>Intern</span>
        <h1 className={styles.title}>Anfragen</h1>
        <p className={styles.notice}>
          Diese Liste zeigt nur Anfragen, die auf diesem Gerät und in diesem Browser
          eingegangen sind (localStorage) – siehe Hinweis in src/crm/store.ts. Für eine
          zentrale, geräteübergreifende Übersicht braucht es später einen Backend-Adapter.
        </p>

        <div className={styles.toolbar}>
          <div className={styles.filters}>
            <button
              className={[styles.filterBtn, statusFilter === 'alle' && styles.filterBtnActive]
                .filter(Boolean)
                .join(' ')}
              onClick={() => setStatusFilter('alle')}
              type="button"
            >
              Alle ({leads.length})
            </button>
            {STATUS_ORDER.map((status) => {
              const count = leads.filter((lead) => lead.status === status).length
              return (
                <button
                  key={status}
                  className={[styles.filterBtn, statusFilter === status && styles.filterBtnActive]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setStatusFilter(status)}
                  type="button"
                >
                  {LEAD_STATUS_LABELS[status]} ({count})
                </button>
              )
            })}
          </div>

          <button className={styles.filterBtn} type="button" onClick={() => exportCsv(leads)}>
            Als CSV exportieren
          </button>
        </div>

        <div className={styles.layout}>
          <div className={styles.list}>
            {filtered.length === 0 && <p className={styles.empty}>Keine Anfragen in dieser Ansicht.</p>}
            {filtered.map((lead) => (
              <button
                key={lead.id}
                type="button"
                className={[styles.row, selected?.id === lead.id && styles.rowActive]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => setSelectedId(lead.id)}
              >
                <span>
                  <span className={styles.rowName}>{lead.name || '(ohne Namen)'}</span>
                  <br />
                  <span className={styles.rowMeta}>
                    {LEAD_SOURCE_LABELS[lead.source]} · {formatDate(lead.createdAt)}
                  </span>
                </span>
                <span className={styles.statusPill}>{LEAD_STATUS_LABELS[lead.status]}</span>
              </button>
            ))}
          </div>

          {selected && <LeadDetail lead={selected} />}
        </div>
      </div>
    </section>
  )
}

function LeadDetail({ lead }: { lead: Lead }) {
  const [noteText, setNoteText] = useState('')

  function handleAddNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!noteText.trim()) return
    crmStore.addNote(lead.id, noteText.trim())
    setNoteText('')
  }

  return (
    <aside className={styles.detail}>
      <h2 className={styles.detailName}>{lead.name || '(ohne Namen)'}</h2>
      <p className={styles.detailMeta}>
        {LEAD_SOURCE_LABELS[lead.source]} · {formatDate(lead.createdAt)}
      </p>

      <select
        className={styles.statusSelect}
        value={lead.status}
        onChange={(event) => crmStore.updateStatus(lead.id, event.target.value as LeadStatus)}
      >
        {STATUS_ORDER.map((status) => (
          <option key={status} value={status}>
            {LEAD_STATUS_LABELS[status]}
          </option>
        ))}
      </select>

      <div className={styles.fieldList}>
        {lead.email && (
          <div>
            <span className={styles.fieldLabel}>E-Mail</span>
            <a href={`mailto:${lead.email}`}>{lead.email}</a>
          </div>
        )}
        {lead.phone && (
          <div>
            <span className={styles.fieldLabel}>Telefon</span>
            {lead.phone}
          </div>
        )}
        {Object.entries(lead.fields)
          .filter(([key]) => !['name', 'email', 'telefon'].includes(key))
          .map(([key, value]) => (
            <div key={key}>
              <span className={styles.fieldLabel}>{key}</span>
              {value}
            </div>
          ))}
      </div>

      <div className={styles.notesList}>
        {lead.notes.map((note) => (
          <div key={note.id} className={styles.note}>
            {note.text}
            <span className={styles.noteMeta}>{formatDate(note.createdAt)}</span>
          </div>
        ))}
      </div>

      <form className={styles.noteForm} onSubmit={handleAddNote}>
        <input
          className={styles.noteInput}
          placeholder="Notiz hinzufügen…"
          value={noteText}
          onChange={(event) => setNoteText(event.target.value)}
        />
        <button className={styles.filterBtn} type="submit">
          +
        </button>
      </form>

      <button
        type="button"
        className={styles.dangerBtn}
        onClick={() => {
          if (confirm('Diesen Lead wirklich löschen?')) crmStore.remove(lead.id)
        }}
      >
        Lead löschen
      </button>
    </aside>
  )
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('de-AT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function exportCsv(leads: Lead[]) {
  const header = ['Datum', 'Quelle', 'Status', 'Name', 'E-Mail', 'Telefon'].join(';')
  const rows = leads.map((lead) =>
    [
      formatDate(lead.createdAt),
      LEAD_SOURCE_LABELS[lead.source],
      LEAD_STATUS_LABELS[lead.status],
      lead.name,
      lead.email,
      lead.phone ?? '',
    ]
      .map((value) => csvEscape(value))
      .join(';'),
  )
  const csv = [header, ...rows].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `coming-home-leads-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

function csvEscape(value: string): string {
  return `"${value.replace(/"/g, '""')}"`
}
