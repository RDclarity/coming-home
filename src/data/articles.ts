/**
 * Der Ratgeber: umfassende, eigenständige Artikel zu Themen rund um
 * körperorientierte Arbeit. Ziel ist echte Substanz statt Keyword-Füllstoff –
 * jeder Artikel soll eine konkrete Frage tatsächlich beantworten, auch für
 * jemanden, der nie eine Session bei Jasmin bucht. Das ist zugleich die beste
 * SEO- und KI-Suche-Strategie: Suchmaschinen und Sprachmodelle zitieren eher
 * Seiten, die eine Frage direkt und ehrlich beantworten.
 *
 * `updated` ist ein festes Datum (kein `new Date()`), damit Server- und
 * Client-Render beim Prerendering exakt gleich ausfallen.
 */

export type Article = {
  slug: string
  title: string
  dek: string
  category: string
  readingMinutes: number
  updated: string
  updatedIso: string
  metaDescription: string
  relatedSlugs: string[]
  relatedServiceSlugs: string[]
  body: ArticleBlock[]
}

export type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'quote'; text: string }

export const articles: Article[] = [
  {
    slug: 'was-ist-breathwork',
    title: 'Was ist Breathwork? Wirkung, Ablauf und für wen es geeignet ist',
    dek: 'Bewusste, verbundene Atmung wird oft als Trend abgetan – dabei steckt eine klare Methode dahinter. Ein ehrlicher Überblick.',
    category: 'Breathwork',
    readingMinutes: 6,
    updated: '21. August 2026',
    updatedIso: '2026-08-21',
    metaDescription:
      'Was ist Breathwork wirklich? Ablauf, Wirkung auf das Nervensystem, Unterschiede zwischen Gruppen- und Einzelsession, und für wen es geeignet ist.',
    relatedSlugs: ['nervensystemregulation-verstehen', 'erste-session-was-dich-erwartet', 'wann-breathwork-nicht-geeignet-ist'],
    relatedServiceSlugs: ['1-1-begleitung'],
    body: [
      {
        type: 'p',
        text: 'Breathwork bezeichnet bewusste, meist verbundene Atemtechniken, bei denen ohne Pause zwischen Ein- und Ausatmung geatmet wird. Anders als bei Meditation, wo der Atem beobachtet wird, wird er hier aktiv gesteuert – mit dem Ziel, den gewohnten Autopilot der Atmung kurzzeitig zu verlassen.',
      },
      {
        type: 'p',
        text: 'Das klingt technisch, fühlt sich in der Praxis aber meist sehr körperlich an: schnellere Atmung verändert den CO2-Spiegel im Blut, das Nervensystem reagiert, Anspannung kann sich lösen, manchmal kommen Gefühle oder Erinnerungen an die Oberfläche, die sonst im Alltag keinen Platz finden.',
      },
      { type: 'h2', text: 'Was während einer Session tatsächlich passiert' },
      {
        type: 'p',
        text: 'Du liegst, meist mit geschlossenen Augen, und wirst durch einen Atemrhythmus geführt – üblicherweise Mund-Atmung, ohne Pause zwischen den Atemzügen. Die Session beginnt langsam, steigert sich, und endet mit einer bewussten Rückkehr zu ruhiger, natürlicher Atmung sowie Zeit zum Nachspüren.',
      },
      {
        type: 'list',
        items: [
          'Körperliche Reaktionen sind normal: Kribbeln in Händen und Füßen, Wärme, manchmal Verspannungen, die sich lösen.',
          'Emotionale Reaktionen sind ebenso normal: Tränen, Lachen, Wut – nichts davon ist ein Fehler.',
          'Manche Sessions fühlen sich ruhig und wenig spektakulär an. Auch das ist ein gültiges Ergebnis.',
        ],
      },
      { type: 'h2', text: 'Gruppen-Breathwork oder 1:1-Session?' },
      {
        type: 'p',
        text: 'In der Gruppe trägt die gemeinsame Energie oft mit – viele Menschen erleben eine Breathwork Journey in Gesellschaft als kraftvoller, gerade beim ersten Mal. Eine 1:1-Session bietet dafür ungeteilte Aufmerksamkeit und eignet sich besser, wenn du an einem konkreten Thema arbeiten oder einfach lieber ohne Publikum atmen möchtest.',
      },
      {
        type: 'quote',
        text: 'Du musst nicht wissen, was passieren wird. Es reicht, bereit zu sein, für eine Weile genau hinzuspüren.',
      },
      { type: 'h2', text: 'Für wen Breathwork (nicht) geeignet ist' },
      {
        type: 'p',
        text: 'Grundsätzlich ist Breathwork für die meisten gesunden Erwachsenen geeignet, unabhängig von Vorerfahrung. Bei bestimmten gesundheitlichen Voraussetzungen – etwa Schwangerschaft, Epilepsie, schweren Herz-Kreislauf-Erkrankungen oder akuten psychiatrischen Krisen – ist vorab ärztliche Rücksprache nötig. Mehr dazu im Artikel zu den Kontraindikationen.',
      },
    ],
  },
  {
    slug: 'nervensystemregulation-verstehen',
    title: 'Nervensystemregulation verstehen: Warum „einfach entspannen" nicht reicht',
    dek: 'Dein Nervensystem lässt sich nicht per Willenskraft beruhigen. Was stattdessen wirklich hilft.',
    category: 'Grundlagen',
    readingMinutes: 7,
    updated: '21. August 2026',
    updatedIso: '2026-08-21',
    metaDescription:
      'Was Nervensystemregulation bedeutet, warum Entspannung sich nicht erzwingen lässt und welche Rolle Körperarbeit und Atem dabei spielen.',
    relatedSlugs: ['was-ist-breathwork', 'cranio-sacrale-impulsarbeit-erklaert', 'humanenergetik-vs-psychotherapie'],
    relatedServiceSlugs: ['1-1-begleitung'],
    body: [
      {
        type: 'p',
        text: 'Dein autonomes Nervensystem entscheidet, ohne dass du bewusst nachdenkst, ob du gerade sicher bist oder nicht. Es schaltet zwischen Aktivierung (Kampf, Flucht), Erstarrung (Einfrieren) und einem ruhigen, verbundenen Zustand hin und her – und diese Entscheidung triffst nicht "du", sondern ein sehr altes, körperliches System.',
      },
      {
        type: 'p',
        text: 'Deshalb funktioniert der Ratschlag "entspann dich einfach" so selten: Entspannung ist kein Gedanke, den du fassen kannst, sondern ein körperlicher Zustand, der sich einstellt, wenn dein Nervensystem genug Sicherheitssignale bekommt.',
      },
      { type: 'h2', text: 'Was Sicherheitssignale für den Körper sind' },
      {
        type: 'list',
        items: [
          'Ein ruhiger, tiefer Atem – dein Nervensystem liest Atemmuster als Information über Gefahr oder Sicherheit.',
          'Langsame, angekündigte Berührung – im Gegensatz zu schneller, unerwarteter Berührung.',
          'Ein Gegenüber, das selbst ruhig und präsent ist – Nervensysteme regulieren sich auch im Kontakt miteinander.',
          'Zeit ohne Handlungsdruck – Regulation braucht Raum, keine To-do-Liste.',
        ],
      },
      { type: 'h2', text: 'Warum viel Wissen allein oft nicht reicht' },
      {
        type: 'p',
        text: 'Viele Menschen, die zu mir kommen, verstehen bereits sehr genau, was mit ihnen los ist – und merken trotzdem, dass sich an den eigentlichen Mustern wenig ändert. Das liegt daran, dass Verstehen ein Vorgang im Kopf ist, Regulation aber ein Vorgang im Körper. Körperarbeit, Atem und achtsame Berührung setzen genau dort an, wo reines Nachdenken an eine Grenze stößt.',
      },
      {
        type: 'quote',
        text: 'Der Körper kennt Wege, die der Verstand nicht denken kann.',
      },
      {
        type: 'p',
        text: 'Das heißt nicht, dass Verstehen wertlos ist – es heißt nur, dass es allein selten reicht. Nachhaltige Veränderung braucht meist beides: Klarheit im Kopf und wiederholte, körperliche Erfahrung von Sicherheit.',
      },
    ],
  },
  {
    slug: 'was-ist-holistic-bodywork',
    title: 'Was ist Holistic Bodywork? Unterschied zu klassischer Massage',
    dek: 'Holistic Bodywork folgt keinem festen Ablauf. Was das in der Praxis bedeutet – und wie es sich von Massage unterscheidet.',
    category: 'Körperarbeit',
    readingMinutes: 5,
    updated: '21. August 2026',
    updatedIso: '2026-08-21',
    metaDescription:
      'Holistic Bodywork erklärt: wie es abläuft, was es von klassischer Massage unterscheidet und für wen es besonders geeignet ist.',
    relatedSlugs: ['achtsame-beruehrung-erklaert', 'cranio-sacrale-impulsarbeit-erklaert'],
    relatedServiceSlugs: ['1-1-begleitung'],
    body: [
      {
        type: 'p',
        text: 'Klassische Massage folgt meist einer festgelegten Abfolge von Griffen, die auf Muskelentspannung zielen. Holistic Bodywork verfolgt einen anderen Ansatz: Statt eines vorgegebenen Ablaufs orientiert sich die Arbeit an dem, was der Körper der Klientin oder des Klienten in der jeweiligen Session tatsächlich braucht.',
      },
      {
        type: 'p',
        text: 'Das kann bedeuten: Manchmal viel Bewegung und Druck, manchmal fast völlige Stille und sehr sanfte Berührung. Manchmal wird ein Bereich lang und ausführlich gehalten, ein anderer gar nicht berührt. Es gibt kein "Standardprogramm".',
      },
      { type: 'h2', text: 'Ganzheitlich heißt: Körper, Atem und Präsenz zusammen' },
      {
        type: 'list',
        items: [
          'Die Arbeit bezieht den Atem mit ein, nicht nur die Muskulatur.',
          'Berührung wird als Kommunikation verstanden, nicht nur als mechanische Einwirkung.',
          'Emotionale Reaktionen während der Session werden nicht unterbrochen, sondern begleitet.',
          'Du bleibst während der gesamten Session ansprechbar und kannst jederzeit die Richtung mitbestimmen.',
        ],
      },
      { type: 'h2', text: 'Für wen es besonders passt' },
      {
        type: 'p',
        text: 'Holistic Bodywork eignet sich gut für Menschen, die klassische Massage bereits kennen, aber merken, dass sie an der Oberfläche bleibt – oder für Menschen, die generell wieder lernen möchten, Berührung als sicher statt als übergriffig zu erleben. Ein Vorwissen ist nicht nötig.',
      },
    ],
  },
  {
    slug: 'cranio-sacrale-impulsarbeit-erklaert',
    title: 'Cranio-Sacrale Impulsarbeit erklärt: Sanfte Arbeit an der Körpermitte',
    dek: 'Kaum spürbare Berührung mit großer Wirkung auf das Nervensystem – was hinter Cranio-Sacral-Arbeit steckt.',
    category: 'Körperarbeit',
    readingMinutes: 5,
    updated: '21. August 2026',
    updatedIso: '2026-08-21',
    metaDescription:
      'Cranio-Sacrale Impulsarbeit erklärt: Ablauf, Wirkung auf das Nervensystem und für wen die sanfte Körperarbeit besonders geeignet ist.',
    relatedSlugs: ['nervensystemregulation-verstehen', 'was-ist-holistic-bodywork'],
    relatedServiceSlugs: ['1-1-begleitung'],
    body: [
      {
        type: 'p',
        text: 'Cranio-Sacrale Impulsarbeit ist eine sehr sanfte, oft kaum wahrnehmbare Form der Körperarbeit entlang von Schädel (Cranium), Wirbelsäule und Kreuzbein (Sacrum). Die Berührung ist so leicht, dass sie für viele Menschen zunächst ungewohnt wirkt – gerade weil sie so wenig zu tun scheint.',
      },
      {
        type: 'p',
        text: 'Genau diese Sanftheit ist der Punkt: Ein übererregtes Nervensystem reagiert auf starke Reize oft mit noch mehr Anspannung. Sehr leichte, ruhige Berührung dagegen sendet ein Signal von Sicherheit, ohne das System zusätzlich zu aktivieren.',
      },
      { type: 'h2', text: 'Wie eine Session abläuft' },
      {
        type: 'p',
        text: 'Du liegst bekleidet, meist auf dem Rücken. Die Praktikerin legt die Hände sanft an Kopf, Wirbelsäule oder Becken und folgt dem, was sie dort wahrnimmt – Spannung, Rhythmus, Bewegung. Viele Klient:innen schlafen während der Session kurz ein oder erleben einen tranceähnlichen, sehr ruhigen Zustand.',
      },
      {
        type: 'list',
        items: [
          'Gut geeignet bei Kopf-, Nacken- oder Kieferspannung.',
          'Häufig eingesetzt bei nervlicher Erschöpfung, weil es kaum zusätzlich aktiviert.',
          'Lässt sich gut mit Atemarbeit oder Bodywork kombinieren.',
          'Erfordert keine aktive Mitarbeit – du darfst einfach empfangen.',
        ],
      },
      { type: 'h2', text: 'Was Cranio-Sacral-Arbeit nicht ist' },
      {
        type: 'p',
        text: 'Cranio-Sacrale Impulsarbeit im humanenergetischen Sinn ist keine medizinische Craniosacraltherapie und keine Heilbehandlung – sie stellt keine Diagnose und ersetzt keine ärztliche Behandlung. Sie versteht sich als energetische Hilfestellung zur Ausgewogenheit, nicht als Therapie einer Erkrankung.',
      },
    ],
  },
  {
    slug: 'achtsame-beruehrung-erklaert',
    title: 'Achtsame Berührung: Was sie bedeutet – und was sie nicht ist',
    dek: 'Der Begriff wird oft verwendet und doch selten wirklich erklärt – ein klarer Blick auf die Haltung hinter achtsamer Berührung.',
    category: 'Grundlagen',
    readingMinutes: 5,
    updated: '29. August 2026',
    updatedIso: '2026-08-29',
    metaDescription:
      'Was achtsame Berührung konkret bedeutet: Prinzipien, Grenzen und der Unterschied zu unangekündigter oder übergriffiger Berührung.',
    relatedSlugs: ['was-ist-holistic-bodywork', 'nervensystemregulation-verstehen'],
    relatedServiceSlugs: ['1-1-begleitung'],
    body: [
      {
        type: 'p',
        text: 'Der Begriff wird oft verwendet und doch selten wirklich erklärt. Denn achtsame Berührung beschreibt weniger eine bestimmte Technik als vielmehr die Haltung, aus der heraus Berührung entsteht.',
      },
      {
        type: 'p',
        text: 'Achtsame Berührung ist kein bestimmter Griff und kein festgelegter Ablauf. Sie geschieht bewusst, langsam und in Abstimmung mit dir.',
      },
      {
        type: 'p',
        text: 'Es geht nicht darum, etwas an dir zu „reparieren" oder ein bestimmtes Ergebnis zu erzwingen. Im Mittelpunkt steht die Wahrnehmung dessen, was im gegenwärtigen Moment da ist.',
      },
      { type: 'h2', text: 'Drei Prinzipien achtsamer Berührung' },
      {
        type: 'list',
        items: [
          'Klarheit und Ankündigung: Du weißt, was geschieht. Berührung entsteht nicht überraschend, sondern bewusst und nachvollziehbar.',
          'Zustimmung: Ein Ja gilt für den Moment, in dem es gegeben wird. Du kannst deine Zustimmung jederzeit verändern oder zurücknehmen.',
          'Kein Leistungsdruck: Du musst nichts erreichen, nichts richtig machen und nirgendwo ankommen. Was sich zeigt, darf zunächst einfach wahrgenommen werden.',
        ],
      },
      { type: 'h2', text: 'Was achtsame Berührung nicht ist' },
      {
        type: 'p',
        text: 'Achtsame Berührung ist nicht sexuell und findet nicht an intimen Körperstellen statt.',
      },
      {
        type: 'p',
        text: 'Sie überschreitet keine Grenzen und setzt nichts voraus. Berührung geschieht innerhalb eines klar besprochenen Rahmens und immer in Abstimmung mit dir.',
      },
      {
        type: 'p',
        text: 'Du darfst jederzeit Nein sagen, eine Berührung verändern oder stoppen und deine Bedürfnisse aussprechen.',
      },
      {
        type: 'p',
        text: 'Denn wirkliche Achtsamkeit bedeutet für mich nicht, über die Grenzen eines Menschen hinwegzugehen, sondern sie wahrzunehmen und zu respektieren.',
      },
      {
        type: 'quote',
        text: 'Achtsame Berührung öffnet Räume, die Worte manchmal nicht erreichen. Räume, in denen nichts geleistet, erklärt oder festgehalten werden muss.',
      },
      {
        type: 'p',
        text: 'Für viele Menschen entsteht Entspannung nicht dadurch, dass sie sich bewusst vornehmen loszulassen.',
      },
      {
        type: 'p',
        text: 'Sie entsteht dort, wo genügend Sicherheit da ist, um nicht mehr festhalten zu müssen.',
      },
      {
        type: 'p',
        text: 'Genau darin liegt für mich die Qualität achtsamer Berührung: Sie drängt nichts auf und will nichts erzwingen. Sie lädt dazu ein, wahrzunehmen, zu spüren und dem eigenen Körper wieder zuzuhören.',
      },
      {
        type: 'p',
        text: 'Manchmal wird dabei etwas sehr Einfaches wieder spürbar: der Kontakt zu sich selbst.',
      },
      {
        type: 'p',
        text: 'Und genau dort beginnt Coming Home.',
      },
    ],
  },
  {
    slug: 'kundalini-awakening-praxis-und-integration',
    title: 'Kundalini Awakening: Zwischen Praxis und Integration',
    dek: 'Kundalini Awakening ist mehr als ein intensiver Moment. Warum die Zeit danach mindestens so wichtig ist wie die Session selbst.',
    category: 'Praxis',
    readingMinutes: 6,
    updated: '21. August 2026',
    updatedIso: '2026-08-21',
    metaDescription:
      'Kundalini Awakening erklärt: was in einer Session passiert, warum Integration entscheidend ist und für wen die Praxis geeignet ist.',
    relatedSlugs: ['was-ist-breathwork', 'nervensystemregulation-verstehen'],
    relatedServiceSlugs: ['1-1-begleitung'],
    body: [
      {
        type: 'p',
        text: 'Kundalini Awakening arbeitet mit der Vorstellung, dass in jedem Menschen Lebensenergie steckt, die durch Alltag, Anpassung und Funktionieren oft eingeschränkt wird. Über Atem, Bewegung und Körperbewusstsein wird diese Energie wieder spürbar gemacht – nicht als spektakuläres Einzelereignis, sondern als Praxis.',
      },
      {
        type: 'p',
        text: 'In populären Darstellungen wird "Kundalini-Erwachen" oft dramatisiert: als plötzlicher, überwältigender Moment. In der Praxis mit mir sieht das meist anders aus – konkreter, körperlicher und ohne den Anspruch, dass etwas Spektakuläres passieren muss.',
      },
      { type: 'h2', text: 'Warum Integration der eigentlich entscheidende Teil ist' },
      {
        type: 'p',
        text: 'Eine intensive Session kann viel in Bewegung bringen – neue Klarheit, aufgewühlte Gefühle, körperliche Empfindungen. Was daraus wird, entscheidet sich aber nicht in der Session, sondern danach: in den Tagen, in denen das Erlebte einen Platz im Alltag finden muss.',
      },
      {
        type: 'list',
        items: [
          'Nach einer intensiven Session bewusst Zeit ohne Termine einplanen.',
          'Aufschreiben, was während der Praxis aufgetaucht ist, ohne es sofort zu bewerten.',
          'Körperliche Nachwirkungen (Müdigkeit, Emotionalität) als normalen Teil des Prozesses akzeptieren.',
          'Bei Unsicherheit lieber früher als später ein Nachgespräch vereinbaren.',
        ],
      },
      { type: 'h2', text: 'Für wen diese Praxis geeignet ist' },
      {
        type: 'p',
        text: 'Kundalini Awakening eignet sich für Menschen, die bereits ein Grundverständnis von Körper- oder Atemarbeit haben und bereit sind, sich auf intensivere energetische Praxis einzulassen. Bei psychiatrischen Vorerkrankungen oder aktuellen Krisen ist vorab Rücksprache mit einer Ärztin oder einem Arzt wichtig.',
      },
    ],
  },
  {
    slug: 'humanenergetik-vs-psychotherapie',
    title: 'Humanenergetik vs. Psychotherapie: Was der Unterschied ist – und wann was passt',
    dek: 'Zwei sehr unterschiedliche Zugänge, die sich nicht ausschließen, sondern ergänzen können. Eine ehrliche Einordnung.',
    category: 'Grundlagen',
    readingMinutes: 6,
    updated: '21. August 2026',
    updatedIso: '2026-08-21',
    metaDescription:
      'Was Humanenergetik von Psychotherapie unterscheidet, wo die Grenzen liegen und wann welcher Zugang der passendere ist.',
    relatedSlugs: ['nervensystemregulation-verstehen', 'wann-breathwork-nicht-geeignet-ist'],
    relatedServiceSlugs: ['1-1-begleitung', 'coming-home-drei-monate'],
    body: [
      {
        type: 'p',
        text: 'Humanenergetik ist in Österreich ein freies Gewerbe – die "Hilfestellung zur Erreichung einer körperlichen bzw. energetischen Ausgewogenheit". Psychotherapie ist ein reglementierter, akademisch ausgebildeter Gesundheitsberuf mit eigenem Berufsgesetz. Das ist kein Detail, sondern der zentrale Unterschied.',
      },
      { type: 'h2', text: 'Was das konkret bedeutet' },
      {
        type: 'list',
        items: [
          'Humanenergetik stellt keine Diagnosen und behandelt keine Krankheiten – sie arbeitet mit Körperwahrnehmung, Atem und Präsenz.',
          'Psychotherapie darf psychische Erkrankungen diagnostizieren und behandeln, unterliegt gesetzlichen Ausbildungs- und Qualitätsstandards.',
          'Die Wirksamkeit humanenergetischer Methoden ist wissenschaftlich nicht in dem Maß belegt wie bei anerkannten Psychotherapieverfahren.',
          'Beides kann parallel stattfinden – viele Klient:innen kombinieren körperorientierte Begleitung mit Psychotherapie.',
        ],
      },
      { type: 'h2', text: 'Wann Körperarbeit eine gute Ergänzung ist' },
      {
        type: 'p',
        text: 'Körperorientierte Begleitung wie Breathwork oder Bodywork kann sinnvoll sein, wenn du bereits viel über dich verstanden hast, aber merkst, dass reines Reden nicht ausreicht, um etwas wirklich zu verändern – weil Muster oft im Körper sitzen, nicht nur im Denken.',
      },
      { type: 'h2', text: 'Wann Psychotherapie der richtige erste Schritt ist' },
      {
        type: 'p',
        text: 'Bei akuten psychischen Krisen, Suizidgedanken, Traumafolgestörungen oder anderen psychiatrischen Diagnosen ist Psychotherapie (bzw. bei akuter Gefahr ärztliche/psychiatrische Hilfe) der richtige erste Weg – nicht Humanenergetik. Eine seriöse Begleiterin wird das offen ansprechen, statt sich als Ersatz anzubieten.',
      },
      {
        type: 'quote',
        text: 'Für die Diagnosestellung und Therapie von Krankheiten wende dich bitte an eine Ärztin, einen Arzt oder eine Psychotherapeutin bzw. einen Psychotherapeuten.',
      },
    ],
  },
  {
    slug: 'wann-breathwork-nicht-geeignet-ist',
    title: 'Wann Breathwork oder Körperarbeit nicht geeignet ist: Kontraindikationen ehrlich erklärt',
    dek: 'Nicht jede Methode passt zu jedem Zeitpunkt. Ein ehrlicher Überblick über Situationen, in denen Vorsicht angebracht ist.',
    category: 'Sicherheit',
    readingMinutes: 5,
    updated: '21. August 2026',
    updatedIso: '2026-08-21',
    metaDescription:
      'Kontraindikationen für Breathwork und Körperarbeit: Schwangerschaft, Epilepsie, Herz-Kreislauf-Erkrankungen und weitere Situationen, in denen Vorsicht gilt.',
    relatedSlugs: ['was-ist-breathwork', 'humanenergetik-vs-psychotherapie'],
    relatedServiceSlugs: ['1-1-begleitung'],
    body: [
      {
        type: 'p',
        text: 'Breathwork und intensive Körperarbeit verändern spürbar den Zustand von Körper und Nervensystem. Genau das macht sie wirksam – und genau deshalb sind sie nicht für jede Situation geeignet. Eine seriöse Begleitung spricht das offen an, statt es zu verschweigen.',
      },
      { type: 'h2', text: 'Situationen, in denen vorab ärztliche Rücksprache nötig ist' },
      {
        type: 'list',
        items: [
          'Schwangerschaft – veränderte Atemtechniken können den Körper stärker beanspruchen als gewohnt.',
          'Epilepsie oder andere Anfallsleiden – verstärkte Atmung kann in Einzelfällen ein Auslöser sein.',
          'Schwere Herz-Kreislauf-Erkrankungen – intensive Atemarbeit beansprucht das Kreislaufsystem.',
          'Akute psychiatrische Krisen oder Erkrankungen – körperlich intensive Erfahrungen können in einer akuten Krise mehr aufwühlen als stabilisieren.',
          'Kürzlich erfolgte Operationen – abhängig von Eingriff und Heilungsstand.',
        ],
      },
      { type: 'h2', text: 'Was in diesen Fällen sinnvoll ist' },
      {
        type: 'p',
        text: 'Nicht "auf keinen Fall", sondern "erst nach Rücksprache": Bei den genannten Punkten sprich vorab mit deiner Ärztin oder deinem Arzt, ob und in welcher angepassten Form Atem- oder Körperarbeit für dich infrage kommt. Eine gute Begleiterin passt die Session bei Bedarf an oder rät im Zweifel ab.',
      },
      {
        type: 'p',
        text: 'Wichtig auch: Diese Aufzählung ersetzt keine individuelle medizinische Einschätzung. Sie ist ein Ausgangspunkt für das Gespräch mit deiner Ärztin, deinem Arzt oder deiner Begleiterin – nicht das letzte Wort.',
      },
    ],
  },
  {
    slug: 'erste-session-was-dich-erwartet',
    title: 'Der erste Schritt: Was dich in einer 1:1-Session wirklich erwartet',
    dek: 'Die Unsicherheit vor der ersten Session ist normal. Ein realistischer, unaufgeregter Ablaufplan.',
    category: 'Praxis',
    readingMinutes: 5,
    updated: '21. August 2026',
    updatedIso: '2026-08-21',
    metaDescription:
      'Was dich bei einer ersten 1:1-Session mit Jasmin konkret erwartet: Vorgespräch, Ablauf, Nachbereitung – Schritt für Schritt erklärt.',
    relatedSlugs: ['was-ist-breathwork', 'achtsame-beruehrung-erklaert'],
    relatedServiceSlugs: ['1-1-begleitung'],
    body: [
      {
        type: 'p',
        text: 'Die meisten Fragen vor einer ersten Session drehen sich nicht um die Methode, sondern um das Ungewisse: Was passiert dort eigentlich genau? Muss ich etwas können? Was, wenn ich weine – oder wenn gar nichts passiert? Hier eine ehrliche, konkrete Antwort.',
      },
      { type: 'h2', text: 'Vor der Session' },
      {
        type: 'p',
        text: 'Du musst dich nicht vorbereiten. Sinnvoll ist, in den Stunden davor nicht allzu voll gegessen zu haben und genug Zeit einzuplanen – direkt danach zu einem stressigen Termin zu hetzen, ist keine gute Idee.',
      },
      { type: 'h2', text: 'Zu Beginn: das Gespräch' },
      {
        type: 'list',
        items: [
          'Wie geht es dir gerade, körperlich und emotional?',
          'Gibt es etwas, das heute bewusst nicht berührt oder angesprochen werden soll?',
          'Gesundheitliche Punkte, die relevant sein könnten (siehe Kontraindikationen).',
          'Was du dir von der Session erhoffst – auch "ich weiß es nicht" ist eine gültige Antwort.',
        ],
      },
      { type: 'h2', text: 'Während der Session' },
      {
        type: 'p',
        text: 'Je nach gebuchter Leistung liegst du, atmest, wirst berührt oder eine Kombination davon. Du bleibst ansprechbar und kannst jederzeit sagen, wenn etwas nicht passt. Es gibt kein "richtiges" Erleben – manche Sessions sind ruhig, manche intensiv, beides ist in Ordnung.',
      },
      { type: 'h2', text: 'Nach der Session' },
      {
        type: 'p',
        text: 'Am Ende bleibt Zeit zum Nachspüren und ein kurzes Gespräch darüber, was war. Plane danach lieber etwas Ruhiges statt eines vollen Terminkalenders – Integration braucht ein bisschen Raum.',
      },
    ],
  },
  {
    slug: 'community-und-gruppenarbeit',
    title: 'Community & Gruppenarbeit: Warum gemeinsames Atmen anders wirkt als allein',
    dek: 'Manche Erfahrungen entfalten ihre größte Kraft, wenn wir sie teilen. Was Gruppenformate von 1:1-Arbeit unterscheidet.',
    category: 'Gruppe',
    readingMinutes: 5,
    updated: '21. August 2026',
    updatedIso: '2026-08-21',
    metaDescription:
      'Warum Breathwork und Körperarbeit in der Gruppe anders wirken als 1:1 – und wie du entscheidest, welches Format zu dir passt.',
    relatedSlugs: ['was-ist-breathwork', 'erste-session-was-dich-erwartet'],
    relatedServiceSlugs: ['feminine-power-workshop', '1-1-begleitung'],
    body: [
      {
        type: 'p',
        text: 'In einer Gruppe atmest, fühlst und liegst du zwar für dich – und bist trotzdem spürbar Teil von etwas Größerem. Viele Menschen beschreiben genau das als tragend: nicht allein zu sein mit dem, was während einer intensiven Atemreise auftaucht.',
      },
      { type: 'h2', text: 'Was in der Gruppe anders ist als 1:1' },
      {
        type: 'list',
        items: [
          'Die kollektive Energie im Raum wird von vielen als verstärkend erlebt – auch ohne dass jemand etwas "tut".',
          'Du bist trotzdem für dich – es gibt keinen Austausch während der Atemarbeit selbst.',
          'Am Ende gibt es oft (freiwilligen) Raum für Austausch, der bei 1:1-Sessions naturgemäß fehlt.',
          'Gruppenformate sind meist günstiger und niedrigschwelliger als Einzelsessions.',
        ],
      },
      { type: 'h2', text: 'Wann ein Gruppenformat die bessere Wahl ist' },
      {
        type: 'p',
        text: 'Wenn du Breathwork zum ersten Mal ausprobieren möchtest, ohne dich gleich festzulegen, ist ein Gruppenformat wie die Breathwork Journey ein guter, unaufgeregter Einstieg. Auch wenn du ohnehin gern in Gemeinschaft bist, wirst du die Gruppenenergie eher als Ressource erleben als als Ablenkung.',
      },
      { type: 'h2', text: 'Wann 1:1 die bessere Wahl ist' },
      {
        type: 'p',
        text: 'Wenn du an einem konkreten, persönlichen Thema arbeiten möchtest, mehr Redezeit im Vorgespräch brauchst oder dich in Gruppen grundsätzlich unwohl fühlst, ist eine 1:1-Session der stimmigere Rahmen. Beides schließt sich nicht aus – viele kombinieren beides über die Zeit.',
      },
    ],
  },
]

export function getArticleBySlug(slug: string | undefined): Article | undefined {
  return articles.find((article) => article.slug === slug)
}

export const articleCategories = Array.from(new Set(articles.map((a) => a.category)))
