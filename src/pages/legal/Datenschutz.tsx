import { business, dataProtectionAuthority } from '../../data/legal'
import { LegalLayout } from './LegalLayout'

export function Datenschutz() {
  return (
    <LegalLayout
      eyebrow="Rechtliches"
      title="Datenschutzerklärung"
      updated="21. August 2026"
      source={
        <>
          Die Abschnitte zu Gesundheitsdaten und Betroffenenrechten orientieren sich am
          Muster-Aufklärungsbogen für die Humanenergetik und Datenschutz der
          Wirtschaftskammer Wien (2024). Ersetzt keine Rechtsberatung.
        </>
      }
    >
      <p>
        Der Schutz deiner personenbezogenen Daten ist mir wichtig. Diese
        Datenschutzerklärung informiert dich darüber, welche Daten beim Besuch dieser
        Website sowie bei Nutzung der Formulare verarbeitet werden, zu welchem Zweck das
        geschieht und welche Rechte dir dabei zustehen – gemäß der EU-Datenschutz-Grundverordnung
        (DSGVO) und dem österreichischen Datenschutzgesetz (DSG).
      </p>

      <h2>1. Verantwortliche Stelle</h2>
      <p>
        Verantwortlich für die Datenverarbeitung auf dieser Website ist:
        <br />
        {business.fullName}
        <br />
        {business.street}, {business.zip} {business.city}
        <br />
        E-Mail: <a href={`mailto:${business.email}`}>{business.email}</a>
      </p>

      <h2>2. Hosting und Server-Logfiles</h2>
      <p>
        Beim Aufruf dieser Website erhebt der Hosting-Anbieter automatisch technische
        Informationen (sogenannte Server-Logfiles), die dein Browser übermittelt. Dazu
        gehören etwa IP-Adresse, Datum und Uhrzeit der Anfrage, aufgerufene Seite,
        verwendeter Browser und Betriebssystem. Diese Daten werden ausschließlich zur
        Sicherstellung eines störungsfreien Betriebs sowie zur Absicherung der Systeme
        verarbeitet (Art. 6 Abs. 1 lit. f DSGVO) und nicht mit anderen Datenquellen
        zusammengeführt.
      </p>
      <p>
        <em>
          [Platzhalter: Name und Sitz des Hosting-Anbieters ergänzen, sobald die Seite
          live geschaltet ist – z. B. „Netlify, Inc., San Francisco" oder „Vercel Inc." –,
          inkl. Hinweis auf einen ggf. bestehenden Auftragsverarbeitungsvertrag.]
        </em>
      </p>

      <h2>3. Schriftarten (Fonts)</h2>
      <p>
        Die auf dieser Website verwendeten Schriftarten (Cormorant Garamond, Inter) sind
        lokal auf dem Webserver eingebunden. Es findet <strong>keine</strong> Verbindung zu
        Servern von Google Fonts oder einem anderen externen Font-Anbieter statt – beim
        Laden der Schriftarten werden also keine Daten an Dritte übertragen.
      </p>

      <h2>4. Cookies</h2>
      <p>
        Für den grundlegenden Betrieb der Seite (z. B. deine Musik-Einstellung, dein
        Cookie-Auswahl) kommen ausschließlich technisch notwendige Funktionen zum
        Einsatz, die keine Einwilligung nach § 165 Telekommunikationsgesetz (TKG)
        benötigen.
      </p>

      <h2 id="analyse-marketing">4a. Analyse- und Marketing-Tools</h2>
      <p>
        Zusätzlich können Google Analytics, Google Ads und/oder der Meta-Pixel (Facebook/
        Instagram) zum Einsatz kommen, um zu verstehen, wie die Seite genutzt wird, und um
        Werbeanzeigen zielgerichtet auszuspielen bzw. deren Erfolg zu messen. Diese Tools
        werden ausschließlich geladen, wenn du dem im Cookie-Banner aktiv zustimmst
        ("Akzeptieren") – ohne diese Zustimmung bleiben sie vollständig inaktiv. Deine
        Wahl kannst du jederzeit ändern, indem du den Local-Storage-Eintrag
        "coming-home:consent" in deinem Browser löschst; der Banner erscheint dann erneut.
      </p>
      <p>
        Rechtsgrundlage ist in diesem Fall ausschließlich deine Einwilligung (Art. 6 Abs. 1
        lit. a DSGVO, § 165 TKG). Bei erfolgreicher Zustimmung werden zusätzlich einzelne
        Ereignisse (z. B. "Formular abgeschickt") serverseitig über eine eigene Supabase
        Edge Function an die Meta Conversions API und das GA4 Measurement Protocol
        übermittelt; E-Mail-Adresse und Telefonnummer werden dabei ausschließlich gehasht
        (SHA-256), nie im Klartext übertragen.
      </p>
      <p>
        <em>
          [Platzhalter: Sobald diese Tools mit echten IDs aktiv geschaltet sind, hier die
          eingesetzten Anbieter konkret benennen (inkl. Links zu deren
          Datenschutzerklärungen, z. B. Google Ireland Limited und Meta Platforms Ireland
          Limited) und ggf. eine Auftragsverarbeitungsvereinbarung mit diesen Anbietern
          abschließen.]
        </em>
      </p>

      <h2>5. Bewerbungsbogen für Coming-Home-Begleitungen</h2>
      <p>
        Wenn du dich über den Bewerbungsbogen für eine drei- oder zwölfmonatige
        Begleitung bewirbst, werden die von dir eingegebenen Daten (Name, E-Mail, Telefon,
        gewünschte Begleitung sowie deine Angaben zu deiner aktuellen Lebenssituation und
        deiner Motivation) verarbeitet, um dein Anliegen zu prüfen und ein
        Kennenlerngespräch zu vereinbaren.
      </p>
      <p>
        Rechtsgrundlage ist die Anbahnung eines Vertrags auf deinen Wunsch hin (Art. 6
        Abs. 1 lit. b DSGVO). Soweit deine Angaben zu deiner Lebenssituation
        gesundheitsbezogene Informationen enthalten (besondere Kategorien
        personenbezogener Daten gemäß Art. 9 DSGVO), verarbeite ich diese nur, weil und
        soweit du sie freiwillig im Formular mitteilst und damit ausdrücklich in ihre
        Verarbeitung einwilligst (Art. 9 Abs. 2 lit. a DSGVO). Du bist nicht verpflichtet,
        gesundheitsbezogene Angaben zu machen.
      </p>
      <p>
        Kommt eine Begleitung zustande, werden deine Daten als Teil des Klientenaktes
        entsprechend den berufsrechtlichen Aufbewahrungspflichten für Humanenergetik
        sieben Jahre aufbewahrt. Führt die Bewerbung zu keiner Begleitung, werden deine
        Angaben spätestens zwölf Monate nach der letzten Kontaktaufnahme gelöscht, sofern
        keine längere Aufbewahrung gesetzlich vorgeschrieben ist oder du einer früheren
        Löschung zustimmst.
      </p>

      <h2>6. Kontaktformular</h2>
      <p>
        Bei Nutzung des Kontaktformulars im Footer werden Name, E-Mail-Adresse und deine
        Nachricht verarbeitet, um deine Anfrage zu beantworten. Rechtsgrundlage ist Art. 6
        Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Beantwortung von Anfragen)
        bzw. Art. 6 Abs. 1 lit. b DSGVO, wenn deine Anfrage der Vorbereitung eines
        Vertrags dient. Deine Angaben werden gelöscht, sobald sie für die Bearbeitung
        deiner Anfrage nicht mehr erforderlich sind, spätestens nach zwölf Monaten.
      </p>

      <h2>7. Audioübung (Newsletter-Anmeldung)</h2>
      <p>
        Wenn du die kostenlose Audioübung anforderst, wird deine E-Mail-Adresse
        verarbeitet, um dir die Übung sowie – sofern du dem separat zugestimmt hast –
        gelegentlich weitere Impulse zu neuen Angeboten zuzusenden. Rechtsgrundlage ist
        deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die du im Formular erteilst. Du
        kannst diese Einwilligung jederzeit formlos per E-Mail an{' '}
        <a href={`mailto:${business.email}`}>{business.email}</a> oder über den
        Abmeldelink in jeder E-Mail widerrufen; die Rechtmäßigkeit der bis dahin erfolgten
        Verarbeitung bleibt davon unberührt.
      </p>
      <p>
        <em>
          [Platzhalter: Sobald ein E-Mail-Marketing-Tool (z. B. Brevo, Mailchimp, CleverReach)
          im Einsatz ist, hier Anbieter, Serverstandort und Verweis auf dessen
          Datenschutzerklärung ergänzen.]
        </em>
      </p>

      <h2>8. Formularversand</h2>
      <p>
        Die Formulardaten werden{' '}
        <em>
          [Platzhalter: technischen Übertragungsweg eintragen – z. B. „verschlüsselt an
          einen Formular-Dienstleister übermittelt" mit Namen des Dienstleisters, oder
          „per E-Mail an die oben genannte Adresse gesendet", falls (noch) kein externer
          Formular-Endpoint eingerichtet ist]
        </em>
        . Sofern dabei ein externer Dienstleister eingebunden ist, besteht mit diesem ein
        Auftragsverarbeitungsvertrag gemäß Art. 28 DSGVO.
      </p>

      <h2>9. Empfänger:innen deiner Daten</h2>
      <p>
        Deine Daten werden ausschließlich zur Erbringung der genannten Zwecke verarbeitet
        und grundsätzlich nicht an Dritte weitergegeben. Eine Weitergabe erfolgt nur, wenn
        gesetzliche Pflichten dazu bestehen oder du zuvor ausdrücklich eingewilligt hast.
        Technische Dienstleister (z. B. Hosting, E-Mail-Versand), die im Rahmen einer
        Auftragsverarbeitung tätig werden, gelten nicht als Dritte im datenschutzrechtlichen
        Sinn.
      </p>

      <h2>10. Deine Rechte</h2>
      <p>Dir stehen als betroffener Person folgende Rechte zu:</p>
      <ul>
        <li>Recht auf Auskunft über die zu deiner Person gespeicherten Daten (Art. 15 DSGVO)</li>
        <li>Recht auf Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
        <li>Recht auf Löschung („Recht auf Vergessenwerden", Art. 17 DSGVO)</li>
        <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
        <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
        <li>
          Recht auf Widerspruch gegen die Verarbeitung, die auf Art. 6 Abs. 1 lit. f
          DSGVO beruht (Art. 21 DSGVO)
        </li>
        <li>
          Recht, eine erteilte Einwilligung jederzeit mit Wirkung für die Zukunft zu
          widerrufen (Art. 7 Abs. 3 DSGVO)
        </li>
      </ul>
      <p>
        Zur Ausübung dieser Rechte genügt eine formlose Nachricht an{' '}
        <a href={`mailto:${business.email}`}>{business.email}</a>.
      </p>

      <h2>11. Beschwerderecht</h2>
      <p>
        Wenn du der Ansicht bist, dass die Verarbeitung deiner Daten gegen das
        Datenschutzrecht verstößt oder deine datenschutzrechtlichen Ansprüche auf sonstige
        Weise verletzt wurden, kannst du dich bei der zuständigen Aufsichtsbehörde
        beschweren:
      </p>
      <p>
        {dataProtectionAuthority.name}
        <br />
        {dataProtectionAuthority.street}, {dataProtectionAuthority.zip}{' '}
        {dataProtectionAuthority.city}
        <br />
        <a href={dataProtectionAuthority.website} target="_blank" rel="noreferrer noopener">
          {dataProtectionAuthority.website}
        </a>
      </p>

      <h2>12. Datensicherheit</h2>
      <p>
        Diese Website nutzt aus Sicherheitsgründen und zum Schutz der Übertragung
        vertraulicher Inhalte eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte
        Verbindung erkennst du daran, dass die Adresszeile des Browsers von „http://" auf
        „https://" wechselt.
      </p>

      <h2>13. Änderung dieser Datenschutzerklärung</h2>
      <p>
        Diese Datenschutzerklärung wird bei Bedarf angepasst, etwa wenn sich die
        Rechtslage oder die eingesetzten Dienste ändern. Es gilt jeweils die zum Zeitpunkt
        deines Besuchs aktuelle, auf dieser Seite veröffentlichte Fassung.
      </p>
    </LegalLayout>
  )
}
