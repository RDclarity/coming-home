/**
 * Alle buchbaren Begleitungen als eine Liste – jede davon führt Jasmin
 * persönlich durch (keine Vertretung, kein Team). Diese Datei ist die
 * einzige Quelle für die Service-Übersicht (/begleitungen) und die
 * einzelnen Detailseiten (/begleitung/:slug).
 *
 * Vier Hauptangebote: die individuelle 1:1 Session, 3-Monats-Begleitung,
 * Jahresbegleitung und das Tagesseminar. Tagesseminar und 1:1 Session haben
 * einen festen bzw. eingegrenzten Preis, die beiden mehrmonatigen
 * Begleitungen sind individuell und werden im Kennenlerngespräch besprochen
 * ("Preis auf Anfrage").
 *
 * Das frühere 10-Stunden-Paket der 1:1-Begleitung ist NICHT mehr das
 * Hauptangebot unter dem Slug `1-1-begleitung` (das zeigt jetzt die neue,
 * flexible Einzelsession) – der alte Inhalt ist bewusst nicht gelöscht,
 * sondern liegt unten als `archivedServices` weiter, falls er an anderer
 * Stelle wieder gebraucht wird. `archivedServices` wird bewusst NIRGENDS
 * verlinkt oder gelistet (kein Eintrag in `services`, keine Sitemap-Seite).
 */

import { AUF_ANFRAGE, formatPrice, pricing } from './pricing'

export type Service = {
  slug: string
  category: 'einzelsession' | 'begleitung' | 'workshop'
  title: string
  shortTitle: string
  tagline: string
  intro: string
  priceLabel: string
  priceValue?: number
  priceNote?: string
  duration: string
  location: string
  highlights: string[]
  forWho: string[]
  process: string[]
  faqSlugs?: string[]
  relatedSlugs: string[]
  relatedArticleSlugs: string[]
  metaDescription: string
  /** Überschreibt den sonst generischen "Kennenlerngespräch vereinbaren"-Button im Hero. */
  ctaLabel?: string
}

