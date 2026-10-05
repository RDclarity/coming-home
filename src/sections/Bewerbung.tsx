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

        <ol className={styles.steps}>
          {bewerbung.steps.map((step, index) => (
            <Reveal as="li" key={step.title} className={styles.step} delay={index * 100}>
              <span className={styles.stepNum}>{index + 1}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepText}>{step.text}</p>
            </Reveal>
          ))}
        </ol>

        <Reveal className={styles.action} delay={200}>
          <Button size="lg" onClick={oeffneTerminOverlay} style={{ backgroundColor: 'var(--c-key1)', color: 'var(--c-dark)' }}>
            {bewerbung.cta}
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
