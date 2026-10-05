import { useState, type FormEvent } from 'react'
import { termine, workshopBuchung } from '../data/site'
import { BuchungsFehler, MAX_PLAETZE, bucheWorkshop } from '../lib/workshopBuchung'
import { withBase } from '../lib/url'
// Bewusst dieselben Styles wie der Termin-Kalender: beide Fenster sollen sich
// wie ein und derselbe Buchungs-Ablauf anfühlen.
import styles from './TerminKalender.module.css'
import eigene from './WorkshopBuchung.module.css'

/**
 * Platz-Reservierung für den nächsten Workshop (termine.events[0]) – öffnet
 * sich im Overlay (TerminOverlay.tsx) über jeden Link auf "#workshop-buchen".
 * Speichern + Bestätigungsmails übernimmt die Edge Function
 * submit-workshop-buchung; bezahlt wird danach direkt bei Jasmin.
 */

const E_MAIL_MUSTER = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function WorkshopBuchung({ onClose }: { onClose?: () => void }) {
  const event = termine.events[0]
  const [daten, setDaten] = useState({ vorname: '', nachname: '', email: '', telefon: '', nachricht: '', website: '' })
  const [plaetze, setPlaetze] = useState(1)
  const [datenschutz, setDatenschutz] = useState(false)
  const [fehler, setFehler] = useState<Record<string, string>>({})
  const [sendet, setSendet] = useState(false)
  const [fertig, setFertig] = useState(false)

  if (!event) {
    return (
      <div className={styles.main}>
        <h2 id="workshop-titel" className={styles.schrittTitel}>
          Gerade ist kein Workshop geplant.
        </h2>
      </div>
    )
  }

  function pruefen(): boolean {
    const f: Record<string, string> = {}
    if (!daten.vorname.trim()) f.vorname = 'Bitte Vornamen angeben.'
    if (!daten.nachname.trim()) f.nachname = 'Bitte Nachnamen angeben.'
    if (!E_MAIL_MUSTER.test(daten.email.trim())) f.email = 'Bitte eine gültige E-Mail-Adresse angeben.'
    if (daten.telefon.replace(/[^0-9]/g, '').length < 6) f.telefon = 'Bitte eine gültige Telefonnummer angeben.'
    if (!datenschutz) f.datenschutz = 'Bitte der Datenschutzerklärung zustimmen.'
    setFehler(f)
    return Object.keys(f).length === 0
  }

  async function absenden(e: FormEvent) {
    e.preventDefault()
    if (!event || sendet || !pruefen()) return
    setSendet(true)
    try {
      await bucheWorkshop({
        ...daten,
        eventSlug: event.slug,
        eventDatum: `${event.date}, ${event.time}`,
        eventTitel: event.title,
        plaetze,
        datenschutzAkzeptiert: datenschutz,
      })
      setFertig(true)
    } catch (err) {
      const status = err instanceof BuchungsFehler ? err.status : undefined
      setFehler({
        senden:
          status === 429
            ? 'Zu viele Versuche – bitte in ein paar Minuten erneut versuchen.'
            : 'Das hat leider nicht geklappt. Bitte versuch es noch einmal.',
      })
    } finally {
      setSendet(false)
    }
  }

  const feldKlasse = (name: string) => [styles.input, fehler[name] && styles.inputFehler].filter(Boolean).join(' ')

  return (
    <div className={styles.layout}>
      <aside className={styles.info}>
        <span className={styles.eyebrow}>{workshopBuchung.eyebrow}</span>
        <h2 id="workshop-titel" className={styles.titel}>
          {event.title}
        </h2>
        <ul className={styles.fakten}>
          <li>
            {event.date}, {event.time}
          </li>
          <li>{event.location}</li>
          <li>{event.price}</li>
        </ul>
      </aside>

      <div className={styles.main}>
        {fertig ? (
          <div className={styles.fertig}>
            <span className={styles.haken} aria-hidden="true">
              ✓
            </span>
            <h3 className={styles.fertigTitel}>{workshopBuchung.successTitle}</h3>
            <p className={styles.fertigText}>
              {plaetze === 1 ? '1 Platz' : `${plaetze} Plätze`} am <strong>{event.date}</strong> für{' '}
              {daten.vorname.trim()} {daten.nachname.trim()}. {workshopBuchung.successText}
            </p>
            {onClose && (
              <button type="button" className={styles.submit} onClick={onClose}>
                Schließen
              </button>
            )}
          </div>
        ) : (
          <form className={styles.form} onSubmit={absenden} noValidate>
            <h3 className={styles.schrittTitel}>{workshopBuchung.formTitle}</h3>

            <div className={eigene.plaetze}>
              <span className={styles.label}>{workshopBuchung.plaetzeLabel}</span>
              <div className={eigene.stepper}>
                <button
                  type="button"
                  className={eigene.stepBtn}
                  onClick={() => setPlaetze((n) => Math.max(1, n - 1))}
                  disabled={plaetze <= 1}
                  aria-label="Einen Platz weniger"
                >
                  −
                </button>
                <span className={eigene.anzahl} aria-live="polite">
                  {plaetze}
                </span>
                <button
                  type="button"
                  className={eigene.stepBtn}
                  onClick={() => setPlaetze((n) => Math.min(MAX_PLAETZE, n + 1))}
                  disabled={plaetze >= MAX_PLAETZE}
                  aria-label="Einen Platz mehr"
                >
                  +
                </button>
              </div>
            </div>

            <div className={styles.reihe}>
              <label className={styles.feld}>
                <span className={styles.label}>Vorname</span>
                <input
                  className={feldKlasse('vorname')}
                  autoComplete="given-name"
                  value={daten.vorname}
                  onChange={(e) => setDaten({ ...daten, vorname: e.target.value })}
                />
                {fehler.vorname && <span className={styles.err}>{fehler.vorname}</span>}
              </label>
              <label className={styles.feld}>
                <span className={styles.label}>Nachname</span>
                <input
                  className={feldKlasse('nachname')}
                  autoComplete="family-name"
                  value={daten.nachname}
                  onChange={(e) => setDaten({ ...daten, nachname: e.target.value })}
                />
                {fehler.nachname && <span className={styles.err}>{fehler.nachname}</span>}
              </label>
            </div>

            <div className={styles.reihe}>
              <label className={styles.feld}>
                <span className={styles.label}>E-Mail</span>
                <input
                  className={feldKlasse('email')}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={daten.email}
                  onChange={(e) => setDaten({ ...daten, email: e.target.value })}
                />
                {fehler.email && <span className={styles.err}>{fehler.email}</span>}
              </label>
              <label className={styles.feld}>
                <span className={styles.label}>Telefon</span>
                <input
                  className={feldKlasse('telefon')}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={daten.telefon}
                  onChange={(e) => setDaten({ ...daten, telefon: e.target.value })}
                />
                {fehler.telefon && <span className={styles.err}>{fehler.telefon}</span>}
              </label>
            </div>

            <label className={styles.feld}>
              <span className={styles.label}>{workshopBuchung.nachrichtLabel}</span>
              <textarea
                className={styles.input}
                rows={3}
                value={daten.nachricht}
                onChange={(e) => setDaten({ ...daten, nachricht: e.target.value })}
              />
            </label>

            {/* Honeypot – für Menschen unsichtbar */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={daten.website}
              onChange={(e) => setDaten({ ...daten, website: e.target.value })}
              className={styles.honeypot}
            />

            <label className={styles.consent}>
              <input type="checkbox" checked={datenschutz} onChange={(e) => setDatenschutz(e.target.checked)} />
              <span>
                Ich bin einverstanden, dass meine Angaben zur Reservierung verarbeitet werden (
                <a href={withBase('/datenschutz')} target="_blank" rel="noopener">
                  Datenschutz
                </a>
                ).
              </span>
            </label>
            {fehler.datenschutz && <p className={styles.err}>{fehler.datenschutz}</p>}
            {fehler.senden && (
              <p className={styles.err} role="alert">
                {fehler.senden}
              </p>
            )}

            <div className={styles.aktionen}>
              <span />
              <button type="submit" className={styles.submit} disabled={sendet}>
                {sendet ? 'Wird reserviert …' : workshopBuchung.submit}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