export const services: Service[] = [
  {
    slug: '1-1-begleitung',
    category: 'einzelsession',
    title: 'Individuelle 1:1 Session',
    shortTitle: '1:1 Session',
    tagline: 'Dein Raum für Tiefe',
    intro:
      'Ein geschützter Raum für ein aktuelles Thema, Regulation, Körperarbeit oder tieferes Erleben. Je nach Prozess können Elemente aus Holistic Bodywork, Connected Breathwork, Cranio-Sacral, Kundalini sowie Gespräch und Reflexion miteinander verbunden werden. Die Session folgt dabei keinem starren Ablauf. Wir schauen gemeinsam, was gerade da ist und welche Form der Begleitung in diesem Moment sinnvoll ist.',
    priceLabel: '160 € – 220 €',
    priceValue: 160,
    priceNote:
      'Plane für deinen Termin ca. 1,5–2 Stunden ein. Je nach tatsächlicher Dauer liegt deine Investition zwischen 160 € und 220 €.',
    duration: 'ca. 1,5–2 Stunden',
    location: '1120 Wien oder 3052 Innermanzing',
    highlights: [
      'Ein flexibel gestalteter Raum – für ein aktuelles Thema, Regulation, Körperarbeit oder tieferes Erleben',
      'Frei kombinierbar aus Holistic Bodywork, Connected Breathwork, Cranio-Sacral, Kundalini sowie Gespräch und Reflexion',
      'Keine starre Struktur – wir schauen gemeinsam, was in diesem Moment sinnvoll ist',
      'Geeignet auch als erster Kontakt mit körperorientierter Arbeit',
    ],
    forWho: [
      'Du trägst gerade ein Thema in dir, für das du einen geschützten, ungeteilten Raum brauchst.',
      'Du wünschst dir Regulation, Körperarbeit oder ein tieferes Erleben – ohne vorgegebenen Ablauf.',
      'Du weißt noch nicht genau, welche Methode zu dir passt, und möchtest das gemeinsam herausfinden.',
    ],
    process: [
      'Kurze Abstimmung vorab: worum es geht, was gerade da ist.',
      'Die Session selbst, ca. 1,5–2 Stunden – je nach Prozess kombiniert aus Körperarbeit, Atem, Cranio-Sacral, Kundalini und Gespräch.',
      'Zeit zum Nachspüren direkt im Anschluss.',
    ],
    faqSlugs: [
      'brauche-ich-erfahrung',
      'wie-laeuft-erste-session-ab',
      'wie-lange-dauert-session',
      'wann-nicht-geeignet',
    ],
    relatedSlugs: ['coming-home-drei-monate', 'coming-home-jahresbegleitung'],
    relatedArticleSlugs: [
      'was-ist-breathwork',
      'erste-session-was-dich-erwartet',
      'wann-breathwork-nicht-geeignet-ist',
    ],
    metaDescription:
      'Individuelle 1:1 Session mit Jasmin in Wien oder Innermanzing: Holistic Bodywork, Connected Breathwork, Cranio-Sacral und Kundalini flexibel kombiniert. 160–220 €, ca. 1,5–2 Stunden.',
    ctaLabel: '1:1 Session anfragen',
  },
  {
    slug: 'coming-home-drei-monate',
    category: 'begleitung',
    title: 'Coming Home – dreimonatige Begleitung',
    shortTitle: '3-Monats-Begleitung',
    tagline: 'Ein zusammenhängender Weg statt einzelner Momente.',
    intro:
      'Die dreimonatige Coming-Home-Begleitung ist für Menschen, die nicht nur eine einzelne Erfahrung machen, sondern wirklich etwas verändern möchten. Über drei Monate hinweg arbeiten wir regelmäßig zusammen – mit Raum für Integration zwischen den Sessions.',
    priceLabel: AUF_ANFRAGE,
    duration: '3 Monate',
    location: 'Niederösterreich, einzelne Termine auch online nach Absprache',
    highlights: [
      'Regelmäßige 1:1 Sessions über drei Monate, aufeinander aufbauend',
      'Kombination aus Breathwork, Bodywork und Prozessbegleitung je nach Bedarf',
      'Persönlicher Bewerbungsbogen und Kennenlerngespräch vorab',
      'Beginnt und endet mit einer bewussten Standortbestimmung',
    ],
    forWho: [
      'Du möchtest nicht länger nur über Veränderung sprechen, sondern sie leben.',
      'Du bist bereit, dir selbst über einen längeren Zeitraum ehrlich zu begegnen.',
      'Ein einzelner Termin würde für dein Thema nicht reichen.',
    ],
    process: [
      'Bewerbungsbogen ausfüllen und unverbindliches Kennenlerngespräch vereinbaren – dabei klären wir auch den Preis für deine Begleitung.',
      'Gemeinsam den roten Faden für die drei Monate festlegen.',
      'Regelmäßige Sessions mit Integrationszeit dazwischen, laufende Anpassung an das, was gerade dran ist.',
    ],
    faqSlugs: ['wie-laeuft-erste-session-ab'],
    relatedSlugs: ['coming-home-jahresbegleitung', '1-1-begleitung'],
    relatedArticleSlugs: ['humanenergetik-vs-psychotherapie', 'was-ist-breathwork'],
    metaDescription:
      'Coming Home – dreimonatige 1:1-Begleitung mit Jasmin: Breathwork, Bodywork und Prozessbegleitung über drei Monate. Preis auf Anfrage.',
  },
  {
    slug: 'coming-home-jahresbegleitung',
    category: 'begleitung',
    title: 'Coming Home – Jahresbegleitung',
    shortTitle: 'Jahresbegleitung',
    tagline: 'Für den ganzen Weg, nicht nur einen Abschnitt.',
    intro:
      'Die Jahresbegleitung ist die tiefste Form der Zusammenarbeit, die ich anbiete: ein volles Jahr, in dem wir gemeinsam an dem arbeiten, was du wirklich verändern willst – mit Zeit für Rückschläge, Wiederholung und echte Integration statt schneller Impulse.',
    priceLabel: AUF_ANFRAGE,
    duration: '12 Monate',
    location: 'Niederösterreich, einzelne Termine auch online nach Absprache',
    highlights: [
      'Regelmäßige 1:1 Sessions über zwölf Monate',
      'Volle Bandbreite: Breathwork, Bodywork, Cranio-Sacral, Prozessbegleitung',
      'Persönlicher Bewerbungsbogen und Kennenlerngespräch vorab',
      'Für Menschen, die bereit sind, blinde Flecken anzusehen',
    ],
    forWho: [
      'Du möchtest eine neue Beziehung zu deinem Körper, deinen Grenzen und deiner Wahrheit aufbauen – nicht nur ein Thema lösen.',
      'Du hast die dreimonatige Begleitung bereits gemacht oder weißt, dass du mehr Zeit brauchst.',
      'Du bist bereit, dich radikal ehrlich mit dir selbst auseinanderzusetzen.',
    ],
    process: [
      'Bewerbungsbogen ausfüllen und unverbindliches Kennenlerngespräch vereinbaren – dabei klären wir auch den Preis für deine Begleitung.',
      'Gemeinsame Standortbestimmung und grober Rahmen für das Jahr.',
      'Regelmäßige Sessions, die sich immer an dem orientieren, was gerade wirklich dran ist.',
    ],
    faqSlugs: ['wo-finden-sessions-statt'],
    relatedSlugs: ['coming-home-drei-monate', '1-1-begleitung'],
    relatedArticleSlugs: ['humanenergetik-vs-psychotherapie', 'nervensystemregulation-verstehen'],
    metaDescription:
      'Coming Home – Jahresbegleitung mit Jasmin: ein volles Jahr 1:1 Körperarbeit, Breathwork und Prozessbegleitung. Preis auf Anfrage.',
  },
  {
    slug: 'feminine-power-workshop',
    category: 'workshop',
    title: 'Coming Home – Connected Breathwork',
    shortTitle: 'Connected Breathwork',
    tagline: 'Ein Tag, der dich aus dem Funktionieren zurück ins Spüren führt.',
    intro:
      'Durch Bewegung, Begegnung, bewusste Körperwahrnehmung und Connected Breathwork entsteht ein Raum, in dem du dir selbst und anderen auf eine neue Weise begegnen kannst. Ein Tag zum Wahrnehmen. Zum Erleben. Zum Loslassen. Und zum Zurückkommen zu dir.',
    priceLabel: formatPrice(pricing.tagesseminar.price),
    priceNote: pricing.tagesseminar.unit,
    duration: pricing.tagesseminar.duration,
    location: 'Wakanda Health, 3052 Neustift Innermanzing',
    highlights: [
      'Ganztägiges Format (9:00–18:00 Uhr) mit Bewegung, Begegnung und Connected Breathwork',
      'Bewusste Körperwahrnehmung in einer kleinen, geschützten Gruppe',
      'Von Jasmin persönlich konzipiert und geleitet',
      'Kein Vorwissen nötig',
    ],
    forWho: [
      'Du möchtest aus dem ständigen Funktionieren aussteigen und wieder bewusster wahrnehmen.',
      'Du suchst einen intensiven Einstieg, ohne dich gleich langfristig zu binden.',
      'Du wünschst dir echte Begegnung und eine tiefere Verbindung zu dir selbst und deinem Körper.',
    ],
    process: [
      'Ankommen und Einstimmung am Morgen, 9:00 Uhr.',
      'Bewegung, Begegnung und Connected-Breathwork-Einheiten über den Tag verteilt.',
      'Gemeinsamer Ausklang mit Raum für Austausch, Ende 18:00 Uhr.',
    ],
    faqSlugs: ['brauche-ich-erfahrung', 'wo-finden-sessions-statt'],
    relatedSlugs: ['1-1-begleitung'],
    relatedArticleSlugs: ['was-ist-breathwork'],
    metaDescription:
      'Coming Home – Connected Breathwork mit Jasmin am 24. Oktober 2026, 9–18 Uhr in Neustift Innermanzing: ein Tag Bewegung, Begegnung und bewusste Körperwahrnehmung. 369 € pro Person.',
  },
]

