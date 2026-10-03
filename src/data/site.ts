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
  { label: 'Dein Weg', href: '/#dein-weg' },
  { label: 'Begleitungen', href: '/begleitungen' },
  { label: 'Workshops & Termine', href: '/#termine' },
  { label: 'Ratgeber', href: '/ratgeber' },
  { label: 'Über Jasmin', href: '/#ueber-jasmin' },
  { label: 'Kontakt', href: '/#kontakt' },
] as const

export const hero = {
  overline: 'Coming Home',
  titleLines: ['Du funktionierst.', 'Aber spürst du dich noch?'],
  lead: 'Coming Home ist körperorientierte Begleitung für Menschen, die viel verstanden haben, aber merken: Veränderung braucht mehr als den Kopf. Über Atem, Berührung und Körperarbeit zurück in Verbindung mit dir selbst.',
  modalities:
    'Breathwork · Holistic Bodywork · Cranio-Sacrale Impulsarbeit · Kundalini Awakening · 1:1 Begleitung · Workshops',
  brandLines: ['Zurück in deinen Körper.', 'Zurück in deine Wahrheit.', 'Zurück zu dir.'],
} as const

export const ankommen = {
  eyebrow: 'Ankommen',
  heading: 'Vielleicht kennst du dieses Gefühl.',
  lead: 'Du funktionierst, kümmerst dich, machst weiter. Und irgendwo dabei hast du begonnen, die leisen Signale deines Körpers zu überhören.',
  items: [
    'Vielleicht bemerkst du deine Bedürfnisse erst, wenn deine Grenzen schon überschritten sind.',
    'Vielleicht verstehst du schon viel über dich – und trotzdem wiederholen sich dieselben Muster.',
    'Vielleicht sehnst du dich nach mehr Ruhe, Lebendigkeit, Verbindung oder Klarheit.',
  ],
  closing:
    'Dann hilft nicht noch mehr Verstehen. Sondern wieder lernen, dich zu spüren.',
} as const

export const jasmin = {
  eyebrow: 'Die Begleiterin',
  heading: 'Ich bin Jasmin.',
  intro:
    'Ich begleite Menschen über Körper, Atem, Berührung und Präsenz zurück in Verbindung mit sich selbst.',
  paragraphs: [
    'Ich will Menschen nicht reparieren oder ihnen sagen, wer sie sein sollen. Ich schaffe Räume, in denen sie wieder spüren, was längst in ihnen da ist: Grenzen, Bedürfnisse, Gefühle, Kraft, Wahrheit.',
    'Meine Arbeit verbindet Körperarbeit, Breathwork, achtsame Berührung und Nervensystemarbeit – auf der Grundlage von Sicherheit, Mut und Freiheit.',
  ],
  credentialsLabel: 'Ausbildung & Erfahrung',
  credentials: [
    { title: 'med. Masseurin', detail: '— Vitalakademie 2017' },
    { title: 'Dipl. Cranio Sacral Praktikerin', detail: '— MENTAS 2019' },
    { title: 'Kundalini Awakening & Breathwork Facilitator', detail: '— 2024-2026' },
  ],
  cta: 'Mehr über mich',
} as const

export const orientierung = {
  eyebrow: 'Orientierung',
  heading: 'Wo stehst du gerade?',
  cards: [
    {
      num: '01',
      label: 'Kennenlernen',
      tagline: 'Du möchtest meine Arbeit zunächst erleben.',
      desc: 'Kein Commitment, kein Vorwissen nötig. Nur die Bereitschaft, dich für eine Weile einzulassen.',
      offers: 'Tagesseminar',
    },
    {
      num: '02',
      label: 'Vertiefen',
      tagline: 'Du möchtest einen Raum nur für dich.',
      desc: 'Individuelle Sessions, die sich ganz an dir, deinem Körper und deinem Tempo ausrichten.',
      offers: 'Individuelle 1:1 Session',
    },
    {
      num: '03',
      label: 'Transformieren',
      tagline: 'Du möchtest über einen längeren Zeitraum begleitet werden.',
      desc: 'Nicht eine einzelne Erfahrung, sondern ein ganzer Weg: begleitet, gehalten, integriert.',
      offers: '3-Monats-Begleitung · Jahresbegleitung',
    },
  ],
  closing: 'Du musst heute noch nicht wissen, welcher Weg der richtige ist.',
} as const

