import { Button } from '../components/Button'
import { Eyebrow } from '../components/Eyebrow'
import { Reveal } from '../components/Reveal'
import { termine } from '../data/site'
import { withBase } from '../lib/url'
import styles from './Termine.module.css'

/**
 * Zerlegt "24. Oktober 2026" für den Bogen-Datumsstempel in Tag ("24") und
 * Rest ("Oktober 2026"). Passt das Format nicht, bleibt das Datum als Ganzes
 * stehen – die Daten selbst werden nicht verändert.
 */
function splitDate(date: string): { day: string | null; rest: string } {
  const match = /^(\d{1,2})\.\s*(.+)$/.exec(date.trim())
  return match ? { day: match[1], rest: match[2] } : { day: null, rest: date }
}

export function Termine() {
  return (
    <section id="termine" className={styles.sec}>
      <div className={styles.inner}>
        <Reveal className={styles.head}>
          <Eyebrow align="center">{termine.eyebrow}</Eyebrow>
          <h2 className={styles.heading}>{termine.heading}</h2>
        </Reveal>

        <div className={styles.list}>
          {termine.events.map((event, index) => {
            const { day, rest } = splitDate(event.date)

            return (
              <Reveal key={`${event.date}-${event.title}`} delay={Math.min(index, 3) * 80}>
                <div className={styles.card}>
                  <div className={styles.when}>
                    <span className={styles.date}>
                      {day && <span className={styles.day}>{day}</span>}
                      <span className={styles.month}>{rest}</span>
                    </span>
                    <span className={styles.time}>{event.time}</span>
                  </div>

                  <a className={styles.contentLink} href={withBase(`/begleitung/${event.slug}`)}>
                    <h3 className={styles.title}>{event.title}</h3>
                    <p className={styles.desc}>{event.desc}</p>
                    <span className={styles.meta}>
                      <span className={styles.chip}>{event.location}</span>
                      <span className={styles.chip}>{event.seats}</span>
                    </span>
                    <span className={styles.more}>
                      Mehr erfahren
                      <span className={styles.arrow} aria-hidden="true">
                        →
                      </span>
                    </span>
                  </a>

                  <div className={styles.action}>
                    <span className={styles.price}>{event.price}</span>
                    <Button href="/#kontakt" variant="solid" size="md">
                      {termine.reserveLabel}
                    </Button>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
