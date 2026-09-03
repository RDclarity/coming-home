/**
 * Betriebsdaten für Impressum, Datenschutz und AGB.
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
  fullName: 'Jasmin Draxl',

  // Nur ausfüllen, falls unter einer eingetragenen Firma (z. B. „… e.U.") tätig.
  companyName: '',

  street: 'Ratschkygasse 11/1',
  zip: '1120',
  city: 'Wien',
  country: 'Österreich',

  phone: '0664 9292311',
  email: 'hallo@jasmindraxl.at',

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
  authority: 'Magistrat 1120',

  chamber: 'Mitglied der Wirtschaftskammer Österreich (WKO)',
  chamberState: 'WKO Wien',

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