export const reise = {
  eyebrow: 'Deine Reise',
  heading: 'Deine Reise beginnt genau dort, wo du heute stehst.',
  lead: 'Du musst nicht wissen, welcher Weg richtig ist. Manchmal beginnt Veränderung mit einem Atemzug, einer Begegnung – einem Moment, in dem du dich wieder spürst.',
  steps: [
    {
      num: '01',
      keyword: 'Entdecken',
      title: 'Der erste Schritt zurück zu dir.',
      text: 'Vielleicht spürst du schon lange: Da steckt mehr in dir. Mehr Verbindung, mehr Lebendigkeit. Im Tagesseminar lernst du meine Arbeit kennen und beginnst, deinem Körper wieder zuzuhören.',
      offers: ['Coming Home – Connected Breathwork'],
      cta: { label: 'Workshop entdecken', href: '/#termine' },
    },
    {
      num: '02',
      keyword: 'Vertiefen',
      title: 'Ein Raum, der sich ganz nach dir richtet.',
      text: 'Manchmal braucht es einen geschützten Rahmen, in dem alles da sein darf – deine Themen, dein Tempo, dein Nervensystem. In der individuellen Begleitung entsteht Raum für echte Tiefe. Keine starre Methode: Jede Session richtet sich danach, was du gerade brauchst.',
      offers: [
        'Holistic Bodywork',
        'Breathwork',
        'Cranio-Sacrale Impulsarbeit',
        'Kundalini Awakening',
        'persönliches Mentoring',
      ],
      cta: { label: '1:1 Begleitung entdecken', href: '/begleitung/1-1-begleitung' },
    },
    {
      num: '03',
      keyword: 'Verkörpern',
      title:
        'Veränderung braucht keinen weiteren Impuls, sondern Raum, Wiederholung und ehrliche Begegnung.',
      text: 'Veränderung beginnt dort, wo neue Erfahrungen Teil deines Alltags werden – durch Wiederholung, Integration und Begleitung über Zeit. Die Coming-Home-Begleitungen sind für Menschen, die nicht mehr nur über Veränderung sprechen wollen, sondern bereit sind, sich radikal ehrlich zu begegnen und eine neue Beziehung zu Körper, Grenzen und innerer Wahrheit aufzubauen.',
      offers: ['Coming Home – dreimonatige Begleitung', 'Coming Home – Jahresbegleitung'],
      cta: { label: 'Begleitungen kennenlernen', href: '/#kennenlernen' },
    },
    {
      num: '04',
      keyword: 'Weitergeben',
      note: 'Zukunftsvision',
      title: 'Was du selbst verkörpert hast, kannst du eines Tages auch für andere halten.',
      text: 'Die zukünftige Coming-Home-Ausbildung verbindet Selbsterfahrung, Körperbewusstsein, Nervensystemarbeit und die Kunst, sichere Räume für andere zu gestalten.',
      offers: ['Coming Home Ausbildung', 'spätere Vertiefungsprogramme'],
      cta: { label: 'Interesse vormerken', href: '/#kontakt' },
    },
  ],
} as const

export const ueberJasmin = {
  eyebrow: 'Mehr über Jasmin',
  headingBefore: 'Ich schaffe Räume, in denen du nichts sein musst – außer ',
  headingEm: 'du selbst',
  paragraphs: [
    'Ich glaube nicht daran, Menschen zu reparieren. Ich glaube daran, dass vieles schon in uns liegt – unter den Schichten aus Funktionieren, Erwartungen und Kontrolle.',
    'Mein eigener Weg führte mich aus dem Verstehen ins Fühlen. Zurück in meinen Körper. Zu meinem Atem. Zu meiner Wahrheit.',
    'Und genau daraus ist meine Arbeit entstanden.',
    'Heute begleite ich Menschen mit Körperarbeit, Breathwork, achtsamer Berührung und Präsenz – ohne starres Schema. Ich höre zu, nehme wahr und begegne dir dort, wo du gerade bist.',
  ],
  quote:
    'Mein Herzensanliegen: ein sicherer Raum, in dem du dir selbst ehrlich begegnen kannst.',
  paragraphsAfter: [
    'Einen Raum, in dem nichts weggemacht werden muss. In dem Gefühle, Grenzen und Stille da sein dürfen. Und in dem du dich Stück für Stück daran erinnerst, wie es sich anfühlt, wirklich bei dir zu sein.',
    'Ich werde dir nicht sagen, wer du sein sollst.',
    'Ich begleite dich dabei, deine eigene Wahrheit wieder zu hören.',
  ],
  closing: 'Das ist für mich Coming Home.',
  skillsLabel: 'Meine Arbeit',
  skills: [
    'Holistic Bodywork',
    'Breathwork',
    'Cranio-Sacrale Impulsarbeit',
    'Kundalini Awakening',
    'Prozessbegleitung',
  ],
  cta: { label: 'Mehr über meinen Weg', href: '/#kontakt' },
} as const

