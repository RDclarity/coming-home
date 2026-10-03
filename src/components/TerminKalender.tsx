import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import {
  BUCHBAR_TAGE,
  BuchungsFehler,
  DAUER_MINUTEN,
  ZEITFENSTER_TEXT,
  bucheTermin,
  fetchBelegteSlots,
  slotsFuerTag,
  tagInWien,
  tagPlus,
  tagSchluessel,
  uhrzeitInWien,
  type Tag,
} from '../lib/termin'
import styles from './TerminKalender.module.css'

/**
 * Direktbuchung fürs kostenlose Kennenlerngespräch (20 Min., Telefon,
 * Mo–Fr 9–17 Uhr) – ersetzt den alten Bewerbungsbogen (Nutzerwunsch
 * 2026-10-03: "so einfach wie möglich", echte Kalenderfunktion zum
 * Direkt-Einbuchen). Freie Slots ergeben sich aus den festen Zeitfenstern
 * (src/lib/terminZeiten.ts) minus bereits vergebener Termine – kein externer
 * Kalender-Anschluss nötig. Die Buchung selbst übernimmt die Edge Function
 * submit-termin (siehe dort); ein eindeutiger Index auf der Startzeit
 * verhindert serverseitig, dass zwei Besucher:innen denselben Slot bekommen.
 */

type Schritt = 'termin' | 'daten' | 'fertig'

const E_MAIL_MUSTER = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function gleicherTag(a: Tag | null, b: Tag | null): boolean {
  return !!a && !!b && a.jahr === b.jahr && a.monat === b.monat && a.tag === b.tag
}

function tagZuDate(tag: Tag): Date {
  return new Date(tag.jahr, tag.monat - 1, tag.tag)
}

