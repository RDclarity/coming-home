import { useEffect, useRef, useState } from 'react'
import { Button } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { hero, site } from '../data/site'
import { withBase } from '../lib/url'
import styles from './Hero.module.css'

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
      <div className={styles.bgLayer} aria-hidden="true">
        <img
          className={styles.bgImg}
          src={withBase('/images/hero-video-poster.webp')}
          alt=""
          width={576}
          height={1024}
          fetchPriority="high"
        />
        <video
          ref={videoRef}
          className={[styles.bgVideo, videoReady && styles.bgVideoReady].filter(Boolean).join(' ')}
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
          poster={withBase('/images/hero-video-poster.jpg')}
        >
          <source src={withBase('/videos/hero-bg.mp4')} type="video/mp4" />
        </video>
        <span className={styles.scrim} />
      </div>

      <div className={styles.inner}>
        <div className={styles.textCol}>
          <Reveal as="span" className={styles.overline}>
            <span className={styles.overlineDash} aria-hidden="true" />
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

          <Reveal as="p" className={styles.modalities} delay={220}>
            {hero.modalities}
          </Reveal>

          <Reveal className={styles.actions} delay={280}>
            <Button href="/#kennenlernen" size="lg" style={{ backgroundColor: 'var(--c-key1)', color: 'var(--c-dark)' }}>
              {site.ctaLabel}
            </Button>
          </Reveal>

          <Reveal as="p" className={styles.brand} delay={340}>
            {hero.brandLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
