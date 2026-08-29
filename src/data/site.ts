/**
 * Sämtliche Texte der Seite an einer Stelle.
 * Jasmin kann hier Inhalte ändern, ohne in die Komponenten zu greifen.
 */

import { formatPrice, pricing } from './pricing'

export const site = {
  brand: 'Coming Home',
  brandLong: 'Coming Home by Jasmin',
  email: 'hallo@cominghome.de',
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
  lead: 'Coming Home ist körperorientierte Begleitung für Menschen, die viel verstanden haben – und spüren, dass Veränderung nicht nur im Kopf geschieht. Über Atem, Berührung und bewusste Körperarbeit findest du zurück in Verbindung mit dir selbst.',
  modalities:
    'Breathwork · Holistic Bodywork · Cranio-Sacrale Impulsarbeit · Kundalini Awakening · 1:1 Begleitung · Workshops',
  brandLines: ['Zurück in deinen Körper.', 'Zurück in deine Wahrheit.', 'Zurück zu dir.'],
} as const

export const ankommen = {
  eyebrow: 'Ankommen',
  heading: 'Vielleicht kennst du dieses Gefühl.',
  lead: 'Du funktionierst. Du kümmerst dich. Du machst weiter. Und irgendwo zwischen all dem hast du begonnen, die leisen Signale deines Körpers zu überhören.',
  items: [
    'Vielleicht bemerkst du deine Bedürfnisse erst, wenn deine Grenzen längst überschritten sind.',
    'Vielleicht verstehst du bereits unglaublich viel über dich – und trotzdem wiederholen sich dieselben Muster.',
    'Vielleicht sehnst du dich nach mehr Ruhe, Lebendigkeit, Verbindung oder Klarheit.',
  ],
  closing:
    'Dann geht es nicht darum, noch mehr über dich zu lernen. Sondern wieder zu lernen, dich zu spüren.',
} as const

