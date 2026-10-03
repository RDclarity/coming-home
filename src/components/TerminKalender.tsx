import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import {
  BUCHBAR_TAGE,
  BuchungsFehler,
  DAUER_MINUTEN,
  ZEITFENSTER_TEXT,
  ZEITZONE,
  bucheTermin,
  fetchBelegteSlots,
  slotsFuerTag,
  tagInWien,
  tagPlus,
  tagSchluessel,
  uhrzeitInWien,
  wochentag,
  type Tag,
} from '../lib/termin'
import { withBase } from '../lib/url'
import styles from './TerminKalender.module.css'

/**
 * Direktbuchung fürs kostenlose Kennenlerngespräch (20 Min., Telefon,
 * Mo–Fr 9–17 Uhr) – läuft im Overlay (TerminOverlay.tsx). Freie Slots
 * ergeben sich aus den festen Zeitfenstern (src/lib/terminZeiten.ts) minus
 * bereits vergebener Termine. Die Buchung übernimmt die Edge Function
 * submit-termin; ein eindeutiger Index auf der Startzeit verhindert
 * serverseitig, dass zwei Personen denselben Slot bekommen.
 */

type Schritt = 'termin' | 'daten' | 'fertig'
type Monat = { jahr: number; monat: number }

const E_MAIL_MUSTER = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const WOCHENTAGE = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

function gleicherTag(a: Tag | null, b: Tag | null): boolean {
  return !!a && !!b && a.jahr === b.jahr && a.monat === b.monat && a.tag === b.tag
}

function monatVergleich(a: Monat, b: Monat): number {
  return a.jahr - b.jahr || a.monat - b.monat
}

/** Tag als Datum zum Formatieren – Mittag UTC, damit keine Zeitzone den Tag verschiebt. */
function tagAlsDatum(tag: Tag): Date {
  return new Date(Date.UTC(tag.jahr, tag.monat - 1, tag.tag, 12))
}

