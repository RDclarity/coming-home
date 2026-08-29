import { useEffect, useState } from 'react'
import { Button } from '../components/Button'
import { navLinks, site } from '../data/site'
import { withBase } from '../lib/url'
import styles from './Nav.module.css'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={[styles.nav, scrolled && styles.scrolled].filter(Boolean).join(' ')}>
      <div className={styles.inner}>
        <a className={styles.brand} href={withBase('/#coming-home')}>
          {site.brand}
        </a>

        <nav className={styles.links} aria-label="Hauptnavigation">
          {navLinks.map((link) => (
            <a key={link.href} className={styles.link} href={withBase(link.href)}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className={styles.right}>
          <span className={styles.ctaDesktop}>
            <Button href="/#kennenlernen" size="sm" style={{ backgroundColor: 'var(--c-key1)' }}>
              {site.ctaLabel}
            </Button>
          </span>
          <button
            type="button"
            className={[styles.burger, menuOpen && styles.burgerOpen].filter(Boolean).join(' ')}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Menü schließen' : 'Menü öffnen'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-menu" className={styles.mobilePanel} aria-label="Navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              className={styles.mobileLink}
              href={withBase(link.href)}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Button href="/#kennenlernen" size="sm" style={{ backgroundColor: 'var(--c-key1)' }}>
            {site.ctaLabel}
          </Button>
        </nav>
      )}
    </header>
  )
}
