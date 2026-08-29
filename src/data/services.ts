/**
 * Alle buchbaren Begleitungen als eine Liste – jede davon führt Jasmin
 * persönlich durch (keine Vertretung, kein Team). Diese Datei ist die
 * einzige Quelle für die Service-Übersicht (/begleitungen) und die
 * einzelnen Detailseiten (/begleitung/:slug).
 */

import { formatPrice, pricing } from './pricing'

export type Service = {
  slug: string
  category: 'einzelsession' | 'begleitung' | 'workshop' | 'gruppe' | 'retreat'
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
}

export const services: Service[] = [
  {
    slug: 'breathwork-einzelsession',
    category: 'einzelsession',
    title: '1:1 Breathwork',
    shortTitle: 'Breathwork',
    tagline: 'Dein Atem als Weg zurück in deinen Körper.',
    intro:
      'In einer 1:1-Breathwork-Session arbeiten wir mit bewusster, verbundener Atmung, um Anspannung zu lösen, Gefühle wieder zugänglich zu machen und deinem Nervensystem einen sicheren Raum zum Loslassen zu geben. Ganz in deinem Tempo, ohne Ablenkung durch eine Gruppe.',
    priceLabel: formatPrice(pricing.einzelstunde.price),
    priceValue: pricing.einzelstunde.price,
    priceNote: pricing.einzelstunde.unit,
    duration: pricing.einzelstunde.duration,
    location: 'Niederösterreich – der genaue Ort wird bei der Terminvereinbarung besprochen',
    highlights: [
      'Bewusste, verbundene Atmung in deinem eigenen Rhythmus',
      'Ein geschützter Raum ohne Gruppe, ganz auf dich ausgerichtet',
      'Vor- und Nachgespräch zur Einordnung und Integration',
      'Geeignet auch als erster Kontakt mit Breathwork',
    ],
    forWho: [
      'Du möchtest Breathwork in Ruhe für dich ausprobieren, bevor du in eine Gruppe gehst.',
      'Du trägst ein Thema in dir, für das du lieber einen ungeteilten Raum hättest.',
      'Du kennst Breathwork bereits und möchtest gezielt an einem Thema weiterarbeiten.',
    ],
    process: [
      'Kurzes Gespräch vorab: Wie geht es dir, was bringst du mit, was braucht Raum?',
      'Geführte, verbundene Atemreise – liegend, in deinem Tempo.',
      'Nachspüren und ein kurzes Integrationsgespräch zum Abschluss.',
    ],
    faqSlugs: [
      'brauche-ich-erfahrung',
      'wie-laeuft-erste-session-ab',
      'wie-lange-dauert-session',
      'wann-nicht-geeignet',
    ],
    relatedSlugs: ['kundalini-awakening', 'holistic-bodywork', 'coming-home-drei-monate'],
    relatedArticleSlugs: ['was-ist-breathwork', 'erste-session-was-dich-erwartet', 'wann-breathwork-nicht-geeignet-ist'],
    metaDescription:
      '1:1 Breathwork mit Jasmin: 90 Minuten bewusste, verbundene Atemarbeit in geschütztem Rahmen. 140 € pro Session, persönlich begleitet.',
  },
  {
    slug: 'holistic-bodywork',
    category: 'einzelsession',
    title: 'Holistic Bodywork',
    shortTitle: 'Bodywork',
    tagline: 'Körperarbeit, die zuhört statt zu behandeln.',
    intro:
      'Holistic Bodywork verbindet achtsame Berührung, Präsenz und Körperarbeit zu einer Session, die sich an dem orientiert, was dein Körper in diesem Moment tatsächlich braucht – nicht an einem starren Ablauf. Kein Schema, sondern echtes Zuhören mit den Händen.',
    priceLabel: formatPrice(pricing.einzelstunde.price),
    priceValue: pricing.einzelstunde.price,
    priceNote: pricing.einzelstunde.unit,
    duration: pricing.einzelstunde.duration,
    location: 'Niederösterreich – der genaue Ort wird bei der Terminvereinbarung besprochen',
    highlights: [
      'Achtsame Berührung, die vorher besprochen und jederzeit widerrufbar ist',
      'Individuell – keine feste Abfolge, sondern eine Antwort auf deinen Körper',
      'Kombinierbar mit Elementen aus Cranio-Sacral-Arbeit und Atemarbeit',
      'Kein Ausziehen erforderlich, du entscheidest, was für dich stimmig ist',
    ],
    forWho: [
      'Du hältst viel in deinem Körper fest und merkst das an Anspannung, die nicht weggeht.',
      'Du suchst Körperarbeit, die nicht auf ein Symptom, sondern auf dich als Ganzes schaut.',
      'Du möchtest wieder lernen, Berührung als sicher zu erleben.',
    ],
    process: [
      'Gespräch zu Beginn: Was braucht heute Raum, was soll bewusst nicht angerührt werden.',
      'Körperarbeit in deinem Tempo – du gibst jederzeit die Richtung vor.',
      'Zeit zum Nachspüren, bevor du wieder in den Alltag gehst.',
    ],
    faqSlugs: ['muss-ich-mich-ausziehen', 'was-ist-achtsame-beruehrung', 'wie-sorgst-du-fuer-sicherheit'],
    relatedSlugs: ['cranio-sacrale-impulsarbeit', 'breathwork-einzelsession', 'prozessbegleitung-mentoring'],
    relatedArticleSlugs: ['was-ist-holistic-bodywork', 'achtsame-beruehrung-erklaert'],
    metaDescription:
      'Holistic Bodywork mit Jasmin: achtsame, individuelle Körperarbeit ohne festes Schema. 90 Minuten, 140 €, persönlich begleitet.',
  },
  {
    slug: 'cranio-sacrale-impulsarbeit',
    category: 'einzelsession',
    title: 'Cranio-Sacrale Impulsarbeit',
    shortTitle: 'Cranio-Sacral',
    tagline: 'Sanfte Impulse an der Körpermitte.',
    intro:
      'Cranio-Sacrale Impulsarbeit ist sehr sanfte, oft kaum spürbare Berührungsarbeit entlang von Kopf, Wirbelsäule und Becken. Sie unterstützt dein Nervensystem dabei, aus Anspannung in einen Zustand von mehr Ruhe und Ausgewogenheit zu finden.',
    priceLabel: formatPrice(pricing.einzelstunde.price),
    priceValue: pricing.einzelstunde.price,
    priceNote: pricing.einzelstunde.unit,
    duration: pricing.einzelstunde.duration,
    location: 'Niederösterreich – der genaue Ort wird bei der Terminvereinbarung besprochen',
    highlights: [
      'Sehr sanfte, ruhige Arbeitsweise – gut geeignet auch bei hoher Anspannung',
      'Ausgebildet an der MENTAS als Dipl. Cranio Sacral Praktikerin',
      'Kombinierbar mit Atemarbeit oder als eigenständige Session',
      'Häufig tief entspannend, ganz ohne aktives Zutun deinerseits',
    ],
    forWho: [
      'Du bist nervlich erschöpft und suchst etwas Ruhiges statt noch mehr Aktivierung.',
      'Du magst intensivere Körperarbeit nicht und möchtest trotzdem etwas verändern.',
      'Du hast Kopf-, Nacken- oder Kieferspannung, die sich hartnäckig hält.',
    ],
    process: [
      'Kurzes Gespräch zum aktuellen Zustand deines Nervensystems.',
      'Sanfte, meist liegende Impulsarbeit an Kopf, Wirbelsäule und Becken.',
      'Nachruhen und Raum, um langsam wieder anzukommen.',
    ],
    faqSlugs: ['was-ist-achtsame-beruehrung', 'wie-lange-dauert-session'],
    relatedSlugs: ['holistic-bodywork', 'breathwork-einzelsession', 'prozessbegleitung-mentoring'],
    relatedArticleSlugs: ['cranio-sacrale-impulsarbeit-erklaert', 'nervensystemregulation-verstehen'],
    metaDescription:
      'Cranio-Sacrale Impulsarbeit mit Jasmin: sanfte Körperarbeit für ein ruhigeres Nervensystem. 90 Minuten, 140 €.',
  },
  {
    slug: 'kundalini-awakening',
    category: 'einzelsession',
    title: 'Kundalini Awakening',
    shortTitle: 'Kundalini',
    tagline: 'Lebendigkeit, die in dir bereits da ist.',
    intro:
      'Kundalini Awakening arbeitet mit Atem, Bewegung und Körperbewusstsein, um die eigene Lebensenergie wieder spürbar zu machen. Es geht nicht um ein spektakuläres Erwachen, sondern um ehrliche, nachvollziehbare Praxis – und darum, was danach an Integration folgt.',
    priceLabel: formatPrice(pricing.einzelstunde.price),
    priceValue: pricing.einzelstunde.price,
    priceNote: pricing.einzelstunde.unit,
    duration: pricing.einzelstunde.duration,
    location: 'Niederösterreich – der genaue Ort wird bei der Terminvereinbarung besprochen',
    highlights: [
      'Praxis aus Atem, Bewegung und Präsenz statt reiner Theorie',
      'Ausgebildet als Kundalini Awakening & Breathwork Facilitator (2024–2026)',
      'Immer mit Fokus auf Integration – nicht nur auf den Moment der Session',
      'Anschlussfähig an Breathwork und Prozessbegleitung',
    ],
    forWho: [
      'Du spürst, dass mehr Lebendigkeit und Verbindung in dir stecken, als du im Alltag zulässt.',
      'Du hast bereits Erfahrung mit Körper- oder Atemarbeit und möchtest vertiefen.',
      'Du bist bereit, dich auf intensivere energetische Praxis einzulassen.',
    ],
    process: [
      'Gespräch zu deinem aktuellen Stand und deiner Erfahrung mit Praxis dieser Art.',
      'Geführte Praxis aus Atem, Bewegung und Körperarbeit.',
      'Bewusste Integrationszeit – das Danach ist genauso wichtig wie die Session selbst.',
    ],
    faqSlugs: ['brauche-ich-erfahrung', 'was-passiert-bei-starken-emotionen', 'wann-nicht-geeignet'],
    relatedSlugs: ['breathwork-einzelsession', 'prozessbegleitung-mentoring', 'coming-home-jahresbegleitung'],
    relatedArticleSlugs: ['kundalini-awakening-praxis-und-integration', 'was-ist-breathwork'],
    metaDescription:
      'Kundalini Awakening mit Jasmin: Praxis aus Atem, Bewegung und Körperbewusstsein mit klarem Fokus auf Integration. 90 Minuten, 140 €.',
  },
  {
    slug: 'prozessbegleitung-mentoring',
    category: 'einzelsession',
    title: 'Prozessbegleitung & Mentoring',
    shortTitle: 'Prozessbegleitung',
    tagline: 'Ein Gegenüber für deinen aktuellen Prozess.',
    intro:
      'Manchmal braucht es weniger eine bestimmte Methode als ein klares, präsentes Gegenüber. In der Prozessbegleitung schauen wir gemeinsam auf das, was in deinem Leben gerade ansteht – körperorientiert, ehrlich und ohne dir zu sagen, was richtig für dich ist.',
    priceLabel: formatPrice(pricing.einzelstunde.price),
    priceValue: pricing.einzelstunde.price,
    priceNote: pricing.einzelstunde.unit,
    duration: pricing.einzelstunde.duration,
    location: 'Niederösterreich oder online nach Absprache',
    highlights: [
      'Gesprächsbasiert, ergänzt um Körperwahrnehmung statt reinem Kopf-Denken',
      'Kein Coaching-Fahrplan – der Prozess entsteht aus dem, was du mitbringst',
      'Gut geeignet als Begleitung über mehrere einzelne Sessions hinweg',
      'Anschlussfähig an die mehrmonatigen Coming-Home-Begleitungen',
    ],
    forWho: [
      'Du stehst vor einer Entscheidung oder Veränderung und möchtest sie nicht allein durchdenken.',
      'Du hast schon viel über dich verstanden und merkst, dass Wissen allein nicht reicht.',
      'Du möchtest regelmäßig ein reflektierendes Gegenüber haben, ohne dich gleich auf eine lange Begleitung festzulegen.',
    ],
    process: [
      'Du bringst mit, was gerade ansteht – ein Thema, eine Entscheidung, ein Gefühl.',
      'Gemeinsames Erforschen, körperorientiert und in deinem Tempo.',
      'Konkrete nächste Schritte oder einfach mehr Klarheit als vorher.',
    ],
    faqSlugs: ['wie-laeuft-erste-session-ab', 'was-kostet-eine-begleitung'],
    relatedSlugs: ['coming-home-drei-monate', 'coming-home-jahresbegleitung', 'kundalini-awakening'],
    relatedArticleSlugs: ['humanenergetik-vs-psychotherapie', 'nervensystemregulation-verstehen'],
    metaDescription:
      'Prozessbegleitung und Mentoring mit Jasmin: körperorientiertes, reflektierendes Gegenüber für aktuelle Lebensthemen. 90 Minuten, 140 €.',
  },
  {
    slug: 'coming-home-drei-monate',
    category: 'begleitung',
    title: 'Coming Home – dreimonatige Begleitung',
    shortTitle: '3-Monats-Begleitung',
    tagline: 'Ein zusammenhängender Weg statt einzelner Momente.',
    intro:
      'Die dreimonatige Coming-Home-Begleitung ist für Menschen, die nicht nur eine einzelne Erfahrung machen, sondern wirklich etwas verändern möchten. Über drei Monate hinweg arbeiten wir regelmäßig zusammen – mit Raum für Integration zwischen den Sessions.',
    priceLabel: formatPrice(pricing.begleitungDreiMonate.price),
    priceValue: pricing.begleitungDreiMonate.price,
    priceNote: pricing.begleitungDreiMonate.unit,
    duration: pricing.begleitungDreiMonate.duration,
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
      'Bewerbungsbogen ausfüllen und unverbindliches Kennenlerngespräch vereinbaren.',
      'Gemeinsam den roten Faden für die drei Monate festlegen.',
      'Regelmäßige Sessions mit Integrationszeit dazwischen, laufende Anpassung an das, was gerade dran ist.',
    ],
    faqSlugs: ['was-kostet-eine-begleitung', 'wie-laeuft-erste-session-ab'],
    relatedSlugs: ['coming-home-jahresbegleitung', 'prozessbegleitung-mentoring', 'breathwork-einzelsession'],
    relatedArticleSlugs: ['humanenergetik-vs-psychotherapie', 'was-ist-breathwork'],
    metaDescription:
      'Coming Home – dreimonatige 1:1-Begleitung mit Jasmin: Breathwork, Bodywork und Prozessbegleitung über drei Monate. 2.990 € gesamt.',
  },
  {
    slug: 'coming-home-jahresbegleitung',
    category: 'begleitung',
    title: 'Coming Home – Jahresbegleitung',
    shortTitle: 'Jahresbegleitung',
    tagline: 'Für den ganzen Weg, nicht nur einen Abschnitt.',
    intro:
      'Die Jahresbegleitung ist die tiefste Form der Zusammenarbeit, die ich anbiete: ein volles Jahr, in dem wir gemeinsam an dem arbeiten, was du wirklich verändern willst – mit Zeit für Rückschläge, Wiederholung und echte Integration statt schneller Impulse.',
    priceLabel: formatPrice(pricing.begleitungZwoelfMonate.price),
    priceValue: pricing.begleitungZwoelfMonate.price,
    priceNote: pricing.begleitungZwoelfMonate.unit,
    duration: pricing.begleitungZwoelfMonate.duration,
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
      'Bewerbungsbogen ausfüllen und unverbindliches Kennenlerngespräch vereinbaren.',
      'Gemeinsame Standortbestimmung und grober Rahmen für das Jahr.',
      'Regelmäßige Sessions, die sich immer an dem orientieren, was gerade wirklich dran ist.',
    ],
    faqSlugs: ['was-kostet-eine-begleitung', 'wo-finden-sessions-statt'],
    relatedSlugs: ['coming-home-drei-monate', 'prozessbegleitung-mentoring', 'retreats'],
    relatedArticleSlugs: ['humanenergetik-vs-psychotherapie', 'nervensystemregulation-verstehen'],
    metaDescription:
      'Coming Home – Jahresbegleitung mit Jasmin: ein volles Jahr 1:1 Körperarbeit, Breathwork und Prozessbegleitung. 9.590 € gesamt.',
  },
  {
    slug: 'feminine-power-workshop',
    category: 'workshop',
    title: 'Feminine Power – Tagesworkshop',
    shortTitle: 'Tagesworkshop',
    tagline: 'Ein Tag, um in deine Weiblichkeit einzutauchen.',
    intro:
      'Ein transformierender Tagesworkshop für Frauen, die in ihre Sexualität eintauchen, ihre Lust wecken und ihre wahre Weiblichkeit leben wollen – in einer kleinen, geschützten Gruppe und persönlich von Jasmin geleitet.',
    priceLabel: formatPrice(pricing.tagesseminar.price),
    priceValue: pricing.tagesseminar.price,
    priceNote: pricing.tagesseminar.unit,
    duration: pricing.tagesseminar.duration,
    location: 'Wechselnde Orte – aktuelle Termine unter Workshops & Termine',
    highlights: [
      'Ganztägiges Format mit Breathwork, Körperarbeit und Bewegung',
      'Kleine Gruppengröße für einen geschützten Rahmen',
      'Von Jasmin persönlich konzipiert und geleitet',
      'Kein Vorwissen nötig',
    ],
    forWho: [
      'Du möchtest dich wieder lebendig, sinnlich und mit dir verbunden fühlen.',
      'Du suchst einen intensiven Einstieg, ohne dich gleich langfristig zu binden.',
      'Du fühlst dich in einer Frauengruppe wohler als in einer gemischten Runde.',
    ],
    process: [
      'Ankommen und Einstimmung am Morgen.',
      'Breathwork- und Körperarbeit-Einheiten über den Tag verteilt.',
      'Gemeinsamer Ausklang mit Raum für Austausch.',
    ],
    faqSlugs: ['brauche-ich-erfahrung', 'wo-finden-sessions-statt'],
    relatedSlugs: ['breathwork-journey-gruppe', 'kundalini-awakening', 'retreats'],
    relatedArticleSlugs: ['community-und-gruppenarbeit', 'was-ist-breathwork'],
    metaDescription:
      'Feminine Power – Tagesworkshop mit Jasmin: ein Tag Breathwork und Körperarbeit für Frauen. 369 € pro Person, aktuelle Termine online.',
  },
  {
    slug: 'breathwork-journey-gruppe',
    category: 'gruppe',
    title: 'Breathwork Journey (Gruppe)',
    shortTitle: 'Breathwork Journey',
    tagline: 'Gemeinsam atmen, getragen von der Gruppe.',
    intro:
      'Bei der Breathwork Journey gehst du deinen ganz eigenen Weg und bist gleichzeitig getragen von der Energie der Gruppe. Du darfst fühlen, loslassen, auftanken und für einen Moment aus dem ständigen Funktionieren aussteigen.',
    priceLabel: '69 €',
    priceValue: 69,
    priceNote: 'pro Person',
    duration: '2 Stunden',
    location: 'Prana Oase Alland oder Wakanda Health Innermanzing – siehe aktuelle Termine',
    highlights: [
      'Zwei Stunden geführte, verbundene Gruppenatmung',
      'Persönlich von Jasmin gehalten, auch in der Gruppe',
      'Regelmäßige Termine, siehe Workshops & Termine',
      'Kein Vorwissen nötig',
    ],
    forWho: [
      'Du möchtest Breathwork zunächst in der Gruppe erleben, bevor du dich für 1:1 entscheidest.',
      'Du magst die Energie und den Rückhalt einer Gruppe.',
      'Du suchst einen niedrigschwelligen, leistbaren Einstieg.',
    ],
    process: [
      'Kurze Einführung und Ankommen in der Gruppe.',
      'Geführte, verbundene Atemreise – jede:r in der eigenen Erfahrung.',
      'Gemeinsames Nachspüren zum Abschluss.',
    ],
    faqSlugs: ['brauche-ich-erfahrung', 'wo-finden-sessions-statt'],
    relatedSlugs: ['breathwork-einzelsession', 'feminine-power-workshop'],
    relatedArticleSlugs: ['community-und-gruppenarbeit', 'was-ist-breathwork'],
    metaDescription:
      'Breathwork Journey in der Gruppe mit Jasmin: 2 Stunden geführte Atemarbeit, 69 € pro Person. Aktuelle Termine unter Workshops & Termine.',
  },
  {
    slug: 'retreats',
    category: 'retreat',
    title: 'Coming Home Retreats',
    shortTitle: 'Retreats',
    tagline: 'Raus aus dem Alltag, rein in die Tiefe.',
    intro:
      'Retreats schenken dir Zeit, Ruhe und Raum, ganz bei dir anzukommen – außerhalb des Gewohnten. Körperarbeit, Atem, Bewegung, Verbindung, Stille und Natur verbinden sich zu einem Rahmen, in dem sich neue Erfahrungen nachhaltig setzen können.',
    priceLabel: 'Auf Anfrage',
    duration: 'mehrtägig',
    location: 'Wird je Retreat bekannt gegeben',
    highlights: [
      'Mehrtägiges Format mit Körperarbeit, Atem, Bewegung und Stille',
      'Persönlich von Jasmin geleitet',
      'Kleine Gruppengröße für echten Rückzug',
      'Termine und Preise werden rechtzeitig vor jedem Retreat veröffentlicht',
    ],
    forWho: [
      'Du brauchst echten Abstand vom Alltag, um wirklich anzukommen.',
      'Du hast bereits Erfahrung mit Breathwork oder Bodywork und möchtest vertiefen.',
      'Du suchst mehr als einen einzelnen Tag oder eine einzelne Session.',
    ],
    process: [
      'Interesse vormerken – du wirst informiert, sobald ein neues Retreat feststeht.',
      'Anmeldung und Vorgespräch vor dem Retreat.',
      'Mehrere Tage Körperarbeit, Atem, Bewegung, Stille und Integration.',
    ],
    relatedSlugs: ['coming-home-jahresbegleitung', 'feminine-power-workshop', 'kundalini-awakening'],
    relatedArticleSlugs: ['community-und-gruppenarbeit'],
    metaDescription:
      'Coming Home Retreats mit Jasmin: mehrtägige Auszeit mit Körperarbeit, Atem und Stille. Termine und Preise auf Anfrage.',
  },
]

export function getServiceBySlug(slug: string | undefined): Service | undefined {
  return services.find((service) => service.slug === slug)
}

export const categoryLabels: Record<Service['category'], string> = {
  einzelsession: 'Einzelsession',
  begleitung: 'Mehrmonatige Begleitung',
  workshop: 'Workshop',
  gruppe: 'Gruppenformat',
  retreat: 'Retreat',
}
