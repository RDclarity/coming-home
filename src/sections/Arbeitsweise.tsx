import { Fragment, type CSSProperties } from 'react'
import { Eyebrow } from '../components/Eyebrow'
import { Reveal } from '../components/Reveal'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { arbeitsweise } from '../data/site'
import styles from './Arbeitsweise.module.css'

// Positionen der 4 Marker rund um die Ringe, im Uhrzeigersinn ab 12 Uhr.
const MARKER_POSITIONS = [
  { top: '2%', left: '50%' },
  { top: '50%', left: '98%' },
  { top: '98%', left: '50%' },
  { top: '50%', left: '2%' },
]

// Ziel-Größe jedes Rings – von innen (klein, nah an der Mitte) nach außen
// (groß, an den Rand reichend). Jeder Ring „wächst" beim Runterscrollen aus
// der Mitte heraus auf diese Größe.
const RING_SCALES = [0.36, 0.58, 0.8, 1.02]

// Scroll-Fenster jedes Rings: Ring 0 beginnt sofort (0.0), Ring 3 endet
// deutlich vor Ende der Sektion (0.85) – bewusst großzügig überlappend und
// früh startend, damit auf kleinen/mobilen Viewports (kurzer sichtbarer
// Scrollweg) trotzdem die volle Animation sichtbar abläuft, statt schon
// "fertig" zu sein, bevor man den Ring überhaupt sieht.
const RING_WINDOW = 0.4
const RING_STEP = 0.15

function localProgress(progress: number, index: number): number {
  const start = index * RING_STEP
  const end = start + RING_WINDOW
  return Math.min(1, Math.max(0, (progress - start) / (end - start)))
}

export function Arbeitsweise() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>()

  return (
    <section className={styles.sec}>
      <div className={styles.inner}>
        <Reveal className={styles.head}>
          <Eyebrow align="center">{arbeitsweise.eyebrow}</Eyebrow>
          <h2 className={styles.heading}>{arbeitsweise.heading}</h2>
        </Reveal>

        <div className={styles.moment}>
          {/* Beim Runterscrollen wächst aus der Mitte Ring um Ring nach außen
              (gekippt, wie Planetenringe – echte CSS-3D-Transforms, kein Bild).
              Sobald ein Ring seine Zielgröße erreicht, „poppt" das dazugehörige
              Element mit einem 3D-Flip an seiner Position auf – als visuelles
              Echo von Körper → Atem → Berührung → Integration weiter unten. */}
          <div className={styles.ringWrap} ref={ref} aria-hidden="true">
            <span className={styles.halo} />

            {arbeitsweise.cards.map((card, index) => {
              const local = localProgress(progress, index)
              const scale = Math.max(local, 0.001) * RING_SCALES[index]
              return (
                <span
                  key={`ring-${card.title}`}
                  className={[styles.growRing, index === arbeitsweise.cards.length - 1 && styles.growRingOuter]
                    .filter(Boolean)
                    .join(' ')}
                  style={
                    {
                      opacity: local * 0.5,
                      transform: `scale3d(${scale}, ${scale}, 1) rotateX(60deg)`,
                    } as CSSProperties
                  }
                />
              )
            })}

            {arbeitsweise.cards.map((card, index) => {
              const local = localProgress(progress, index)
              const translateZ = -60 + 96 * local
              const rotateY = -110 * (1 - local)
              const scale = 0.2 + 0.8 * local
              return (
                <span
                  key={`marker-${card.title}`}
                  className={styles.marker3d}
                  style={{
                    ...MARKER_POSITIONS[index],
                    opacity: local,
                    transform: `translate(-50%, -50%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  }}
                >
                  <span className={styles.markerInner}>
                    <span className={styles.markerGlyph}>{card.glyph}</span>
                  </span>
                </span>
              )
            })}
          </div>

          <Reveal className={styles.invite} delay={120}>
            <span className={styles.inviteEyebrow}>{arbeitsweise.inviteEyebrow}</span>
            <div className={styles.inviteBody}>
              {arbeitsweise.inviteLines.map((group, groupIndex) => (
                <Fragment key={group.join('-')}>
                  {groupIndex > 0 && <span className={styles.inviteGap} aria-hidden="true" />}
                  {group.map((line) => (
                    <p key={line} className={styles.inviteLine}>
                      {line}
                    </p>
                  ))}
                </Fragment>
              ))}
            </div>
          </Reveal>
        </div>

        <div className={styles.grid}>
          {arbeitsweise.cards.map((card, index) => (
            <Reveal key={card.title} className={styles.card} delay={index * 90}>
              <span className={styles.glyph} aria-hidden="true">
                {card.glyph}
              </span>
              <h3 className={styles.title}>{card.title}</h3>
              <p className={styles.text}>{card.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
