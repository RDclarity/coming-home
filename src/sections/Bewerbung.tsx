import { Eyebrow } from '../components/Eyebrow'
import { MultiStepBewerbungForm } from '../components/MultiStepBewerbungForm'
import { Reveal } from '../components/Reveal'
import { bewerbung } from '../data/site'
import styles from './Bewerbung.module.css'

export function Bewerbung() {
  return (
    <section id="kennenlernen" className={styles.sec}>
      <div className={styles.inner}>
        <Reveal className={styles.left}>
          <Eyebrow>{bewerbung.eyebrow}</Eyebrow>
          <h2 className={styles.heading}>{bewerbung.heading}</h2>
          <p className={styles.intro}>{bewerbung.intro}</p>
          <p className={styles.intro2}>{bewerbung.intro2}</p>
        </Reveal>

        <Reveal className={styles.card} delay={100}>
          <h3 className={styles.formTitle}>{bewerbung.formTitle}</h3>
          <MultiStepBewerbungForm />
        </Reveal>
      </div>
    </section>
  )
}
