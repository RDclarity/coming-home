import { Button } from '../components/Button'
import { Eyebrow } from '../components/Eyebrow'
import { Reveal } from '../components/Reveal'
import { reise } from '../data/site'
import styles from './Reise.module.css'

export function Reise() {
  return (
    <section id="dein-weg" className={styles.sec}>
      <div className={styles.inner}>
        <Reveal className={styles.head}>
          <Eyebrow>{reise.eyebrow}</Eyebrow>
          <h2 className={styles.heading}>{reise.heading}</h2>
          <p className={styles.lead}>{reise.lead}</p>
        </Reveal>

        <div className={styles.steps}>
          {reise.steps.map((step) => (
            <Reveal as="article" key={step.num} className={styles.step}>
              <div className={styles.aside}>
                <span className={styles.number}>{step.num}</span>
                <span className={styles.keyword}>{step.keyword}</span>
              </div>

              <div className={styles.body}>
                {'note' in step && step.note && <span className={styles.note}>{step.note}</span>}
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepText}>{step.text}</p>
                <ul className={styles.offers}>
                  {step.offers.map((offer) => (
                    <li key={offer} className={styles.offer}>
                      <span className={styles.tick} aria-hidden="true" />
                      {offer}
                    </li>
                  ))}
                </ul>
                <Button href={step.cta.href} variant="outline">
                  {step.cta.label}
                </Button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
