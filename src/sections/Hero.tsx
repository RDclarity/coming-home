import { useEffect, useRef, useState } from 'react'
import { Button } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { hero, site } from '../data/site'
import { withBase } from '../lib/url'
import styles from './Hero.module.css'

/**
 * Hero im Designsystem "Ankommen": Text auf Leinen links, rechts das Video
 * in einem großen Torbogen (Leitmotiv: Durchgang nach Hause). Dahinter ein
 * weicher Kreis, der im Atemrhythmus weiter und enger wird (4 s ein, 6 s
 * aus) – zeigt ohne Worte, worum es bei Jasmin geht.
 */
export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoReady, setVideoReady] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Respekt vor „reduzierte Bewegung" und Sparmodus: dann bleibt es beim
    // ruhigen Standbild (Poster-Bild), kein Video wird geladen/abgespielt.
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const connection = (navigator as { connection?: { saveData?: boolean } }).connection
    if (prefersReducedMotion || connection?.saveData) return

    const markReady = () => setVideoReady(true)
    video.addEventListener('loadeddata', markReady)
    video.play().catch(() => {
      // Manche Browser blockieren Autoplay trotz muted – dann bleibt einfach
      // das Poster-Bild stehen, kein Fehlerfall.
    })
    return () => video.removeEventListener('loadeddata', markReady)
  }, [])

  return (
    <section id="coming-home" className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.textCol}>
          <Reveal as="span" className={styles.overline}>
            <span className={styles.overlineArch} aria-hidden="true" />
            {hero.overline}
          </Reveal>

          <Reveal as="h1" className={styles.title} delay={80}>
            {hero.titleLines.map((line, index) => (
              <span
                key={line}
                className={[styles.tLine, index === 1 && styles.emph].filter(Boolean).join(' ')}
              >
                {line}
              </span>
            ))}
          </Reveal>

          <Reveal as="p" className={styles.lead} delay={160}>
            {hero.lead}
          </Reveal>

          <Reveal className={styles.actions} delay={220}>
            <Button href="/#kennenlernen" size="lg">
              {site.ctaLabel}
            </Button>
            <ul className={styles.trust}>
              {hero.trust.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal className={styles.visual} delay={120}>
          <span className={styles.breath} aria-hidden="true" />
          <span className={styles.archOutline} aria-hidden="true" />
          <div className={styles.arch}>
            <img
              className={styles.media}
              src={withBase('/images/hero-video-poster.webp')}
              alt=""
              width={576}
              height={1024}
              fetchPriority="high"
            />
            <video
              ref={videoRef}
              className={[styles.media, styles.video, videoReady && styles.videoReady].filter(Boolean).join(' ')}
              muted
              autoPlay
              loop
              playsInline
              preload="auto"
              poster={withBase('/images/hero-video-poster.jpg')}
              aria-hidden="true"
            >
              <source src={withBase('/videos/hero-bg.mp4')} type="video/mp4" />
            </video>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
