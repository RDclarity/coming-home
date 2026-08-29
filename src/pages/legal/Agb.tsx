import { business } from '../../data/legal'
import { withBase } from '../../lib/url'
import { LegalLayout } from './LegalLayout'

export function Agb() {
  return (
    <LegalLayout
      eyebrow="Rechtliches"
      title="Allgemeine Geschäftsbedingungen"
      updated="21. August 2026"
      source={
        <>
          Diese AGB orientieren sich inhaltlich an den{' '}
          <strong>
            Standesregeln des Fachverbands der gewerblichen Dienstleister für die freien
            Gewerbe der Humanenergetik
          </strong>{' '}
          (genehmigt vom Erweiterten Präsidium der Wirtschaftskammer Österreich am
          23.4.2014) sowie am{' '}
          <strong>
            Muster-Aufklärungsbogen für die Humanenergetik und Datenschutz
          </strong>{' '}
          der Wirtschaftskammer Wien, Fachgruppe Personenberatung und
          Personenbetreuung. Beide Dokumente ersetzen keine Rechtsberatung – das gilt
          auch für diese daraus abgeleiteten AGB. Vor Veröffentlichung bitte von einer
          Rechtsberatung prüfen lassen, insbesondere die Abschnitte zum
          Rücktrittsrecht und zur Haftung.
        </>
      }
    >
      <h2>1. Geltungsbereich</h2>
      <p>
        Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für sämtliche Verträge
        zwischen {business.fullName} („Coming Home", „ich", „mich") und ihren Kund:innen
        („du", „Klient:in") über Einzelsessions, mehrmonatige Begleitungen, Workshops,
        Gruppenformate und Retreats im Bereich Breathwork, Holistic Bodywork,
        Cranio-Sacrale Impulsarbeit und verwandte körperorientierte Angebote
        (nachfolgend gemeinsam „Leistungen").
      </p>

      <h2>2. Charakter der Leistungen – keine Heilbehandlung</h2>
      <p>
        Die angebotenen Leistungen sind energetische Hilfestellung zur Erreichung einer
        körperlichen bzw. energetischen Ausgewogenheit im Sinne der Humanenergetik. Sie
        beschäftigen sich mit der Aktivierung und Harmonisierung körpereigener
        Energiefelder (Lebensenergie) und dienen der Wiederherstellung und Harmonisierung
        dieser Energiefelder.
      </p>
      <p>
        Diese Leistungen stellen <strong>ausdrücklich keine Heilbehandlung</strong>{' '}
        (Krankheitsbehandlung) dar und sind kein Ersatz für eine ärztliche Diagnose und
        Behandlung sowie kein Ersatz für eine psychologische oder psychotherapeutische
        Behandlung oder Untersuchung. Sämtliche im Rahmen einer Session getroffenen
        Aussagen stellen keine medizinischen Diagnosen dar, sondern sind als reine
        energetische Zustandsbeschreibungen zu verstehen. Die Wirkungsweise und der
        Erfolg der angebotenen Methoden sind naturwissenschaftlich nicht belegt.
      </p>
      <p>
        Für die Diagnosestellung und Therapie von Krankheiten wende dich bitte an eine
        Ärztin, einen Arzt oder eine Psychotherapeutin bzw. einen Psychotherapeuten.
      </p>

      <h2>3. Gesundheitliche Voraussetzungen</h2>
      <p>
        Du bist verpflichtet, mich vor Beginn einer Session oder eines Workshops über
        gesundheitliche Einschränkungen zu informieren, die für die Durchführung relevant
        sein können, insbesondere über:
      </p>
      <ul>
        <li>eine bestehende Schwangerschaft,</li>
        <li>Epilepsie oder andere Anfallsleiden,</li>
        <li>schwere Herz-Kreislauf-Erkrankungen,</li>
        <li>akute psychiatrische Krisen oder Erkrankungen,</li>
        <li>kürzlich erfolgte Operationen,</li>
        <li>sowie jede weitere Erkrankung, bei der Atemarbeit oder Körperarbeit ein Risiko darstellen könnte.</li>
      </ul>
      <p>
        In diesen Fällen ist vorab Rücksprache mit der behandelnden Ärztin oder dem
        behandelnden Arzt zu halten. Ich behalte mir vor, eine Teilnahme abzulehnen oder
        eine Session anzupassen, wenn gesundheitliche Gründe dagegensprechen. Unrichtige
        oder unterlassene Angaben zu gesundheitlichen Voraussetzungen gehen zu deinen
        Lasten.
      </p>

      <h2>4. Vertragsabschluss und Bewerbungsprozess</h2>
      <p>
        Workshops, Gruppentermine und Einzelsessions können über die auf der Website
        angegebenen Wege (Formular, E-Mail, Terminbuchung) angefragt werden; der Vertrag
        kommt mit meiner Bestätigung der Anfrage zustande.
      </p>
      <p>
        Für die drei- und zwölfmonatigen Coming-Home-Begleitungen gilt ein eigener
        Ablauf: Die Zusammenarbeit beginnt mit dem Ausfüllen des Bewerbungsbogens und
        einem unverbindlichen, kostenlosen Kennenlerngespräch. Ein Vertrag über eine
        solche Begleitung kommt erst zustande, wenn ich dir nach dem Kennenlerngespräch
        ausdrücklich – mündlich oder schriftlich – zusage und du dieses Angebot
        annimmst. Weder die Bewerbung noch das Kennenlerngespräch begründen einen
        Anspruch auf Aufnahme in eine Begleitung.
      </p>

      <h2>5. Honorar und Zahlungsbedingungen</h2>
      <p>
        Es gelten die zum Zeitpunkt der Buchung auf der Website angegebenen bzw. im
        Rahmen des Kennenlerngesprächs individuell vereinbarten Preise, jeweils
        inklusive der gesetzlichen Umsatzsteuer, sofern diese anfällt. Das Honorar ist,
        sofern nicht anders vereinbart, vor Beginn der jeweiligen Leistung bzw. gemäß den
        bei der Buchung angegebenen Zahlungsbedingungen fällig.
      </p>
      <p>
        <em>
          [Platzhalter: Konkrete Zahlungsarten (z. B. Überweisung, Zahlungsdienstleister)
          und Ratenzahlungsmodalitäten für die mehrmonatigen Begleitungen ergänzen, falls
          angeboten.]
        </em>
      </p>

      <h2>6. Terminabsagen und Stornobedingungen</h2>
      <p>
        Einzelsessions und Plätze in Workshops bzw. Gruppenterminen können bis{' '}
        <em>[Platzhalter: Frist, z. B. „48 Stunden"]</em> vor dem vereinbarten Termin
        kostenfrei storniert oder verschoben werden. Bei späteren Absagen oder Nichterscheinen
        („No-Show") behalte ich mir vor, das vereinbarte Honorar ganz oder teilweise in
        Rechnung zu stellen, da der Platz für andere Klient:innen freigehalten wurde.
      </p>
      <p>
        Muss ich selbst einen Termin absagen oder verschieben, informiere ich dich so
        früh wie möglich und biete einen Ersatztermin an bzw. erstatte ein bereits
        bezahltes Honorar für die entfallene Leistung.
      </p>

      <h2>7. Rücktrittsrecht bei Fernabsatzverträgen (Verbraucher:innen)</h2>
      <p>
        Schließt du als Verbraucher:in einen Vertrag über die Website, per E-Mail oder
        Telefon ab (Fernabsatzvertrag im Sinne des Fern- und Auswärtsgeschäfte-Gesetzes,
        FAGG), steht dir grundsätzlich ein Rücktrittsrecht binnen 14 Tagen ab
        Vertragsabschluss zu, ohne dass du dafür Gründe angeben musst.
      </p>
      <p>
        Das Rücktrittsrecht erlischt vorzeitig, wenn ich die Leistung vollständig
        erbracht habe und du der Ausführung ausdrücklich zugestimmt sowie zur Kenntnis
        genommen hast, dass du dein Rücktrittsrecht bei vollständiger Vertragserfüllung
        durch mich verlierst (§ 18 Abs. 1 Z 1 FAGG). Für Leistungen zu einem konkret
        vereinbarten Termin (z. B. Workshops mit fixem Datum) kann das Rücktrittsrecht
        nach § 18 Abs. 1 Z 9 FAGG ausgeschlossen sein; in diesem Fall gelten die
        Stornobedingungen gemäß Punkt 6.
      </p>
      <p>
        Um dein Rücktrittsrecht auszuüben, genügt eine eindeutige Erklärung (z. B. per
        E-Mail an <a href={`mailto:${business.email}`}>{business.email}</a>) innerhalb der
        Frist.
      </p>

      <h2>8. Verschwiegenheit und Datenschutz</h2>
      <p>
        Alle im Rahmen einer Session anvertrauten Angelegenheiten unterliegen meiner
        Verschwiegenheitspflicht. Diese besteht nicht, wenn und insoweit du mich
        ausdrücklich davon entbindest oder eine gesetzliche Pflicht zur Offenlegung
        besteht. Details zur Verarbeitung deiner Daten findest du in der{' '}
        <a href={withBase('/datenschutz')}>Datenschutzerklärung</a>.
      </p>

      <h2>9. Deine Mitwirkung und Eigenverantwortung</h2>
      <p>
        Die Teilnahme an Sessions, Workshops und Begleitungen erfolgt freiwillig und in
        deiner Eigenverantwortung. Du entscheidest jederzeit selbst, welche Form der
        Berührung oder Körperarbeit für dich stimmig ist, und kannst eine Übung oder
        Berührung jederzeit ohne Angabe von Gründen ablehnen oder eine Session
        abbrechen. Achtsame Berührung findet ausschließlich mit deinem Einverständnis
        statt; an intimen Körperstellen erfolgt keine Berührung.
      </p>

      <h2>10. Haftung</h2>
      <p>
        Ich hafte für Schäden, die auf einfacher Fahrlässigkeit beruhen, nur bei
        Verletzung wesentlicher Vertragspflichten und der Höhe nach begrenzt auf den
        vorhersehbaren, vertragstypischen Schaden. Diese Beschränkung gilt nicht bei
        Vorsatz oder grober Fahrlässigkeit sowie nicht für Schäden aus der Verletzung des
        Lebens, des Körpers oder der Gesundheit. Die Haftung nach dem
        Produkthaftungsgesetz bleibt unberührt.
      </p>
      <p>
        Für Angaben, die du zu deinem Gesundheitszustand machst oder unterlässt (siehe
        Punkt 3), sowie für die Nichtbeachtung ärztlichen Rats übernehme ich keine
        Haftung.
      </p>

      <h2>11. Urheberrecht</h2>
      <p>
        Sämtliche Inhalte dieser Website sowie bereitgestellte Materialien
        (z. B. die kostenlose Audioübung) sind urheberrechtlich geschützt. Eine
        Vervielfältigung, Weitergabe oder öffentliche Zugänglichmachung ohne meine
        vorherige schriftliche Zustimmung ist nicht gestattet.
      </p>

      <h2>12. Änderungen dieser AGB</h2>
      <p>
        Ich behalte mir vor, diese AGB mit Wirkung für die Zukunft anzupassen, etwa bei
        Änderungen des Leistungsangebots oder der Rechtslage. Für bereits abgeschlossene
        Verträge gilt die zum Zeitpunkt des Vertragsabschlusses gültige Fassung.
      </p>

      <h2>13. Anwendbares Recht und Gerichtsstand</h2>
      <p>
        Es gilt österreichisches Recht unter Ausschluss der Verweisungsnormen des
        internationalen Privatrechts und des UN-Kaufrechts. Bist du Verbraucher:in mit
        gewöhnlichem Aufenthalt in einem anderen EU-Mitgliedstaat, bleiben zwingende
        verbraucherschutzrechtliche Bestimmungen dieses Staates unberührt.
      </p>

      <h2>14. Schlussbestimmungen</h2>
      <p>
        Sollte eine Bestimmung dieser AGB unwirksam sein oder werden, bleibt die
        Wirksamkeit der übrigen Bestimmungen davon unberührt. An die Stelle der
        unwirksamen Bestimmung tritt eine dem wirtschaftlichen Zweck möglichst nahe
        kommende wirksame Regelung.
      </p>
    </LegalLayout>
  )
}