export const arbeitsweise = {
  eyebrow: 'Meine Arbeitsweise',
  heading: 'Der Körper kennt Wege, die der Verstand nicht denken kann.',
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
      text: 'Der Körper ist nicht nur ein Werkzeug. Er ist Erinnerung, Kompass und Zuhause.',
      href: '/ratgeber/was-ist-holistic-bodywork',
    },
    {
      glyph: '〜',
      title: 'Atem',
      text: 'Der Atem öffnet Räume, in denen Kontrolle weicher und Fühlen wieder möglich wird.',
      href: '/ratgeber/was-ist-breathwork',
    },
    {
      glyph: '✦',
      title: 'Berührung',
      text: 'Achtsame Berührung öffnet Räume, die Worte nicht erreichen. Sicher. Respektvoll. Transformativ.',
      href: '/ratgeber/achtsame-beruehrung-erklaert',
    },
    {
      glyph: '◐',
      title: 'Integration',
      text: 'Erfahrungen brauchen Zeit, um sich zu setzen. Integration macht aus Erlebnissen echtes Leben.',
      href: '/ratgeber/kundalini-awakening-praxis-und-integration',
    },
  ],
} as const

export const fuerWen = {
  eyebrow: 'Ist das dein Weg?',
  heading: 'Vielleicht erkennst du dich hier wieder.',
  statements: [
    'Du leistest viel und verlierst dich dabei immer wieder selbst.',
    'Du bemerkst deine Bedürfnisse oft erst, wenn deine Grenzen schon überschritten sind.',
    'Du sehnst dich nach tiefer Verbindung – und hast Angst, dich wirklich zu zeigen.',
    'Du hast schon viel verstanden und merkst, dass Wissen allein nicht alles verändert.',
    'Du möchtest dich wieder lebendig, sinnlich, klar und mit dir verbunden fühlen.',
    'Du bist bereit, Verantwortung für deinen eigenen Weg zu übernehmen.',
  ],
  closing:
    'Du musst nicht fertig sein. Aber du solltest bereit sein, dir selbst ehrlich zu begegnen.',
} as const

export const bewerbung = {
  eyebrow: 'Kennenlernen',
  heading: 'Lass uns schauen, was zu dir passt.',
  intro:
    'Die drei- und zwölfmonatigen Begleitungen sind eine intensive Reise – kein Programm, das du einfach konsumierst.',
  intro2: 'Deshalb starten wir mit einem kurzen, kostenlosen Kennenlerngespräch. Wähl direkt einen Termin.',
  formTitle: 'Termin wählen',
} as const

