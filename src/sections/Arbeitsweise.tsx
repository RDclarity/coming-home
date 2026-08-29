import { Fragment } from 'react'
import { Eyebrow } from '../components/Eyebrow'
import { Reveal } from '../components/Reveal'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { arbeitsweise } from '../data/site'
import styles from './Arbeitsweise.module.css'

// Positionen der 4 Marker auf dem Ring, im Uhrzeigersinn ab 12 Uhr – deckt
// sich mit der Zeichenrichtung des SVG-Kreises weiter unten.
const MARKER_POSITIONS = [
  { top: '0%', left: '50%' },
  { top: '50%', left: '100%' },
  { top: '100%', left: '50%' },
  { top: '50%', left: '0%' },
]

const RADIUS = 90
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

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
          {/* Der Ring baut sich beim Runterscrollen auf: Je weiter man liest,
              desto mehr von Körper → Atem → Berührung → Integration ist
              „gezeichnet" – als visuelles Echo der 4 Karten weiter unten. */}
          <div className={styles.ringWrap} ref={ref} aria-hidden="true">
            <span className={styles.halo} />
            <svg className={styles.progressSvg} viewBox="0 0 200 200">
              <circle className={styles.track} cx="100" cy="100" r={RADIUS} />
              <circle
                className={styles.progressCircle}
                cx="100"
                cy="100"
                r={RADIUS}
                style={{
                  strokeDasharray: CIRCUMFERENCE,
                  strokeDashoffset: CIRCUMFERENCE * (1 - progress),
                }}
              />
            </svg>
            {arbeitsweise.cards.map((card, index) => {
              const threshold = index / arbeitsweise.cards.length
              const active = progress >= threshold - 0.015
              return (
                <span
                  key={card.title}
                  className={[styles.marker, active && styles.markerActive]
                    .filter(Boolean)
                    .join(' ')}
                  style={MARKER_POSITIONS[index]}
                >
                  <span className={styles.markerGlyph}>{card.glyph}</span>
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