export const jasmin = {
  eyebrow: 'Die Begleiterin',
  heading: 'Ich bin Jasmin.',
  intro:
    'Ich begleite Menschen über den Körper, den Atem, Berührung und bewusste Präsenz zurück in eine tiefere Verbindung mit sich selbst.',
  paragraphs: [
    'Mir geht es nicht darum, Menschen zu reparieren oder ihnen zu sagen, wer sie sein sollen. Ich möchte Räume schaffen, in denen sie wieder wahrnehmen können, was längst in ihnen da ist: ihre Grenzen, ihre Bedürfnisse, ihre Gefühle, ihre Kraft, ihre Wahrheit.',
    'Meine Arbeit verbindet körperorientierte Begleitung, Breathwork, achtsame Berührung und Nervensystemarbeit. Sicherheit, Mut und Freiheit bilden dabei die Grundlage.',
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
      offers: '1:1 Begleitung – 10-Stunden-Paket',
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
  lead: 'Du musst nicht wissen, welcher Weg der richtige ist. Manchmal beginnt Veränderung mit einem einzigen Atemzug, einer Begegnung oder einem Moment, in dem du dich wieder wirklich spürst.',
  steps: [
    {
      num: '01',
      keyword: 'Entdecken',
      title: 'Der erste Schritt zurück zu dir.',
      text: 'Vielleicht spürst du schon lange, dass da mehr in dir steckt. Mehr Verbindung. Mehr Lebendigkeit. Mehr von dem, was sich wirklich nach dir anfühlt. Im Tagesseminar lernst du meine Arbeit kennen, sammelst erste Erfahrungen und beginnst, deinem Körper und deiner inneren Stimme wieder zuzuhören.',
      offers: ['Feminine Power – Tagesworkshop'],
      cta: { label: 'Workshop entdecken', href: '/#termine' },
    },
    {
      num: '02',
      keyword: 'Vertiefen',
      title: 'Ein Raum, der sich ganz nach dir richtet.',
      text: 'Manchmal braucht es einen geschützten Rahmen, in dem alles da sein darf. Deine Themen. Dein Tempo. Dein Nervensystem. In der individuellen Begleitung entsteht Raum für echte Tiefe und nachhaltige Veränderung. Es geht nicht um eine starre Methode. Jede Session entsteht aus dem, was dein Körper, dein Nervensystem und dein Leben gerade brauchen.',
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
        'Veränderung braucht keinen weiteren schnellen Impuls. Sie braucht Raum, Wiederholung und ehrliche Begegnung.',
      text: 'Veränderung beginnt dort, wo neue Erfahrungen Teil deines Alltags werden. Wahre Transformation entsteht nicht in einem einzigen Moment, sondern durch bewusste Wiederholung, Integration und Begleitung über einen längeren Zeitraum. Die Coming-Home-Begleitungen sind für Menschen, die nicht länger nur über Veränderung sprechen möchten. Sie sind für Menschen, die bereit sind, sich selbst radikal ehrlich zu begegnen, blinde Flecken anzusehen und eine neue Beziehung zu ihrem Körper, ihren Grenzen, Bedürfnissen und ihrer inneren Wahrheit aufzubauen.',
      offers: ['Coming Home – dreimonatige Begleitung', 'Coming Home – Jahresbegleitung'],
      cta: { label: 'Begleitungen kennenlernen', href: '/#kennenlernen' },
    },
    {
      num: '04',
      keyword: 'Weitergeben',
      note: 'Zukunftsvision',
      title: 'Was du selbst verkörpert hast, kannst du eines Tages auch für andere halten.',
      text: 'Die zukünftige Coming-Home-Ausbildung verbindet Selbsterfahrung, Körperbewusstsein, Nervensystemarbeit, Präsenz und die Kunst, sichere Räume für andere Menschen zu gestalten.',
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
    'Ich glaube nicht daran, dass wir Menschen reparieren müssen. Ich glaube daran, dass vieles bereits in uns liegt – unter all den Schichten aus Funktionieren, Erwartungen, Kontrolle und dem, was wir gelernt haben zu sein.',
    'Mein eigener Weg hat mich immer tiefer aus dem Verstehen ins Fühlen geführt. Zurück in meinen Körper. Zu meinem Atem. Zu meiner Wahrheit.',
    'Und genau daraus ist meine Arbeit entstanden.',
    'Heute begleite ich Menschen mit Körperarbeit, Breathwork, achtsamer Berührung und tiefer Präsenz. Dabei arbeite ich nicht nach einem starren Schema. Ich höre zu. Ich nehme wahr. Ich begegne dir dort, wo du gerade bist – und wir schauen gemeinsam, was dein Körper und dein System in diesem Moment wirklich brauchen.',
  ],
  quote:
    'Mein Herzensanliegen ist es, einen sicheren Raum zu schaffen, in dem du dir selbst ehrlich begegnen kannst.',
  paragraphsAfter: [
    'Einen Raum, in dem nichts weggemacht werden muss. In dem Gefühle da sein dürfen. Grenzen da sein dürfen. Stille da sein darf. Und in dem du dich Stück für Stück wieder daran erinnern kannst, wie es sich anfühlt, wirklich bei dir zu sein.',
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
    },
    {
      glyph: '〜',
      title: 'Atem',
      text: 'Der Atem kann Räume öffnen, in denen Kontrolle weicher und Fühlen wieder möglich wird.',
    },
    {
      glyph: '✦',
      title: 'Berührung',
      text: 'Achtsame Berührung öffnet Räume, die Worte nicht erreichen. Sicher. Respektvoll. Transformativ.',
    },
    {
      glyph: '◐',
      title: 'Integration',
      text: 'Erfahrungen brauchen Zeit, um sich zu setzen. Integration macht aus Erlebnissen echtes Leben.',
    },
  ],
} as const

export const fuerWen = {
  eyebrow: 'Ist das dein Weg?',
  heading: 'Vielleicht erkennst du dich hier wieder.',
  statements: [
    'Du leistest viel und verlierst dich dabei immer wieder selbst.',
    'Du bemerkst deine Bedürfnisse oft erst, wenn deine Grenzen längst überschritten sind.',
    'Du sehnst dich nach tiefer Verbindung und hast gleichzeitig Angst davor, dich wirklich zu zeigen.',
    'Du hast schon viel verstanden und merkst, dass Wissen allein nicht alles verändert.',
    'Du möchtest dich wieder lebendig, sinnlich, klar und mit dir verbunden fühlen.',
    'Du bist bereit, Verantwortung für deinen eigenen Weg zu übernehmen.',
  ],
  closing:
    'Du musst nicht fertig sein. Aber du solltest bereit sein, dir selbst ehrlich zu begegnen.',
} as const

export const bewerbung = {
  eyebrow: 'Kennenlernen',
  heading: 'Lass uns gemeinsam schauen, was zu dir passt.',
  intro:
    'Die drei- und zwölfmonatigen Coming-Home-Begleitungen sind keine Programme, die du einfach konsumierst. Sie sind eine intensive Reise.',
  intro2:
    'Deshalb beginnt die Zusammenarbeit mit einem persönlichen Bewerbungsbogen und einem unverbindlichen Kennenlerngespräch. So können wir gemeinsam herausfinden, ob dieser Raum und diese Form der Begleitung im Moment wirklich zu dir passen.',
  formTitle: 'Bewerbungsbogen',
  programs: [
    'Feminine Power – Tagesworkshop',
    '1:1 Begleitung – 10-Stunden-Paket',
    'Coming Home – dreimonatige Begleitung',
    'Coming Home – Jahresbegleitung',
    'Ich bin mir noch nicht sicher',
  ],
  consent:
    'Ich bin damit einverstanden, dass Jasmin meine Angaben zur Kontaktaufnahme verwendet.',
  submit: 'Anfrage senden',
  successTitle: 'Danke für dein Vertrauen.',
  successText:
    'Deine Bewerbung ist angekommen. Ich melde mich innerhalb der nächsten Tage persönlich bei dir.',
} as const

export const faq = {
  eyebrow: 'FAQs',
  heading: 'Vielleicht fragst du dich noch …',
  items: [
    {
      slug: 'brauche-ich-erfahrung',
      q: 'Brauche ich Erfahrung mit Breathwork oder Körperarbeit?',
      a: 'Nein. Du brauchst kein Vorwissen und keine Technik. Ich führe dich Schritt für Schritt durch die Session und erkläre dir vorher alles, was du wissen möchtest. Mitzubringen ist nur die Bereitschaft, dich für eine Weile einzulassen.',
    },
    {
      slug: 'wie-laeuft-erste-session-ab',
      q: 'Wie läuft eine erste Session ab?',
      a: 'Wir beginnen mit einem Gespräch: Wie geht es dir gerade, was bringst du mit, was braucht Raum? Daraus entsteht der weitere Verlauf – Atem, Körperarbeit, Berührung oder auch Stille. Am Ende bleibt Zeit zum Nachspüren und für ein kurzes Integrationsgespräch.',
    },
    {
      slug: 'muss-ich-mich-ausziehen',
      q: 'Muss ich mich bei Bodywork ausziehen?',
      a: 'Nein. Du entscheidest, was sich für dich stimmig anfühlt. Viele Menschen bleiben in bequemer Kleidung. Alles, was wir tun, wird vorher besprochen – nichts geschieht ohne dein Einverständnis.',
    },
    {
      slug: 'was-ist-achtsame-beruehrung',
      q: 'Was bedeutet achtsame Berührung?',
      a: 'Achtsame Berührung ist langsam, klar und angekündigt. Sie will nichts erreichen und nichts wegmachen. Du bestimmst jederzeit, wo, wie und ob berührt wird – und du darfst jederzeit Nein sagen, ohne dich erklären zu müssen.',
    },
    {
      slug: 'was-passiert-bei-starken-emotionen',
      q: 'Was passiert, wenn während einer Session starke Emotionen auftauchen?',
      a: 'Gefühle dürfen da sein. Genau dafür ist der Raum gedacht. Ich bleibe präsent, begleite dich und wir verlangsamen, wann immer es nötig ist. Nichts muss ausgehalten werden – wir arbeiten immer im Tempo deines Nervensystems.',
    },
    {
      slug: 'wie-sorgst-du-fuer-sicherheit',
      q: 'Wie sorgst du für Sicherheit während einer Session?',
      a: 'Durch klare Absprachen vor der Session, laufende Rückfragen währenddessen und die Möglichkeit, jederzeit zu pausieren oder abzubrechen. Sicherheit, Mut und Freiheit sind die Grundlage meiner Arbeit – in dieser Reihenfolge.',
    },
    {
      slug: 'wie-lange-dauert-session',
      q: 'Wie lange dauert eine 1:1-Session?',
      a: 'Eine einzelne Session dauert in der Regel 90 Minuten, inklusive Ankommen, Arbeit und Integration. Für Erstsessions plane ich etwas mehr Zeit ein.',
    },
    {
      slug: 'was-kostet-eine-begleitung',
      q: 'Was kostet eine Begleitung?',
      a: 'Das Tagesseminar „Feminine Power" kostet 369 € pro Person. Die 1:1-Begleitung (10-Stunden-Paket), die dreimonatige Begleitung und die Jahresbegleitung sind individuell und werden im kostenlosen Kennenlerngespräch besprochen – dort schauen wir gemeinsam, welcher Rahmen und welches Investment zu dir passen.',
    },
    {
      slug: 'wo-finden-sessions-statt',
      q: 'Wo finden die Sessions statt?',
      a: '1:1 Sessions finden in Niederösterreich statt, einzelne Termine sind auch online möglich. Den genauen Ort erfährst du bei der Terminvereinbarung. Der Ort des Tagesseminars wird bei der Anmeldung bekannt gegeben.',
    },
    {
      slug: 'wann-nicht-geeignet',
      q: 'Wann ist Breathwork oder Körperarbeit nicht für mich geeignet?',
      a: 'Bei Schwangerschaft, Epilepsie, schweren Herz-Kreislauf-Erkrankungen, akuten psychiatrischen Krisen oder nach frischen Operationen bitte vorab Rücksprache halten. Meine Arbeit ersetzt keine ärztliche oder psychotherapeutische Behandlung – sie kann sie aber gut begleiten.',
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
      title: 'Feminine Power – Tagesworkshop',
      desc: 'Ein transformierender Workshop für Frauen, die in ihre Sexualität eintauchen, ihre Lust wecken und ihre wahre Weiblichkeit leben wollen.',
      location: 'Wird bei Anmeldung bekannt gegeben',
      seats: 'begrenzte Plätze',
      price: formatPrice(pricing.tagesseminar.price),
    },
  ],
  reserveLabel: 'Meinen Platz reservieren',
} as const

export const newsletter = {
  eyebrow: 'Kostenloser Einstieg',
  heading: 'Ein Moment nur für dich.',
  sub: '5 Minuten. Dein Atem. Dein Körper.',
  body: 'Eine kurze geführte Audioübung, die dich aus dem Funktionieren zurück in deinen Körper bringt. Kostenlos.',
  submit: 'Audioübung erhalten',
  consent:
    'Ich möchte die Audioübung erhalten und stimme der Verarbeitung meiner E-Mail-Adresse zu.',
  disclaimer:
    'Du erhältst außerdem gelegentlich Impulse und Informationen zu neuen Räumen und Veranstaltungen. Abmeldung jederzeit möglich.',
  success: 'Schau in dein Postfach – die Audioübung ist unterwegs zu dir.',
} as const

export const abschluss = {
  heading: 'Vielleicht beginnt Coming Home genau hier.',
  text: 'Du musst nicht wissen, wie der ganze Weg aussieht. Du musst nur spüren, ob es Zeit ist, den ersten Schritt zu machen.',
  sub: 'Unverbindlich kennenlernen · Fragen klären · gemeinsam schauen, welcher Raum zu dir passt.',
} as const

export const kontakt = {
  eyebrow: 'Kontakt',
  heading: 'Schreib mir – ganz ohne Druck.',
  text: 'Wenn du eine Frage hast oder einfach spüren möchtest, ob meine Arbeit zu dir passt, hinterlass mir gern eine Nachricht.',
  submit: 'Nachricht senden',
  success: 'Deine Nachricht ist angekommen. Ich melde mich bald bei dir.',
  links: [
    { label: 'Impressum', href: '/impressum' },
    { label: 'Datenschutz', href: '/datenschutz' },
    { label: 'AGB', href: '/agb' },
  ],
} as const
