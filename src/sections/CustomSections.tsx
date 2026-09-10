import { customSections } from '../data/customSections'
import { Reveal } from '../components/Reveal'
import styles from './CustomSections.module.css'

/**
 * Rendert die Bereiche, die Jasmin selbst im Website-Editor (Backend → Tab
 * "Website") aus fertigen Bausteinen zusammengestellt hat – siehe
 * data/customSections.ts. Leeres Array = rendert nichts, ganz normal.
 */
export function CustomSections() {
  if (customSections.length === 0) return null

  return (
    <>
      {customSections.map((section) => {
        if (section.blockType === 'quote') {
          return (
            <section key={section.id} className={styles.quoteSec}>
              <Reveal className={styles.quoteInner}>
                <p className={styles.quoteText}>„{section.content.quote}"</p>
                {section.content.attribution && (
                  <p className={styles.quoteAttribution}>{section.content.attribution}</p>
                )}
              </Reveal>
            </section>
          )
        }

        if (section.blockType === 'image_text') {
          return (
            <section key={section.id} className={styles.imageTextSec}>
              <div className={styles.imageTextInner}>
                {section.content.imageUrl && (
                  <Reveal className={styles.imageWrap}>
                    <img src={section.content.imageUrl} alt="" loading="lazy" />
                  </Reveal>
                )}
                <Reveal className={styles.imageTextBody}>
                  {section.content.heading && <h2 className={styles.heading}>{section.content.heading}</h2>}
                  <p className={styles.body}>{section.content.body}</p>
                </Reveal>
              </div>
            </section>
          )
        }

        // 'text'
        return (
          <section key={section.id} className={styles.textSec}>
            <Reveal className={styles.textInner}>
              {section.content.heading && <h2 className={styles.heading}>{section.content.heading}</h2>}
              <p className={styles.body}>{section.content.body}</p>
            </Reveal>
          </section>
        )
      })}
    </>
  )
}
