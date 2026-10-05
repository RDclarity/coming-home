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
  lead: 'Körperarbeit, Atem und Berührung – zurück in deinen Körper.',
  trust: ['20 Minuten', 'kostenlos', 'unverbindlich'],
} as const

export const ankommen = {
  eyebrow: 'Kennst du das?',
  heading: 'Viel im Kopf. Wenig im Körper.',
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
  intro: 'Ich will dich nicht reparieren. Ich schaffe den Raum, in dem du dich wieder spürst.',
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
  naechsterTermin: 'Nächster Termin',
  heading: 'Welcher Weg passt zu dir?',
  cards: [
    {
      num: '01',
      label: 'Ausprobieren',
      tagline: 'Ein Tag in der Gruppe.',
      offers: 'Tagesseminar Connected Breathwork',
      price: formatPrice(pricing.tagesseminar.price),
      cta: { label: 'Platz buchen', href: '/#workshop-buchen' },
    },
    {
      num: '02',
      label: 'Vertiefen',
      tagline: 'Eine Session nur für dich.',
      offers: 'Individuelle 1:1 Session',
      price: '160 € – 220 €',
      cta: { label: 'Kennenlernen buchen', href: '/#kennenlernen' },
    },
    {
      num: '03',
      label: 'Transformieren',
      tagline: 'Begleitung über Monate.',
      offers: '3-Monats- oder Jahresbegleitung',
      price: 'Individuell',
      cta: { label: 'Kennenlernen buchen', href: '/#kennenlernen' },
    },
  ],
} as const

export const bewerbung = {
  eyebrow: 'So einfach geht’s',
  heading: 'In drei Schritten zu deinem Gespräch.',
  steps: [
    { title: 'Termin wählen', text: 'Freien Slot im Kalender aussuchen.' },
    { title: 'Wir telefonieren', text: '20 Minuten, kostenlos. Ich rufe dich an.' },
    { title: 'Du entscheidest', text: 'Ob und wie wir weitergehen – ohne Druck.' },
  ],
  cta: 'Freien Termin wählen',
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

export const workshopBuchung = {
  eyebrow: 'Workshop',
  formTitle: 'Platz reservieren',
  plaetzeLabel: 'Plätze',
  nachrichtLabel: 'Möchtest du mir noch etwas sagen? (optional)',
  submit: 'Platz verbindlich reservieren',
  successTitle: 'Dein Platz ist reserviert.',
  successText: 'Die Bestätigung ist unterwegs. Ich melde mich mit allen Infos zur Zahlung.',
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
