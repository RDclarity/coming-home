import { useEffect, useMemo, useState } from 'react'
import { fetchPageViews, type PageView } from '../../lib/analytics'
import styles from './Statistik.module.css'

type Zeitraum = 'woche' | 'monat' | 'jahr'

const ZEITRAUM_TAGE: Record<Zeitraum, number> = {
  woche: 7,
  monat: 30,
  jahr: 365,
}

const ZEITRAUM_LABEL: Record<Zeitraum, string> = {
  woche: 'Woche',
  monat: 'Monat',
  jahr: 'Jahr',
}

type Bucket = { label: string; anzahl: number }

/** Teilt die Seitenaufrufe eines Zeitraums in Tages- (Woche/Monat) oder
 * Monats-Buckets (Jahr) auf – für den einfachen Balken-Verlauf unten. */
function bucketize(views: PageView[], zeitraum: Zeitraum, jetzt: Date): Bucket[] {
  if (zeitraum === 'jahr') {
    const monatsNamen = ['Jän', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
    const buckets: Bucket[] = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(jetzt.getFullYear(), jetzt.getMonth() - 11 + i, 1)
      return { label: monatsNamen[d.getMonth()], anzahl: 0 }
    })
    for (const v of views) {
      const d = new Date(v.viewed_at)
      const diffMonate = (jetzt.getFullYear() - d.getFullYear()) * 12 + (jetzt.getMonth() - d.getMonth())
      const index = 11 - diffMonate
      if (index >= 0 && index < 12) buckets[index].anzahl++
    }
    return buckets
  }

  const tage = ZEITRAUM_TAGE[zeitraum]
  const buckets: Bucket[] = Array.from({ length: tage }, (_, i) => {
    const d = new Date(jetzt)
    d.setDate(d.getDate() - (tage - 1 - i))
    return { label: d.toLocaleDateString('de-AT', { day: '2-digit', month: '2-digit' }), anzahl: 0 }
  })
  const heuteStart = new Date(jetzt.getFullYear(), jetzt.getMonth(), jetzt.getDate())
  for (const v of views) {
    const d = new Date(v.viewed_at)
    const dStart = new Date(d.getFullYear(), d.getMonth(), d.getDate())
    const diffTage = Math.round((heuteStart.getTime() - dStart.getTime()) / 86_400_000)
    const index = tage - 1 - diffTage
    if (index >= 0 && index < tage) buckets[index].anzahl++
  }
  return buckets
}

/** Einfacher Balkenverlauf als reines SVG, kein Diagramm-Paket nötig. */
function Verlauf({ buckets }: { buckets: Bucket[] }) {
  const [hover, setHover] = useState<number | null>(null)
  const W = 900
  const H = 220
  const pad = { l: 32, r: 8, t: 12, b: 26 }
  const max = Math.max(1, ...buckets.map((b) => b.anzahl))
  const iw = (W - pad.l - pad.r) / buckets.length
  const bw = Math.min(20, Math.max(3, iw - 4))
  const y = (v: number) => pad.t + (H - pad.t - pad.b) * (1 - v / max)
  const zeigeJedesLabel = buckets.length <= 14

  return (
    <div className={styles.chartWrap}>
      <svg viewBox={`0 0 ${W} ${H}`} className={styles.chart} role="img" aria-label="Seitenaufrufe im Zeitverlauf">
        {[0, 0.5, 1].map((f) => (
          <g key={f}>
            <line x1={pad.l} x2={W - pad.r} y1={y(max * f)} y2={y(max * f)} stroke="#0c0c0c" strokeOpacity="0.08" />
            <text x={pad.l - 6} y={y(max * f) + 4} textAnchor="end" fontSize="10" fill="#0c0c0c99">
              {Math.round(max * f)}
            </text>
          </g>
        ))}
        {buckets.map((b, i) => {
          const x0 = pad.l + i * iw + (iw - bw) / 2
          return (
            <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <rect x={pad.l + i * iw} y={pad.t} width={iw} height={H - pad.t - pad.b} fill="transparent" />
              <rect
                x={x0}
                y={y(b.anzahl)}
                width={bw}
                height={Math.max(0, H - pad.b - y(b.anzahl))}
                fill="var(--c-key1)"
                opacity={hover === null || hover === i ? 1 : 0.45}
              />
              {(zeigeJedesLabel || i % Math.ceil(buckets.length / 10) === 0) && (
                <text x={pad.l + i * iw + iw / 2} y={H - 8} textAnchor="middle" fontSize="10" fill="#0c0c0c99">
                  {b.label}
                </text>
              )}
            </g>
          )
        })}
      </svg>
      {hover !== null && (
        <div
          className={styles.tooltip}
          style={{ left: `${((pad.l + hover * iw + iw / 2) / W) * 100}%` }}
        >
          <strong>{buckets[hover].label}</strong> · {buckets[hover].anzahl} Aufrufe
        </div>
      )}
    </div>
  )
}

type AggregatEintrag = { label: string; anzahl: number }

/** Zählt pro Sitzung (nicht pro Aufruf) einen Wert – sonst würde jemand, der
 * zehn Seiten anschaut, die Auswertung zehnfach verzerren. */
