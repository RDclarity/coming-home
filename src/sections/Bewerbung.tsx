import { Button } from '../components/Button'
import { Eyebrow } from '../components/Eyebrow'
import { Reveal } from '../components/Reveal'
import { bewerbung } from '../data/site'
import { oeffneTerminOverlay } from '../lib/terminOverlay'
import styles from './Bewerbung.module.css'

/** "So einfach geht's" – drei Schritte bis zum Kennenlerngespräch, ein Button.
 * Der Button öffnet den Buchungskalender (TerminOverlay). Die id bleibt
 * "kennenlernen": alle Termin-Links der Seite zeigen hierher. */
export function Bewerbung() {
  return (
    <section id="kennenlernen" className={styles.sec}>
      <div className={styles.inner}>
        <Reveal className={styles.head}>
          <Eyebrow align="center">{bewerbung.eyebrow}</Eyebrow>
          <h2 className={styles.heading}>{bewerbung.heading}</h2>
        </Reveal>

        {/* Drei kleine Torbögen mit Nummer, verbunden durch eine feine
            gestrichelte Linie – horizontal am Desktop, vertikal mobil. */}
        <ol className={styles.steps}>
          {bewerbung.steps.map((step, index) => (
            <Reveal as="li" key={step.title} className={styles.step} delay={index * 120}>
              <span className={styles.stepNum} aria-hidden="true">
                {index + 1}
              </span>
              <div className={styles.stepBody}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepText}>{step.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal className={styles.action} delay={360}>
          <Button size="lg" onClick={oeffneTerminOverlay}>
            {bewerbung.cta}
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
