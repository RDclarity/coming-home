import { business } from '../../data/legal'
import { withBase } from '../../lib/url'
import styles from './LegalLayout.module.css'
import { LegalLayout } from './LegalLayout'

export function Impressum() {
  return (
    <LegalLayout
      eyebrow="Rechtliches"
      title="Impressum"
      updated="21. August 2026"
      source={
        <>
          Aufbau angelehnt an das Musterimpressum der Wirtschaftskammer Wien, Fachgruppe
          Personenberatung und Personenbetreuung. Ersetzt keine Rechtsberatung.
        </>
      }
    >
      <p>
        Informationspflicht gemäß § 5 E-Commerce-Gesetz, § 14 Unternehmensgesetzbuch,
        § 63 Gewerbeordnung und Offenlegungspflicht gemäß § 25 Mediengesetz.
      </p>

      <h2>Diensteanbieterin</h2>
      <table className={styles.table}>
        <tbody>
          <tr>
            <th scope="row">Name</th>
            <td>{business.fullName}</td>
          </tr>
          {business.companyName && (
            <tr>
              <th scope="row">Firma</th>
              <td>{business.companyName}</td>
            </tr>
          )}
          <tr>
            <th scope="row">Berufsbezeichnung</th>
            <td>{business.tradeTitle}</td>
          </tr>
          <tr>
            <th scope="row">Unternehmensgegenstand</th>
            <td>{business.tradeSubject}</td>
          </tr>
          <tr>
            <th scope="row">Anschrift</th>
            <td>
              {business.street}, {business.zip} {business.city}, {business.country}
            </td>
          </tr>
          <tr>
            <th scope="row">Telefon</th>
            <td>{business.phone}</td>
          </tr>
          <tr>
            <th scope="row">E-Mail</th>
            <td>
              <a href={`mailto:${business.email}`}>{business.email}</a>
            </td>
          </tr>
          {business.uid && (
            <tr>
              <th scope="row">UID-Nummer</th>
              <td>{business.uid}</td>
            </tr>
          )}
          {business.companyRegisterNumber && (
            <tr>
              <th scope="row">Firmenbuchnummer</th>
              <td>{business.companyRegisterNumber}</td>
            </tr>
          )}
          {business.companyRegisterCourt && (
            <tr>
              <th scope="row">Firmenbuchgericht</th>
              <td>{business.companyRegisterCourt}</td>
            </tr>
          )}
        </tbody>
      </table>

      <h2>Mitgliedschaften</h2>
      <p>
        {business.chamber}, {business.chamberState}. Fachverband der gewerblichen
        Dienstleister, Berufsgruppe der freien Gewerbe der Hilfestellung zur Erreichung
        einer körperlichen bzw. energetischen Ausgewogenheit (Humanenergetik).
      </p>

      <h2>Anwendbare Rechtsvorschriften und Zugang zu diesen</h2>
      <p>
        Gewerbeordnung 1994 (GewO 1994), BGBl. Nr. 194/1994 idgF, abrufbar unter{' '}
        <a href="https://www.ris.bka.gv.at" target="_blank" rel="noreferrer noopener">
          www.ris.bka.gv.at
        </a>
        . Für das Gewerbe {business.tradeTitle} gilt kein Befähigungsnachweis, es handelt
        sich um ein freies Gewerbe.
      </p>
      <p>
        Standesregeln des Fachverbands der gewerblichen Dienstleister für die freien
        Gewerbe der Humanenergetik, genehmigt vom Erweiterten Präsidium der
        Wirtschaftskammer Österreich am 23.4.2014.
      </p>

      <h2>Gewerbebehörde</h2>
      <p>{business.authority}</p>

      <h2>Berufsrechtliche Einstufung der Tätigkeit</h2>
      <p>
        Die auf dieser Website beschriebenen Angebote (Breathwork, Holistic Bodywork,
        Cranio-Sacrale Impulsarbeit, Kundalini Awakening, Prozessbegleitung) sind
        energetische Hilfestellung im Rahmen der Humanenergetik. Sie stellen keine
        Heilbehandlung, keine medizinische Diagnose und keinen Ersatz für eine ärztliche,
        psychologische oder psychotherapeutische Behandlung dar. Näheres dazu in den{' '}
        <a href={withBase('/agb')}>Allgemeinen Geschäftsbedingungen</a>.
      </p>

      <h2>EU-Streitschlichtung</h2>
      <p>
        Verbraucher:innen haben die Möglichkeit, Beschwerden an die
        Online-Streitbeilegungsplattform der EU zu richten:{' '}
        <a
          href="https://ec.europa.eu/consumers/odr"
          target="_blank"
          rel="noreferrer noopener"
        >
          ec.europa.eu/consumers/odr
        </a>
        . Sie können allfällige Beschwerden auch an die oben angegebene E-Mail-Adresse
        richten. An einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
        wird derzeit nicht teilgenommen.
      </p>

      <h2>Haftung für Inhalte dieser Website</h2>
      <p>
        Alle Inhalte dieser Website wurden mit größtmöglicher Sorgfalt und nach bestem
        Wissen erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte
        kann jedoch keine Gewähr übernommen werden. Als Diensteanbieterin ist {business.fullName}{' '}
        gemäß § 18 Abs. 1 E-Commerce-Gesetz nicht verpflichtet, übermittelte oder
        gespeicherte fremde Informationen zu überwachen.
      </p>

      <h2>Haftung für Links</h2>
      <p>
        Diese Website enthält Links zu externen Websites Dritter, auf deren Inhalte kein
        Einfluss besteht. Für diese fremden Inhalte kann daher keine Gewähr übernommen
        werden. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
        verantwortlich.
      </p>

      <h2>Urheberrecht</h2>
      <p>
        Die durch die Betreiberin erstellten Inhalte und Werke auf dieser Website
        unterliegen dem österreichischen Urheberrecht. Beiträge Dritter sind als solche
        gekennzeichnet. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
        Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen
        Zustimmung der jeweiligen Autorin bzw. Erstellerin.
      </p>
    </LegalLayout>
  )
}
