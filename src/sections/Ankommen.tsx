import { Eyebrow } from '../components/Eyebrow'
import { Reveal } from '../components/Reveal'
import { ankommen } from '../data/site'
import styles from './Ankommen.module.css'

/** Setzt den zweiten Satz der Überschrift kursiv („… Wenig im *Körper.*") –
 *  ohne Satzgrenze bleibt die Überschrift einfach aufrecht. */
function Heading({ text }: { text: string }) {
  const cut = text.indexOf('. ')
  if (cut === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, cut + 1)} <em className={styles.headingEm}>{text.slice(cut + 2)}</em>
    </>
  )
}

export function Ankommen() {
  return (
    <section id="ankommen" className={styles.sec}>
      <div className={styles.inner}>
        {/* Links: Label + große Überschrift vor einem zarten Torbogen –
            rechts: die drei Sätze und die Schlusszeile als ruhige Karte.
            Mobil einspaltig untereinander. */}
        <Reveal className={styles.intro}>
          <span className={styles.archLine} aria-hidden="true" />
          <Eyebrow>{ankommen.eyebrow}</Eyebrow>
          <h2 className={styles.heading}>
            <Heading text={ankommen.heading} />
          </h2>
        </Reveal>

        <div className={styles.statements}>
          <ul className={styles.list}>
            {ankommen.items.map((item, index) => (
              <Reveal as="li" key={item} className={styles.item} delay={index * 90}>
                <span className={styles.dot} aria-hidden="true" />
                <span>{item}</span>
              </Reveal>
            ))}
          </ul>

          <Reveal className={styles.closing} delay={280}>
            <span className={styles.closingMark} aria-hidden="true" />
            <p className={styles.closingText}>{ankommen.closing}</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