const tagLang = (tag: Tag) =>
  tagAlsDatum(tag).toLocaleDateString('de-AT', { timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long' })
const slotLang = (d: Date) =>
  d.toLocaleDateString('de-AT', { timeZone: ZEITZONE, weekday: 'long', day: 'numeric', month: 'long' })
const zeitraum = (d: Date) => `${uhrzeitInWien(d)}–${uhrzeitInWien(new Date(d.getTime() + DAUER_MINUTEN * 60000))}`

export function TerminKalender({ onClose }: { onClose?: () => void }) {
  const [schritt, setSchritt] = useState<Schritt>('termin')
  const [jetzt] = useState(() => new Date())
  const heute = useMemo(() => tagInWien(jetzt), [jetzt])
  const letzterTag = useMemo(() => tagPlus(heute, BUCHBAR_TAGE), [heute])

  const [belegt, setBelegt] = useState<Set<number> | null>(null)
  const [monat, setMonat] = useState<Monat>({ jahr: heute.jahr, monat: heute.monat })
  const [gewaehlterTag, setGewaehlterTag] = useState<Tag | null>(null)
  const [gewaehlterSlot, setGewaehlterSlot] = useState<Date | null>(null)
  const [hinweis, setHinweis] = useState<string | null>(null)

  const [daten, setDaten] = useState({ vorname: '', nachname: '', email: '', telefon: '', wuensche: '', website: '' })
  const [datenschutz, setDatenschutz] = useState(false)
  const [fehler, setFehler] = useState<Record<string, string>>({})
  const [sendet, setSendet] = useState(false)

  // Bei jedem Schrittwechsel nach oben – sonst landet man (v. a. mobil) mitten
  // im neuen Schritt, weil das Overlay die alte Scrollposition behält.
  const layoutRef = useRef<HTMLDivElement>(null)
  const ersterSchritt = useRef(true)
  useEffect(() => {
    if (ersterSchritt.current) {
      ersterSchritt.current = false
      return
    }
    layoutRef.current?.scrollIntoView({ block: 'start' })
  }, [schritt])

  const ladeBelegt = () =>
    fetchBelegteSlots()
      .then(setBelegt)
      .catch((e) => {
        console.error('Termin: belegte Slots konnten nicht geladen werden', e)
        setBelegt(new Set())
      })

  useEffect(() => {
    ladeBelegt()
  }, [])

  /** Freie Slots je Tag – nur Tage mit mindestens einem freien Slot. */
  const freieSlots = useMemo(() => {
    const karte = new Map<string, Date[]>()
    if (!belegt) return karte
    for (let i = 0; i <= BUCHBAR_TAGE; i++) {
      const tag = tagPlus(heute, i)
      const slots = slotsFuerTag(tag, jetzt).filter((s) => !belegt.has(s.getTime()))
      if (slots.length > 0) karte.set(tagSchluessel(tag), slots)
    }
    return karte
  }, [heute, jetzt, belegt])

  // Sobald die Verfügbarkeit da ist: ersten freien Tag vorauswählen, damit
  // sofort Uhrzeiten sichtbar sind – ein Klick weniger bis zur Buchung.
  useEffect(() => {
    if (!belegt || gewaehlterTag) return
    for (let i = 0; i <= BUCHBAR_TAGE; i++) {
      const tag = tagPlus(heute, i)
      if (freieSlots.has(tagSchluessel(tag))) {
        setGewaehlterTag(tag)
        setMonat({ jahr: tag.jahr, monat: tag.monat })
        return
      }
    }
  }, [belegt, freieSlots, heute, gewaehlterTag])

  const zellen = useMemo(() => {
    const erster: Tag = { jahr: monat.jahr, monat: monat.monat, tag: 1 }
    const leerVorne = (wochentag(erster) + 6) % 7 // Woche beginnt am Montag
    const anzahl = new Date(Date.UTC(monat.jahr, monat.monat, 0)).getUTCDate()
    const liste: Array<Tag | null> = Array.from({ length: leerVorne }, () => null)
    for (let t = 1; t <= anzahl; t++) liste.push({ jahr: monat.jahr, monat: monat.monat, tag: t })
    return liste
  }, [monat])

  const kannZurueck = monatVergleich(monat, heute) > 0
  const kannVor = monatVergleich(monat, letzterTag) < 0
  const monatWechseln = (delta: number) =>
    setMonat((m) => {
      const d = new Date(Date.UTC(m.jahr, m.monat - 1 + delta, 1))
      return { jahr: d.getUTCFullYear(), monat: d.getUTCMonth() + 1 }
    })
  const monatsName = new Date(Date.UTC(monat.jahr, monat.monat - 1, 15)).toLocaleDateString('de-AT', {
    timeZone: 'UTC',
    month: 'long',
    year: 'numeric',
  })

  const slotsDesTages = gewaehlterTag ? freieSlots.get(tagSchluessel(gewaehlterTag)) ?? [] : []

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

  async function absenden(event: FormEvent) {
    event.preventDefault()
    if (!gewaehlterSlot || sendet || !pruefen()) return
    setSendet(true)
    try {
      await bucheTermin({ ...daten, beginn: gewaehlterSlot, datenschutzAkzeptiert: datenschutz })
      setSchritt('fertig')
    } catch (err) {
      const status = err instanceof BuchungsFehler ? err.status : undefined
      if (status === 409) {
        setHinweis('Dieser Termin wurde gerade vergeben. Bitte wähl eine andere Uhrzeit.')
        setGewaehlterSlot(null)
        setSchritt('termin')
        ladeBelegt()
      } else if (status === 429) {
        setFehler({ senden: 'Zu viele Versuche – bitte in ein paar Minuten erneut versuchen.' })
      } else {
        setFehler({ senden: 'Das hat leider nicht geklappt. Bitte versuch es noch einmal.' })
      }
    } finally {
      setSendet(false)
    }
  }

  const feldKlasse = (name: string) => [styles.input, fehler[name] && styles.inputFehler].filter(Boolean).join(' ')

  return (
    <div ref={layoutRef} className={styles.layout}>
      <aside className={styles.info}>
        <span className={styles.eyebrow}>Kennenlerngespräch</span>
        <h2 id="termin-titel" className={styles.titel}>
          Lass uns sprechen.
        </h2>
        <ul className={styles.fakten}>
          <li>{DAUER_MINUTEN} Minuten</li>
          <li>Telefonat – ich rufe dich an</li>
          <li>Kostenlos & unverbindlich</li>
        </ul>
        {gewaehlterSlot && schritt !== 'termin' && (
          <p className={styles.auswahl}>
            {slotLang(gewaehlterSlot)}
            <br />
            <strong>{zeitraum(gewaehlterSlot)} Uhr</strong>
          </p>
        )}
      </aside>

      <div className={styles.main}>
        {schritt === 'termin' && (
          <>
            <h3 className={styles.schrittTitel}>Tag und Uhrzeit wählen</h3>
            {hinweis && (
              <p className={styles.hinweis} role="alert">
                {hinweis}
              </p>
            )}

            <div className={styles.picker}>
              <div>
                <div className={styles.monatKopf}>
                  <span className={styles.monatName}>{monatsName}</span>
                  <div className={styles.pfeile}>
                    <button
                      type="button"
                      className={styles.pfeil}
                      disabled={!kannZurueck}
                      onClick={() => monatWechseln(-1)}
                      aria-label="Vorheriger Monat"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      className={styles.pfeil}
                      disabled={!kannVor}
                      onClick={() => monatWechseln(1)}
                      aria-label="Nächster Monat"
                    >
                      ›
                    </button>
                  </div>
                </div>

                <div className={styles.wochentage} aria-hidden="true">
                  {WOCHENTAGE.map((w) => (
                    <span key={w}>{w}</span>
                  ))}
                </div>

                <div className={styles.tage}>
                  {zellen.map((tag, i) => {
                    if (!tag) return <span key={`leer-${i}`} />
                    const frei = freieSlots.has(tagSchluessel(tag))
                    const aktiv = gleicherTag(tag, gewaehlterTag)
                    return (
                      <button
                        key={tagSchluessel(tag)}
                        type="button"
                        disabled={!frei}
                        aria-pressed={aktiv}
                        aria-label={`${tagLang(tag)}${frei ? '' : ' – nicht verfügbar'}`}
                        onClick={() => {
                          setGewaehlterTag(tag)
                          setHinweis(null)
                        }}
                        className={[
                          styles.tag,
                          frei && styles.tagFrei,
                          aktiv && styles.tagAktiv,
                          gleicherTag(tag, heute) && styles.heute,
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        {tag.tag}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className={styles.slotsSpalte}>
                {belegt === null ? (
                  <p className={styles.leise}>Freie Termine werden geladen …</p>
                ) : freieSlots.size === 0 ? (
                  <p className={styles.leise}>
                    Gerade keine freien Termine. Schreib mir gern über das{' '}
                    <a href={withBase('/#kontakt')} onClick={onClose}>
                      Kontaktformular
                    </a>
                    .
                  </p>
                ) : gewaehlterTag ? (
                  <>
                    <p className={styles.slotsTag}>{tagLang(gewaehlterTag)}</p>
                    <div className={styles.slots}>
                      {slotsDesTages.map((slot) => (
                        <button
                          key={slot.getTime()}
                          type="button"
                          className={styles.slot}
                          onClick={() => {
                            setGewaehlterSlot(slot)
                            setSchritt('daten')
                          }}
                        >
                          {uhrzeitInWien(slot)}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className={styles.leise}>Bitte zuerst einen Tag wählen.</p>
                )}
              </div>
            </div>

            <p className={styles.fussnote}>{ZEITFENSTER_TEXT} · Zeiten in österreichischer Zeit</p>
          </>
        )}

        {schritt === 'daten' && gewaehlterSlot && (
          <form className={styles.form} onSubmit={absenden} noValidate>
            <h3 className={styles.schrittTitel}>Deine Kontaktdaten</h3>

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
            </div>

            <label className={styles.feld}>
              <span className={styles.label}>Magst du mir vorab etwas erzählen? (optional)</span>
              <textarea
                className={styles.input}
                rows={3}
                value={daten.wuensche}
                onChange={(e) => setDaten({ ...daten, wuensche: e.target.value })}
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
                Ich bin einverstanden, dass meine Angaben zur Terminvereinbarung verarbeitet werden (
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
              <button type="button" className={styles.zurueck} onClick={() => setSchritt('termin')}>
                ← Zurück
              </button>
              <button type="submit" className={styles.submit} disabled={sendet}>
                {sendet ? 'Wird gebucht …' : 'Termin buchen'}
              </button>
            </div>
          </form>
        )}

        {schritt === 'fertig' && gewaehlterSlot && (
          <div className={styles.fertig}>
            <span className={styles.haken} aria-hidden="true">
              ✓
            </span>
            <h3 className={styles.fertigTitel}>Dein Termin steht.</h3>
            <p className={styles.fertigText}>
              Danke, {daten.vorname.trim()}. Ich rufe dich am <strong>{slotLang(gewaehlterSlot)}</strong> um{' '}
              <strong>{uhrzeitInWien(gewaehlterSlot)} Uhr</strong> unter {daten.telefon.trim()} an. Die Bestätigung
              ist unterwegs an {daten.email.trim()}.
            </p>
            {onClose && (
              <button type="button" className={styles.submit} onClick={onClose}>
                Schließen
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
