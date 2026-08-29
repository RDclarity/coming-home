import { Eyebrow } from '../components/Eyebrow'
import { Reveal } from '../components/Reveal'
import { ankommen } from '../data/site'
import styles from './Ankommen.module.css'

export function Ankommen() {
  return (
    <section className={styles.sec}>
      <div className={styles.inner}>
        <div className={styles.textBlock}>
          <Reveal>
            <Eyebrow>{ankommen.eyebrow}</Eyebrow>
            <h2 className={styles.heading}>{ankommen.heading}</h2>
            <p className={styles.lead}>{ankommen.lead}</p>
          </Reveal>

          <ul className={styles.list}>
            {ankommen.items.map((item, index) => (
              <Reveal as="li" key={item} className={styles.item} delay={index * 90}>
                <span className={styles.dot} aria-hidden="true" />
                {item}
              </Reveal>
            ))}
          </ul>

          <Reveal as="p" className={styles.closingAccent}>
            {ankommen.closing}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
