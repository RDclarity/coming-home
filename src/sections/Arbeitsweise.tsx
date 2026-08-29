import { Fragment } from 'react'
import { Eyebrow } from '../components/Eyebrow'
import { Reveal } from '../components/Reveal'
import { arbeitsweise } from '../data/site'
import styles from './Arbeitsweise.module.css'

export function Arbeitsweise() {
  return (
    <section className={styles.sec}>
      <div className={styles.inner}>
        <Reveal className={styles.head}>
          <Eyebrow align="center">{arbeitsweise.eyebrow}</Eyebrow>
          <h2 className={styles.heading}>{arbeitsweise.heading}</h2>
        </Reveal>

        <div className={styles.moment}>
          {/* Drei mitatmende Ringe – der Rhythmus folgt einem ruhigen Atemzug. */}
          <Reveal className={styles.ringWrap}>
            <span className={styles.ring} aria-hidden="true" />
            <span className={`${styles.ring} ${styles.ring2}`} aria-hidden="true" />
            <span className={`${styles.ring} ${styles.ring3}`} aria-hidden="true" />
            <span className={styles.halo} aria-hidden="true" />
          </Reveal>

          <Reveal className={styles.invite} delay={120}>
            <span className={styles.inviteEyebrow}>{arbeitsweise.inviteEyebrow}</span>
            <div className={styles.inviteBody}>
              {arbeitsweise.inviteLines.map((group, groupIndex) => (
                <Fragment key={group.join('-')}>
                  {groupIndex > 0 && <span className={styles.inviteGap} aria-hidden="true" />}
                  {group.map((line) => (
                    <p key={line} className={styles.inviteLine}>
                      {line}
                    </p>
                  ))}
                </Fragment>
              ))}
            </div>
          </Reveal>
        </div>

        <div className={styles.grid}>
          {arbeitsweise.cards.map((card, index) => (
            <Reveal key={card.title} className={styles.card} delay={index * 90}>
              <span className={styles.glyph} aria-hidden="true">
                {card.glyph}
              </span>
              <h3 className={styles.title}>{card.title}</h3>
              <p className={styles.text}>{card.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
