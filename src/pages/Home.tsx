import { Abschluss } from '../sections/Abschluss'
import { Ankommen } from '../sections/Ankommen'
import { Bewerbung } from '../sections/Bewerbung'
import { CustomSections } from '../sections/CustomSections'
import { Faq } from '../sections/Faq'
import { Hero } from '../sections/Hero'
import { Jasmin } from '../sections/Jasmin'
import { Orientierung } from '../sections/Orientierung'
import { Termine } from '../sections/Termine'

/**
 * Conversion-Landingpage (Okt. 2026): ein Ziel – das kostenlose
 * Kennenlerngespräch. Problem erkennen → Angebote mit Preis → Vertrauen in
 * Jasmin → drei Schritte zum Termin → nächster Workshop → Einwände (FAQ) →
 * letzter Aufruf. Bewusst ohne Methoden-Grafik und Audioübung, damit nichts
 * vom Termin ablenkt.
 */
export function Home() {
  return (
    <>
      <Hero />
      <Ankommen />
      <Orientierung />
      <Jasmin />
      <Bewerbung />
      <Termine />
      <Faq />
      <CustomSections />
      <Abschluss />
    </>
  )
}