export const faq = {
  eyebrow: 'FAQs',
  heading: 'Vielleicht fragst du dich noch …',
  items: [
    {
      slug: 'brauche-ich-erfahrung',
      q: 'Brauche ich Erfahrung mit Breathwork oder Körperarbeit?',
      a: 'Nein. Du brauchst kein Vorwissen und keine Technik. Ich führe dich Schritt für Schritt durch die Session und erkläre vorher alles. Mitzubringen ist nur die Bereitschaft, dich einzulassen.',
    },
    {
      slug: 'wie-laeuft-erste-session-ab',
      q: 'Wie läuft eine erste Session ab?',
      a: 'Wir beginnen mit einem Gespräch: Wie geht es dir, was braucht Raum? Daraus entsteht der weitere Verlauf – Atem, Körperarbeit, Berührung oder Stille. Am Ende bleibt Zeit zum Nachspüren und für ein kurzes Integrationsgespräch.',
    },
    {
      slug: 'muss-ich-mich-ausziehen',
      q: 'Muss ich mich bei Bodywork ausziehen?',
      a: 'Nein. Du entscheidest, was sich stimmig anfühlt – viele bleiben in bequemer Kleidung. Alles wird vorher besprochen, nichts geschieht ohne dein Einverständnis.',
    },
    {
      slug: 'was-ist-achtsame-beruehrung',
      q: 'Was bedeutet achtsame Berührung?',
      a: 'Achtsame Berührung ist langsam, klar und angekündigt. Sie will nichts erreichen, nichts wegmachen. Du bestimmst, wo, wie und ob berührt wird – und darfst jederzeit Nein sagen, ohne dich zu erklären.',
    },
    {
      slug: 'was-passiert-bei-starken-emotionen',
      q: 'Was passiert, wenn während einer Session starke Emotionen auftauchen?',
      a: 'Gefühle dürfen da sein – genau dafür ist der Raum gedacht. Ich bleibe präsent und wir verlangsamen, wann immer nötig. Nichts muss ausgehalten werden, wir arbeiten im Tempo deines Nervensystems.',
    },
    {
      slug: 'wie-sorgst-du-fuer-sicherheit',
      q: 'Wie sorgst du für Sicherheit während einer Session?',
      a: 'Durch klare Absprachen vorab, laufende Rückfragen währenddessen und die Möglichkeit, jederzeit zu pausieren oder abzubrechen. Sicherheit, Mut und Freiheit sind die Grundlage meiner Arbeit – in dieser Reihenfolge.',
    },
    {
      slug: 'wie-lange-dauert-session',
      q: 'Wie lange dauert eine 1:1-Session?',
      a: 'Plane für eine 1:1 Session ca. 1,5–2 Stunden ein, inklusive Ankommen, Arbeit und Integration. Für Erstsessions etwas mehr.',
    },
    {
      slug: 'was-kostet-eine-begleitung',
      q: 'Was kostet eine Begleitung?',
      a: 'Der Tagesworkshop „Coming Home – Connected Breathwork" kostet 369 € pro Person, eine 1:1 Session zwischen 160 € und 220 €, je nach Dauer. Die drei- und zwölfmonatige Begleitung sind individuell und werden im kostenlosen Kennenlerngespräch besprochen.',
    },
    {
      slug: 'wo-finden-sessions-statt',
      q: 'Wo finden die Sessions statt?',
      a: '1:1 Sessions finden in 1120 Wien oder 3052 Innermanzing statt, einzelne Termine auch online. Den genauen Ort erfährst du bei der Terminvereinbarung. Der Tagesworkshop findet bei Wakanda Health, 3052 Neustift Innermanzing statt.',
    },
    {
      slug: 'wann-nicht-geeignet',
      q: 'Wann ist Breathwork oder Körperarbeit nicht für mich geeignet?',
      a: 'Bei Schwangerschaft, Epilepsie, schweren Herz-Kreislauf-Erkrankungen, akuten psychiatrischen Krisen oder frischen Operationen bitte vorab Rücksprache halten. Meine Arbeit ersetzt keine ärztliche oder psychotherapeutische Behandlung, kann sie aber gut begleiten.',
    },
  ],
} as const

export function getFaqBySlug(slug: string) {
  return faq.items.find((item) => item.slug === slug)
}

export const termine = {
  eyebrow: 'Workshops & Termine',
  heading: 'Räume, in denen wir uns begegnen können',
  events: [
    {
      date: '24. Oktober 2026',
      time: '9:00 – 18:00 Uhr',
      title: 'Coming Home – Connected Breathwork',
      desc: 'Ein Tag, der dich aus dem Funktionieren zurück ins Spüren führt. Durch Bewegung, Begegnung, bewusste Körperwahrnehmung und Connected Breathwork entsteht ein Raum, in dem du dir selbst und anderen auf eine neue Weise begegnen kannst. Ein Tag zum Wahrnehmen. Zum Erleben. Zum Loslassen. Und zum Zurückkommen zu dir.',
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
  body: 'Eine kurze geführte Audioübung, die dich zurück in deinen Körper bringt. Kostenlos.',
  submit: 'Audioübung erhalten',
  consent:
    'Ich möchte die Audioübung erhalten und stimme der Verarbeitung meiner E-Mail-Adresse zu.',
  disclaimer:
    'Du erhältst gelegentlich Impulse zu neuen Räumen und Veranstaltungen. Abmeldung jederzeit möglich.',
  success: 'Schau in dein Postfach – die Audioübung ist unterwegs zu dir.',
} as const

export const abschluss = {
  heading: 'Vielleicht beginnt Coming Home genau hier.',
  text: 'Du musst nicht wissen, wie der ganze Weg aussieht. Nur spüren, ob es Zeit für den ersten Schritt ist.',
  sub: 'Unverbindlich kennenlernen · Fragen klären · gemeinsam schauen, welcher Raum zu dir passt.',
} as const

export const kontakt = {
  eyebrow: 'Kontakt',
  heading: 'Schreib mir – ganz ohne Druck.',
  text: 'Wenn du eine Frage hast oder spüren willst, ob meine Arbeit zu dir passt, hinterlass mir eine Nachricht.',
  submit: 'Nachricht senden',
  success: 'Deine Nachricht ist angekommen. Ich melde mich bald bei dir.',
  links: [
    { label: 'Impressum', href: '/impressum' },
    { label: 'Datenschutz', href: '/datenschutz' },
    { label: 'AGB', href: '/agb' },
  ],
} as const