export function TerminKalender() {
  const [schritt, setSchritt] = useState<Schritt>('termin')
  const [jetzt] = useState(() => new Date())
  const heute = useMemo(() => tagInWien(jetzt), [jetzt])
  const [belegt, setBelegt] = useState<Set<number> | null>(null)
  const [gewaehlterTag, setGewaehlterTag] = useState<Tag | null>(null)
  const [gewaehlterSlot, setGewaehlterSlot] = useState<Date | null>(null)
  const [hinweis, setHinweis] = useState<string | null>(null)
  const slotsRef = useRef<HTMLDivElement>(null)

  const [daten, setDaten] = useState({ vorname: '', nachname: '', email: '', telefon: '', wuensche: '', website: '' })
  const [datenschutz, setDatenschutz] = useState(false)
  const [fehler, setFehler] = useState<Record<string, string>>({})
  const [sendet, setSendet] = useState(false)

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

  /** Nur Tage mit mindestens einem freien Slot, als Kalender-Streifen. */
  const freieSlots = useMemo(() => {
    const karte = new Map<string, Date[]>()
    for (let i = 0; i <= BUCHBAR_TAGE; i++) {
      const tag = tagPlus(heute, i)
      const slots = slotsFuerTag(tag, jetzt).filter((s) => !belegt?.has(s.getTime()))
      if (slots.length > 0) karte.set(tagSchluessel(tag), slots)
    }
    return karte
  }, [heute, jetzt, belegt])

  const tageMitSlots = useMemo(
    () => Array.from({ length: BUCHBAR_TAGE + 1 }, (_, i) => tagPlus(heute, i)).filter((t) => freieSlots.has(tagSchluessel(t))),
    [heute, freieSlots],
  )

  const slotsDesTages = gewaehlterTag ? freieSlots.get(tagSchluessel(gewaehlterTag)) ?? [] : []

  const datumKurz = (tag: Tag) => tagZuDate(tag).toLocaleDateString('de-AT', { weekday: 'short', day: 'numeric', month: 'short' })
  const datumLang = (d: Date) => d.toLocaleDateString('de-AT', { weekday: 'long', day: 'numeric', month: 'long' })
  const zeitraum = (d: Date) => `${uhrzeitInWien(d)}–${uhrzeitInWien(new Date(d.getTime() + DAUER_MINUTEN * 60000))}`

  function tagWaehlen(tag: Tag) {
    setGewaehlterTag(tag)
    setGewaehlterSlot(null)
    setHinweis(null)
    if (window.matchMedia('(max-width: 760px)').matches) {
      setTimeout(() => slotsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
    }
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

  async function absenden(event: FormEvent) {
    event.preventDefault()
    if (!gewaehlterSlot || sendet || !pruefen()) return
    setSendet(true)
    try {
      await bucheTermin({ ...daten, beginn: gewaehlterSlot, datenschutzAkzeptiert: datenschutz })
      setSchritt('fertig')
      window.scrollTo({ top: slotsRef.current?.getBoundingClientRect().top ?? 0, behavior: 'smooth' })
    } catch (err) {
      const status = err instanceof BuchungsFehler ? err.status : undefined
      if (status === 409) {
        setHinweis('Dieser Termin wurde gerade vergeben. Bitte eine andere Uhrzeit wählen.')
        setGewaehlterSlot(null)
        setSchritt('termin')
        ladeBelegt()
      } else if (status === 429) {
        setFehler({ senden: 'Zu viele Versuche – bitte in ein paar Minuten erneut versuchen.' })
      } else {
        setFehler({ senden: 'Das hat leider nicht geklappt. Bitte erneut versuchen oder direkt schreiben.' })
      }
    } finally {
      setSendet(false)
    }
  }

  if (schritt === 'fertig' && gewaehlterSlot) {
    return (
      <div className={styles.success}>
        <span className={styles.successDot} aria-hidden="true">
          ✓
        </span>
        <h3 className={styles.successTitle}>Dein Termin steht.</h3>
        <p className={styles.successText}>
          Danke, {daten.vorname.trim()}! Ich rufe dich an am <strong>{datumLang(gewaehlterSlot)}</strong>,{' '}
          {zeitraum(gewaehlterSlot)} Uhr, unter {daten.telefon.trim()}.
        </p>
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      {schritt === 'termin' && (
        <div>
          {hinweis && (
            <p className={styles.hinweis} role="alert">
              {hinweis}
            </p>
          )}

          <div className={styles.tageStreifen} role="radiogroup" aria-label="Tag wählen">
            {belegt === null ? (
              <p className={styles.lade}>Freie Termine werden geladen …</p>
            ) : tageMitSlots.length === 0 ? (
              <p className={styles.lade}>Gerade keine freien Termine – schreib mir direkt.</p>
            ) : (
              tageMitSlots.map((tag) => {
                const aktiv = gleicherTag(tag, gewaehlterTag)
                return (
                  <button
                    key={tagSchluessel(tag)}
                    type="button"
                    role="radio"
                    aria-checked={aktiv}
                    onClick={() => tagWaehlen(tag)}
                    className={[styles.tag, aktiv && styles.tagAktiv].filter(Boolean).join(' ')}
                  >
                    {datumKurz(tag)}
                  </button>
                )
              })
            )}
          </div>

          {gewaehlterTag && (
            <div ref={slotsRef} className={styles.slots}>
              {slotsDesTages.map((slot) => {
                const aktiv = gewaehlterSlot?.getTime() === slot.getTime()
                return (
                  <button
                    key={slot.getTime()}
                    type="button"
                    aria-pressed={aktiv}
                    onClick={() => {
                      setGewaehlterSlot(slot)
                      setSchritt('daten')
                    }}
                    className={[styles.slot, aktiv && styles.slotAktiv].filter(Boolean).join(' ')}
                  >
                    {uhrzeitInWien(slot)}
                  </button>
                )
              })}
            </div>
          )}

          <p className={styles.footnote}>
            {ZEITFENSTER_TEXT} · {DAUER_MINUTEN} Min. · kostenlos & unverbindlich
          </p>
        </div>
      )}

      {schritt === 'daten' && gewaehlterSlot && (
        <form className={styles.form} onSubmit={absenden}>
          <button type="button" onClick={() => setSchritt('termin')} className={styles.change}>
            {datumLang(gewaehlterSlot)} · {zeitraum(gewaehlterSlot)} Uhr — ändern
          </button>

          <div className={styles.row}>
            <label className={styles.field}>
              <span className={styles.label}>Vorname</span>
              <input
                className={[styles.input, fehler.vorname && styles.inputFehler].filter(Boolean).join(' ')}
                autoComplete="given-name"
                value={daten.vorname}
                onChange={(e) => setDaten({ ...daten, vorname: e.target.value })}
              />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Nachname</span>
              <input
                className={[styles.input, fehler.nachname && styles.inputFehler].filter(Boolean).join(' ')}
                autoComplete="family-name"
                value={daten.nachname}
                onChange={(e) => setDaten({ ...daten, nachname: e.target.value })}
              />
            </label>
          </div>

          <label className={styles.field}>
            <span className={styles.label}>E-Mail</span>
            <input
              className={[styles.input, fehler.email && styles.inputFehler].filter(Boolean).join(' ')}
              type="email"
              autoComplete="email"
              value={daten.email}
              onChange={(e) => setDaten({ ...daten, email: e.target.value })}
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Telefon</span>
            <input
              className={[styles.input, fehler.telefon && styles.inputFehler].filter(Boolean).join(' ')}
              type="tel"
              autoComplete="tel"
              placeholder="Hier rufe ich dich an"
              value={daten.telefon}
              onChange={(e) => setDaten({ ...daten, telefon: e.target.value })}
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Magst du mir schon etwas erzählen? (optional)</span>
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
            style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}
          />

          <label className={styles.consent}>
            <input type="checkbox" checked={datenschutz} onChange={(e) => setDatenschutz(e.target.checked)} />
            <span>Ich bin einverstanden, dass meine Angaben zur Terminvereinbarung verarbeitet werden.</span>
          </label>
          {fehler.datenschutz && (
            <p className={styles.err} role="alert">
              {fehler.datenschutz}
            </p>
          )}
          {fehler.senden && (
            <p className={styles.err} role="alert">
              {fehler.senden}
            </p>
          )}

          <button type="submit" className={styles.submit} disabled={sendet}>
            {sendet ? 'Wird gebucht …' : 'Termin verbindlich buchen'}
          </button>
        </form>
      )}
    </div>
  )
}