/**
 * Archiv, absichtlich NICHT Teil von `services` – erscheint dadurch weder auf
 * /begleitungen noch als eigene Detailseite. Das alte 10-Stunden-Paket der
 * 1:1-Begleitung, das der neuen flexiblen Einzelsession (siehe oben,
 * `1-1-begleitung`) Platz gemacht hat. Bewusst mit eigenem Slug aufbewahrt,
 * nicht gelöscht – bei Bedarf einfach in `services` verschieben, um es
 * wieder live zu schalten.
 */
export const archivedServices: Service[] = [
  {
    slug: '1-1-begleitung-10-stunden-paket',
    category: 'einzelsession',
    title: '1:1 Begleitung – 10-Stunden-Paket',
    shortTitle: '1:1 Begleitung (10-Stunden-Paket)',
    tagline: 'Zehn Stunden, ganz für dich – Breathwork, Bodywork, Cranio-Sacral, Kundalini.',
    intro:
      'Die 1:1-Begleitung wird als 10-Stunden-Paket gebucht und kombiniert flexibel, was du gerade brauchst: bewusste Atemarbeit, Holistic Bodywork, Cranio-Sacrale Impulsarbeit, Kundalini Awakening und Prozessbegleitung. Kein starres Schema – jede Session entsteht aus dem, was dein Körper und dein Nervensystem gerade brauchen.',
    priceLabel: AUF_ANFRAGE,
    duration: '10 Stunden als Paket, aufgeteilt auf mehrere Sessions',
    location: 'Niederösterreich – der genaue Ort wird bei der Terminvereinbarung besprochen',
    highlights: [
      'Zehn Stunden 1:1-Zeit, frei kombinierbar aus Breathwork, Bodywork, Cranio-Sacral, Kundalini Awakening und Prozessbegleitung',
      'Ein geschützter Raum ohne Gruppe, ganz auf dich ausgerichtet',
      'Vor- und Nachgespräch zur Einordnung und Integration bei jeder Session',
      'Geeignet auch als erster Kontakt mit körperorientierter Arbeit',
    ],
    forWho: [
      'Du möchtest über mehrere Sessions hinweg an dir arbeiten, statt nur eine einzelne Erfahrung zu machen.',
      'Du trägst ein Thema in dir, für das du einen ungeteilten, wiederkehrenden Raum brauchst.',
      'Du weißt noch nicht genau, welche Methode zu dir passt, und möchtest das gemeinsam herausfinden.',
    ],
    process: [
      'Kennenlerngespräch: Wie geht es dir, was bringst du mit, was braucht Raum – und Klärung des Preises für dein Paket.',
      'Zehn Stunden 1:1-Zeit, aufgeteilt auf mehrere Sessions, je nach Bedarf mit Atem-, Körper- oder Cranio-Sacral-Arbeit.',
      'Nach jeder Session Zeit zum Nachspüren, am Ende ein Integrationsgespräch.',
    ],
    faqSlugs: [
      'brauche-ich-erfahrung',
      'wie-laeuft-erste-session-ab',
      'wie-lange-dauert-session',
      'wann-nicht-geeignet',
    ],
    relatedSlugs: ['coming-home-drei-monate', 'coming-home-jahresbegleitung'],
    relatedArticleSlugs: [
      'was-ist-breathwork',
      'erste-session-was-dich-erwartet',
      'wann-breathwork-nicht-geeignet-ist',
    ],
    metaDescription:
      '1:1 Begleitung mit Jasmin: 10-Stunden-Paket aus Breathwork, Bodywork, Cranio-Sacral und Kundalini Awakening. Preis auf Anfrage im Kennenlerngespräch.',
  },
]

export function getServiceBySlug(slug: string | undefined): Service | undefined {
  return services.find((service) => service.slug === slug)
}

export const categoryLabels: Record<Service['category'], string> = {
  einzelsession: 'Einzelbegleitung',
  begleitung: 'Mehrmonatige Begleitung',
  workshop: 'Workshop',
}
