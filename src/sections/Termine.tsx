import { Button } from '../components/Button'
import { Eyebrow } from '../components/Eyebrow'
import { Reveal } from '../components/Reveal'
import { termine } from '../data/site'
import styles from './Termine.module.css'

export function Termine() {
  return (
    <section id="termine" className={styles.sec}>
      <div className={styles.inner}>
        <Reveal className={styles.head}>
          <Eyebrow align="center">{termine.eyebrow}</Eyebrow>
          <h2 className={styles.heading}>{termine.heading}</h2>
        </Reveal>

        <div className={styles.list}>
          {termine.events.map((event, index) => (
            <Reveal
              key={`${event.date}-${event.title}`}
              className={styles.card}
              delay={Math.min(index, 3) * 80}
            >
              <div className={styles.when}>
                <span className={styles.date}>{event.date}</span>
                <span className={styles.time}>{event.time}</span>
              </div>

              <div>
                <h3 className={styles.title}>{event.title}</h3>
                <p className={styles.desc}>{event.desc}</p>
                <div className={styles.meta}>
                  <span>{event.location}</span>
                  <span className={styles.sep} aria-hidden="true">
                    ·
                  </span>
                  <span>{event.seats}</span>
                </div>
              </div>

              <div className={styles.action}>
                <span className={styles.price}>{event.price}</span>
                <Button href="/#kontakt" variant="outline" size="sm">
                  {termine.reserveLabel}
                </Button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
