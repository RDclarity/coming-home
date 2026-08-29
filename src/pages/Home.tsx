import { Abschluss } from '../sections/Abschluss'
import { Ankommen } from '../sections/Ankommen'
import { Arbeitsweise } from '../sections/Arbeitsweise'
import { Bewerbung } from '../sections/Bewerbung'
import { Faq } from '../sections/Faq'
import { FuerWen } from '../sections/FuerWen'
import { Hero } from '../sections/Hero'
import { Jasmin } from '../sections/Jasmin'
import { Newsletter } from '../sections/Newsletter'
import { Orientierung } from '../sections/Orientierung'
import { Reise } from '../sections/Reise'
import { Termine } from '../sections/Termine'
import { UeberJasmin } from '../sections/UeberJasmin'

export function Home() {
  return (
    <>
      <Hero />
      <Ankommen />
      <Jasmin />
      <Orientierung />
      <Reise />
      <UeberJasmin />
      <Arbeitsweise />
      <FuerWen />
      <Bewerbung />
      <Faq />
      <Termine />
      <Newsletter />
      <Abschluss />
    </>
  )
}
