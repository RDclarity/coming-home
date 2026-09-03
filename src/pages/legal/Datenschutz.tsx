import { business, dataProtectionAuthority } from '../../data/legal'
import { LegalLayout } from './LegalLayout'

export function Datenschutz() {
  return (
    <LegalLayout
      eyebrow="Rechtliches"
      title="Datenschutzerklärung"
      updated="30. August 2026"
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
        Diese Website wird über GitHub Pages gehostet (GitHub, Inc., 88 Colin P. Kelly
        Jr. Street, San Francisco, CA 94107, USA; im Konzern der Microsoft Corporation).
        Die Datenübertragung kann dabei auch über Server außerhalb der EU/des EWR
        erfolgen. GitHub verarbeitet in diesem Zusammenhang als Auftragsverarbeiter nach
        Art. 28 DSGVO; für die Datenübertragung in die USA stützt sich GitHub auf die
        EU-Standardvertragsklauseln. Mehr dazu in der{' '}
        <a href="https://docs.github.com/site-policy/privacy-policies/github-privacy-statement" target="_blank" rel="noreferrer noopener">
          Datenschutzerklärung von GitHub
        </a>
        .
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
      {/* Sobald diese Tools mit echten IDs aktiv geschaltet sind (siehe .env.example,
          VITE_GA_MEASUREMENT_ID/VITE_GOOGLE_ADS_ID/VITE_META_PIXEL_ID), hier die
          eingesetzten Anbieter konkret benennen (inkl. Links zu deren
          Datenschutzerklärungen, z. B. Google Ireland Limited und Meta Platforms Ireland
          Limited) und ggf. eine Auftragsverarbeitungsvereinbarung mit diesen Anbietern
          abschließen. */}

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
      {/* Sobald ein E-Mail-Marketing-Tool (z. B. Brevo, Mailchimp, CleverReach) im
          Einsatz ist, hier Anbieter, Serverstandort und Verweis auf dessen
          Datenschutzerklärung ergänzen. */}

      <h2>8. Formularversand und internes Anfragen-System (CRM)</h2>
      <p>
        Sobald du eines der Formulare dieser Website abschickst, wird automatisch eine
        Benachrichtigungs-E-Mail an mein internes Postfach (anfrage@jasmindraxl.at)
        ausgelöst, damit ich zeitnah von deiner Anfrage erfahre. Dafür wird der
        E-Mail-Versanddienst Resend (Resend, Inc., USA) eingesetzt; die Übermittlung in
        die USA stützt sich auf die EU-Standardvertragsklauseln. Übertragen werden dabei
        genau die Angaben, die du im jeweiligen Formular gemacht hast (siehe Abschnitte
        5–7). Ist dieser Dienst ausnahmsweise nicht erreichbar, öffnet sich stattdessen
        ein vorausgefüllter E-Mail-Entwurf in deinem eigenen E-Mail-Programm – so geht
        deine Anfrage so oder so nicht verloren, unabhängig davon landet sie außerdem
        immer im unten beschriebenen Anfragen-System.
      </p>
      <p>
        Zusätzlich landet jede über ein Formular dieser Website eingehende Anfrage in
        einem passwortgeschützten, internen Anfragen-System, das ich zur Übersicht und
        Bearbeitung eingehender Anfragen nutze. Dafür wird der Dienst Supabase
        eingesetzt (Supabase Inc.); die Daten werden dabei ausschließlich auf Servern
        innerhalb der EU (Frankfurt, Deutschland) gespeichert – es findet keine
        Datenübertragung in Länder außerhalb der EU/des EWR statt. Zugriff auf dieses
        System habe ausschließlich ich, geschützt durch ein persönliches Login.
        Rechtsgrundlage ist dieselbe wie für den jeweiligen Verarbeitungszweck laut den
        Abschnitten 5–7 oben; die dort genannten Aufbewahrungsfristen gelten
        entsprechend auch für die im Anfragen-System gespeicherten Daten.
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
