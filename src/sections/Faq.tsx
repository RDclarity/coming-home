import { Accordion } from '../components/Accordion'
import { Eyebrow } from '../components/Eyebrow'
import { Reveal } from '../components/Reveal'
import { faq } from '../data/site'
import styles from './Faq.module.css'

export function Faq() {
  return (
    <section id="faq" className={styles.sec}>
      <div className={styles.inner}>
        <Reveal className={styles.head}>
          <Eyebrow>{faq.eyebrow}</Eyebrow>
          <h2 className={styles.heading}>{faq.heading}</h2>
        </Reveal>

        <Reveal>
          <Accordion items={faq.items} />
        </Reveal>
      </div>
    </section>
  )
}