function proSitzungAggregieren(views: PageView[], feld: 'geraet' | 'quelle'): AggregatEintrag[] {
  const wertProSitzung = new Map<string, string>()
  for (const v of views) {
    if (!wertProSitzung.has(v.session_id)) {
      wertProSitzung.set(v.session_id, v[feld] || (feld === 'geraet' ? 'Unbekannt' : 'Direkt'))
    }
  }
  const zaehler = new Map<string, number>()
  for (const wert of wertProSitzung.values()) zaehler.set(wert, (zaehler.get(wert) ?? 0) + 1)
  return [...zaehler.entries()].sort((a, b) => b[1] - a[1]).map(([label, anzahl]) => ({ label, anzahl }))
}

function topSeiten(views: PageView[], n = 8): AggregatEintrag[] {
  const zaehler = new Map<string, number>()
  for (const v of views) zaehler.set(v.path, (zaehler.get(v.path) ?? 0) + 1)
  const sortiert = [...zaehler.entries()].sort((a, b) => b[1] - a[1])
  const top: AggregatEintrag[] = sortiert.slice(0, n).map(([label, anzahl]) => ({ label, anzahl }))
  const rest = sortiert.slice(n).reduce((sum, [, anzahl]) => sum + anzahl, 0)
  if (rest > 0) top.push({ label: 'Sonstige', anzahl: rest })
  return top
}

function BalkenListe({ titel, eintraege }: { titel: string; eintraege: AggregatEintrag[] }) {
  const max = Math.max(1, ...eintraege.map((e) => e.anzahl))
  return (
    <div className={styles.panel}>
      <p className={styles.panelTitle}>{titel}</p>
      {eintraege.length === 0 ? (
        <p className={styles.empty}>Noch keine Daten im gewählten Zeitraum.</p>
      ) : (
        <div className={styles.balkenListe}>
          {eintraege.map((e) => (
            <div key={e.label} className={styles.balkenZeile}>
              <div className={styles.balkenKopf}>
                <span className={styles.balkenLabel}>{e.label}</span>
                <span className={styles.balkenWert}>{e.anzahl}</span>
              </div>
              <div className={styles.balkenSpur}>
                <div className={styles.balkenFuellung} style={{ width: `${(e.anzahl / max) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function Statistik() {
  const [zeitraum, setZeitraum] = useState<Zeitraum>('woche')
  const [views, setViews] = useState<PageView[]>([])
  const [laden, setLaden] = useState(true)
  const [fehler, setFehler] = useState<string | null>(null)

  useEffect(() => {
    const seit = new Date()
    seit.setDate(seit.getDate() - 365)
    fetchPageViews(seit)
      .then(setViews)
      .catch(() => setFehler('Statistik konnte nicht geladen werden.'))
      .finally(() => setLaden(false))
  }, [])

  const jetzt = useMemo(() => new Date(), [])

  const viewsImZeitraum = useMemo(() => {
    const seit = new Date(jetzt)
    seit.setDate(seit.getDate() - ZEITRAUM_TAGE[zeitraum])
    return views.filter((v) => new Date(v.viewed_at) >= seit)
  }, [views, zeitraum, jetzt])

  const buckets = useMemo(() => bucketize(viewsImZeitraum, zeitraum, jetzt), [viewsImZeitraum, zeitraum, jetzt])
  const besucher = useMemo(() => new Set(viewsImZeitraum.map((v) => v.session_id)).size, [viewsImZeitraum])

  if (laden) return <p className={styles.empty}>Statistik wird geladen …</p>
  if (fehler) return <p className={styles.empty}>{fehler}</p>

  return (
    <div>
      <div className={styles.kopfzeile}>
        <div className={styles.filters}>
          {(['woche', 'monat', 'jahr'] as Zeitraum[]).map((z) => (
            <button
              key={z}
              type="button"
              className={[styles.filterBtn, zeitraum === z && styles.filterBtnActive].filter(Boolean).join(' ')}
              onClick={() => setZeitraum(z)}
            >
              {ZEITRAUM_LABEL[z]}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.kennzahlen}>
        <div className={styles.kennzahl}>
          <p className={styles.kennzahlLabel}>Seitenaufrufe</p>
          <p className={styles.kennzahlWert}>{viewsImZeitraum.length}</p>
        </div>
        <div className={styles.kennzahl}>
          <p className={styles.kennzahlLabel}>Besucher (eindeutige Sitzungen)</p>
          <p className={styles.kennzahlWert}>{besucher}</p>
        </div>
      </div>

      <div className={styles.panel}>
        {viewsImZeitraum.length === 0 ? (
          <p className={styles.empty}>Noch keine Besuchsdaten im gewählten Zeitraum.</p>
        ) : (
          <Verlauf buckets={buckets} />
        )}
      </div>

      {viewsImZeitraum.length > 0 && (
        <div className={styles.panelGrid}>
          <BalkenListe titel="Woher die Besucher:innen kommen" eintraege={proSitzungAggregieren(viewsImZeitraum, 'quelle')} />
          <BalkenListe titel="Geräte" eintraege={proSitzungAggregieren(viewsImZeitraum, 'geraet')} />
          <BalkenListe titel="Meistbesuchte Seiten" eintraege={topSeiten(viewsImZeitraum)} />
        </div>
      )}
    </div>
  )
}
