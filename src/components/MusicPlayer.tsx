import { useEffect, useRef, useState } from 'react'
import { withBase } from '../lib/url'
import styles from './MusicPlayer.module.css'

const STORAGE_KEY = 'coming-home:music-enabled'

/**
 * Hintergrundmusik-Umschalter, oben links, auf jeder Seite sichtbar.
 *
 * Die Audiodatei (public/audio/theme.mp3 + .m4a) ist die Tonspur aus dem
 * Hero-Hintergrundvideo, siehe src/sections/Hero.tsx.
 *
 * WICHTIG zu "immer an": Browser blockieren Audio mit Ton grundsätzlich,
 * bevor die besuchende Person mit der Seite interagiert hat (Chrome/Safari/
 * Firefox-Autoplay-Richtlinie – das lässt sich nicht per Code umgehen). Der
 * Schalter ist deshalb standardmäßig "an" gespeichert, und die Musik startet
 * beim ersten Klick/Tap irgendwo auf der Seite von selbst – das ist die
 * bestmögliche Annäherung an "immer an", die Browser zulassen.
 */
export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [enabled, setEnabled] = useState(true)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored !== null) setEnabled(stored === '1')
    } catch {
      // localStorage nicht verfügbar (privater Modus o. Ä.) – Standard "an" bleibt.
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !enabled) return

    const tryPlay = () => {
      audio.play().then(
        () => setPlaying(true),
        () => {
          /* vom Browser blockiert, bis Interaktion stattfindet – siehe unten */
        },
      )
    }

    tryPlay()

    // Erste Interaktion irgendwo auf der Seite startet die Wiedergabe nach,
    // falls der Browser den ersten Versuch blockiert hat.
    const onFirstInteraction = () => {
      if (enabled && audio.paused) tryPlay()
    }
    document.addEventListener('pointerdown', onFirstInteraction, { once: true })
    document.addEventListener('keydown', onFirstInteraction, { once: true })

    return () => {
      document.removeEventListener('pointerdown', onFirstInteraction)
      document.removeEventListener('keydown', onFirstInteraction)
    }
  }, [enabled])

  // Pausiert, sobald der Tab in den Hintergrund geht (Tab-Wechsel, Minimieren,
  // App-Wechsel am Handy) – spielt automatisch weiter, sobald man zurückkommt
  // (nur wenn die Musik überhaupt eingeschaltet ist).
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    function onVisibilityChange() {
      if (document.hidden) {
        audio!.pause()
        setPlaying(false)
      } else if (enabled) {
        audio!.play().then(
          () => setPlaying(true),
          () => {
            /* Autoplay evtl. wieder blockiert – nächster Klick/Tap holt es nach */
          },
        )
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [enabled])

  function toggle() {
    const next = !enabled
    setEnabled(next)
    try {
      localStorage.setItem(STORAGE_KEY, next ? '1' : '0')
    } catch {
      // s. o. – rein kosmetisch, wenn das fehlschlägt
    }

    const audio = audioRef.current
    if (!audio) return
    if (next) {
      audio.play().then(
        () => setPlaying(true),
        () => setPlaying(false),
      )
    } else {
      audio.pause()
      setPlaying(false)
    }
  }

  return (
    <>
      <audio ref={audioRef} loop preload="none">
        <source src={withBase('/audio/theme.m4a')} type="audio/mp4" />
        <source src={withBase('/audio/theme.mp3')} type="audio/mpeg" />
      </audio>
      <button
        type="button"
        className={[styles.btn, playing && styles.playing, !enabled && styles.muted]
          .filter(Boolean)
          .join(' ')}
        onClick={toggle}
        aria-pressed={enabled}
        aria-label={enabled ? 'Musik ausschalten' : 'Musik einschalten'}
        title={enabled ? 'Musik ausschalten' : 'Musik einschalten'}
      >
        <svg className={styles.note} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
      </button>
    </>
  )
}
