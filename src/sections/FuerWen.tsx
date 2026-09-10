import { Eyebrow } from '../components/Eyebrow'
import { Reveal } from '../components/Reveal'
import { fuerWen } from '../data/site'
import styles from './FuerWen.module.css'

export function FuerWen() {
  return (
    <section id="fuer-wen" className={styles.sec}>
      <div className={styles.inner}>
        <Reveal className={styles.head}>
          <Eyebrow>{fuerWen.eyebrow}</Eyebrow>
          <h2 className={styles.heading}>{fuerWen.heading}</h2>
        </Reveal>

        <div className={styles.list}>
          {fuerWen.statements.map((statement, index) => (
            <Reveal as="p" key={statement} className={styles.statement} delay={index * 70}>
              {statement}
            </Reveal>
          ))}
        </div>

        <Reveal as="p" className={styles.closing}>
          {fuerWen.closing}
        </Reveal>
      </div>
    </section>
  )
}
