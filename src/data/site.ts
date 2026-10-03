/**
 * Sämtliche Texte der Seite an einer Stelle.
 * Jasmin kann hier Inhalte ändern, ohne in die Komponenten zu greifen.
 */

import { formatPrice, pricing } from './pricing'

export const site = {
  brand: 'Coming Home',
  brandLong: 'Coming Home by Jasmin',
  email: 'hallo@jasmindraxl.at',
  instagram: 'https://www.instagram.com/',
  claim: 'Coming Home – Körperbewusstsein und echte Verbindung.',
  ctaLabel: 'Kennenlerngespräch vereinbaren',
} as const

export const navLinks = [
  { label: 'Angebote', href: '/#orientierung' },
  { label: 'Über Jasmin', href: '/#jasmin' },
  { label: 'Workshops', href: '/#termine' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Kontakt', href: '/#kontakt' },
] as const

export const hero = {
  overline: 'Wien & Innermanzing',
  titleLines: ['Du funktionierst.', 'Aber spürst du dich noch?'],
  lead: 'Du hast viel verstanden – und trotzdem ändert sich wenig? Ich begleite dich über Atem, Berührung und Körperarbeit zurück zu dir.',
  modalities:
    'Breathwork · Holistic Bodywork · Cranio-Sacrale Impulsarbeit · Kundalini Awakening',
  brandLines: ['Zurück in deinen Körper.', 'Zurück in deine Wahrheit.', 'Zurück zu dir.'],
} as const

export const ankommen = {
  eyebrow: 'Ankommen',
  heading: 'Viel im Kopf. Wenig im Körper.',
  lead: 'Du kümmerst dich um alles. Nur die Signale deines Körpers überhörst du.',
  items: [
    'Du merkst Grenzen erst, wenn sie überschritten sind.',
    'Du verstehst deine Muster – und sie bleiben.',
    'Du sehnst dich nach Ruhe und Lebendigkeit.',
  ],
  closing: 'Mehr Verstehen hilft dann nicht. Wieder spüren schon.',
} as const

export const jasmin = {
  eyebrow: 'Die Begleiterin',
  heading: 'Ich bin Jasmin.',
  intro: 'Ich begleite dich über Körper, Atem und Berührung zurück zu dir.',
  paragraphs: [
    'Ich will dich nicht reparieren. Ich schaffe einen Raum, in dem du wieder spürst, was längst in dir da ist.',
    'Grundlage meiner Arbeit: Sicherheit, Mut und Freiheit.',
  ],
  credentialsLabel: 'Ausbildung & Erfahrung',
  credentials: [
    { title: 'med. Masseurin', detail: '— Vitalakademie 2017' },
    { title: 'Dipl. Cranio Sacral Praktikerin', detail: '— MENTAS 2019' },
    { title: 'Kundalini Awakening & Breathwork Facilitator', detail: '— 2024-2026' },
  ],
  cta: 'Kennenlerngespräch buchen',
} as const

export const orientierung = {
  eyebrow: 'Angebote',
  heading: 'Welcher Weg passt zu dir?',
  cards: [
    {
      num: '01',
      label: 'Ausprobieren',
      tagline: 'Du willst meine Arbeit erst erleben.',
      desc: 'Ein Tag in der Gruppe. Kein Vorwissen nötig.',
      offers: 'Tagesseminar',
    },
    {
      num: '02',
      label: 'Vertiefen',
      tagline: 'Du willst einen Raum nur für dich.',
      desc: 'Eine Session ganz in deinem Tempo.',
      offers: 'Individuelle 1:1 Session',
    },
    {
      num: '03',
      label: 'Transformieren',
      tagline: 'Du willst länger begleitet werden.',
      desc: 'Ein Weg über Monate – begleitet und integriert.',
      offers: '3-Monats-Begleitung · Jahresbegleitung',
    },
  ],
  closing: 'Noch unsicher? Wir klären es in 20 Minuten am Telefon – kostenlos.',
} as const

export const arbeitsweise = {
  eyebrow: 'Meine Arbeitsweise',
  heading: 'Wo der Kopf nicht weiterkommt, hilft der Körper.',
  inviteEyebrow: 'Komm für einen Moment an',
  inviteLines: [
    ['Atme ein.', 'Spüre deinen Körper.'],
    ['Atme aus.', 'Lass ein wenig weicher werden.'],
    ['Nur dieser Moment. Nur du.'],
  ],
  cards: [
    {
      glyph: '◯',
      title: 'Körper',
      text: 'Dein Körper ist Kompass und Zuhause.',
      href: '/ratgeber/was-ist-holistic-bodywork',
    },
    {
      glyph: '〜',
      title: 'Atem',
      text: 'Der Atem löst Kontrolle. Fühlen wird wieder möglich.',
      href: '/ratgeber/was-ist-breathwork',
    },
    {
      glyph: '✦',
      title: 'Berührung',
      text: 'Erreicht, was Worte nicht erreichen. Sicher und respektvoll.',
      href: '/ratgeber/achtsame-beruehrung-erklaert',
    },
    {
      glyph: '◐',
      title: 'Integration',
      text: 'Damit das Erlebte in deinem Alltag ankommt.',
      href: '/ratgeber/kundalini-awakening-praxis-und-integration',
    },
  ],
} as const

export const bewerbung = {
  eyebrow: 'Kennenlernen',
  heading: 'In 20 Minuten wissen, was zu dir passt.',
  intro: 'Ein kurzes Telefonat über dich und deine Fragen.',
  intro2: 'Such dir einfach einen Termin aus.',
  formTitle: 'Dein kostenloses Kennenlerngespräch',
} as const

export const faq = {
  eyebrow: 'FAQs',
  heading: 'Bevor du buchst',
  items: [
    {
      slug: 'brauche-ich-erfahrung',
      q: 'Brauche ich Vorerfahrung?',
      a: 'Nein. Ich erkläre dir vorher alles und führe dich Schritt für Schritt.',
    },
    {
      slug: 'wie-laeuft-erste-session-ab',
      q: 'Wie läuft eine erste Session ab?',
      a: 'Wir starten mit einem Gespräch, dann folgen Atem, Körperarbeit, Berührung oder Stille. Zum Schluss bleibt Zeit zum Nachspüren und für ein kurzes Integrationsgespräch.',
    },
    {
      slug: 'muss-ich-mich-ausziehen',
      q: 'Muss ich mich bei Bodywork ausziehen?',
      a: 'Nein. Viele bleiben in bequemer Kleidung – und nichts geschieht ohne dein Einverständnis.',
    },
    {
      slug: 'wie-lange-dauert-session',
      q: 'Wie lange dauert eine 1:1-Session?',
      a: 'Ca. 1,5–2 Stunden, inklusive Ankommen und Integration. Erstsessions etwas länger.',
    },
    {
      slug: 'was-kostet-eine-begleitung',
      q: 'Was kostet eine Begleitung?',
      a: `Der Tagesworkshop kostet ${formatPrice(pricing.tagesseminar.price)} pro Person, eine 1:1 Session 160 € – 220 € je nach Dauer. Die 3- und 12-Monats-Begleitung besprechen wir im kostenlosen Kennenlerngespräch.`,
    },
    {
      slug: 'wo-finden-sessions-statt',
      q: 'Wo finden die Sessions statt?',
      a: '1:1 Sessions in 1120 Wien oder 3052 Innermanzing, einzelne Termine auch online. Der Tagesworkshop findet bei Wakanda Health, 3052 Neustift Innermanzing statt.',
    },
    {
      slug: 'wann-nicht-geeignet',
      q: 'Wann ist Breathwork oder Körperarbeit nicht für mich geeignet?',
      a: 'Bei Schwangerschaft, Epilepsie, schweren Herz-Kreislauf-Erkrankungen, akuten psychiatrischen Krisen oder frischen Operationen bitte vorab Rücksprache halten. Meine Arbeit ersetzt keine ärztliche oder psychotherapeutische Behandlung, kann sie aber begleiten.',
    },
  ],
} as const

export function getFaqBySlug(slug: string) {
  return faq.items.find((item) => item.slug === slug)
}

export const termine = {
  eyebrow: 'Workshops & Termine',
  heading: 'Erlebe meine Arbeit an einem Tag.',
  events: [
    {
      date: '24. Oktober 2026',
      time: '9:00 – 18:00 Uhr',
      title: 'Coming Home – Connected Breathwork',
      desc: 'Ein Tag, der dich aus dem Funktionieren ins Spüren bringt. Mit Bewegung, Begegnung, Körperwahrnehmung und Connected Breathwork.',
      location: 'Wakanda Health, 3052 Neustift Innermanzing',
      seats: 'begrenzte Plätze',
      price: formatPrice(pricing.tagesseminar.price),
      slug: 'feminine-power-workshop',
    },
  ],
  reserveLabel: 'Meinen Platz buchen',
} as const

export const newsletter = {
  eyebrow: 'Kostenloser Einstieg',
  heading: 'Ein Moment nur für dich.',
  sub: '5 Minuten. Dein Atem. Dein Körper.',
  body: 'Eine geführte Audioübung, die dich zurück in deinen Körper bringt.',
  submit: 'Audioübung erhalten',
  consent:
    'Ich möchte die Audioübung erhalten und stimme der Verarbeitung meiner E-Mail-Adresse zu.',
  disclaimer:
    'Du erhältst gelegentlich Impulse zu neuen Räumen und Veranstaltungen. Abmeldung jederzeit möglich.',
  success: 'Schau in dein Postfach – die Audioübung ist unterwegs zu dir.',
} as const

export const abschluss = {
  heading: 'Der erste Schritt dauert 20 Minuten.',
  text: 'Du musst den ganzen Weg nicht kennen. Ein Gespräch reicht für den Anfang.',
  sub: 'Kostenlos · Unverbindlich · Am Telefon',
} as const

export const kontakt = {
  eyebrow: 'Kontakt',
  heading: 'Lieber schreiben?',
  text: 'Stell mir deine Frage. Ich melde mich bald bei dir.',
  submit: 'Nachricht senden',
  success: 'Deine Nachricht ist angekommen. Ich melde mich bald bei dir.',
  links: [
    { label: 'Impressum', href: '/impressum' },
    { label: 'Datenschutz', href: '/datenschutz' },
    { label: 'AGB', href: '/agb' },
  ],
} as const
