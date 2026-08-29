import { Fragment } from 'react'
import { Eyebrow } from '../components/Eyebrow'
import { Reveal } from '../components/Reveal'
import { ueberJasmin } from '../data/site'
import { withBase } from '../lib/url'
import styles from './UeberJasmin.module.css'

export function UeberJasmin() {
  return (
    <section id="ueber-jasmin" className={styles.sec}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <Reveal className={styles.media}>
            <figure className={styles.frame}>
              <img
                className={styles.img}
                src={withBase('/images/jasmin-headshot.webp')}
                alt="Jasmin, lachend am Fluss"
                width={1920}
                height={1920}
                loading="lazy"
              />
            </figure>
          </Reveal>

          <div className={styles.content}>
            <Reveal>
              <Eyebrow style={{ color: 'var(--c-key2)' }}>{ueberJasmin.eyebrow}</Eyebrow>
              <h2 className={styles.heading}>
                {ueberJasmin.headingBefore}
                <em className={styles.em}>{ueberJasmin.headingEm}</em>.
              </h2>
            </Reveal>

            <Reveal className={styles.paras} delay={80}>
              {ueberJasmin.paragraphs.map((text) => (
                <p key={text} className={styles.para}>
                  {text}
                </p>
              ))}

              <p className={styles.quote}>{ueberJasmin.quote}</p>

              {ueberJasmin.paragraphsAfter.map((text) => (
                <p key={text} className={styles.para}>
                  {text}
                </p>
              ))}
            </Reveal>

            <Reveal as="p" className={styles.closing} delay={140}>
              {ueberJasmin.closing}
            </Reveal>

            <Reveal className={styles.skills} delay={180}>
              <span className={styles.skillsLabel}>{ueberJasmin.skillsLabel}</span>
              <p className={styles.skillsList}>
                {ueberJasmin.skills.map((skill, index) => (
                  <Fragment key={skill}>
                    {/* Die Leerzeichen um den Punkt sind die einzigen Umbruchstellen der Zeile. */}
                    {index > 0 && (
                      <>
                        {' '}
                        <span className={styles.dot} aria-hidden="true">
                          ·
                        </span>{' '}
                      </>
                    )}
                    <span className={styles.skill}>{skill}</span>
                  </Fragment>
                ))}
              </p>
              <a className={styles.cta} href={withBase(ueberJasmin.cta.href)}>
                {ueberJasmin.cta.label}
                <span className={styles.arrow} aria-hidden="true">
                  →
                </span>
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
