import { Abschluss } from '../sections/Abschluss'
import { Ankommen } from '../sections/Ankommen'
import { Arbeitsweise } from '../sections/Arbeitsweise'
import { Bewerbung } from '../sections/Bewerbung'
import { CustomSections } from '../sections/CustomSections'
import { Faq } from '../sections/Faq'
import { Hero } from '../sections/Hero'
import { Jasmin } from '../sections/Jasmin'
import { Newsletter } from '../sections/Newsletter'
import { Orientierung } from '../sections/Orientierung'
import { Termine } from '../sections/Termine'

/**
 * Reihenfolge nach Conversion (Okt. 2026): Problem erkennen → Angebot sehen →
 * Vertrauen in Jasmin → Methode → Termin buchen → Workshop → Einwände (FAQ) →
 * leiser Einstieg (Audioübung) → letzter Aufruf. Doppelte Abschnitte (Reise,
 * Über Jasmin, Für wen) wurden gestrichen.
 */
export function Home() {
  return (
    <>
      <Hero />
      <Ankommen />
      <Orientierung />
      <Jasmin />
      <Arbeitsweise />
      <Bewerbung />
      <Termine />
      <Faq />
      <CustomSections />
      <Newsletter />
      <Abschluss />
    </>
  )
}
