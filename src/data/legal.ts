/**
 * Betriebsdaten für Impressum, Datenschutz und AGB.
 *
 * WICHTIG: Die mit [Platzhalter] markierten Werte sind noch keine echten Angaben.
 * Sie MÜSSEN vor dem Livegang durch die tatsächlichen Daten von Jasmin ersetzt
 * werden – ein Impressum mit falschen oder erfundenen Angaben ist in Österreich
 * ein Wettbewerbsverstoß (§ 5 ECG) und macht die Anbieterin persönlich haftbar.
 *
 * Diese Datei geht davon aus, dass die Tätigkeit unter das freie Gewerbe
 * „Hilfestellung zur Erreichung einer körperlichen bzw. energetischen
 * Ausgewogenheit" (Humanenergetik) fällt – das passt zur Selbstbeschreibung der
 * Seite („keine Heilbehandlung", Breathwork/Bodywork/Berührung). Falls Jasmin
 * daneben ein reglementiertes Gewerbe ausübt (z. B. Massage als medizinische
 * Masseurin), muss das hier ergänzt werden.
 */

export const business = {
  // Vollständiger Name der Unternehmerin bzw. Firmenwortlaut laut Gewerbeschein.
  fullName: '[Platzhalter: Vor- und Nachname]',

  // Nur ausfüllen, falls unter einer eingetragenen Firma (z. B. „… e.U.") tätig.
  companyName: '',

  street: '[Platzhalter: Straße und Hausnummer]',
  zip: '[Platzhalter: PLZ]',
  city: '[Platzhalter: Ort]',
  country: 'Österreich',

  phone: '[Platzhalter: Telefonnummer]',
  email: 'hallo@cominghome.de',

  // Gewerbebezeichnung laut Gewerbeschein.
  tradeTitle: 'Humanenergetikerin',
  tradeSubject:
    'Hilfestellung zur Erreichung einer körperlichen bzw. energetischen Ausgewogenheit, personenbezogen ausgeübt (Humanenergetik)',

  // Nur ausfüllen, wenn tatsächlich vergeben (nicht jede Einzelunternehmerin hat eine UID).
  uid: '',

  // Firmenbuchnummer/-gericht nur bei eingetragener Firma relevant.
  companyRegisterNumber: '',
  companyRegisterCourt: '',

  // Die Bezirksverwaltungsbehörde am Sitz des Unternehmens (zugleich Gewerbebehörde).
  authority: '[Platzhalter: zuständige Bezirkshauptmannschaft / zuständiges Magistrat]',

  chamber: 'Mitglied der Wirtschaftskammer Österreich (WKO)',
  chamberState: '[Platzhalter: Landesinnung/-kammer, z. B. WKO Niederösterreich]',

  // Betrieblicher Sitz, falls Sessions ausschließlich außer Haus stattfinden.
  hasFixedPremises: false,
} as const

export const dataProtectionAuthority = {
  name: 'Österreichische Datenschutzbehörde',
  street: 'Barichgasse 40–42',
  zip: '1030',
  city: 'Wien',
  website: 'https://www.dsb.gv.at',
} as const
