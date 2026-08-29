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
              const threshold = index / arbeitsweise.cards.length
              const active = progress >= threshold - 0.015
              return (
                <span
                  key={`ring-${card.title}`}
                  className={[
                    styles.growRing,
                    index === arbeitsweise.cards.length - 1 && styles.growRingOuter,
                    active && styles.growRingActive,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={
                    {
                      '--ring-scale': RING_SCALES[index],
                      transitionDelay: `${index * 90}ms`,
                    } as CSSProperties
                  }
                />
              )
            })}

            {arbeitsweise.cards.map((card, index) => {
              const threshold = index / arbeitsweise.cards.length
              const active = progress >= threshold - 0.015
              return (
                <span
                  key={`marker-${card.title}`}
                  className={[styles.marker3d, active && styles.marker3dActive]
                    .filter(Boolean)
                    .join(' ')}
                  style={{ ...MARKER_POSITIONS[index], transitionDelay: `${index * 90 + 160}ms` }}
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
