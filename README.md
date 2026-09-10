# Coming Home

Neubau der Seite `achtsames-beruehren.onepage.me` als eigenständiges Projekt –
Vite + React 19 + TypeScript, CSS Modules, keine Baukasten-Abhängigkeit mehr.
Jede Seite wird zur Build-Zeit vorgerendert (SSG) und läuft danach als
interaktive React-App weiter (Hydration) – siehe „Rendering & SEO" unten.

Live: https://jasmindraxl.at/ (gehostet auf GitHub Pages, per GitHub Actions
bei jedem Push auf `main` neu gebaut, siehe `.github/workflows/deploy.yml`;
eigene Domain per `public/CNAME`, vorher lief die Seite unter
`rdclarity.github.io/coming-home/`).

## Loslegen

```bash
npm install
npm run dev      # http://localhost:5174 – reines CSR, für schnelles Iterieren
npm run build    # tsc + Client-Build + SSR-Build + Prerender → dist/
npm run preview  # dist/ lokal wie GitHub Pages ausliefern (siehe Hinweis unten)
```

**Wichtig:** Zum lokalen Testen des fertigen Builds NICHT `vite preview`
verwenden – dessen SPA-Fallback liefert für jede Route außer „/" fälschlich
die Startseite aus und sieht dann wie ein Hydration-Fehler aus, obwohl die
erzeugte Datei korrekt ist. `npm run preview` startet stattdessen
`scripts/serve-dist.mjs`, einen minimalen Server, der sich wie GitHub Pages
verhält (Verzeichnis-Index, echtes 404.html).

## Aufbau

```
src/
  data/           site.ts (Texte, FAQ, Termine), pricing.ts (alle Preise),
                  services.ts (Begleitungen), articles.ts (Ratgeber), legal.ts
  components/     Button, Eyebrow, Breadcrumbs, Formularfelder, Accordion, Reveal
  sections/       Home-Abschnitte, je eine Komponente + .module.css
  pages/          Home, legal/ (Impressum, Datenschutz, AGB), services/
                  (Begleitungen-Übersicht + Detailseite), ratgeber/
                  (Übersicht + Artikel), crm/ (internes Tool), NotFound
  crm/            Lead-Datenmodell + austauschbarer Store (aktuell localStorage)
  seo/pages.ts    Verzeichnis ALLER öffentlichen Routen – treibt Prerender,
                  Meta-Tags/JSON-LD und sitemap.xml
  lib/url.ts      withBase() – GitHub-Pages-Unterpfad-Handling, siehe unten
  entry-server.tsx  SSR-Einstieg fürs Prerendering
scripts/
  prerender.mjs   baut aus jeder Route in seo/pages.ts eine eigene dist/*/index.html
  serve-dist.mjs  lokaler Test-Server, verhält sich wie GitHub Pages
```

Inhalte ändern heißt meistens: nur `src/data/*.ts` anfassen, nicht die
Komponenten. Neue Begleitung/neuen Artikel hinzufügen → Eintrag in
`services.ts`/`articles.ts` ergänzen, taucht automatisch in Übersicht,
Sitemap, `llms.txt`-Erwähnung (von Hand pflegen) und Prerender auf.

## Preise

Einzige Quelle: `src/data/pricing.ts`. Aktueller Stand:

| Leistung                          | Preis      |
| ---------------------------------- | ---------- |
| Einzelstunde (Breathwork, Bodywork, Cranio-Sacral, Kundalini, Prozessbegleitung) | 140 € / 90 Min. |
| Tagesseminar (z. B. Feminine Power) | 369 € pro Person |
| 3-Monats-Begleitung                | 2.990 € gesamt |
| 12-Monats-Begleitung (Jahresbegleitung) | 9.590 € gesamt |

Preis ändern = einmal in `pricing.ts` anpassen, wirkt überall (Begleitungsseiten,
FAQ-Antwort „Was kostet eine Begleitung?", JSON-LD-Preisangaben, `llms.txt`
muss beim Ändern **von Hand** mitgepflegt werden, siehe unten).

## Begleitungen & Ratgeber (neue Unterseiten)

- **`/begleitungen`** – Übersicht aller vier Angebote (1:1 Session,
  3-Monats-Begleitung, Jahresbegleitung, Tagesseminar), jede mit eigener
  Detailseite unter `/begleitung/:slug` (Preis, Ablauf, Zielgruppe, passende
  FAQ, verwandte Angebote). Daten in `src/data/services.ts` – das frühere
  10-Stunden-Paket der 1:1-Begleitung liegt dort als bewusst nicht gelistetes
  `archivedServices`-Array weiter (frühere Gruppenformat-/Retreat-Angebote
  wurden bereits davor ganz entfernt, nicht archiviert).
- **`/ratgeber`** – zehn ausführliche Artikel zu Breathwork, Nervensystem-
  regulation, Cranio-Sacral, Kontraindikationen etc., jeweils unter
  `/ratgeber/:slug`. Daten in `src/data/articles.ts`. Bewusst substanziell
  geschrieben (keine Keyword-Füllseiten) – das ist zugleich die wirksamste
  SEO/KI-Suche-Maßnahme: Suchmaschinen und Sprachmodelle zitieren eher Seiten,
  die eine Frage direkt beantworten.

Beide Bereiche sind aus Nav, Footer und den jeweiligen Detailseiten quer
verlinkt (Breadcrumbs, „passende Begleitungen", „verwandte Artikel").

## Rendering & SEO

Die App ist eine normale React-SPA, wird aber bei jedem `npm run build`
zusätzlich **vorgerendert**: `scripts/prerender.mjs` rendert jede Route aus
`src/seo/pages.ts` serverseitig (`react-dom/server` + `react-router-dom`s
`StaticRouter`) zu eigenem, sofort lesbarem HTML – inklusive `<title>`,
`<meta description>`, Canonical-Link, Open-Graph/Twitter-Tags und JSON-LD
(`Person`, `Organization`, `Service`/`Article` je nach Seite, `FAQPage` auf
der Startseite, `BreadcrumbList` auf Unterseiten).

**Warum das wichtig ist:** Eine reine Client-Side-App zeigt Bots, die kein
JavaScript ausführen – darunter die meisten KI-Crawler wie GPTBot, ClaudeBot
oder PerplexityBot – nur ein leeres `<div id="root">`. Mit Prerendering sieht
jede URL für Mensch, Google **und** KI-Suche denselben, echten Inhalt. Im
Browser übernimmt anschließend `hydrateRoot` (in `src/main.tsx`) nahtlos die
Interaktivität.

Zusätzlich vorhanden:

- `public/robots.txt` – erlaubt alles außer `/intern/` (das CRM), verweist auf die Sitemap.
- `dist/sitemap.xml` – wird bei jedem Build aus `seo/pages.ts` neu generiert.
- `public/llms.txt` – kuratierte Übersicht für Sprachmodelle/KI-Suche (Preise,
  wichtigste Seiten, ausdrücklicher Hinweis, keine Angaben zu erfinden). **Von
  Hand pflegen**, wenn sich Preise oder Seiten ändern – wird nicht automatisch
  generiert, damit die Kuratierung bewusst bleibt.
- `dist/404.html` – wird beim Prerender separat erzeugt (NotFound-Seite,
  `noindex`) und dient GitHub Pages als Fallback für nicht vorgerenderte Pfade
  (aktuell nur `/admin`, siehe unten).

### Eigene Domain (jasmindraxl.at)

Die Seite läuft unter `https://jasmindraxl.at/` – eigene Domain, kein
Unterordner. `vite.config.ts` setzt `base: '/'`. Trotzdem läuft jeder interne
Link/jede `public/`-Referenz im Code weiterhin durch `withBase()` aus
`src/lib/url.ts` statt rohe `"/pfad"`-Strings zu verwenden – falls die Seite
je wieder unter einem Unterpfad läuft (z. B. wieder als GitHub-Pages-
Projektseite ohne eigene Domain), reicht dann wieder eine einzige Änderung
in `vite.config.ts`.

Die Domain-Anbindung besteht aus drei Teilen:

1. **DNS** beim Registrar: 4 A-Einträge auf der nackten Domain (`185.199.108.153`,
   `185.199.109.153`, `185.199.110.153`, `185.199.111.153`) sowie ein
   CNAME-Eintrag `www` → `rdclarity.github.io`.
2. **`public/CNAME`** im Repo (Inhalt: `jasmindraxl.at`) – landet bei jedem
   Build automatisch in `dist/CNAME`, damit GitHub Pages die Domain nach
   jedem Deploy behält (sonst würde ein rein über die GitHub-UI gesetzter
   Custom-Domain-Eintrag beim nächsten Deploy wieder verschwinden, weil
   `dist/` frisch aus `public/` + Build-Output zusammengesetzt wird).
3. **GitHub-Repo-Settings** → Pages → „Custom domain" → `jasmindraxl.at`
   eintragen, „Enforce HTTPS" aktivieren, sobald das Zertifikat ausgestellt
   ist (kann nach DNS-Umstellung etwas dauern).

## Bilder

Alle großflächigen Fotos liegen als WebP vor (`public/images/*.webp`,
`cwebp -q 82`), das spart je nach Bild 54–59 % gegenüber den ursprünglichen
JPEGs. `hero.jpg` liegt zusätzlich als JPEG vor, weil das Open-Graph-Bild
(für Link-Vorschauen in Messengern/Social Media) bewusst beim kompatibleren
Format bleibt – nur die Sichtbare-Seite-Referenzen nutzen WebP.

## CRM (mit echtem Supabase-Backend)

Jede Formular-Anfrage (Bewerbungsbogen, Kontakt, Audioübung) landet zusätzlich
zum normalen Versand (siehe „Formulare" unten) in einem einfachen CRM unter
**`/admin`** – bewusst nicht in Nav/Footer verlinkt, per `robots.txt`
von der Indexierung ausgeschlossen und nicht Teil der Sitemap.

Das CRM hat ein eigenes, von allen anderen Ventures des Betreibers komplett
getrenntes Supabase-Projekt (`coming-home`, Schema in
`supabase/migrations/00000000000001_leads.sql`). Sobald
`VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` gesetzt sind (siehe
`.env.example`, im GitHub-Actions-Deploy bereits als Repo-Secrets hinterlegt),
übernimmt `src/crm/supabaseStore.ts` automatisch von der localStorage-Variante
(`src/crm/store.ts`) – **Anfragen landen dann zentral in der Datenbank, egal
von welchem Gerät aus jemand das Formular abschickt.** Ohne diese Variablen
(z. B. lokal ohne `.env`) fällt die App automatisch auf den localStorage-Adapter
zurück, damit sie trotzdem baut und funktioniert.

**Sicherheitsmodell (Row Level Security):** Der `anon`-Key im Frontend darf
laut Datenbank-Policy ausschließlich neue Leads *anlegen* – nie lesen, ändern
oder löschen. Nur ein eingeloggter Account darf Leads sehen/bearbeiten/löschen.
Zugriffsschutz auf `/admin` ist deshalb ein **echter Supabase-Login**
(E-Mail/Passwort, siehe `src/components/SupabaseLoginGate.tsx` und
`src/crm/auth.ts`) – keine reine Passphrase mehr wie zuvor.

**Jasmins Zugang selbst anlegen** (bewusst nicht automatisch von der KI
erstellt): Supabase-Dashboard → Projekt „coming-home" → *Authentication* →
*Users* → *Add user* → E-Mail und Passwort eurer Wahl eintragen, „Auto Confirm
User" aktivieren. Mit diesen Zugangsdaten kann sie sich danach direkt unter
`/admin` einloggen.

Ist kein Supabase konfiguriert (z. B. in einer lokalen Vorschau ohne `.env`),
gilt weiterhin nur der alte Passphrase-Sichtschutz
(„cominghome2026", in `src/lib/internAuth.ts` änderbar) – **keine echte
Zugriffskontrolle**, weil eine rein statische Seite ohne Backend keine
serverseitige Prüfung machen kann.

**Eigene Ansicht ohne Website-Chrome:** `/admin` (und `/intern/*`) bekommen in
`App.tsx` bewusst kein Nav, Footer, Musikplayer oder Cookie-Banner – wer sich
dort einloggt, sieht ausschließlich das Backend, nicht die Marketing-Seite
drumherum.

**Besucherstatistik (Tab „Statistik" im Backend):** Zeigt Seitenaufrufe,
eindeutige Besucher, Geräte- und Quellenverteilung (woher die Besucher:innen
kommen – Suchmaschine, Social Media, Direktaufruf …) sowie die meistbesuchten
Seiten. Komplett anonym und ohne externen Dienst, siehe Kommentar in
`src/lib/analytics.ts` für die Details. Landet in einer eigenen Tabelle
(`supabase/migrations/00000000000002_page_views.sql`), gleiches
Sicherheitsmodell wie bei `leads`: `anon` darf nur einfügen, nur ein
eingeloggter Account darf auswerten.

## Mitgliederbereich (3-/12-Monats-Begleitungen)

Unter **`/mitglieder`** bekommen Teilnehmer:innen der mehrmonatigen
Begleitungen monatsweise Zugriff auf PDFs, Videos und einen Fragebogen zum
jeweiligen Videokurs. Eigenes, komplett eingeständiges Datenmodell (siehe
`supabase/migrations/00000000000003_members.sql`):

- **`profiles`** – eine Zeile pro Supabase-Auth-Account (admin oder member),
  wird automatisch per Datenbank-Trigger angelegt, sobald Jasmin im
  Supabase-Dashboard einen neuen Login erstellt (genau wie bisher schon für
  ihren eigenen CRM-Zugang – kein öffentliches Registrierungsformular).
- **`programs`**/**`enrollments`** – Programme (z. B. „3-Monats-Begleitung")
  und wer mit welchem Startdatum eingeschrieben ist.
- **`program_months`**/**`month_materials`**/**`questionnaires`** – Inhalte
  je Monat (PDF im privaten Storage-Bucket `program-pdfs`, Video als
  YouTube/Vimeo-Link) sowie ein Fragebogen dazu.

**Sicherheitsmodell:** Welche Monate ein Mitglied sieht, entscheidet
ausschließlich die Datenbank per Row Level Security – Monat *N* wird erst
sichtbar, sobald seit dem Startdatum *N-1* volle Monate vergangen sind
(Funktion `month_unlocked()`). Das lässt sich nicht durch Tricksen im
Frontend umgehen.

**Wichtig:** Seit es Teilnehmer-Logins gibt, prüft die Datenbank bei `leads`,
`lead_notes` und `page_views` nicht mehr nur „ist überhaupt eingeloggt",
sondern echt „hat role = 'admin'" (Funktion `is_admin()`) – vorher hätte
jeder neue Mitglieder-Login sonst versehentlich vollen CRM-Zugriff auf
Jasmins Kundenanfragen bekommen.

**Verwaltung:** Im Backend (`/admin`) gibt es dafür den Tab
**„Mitgliederbereich"** (`src/pages/crm/AdminMitglieder.tsx`) – Programme und
Monate anlegen, PDFs hochladen, Video-Links eintragen, Fragebögen
zusammenstellen (Fragen mit Kurzantwort/Langtext/Einfach-/Mehrfachauswahl)
und Mitglieder einem Programm mit Startdatum zuordnen.

**Fragebogen als PDF:** Ein Mitglied kann seine Antworten client-seitig
(lazy geladenes `jsPDF`, kein Bundle-Gewicht ohne tatsächliche Nutzung) als
PDF erzeugen und sich per Klick an die eigene, im Login hinterlegte
E-Mail-Adresse schicken lassen – über eine neue Edge Function
(`supabase/functions/send-questionnaire-pdf/`, Resend wie bei `notify-lead`,
Einrichtung dort im Datei-Kommentar). Die Zieladresse kommt dabei
ausschließlich aus dem geprüften Login, nie aus dem Request selbst.

## Text-Editor (lokal, noch ohne Backend)

Unter **`/intern/editor`** (gleicher Passphrase-Schutz wie das CRM) lassen
sich alle Texte aus `src/data/site.ts` durchsuchen und bearbeiten –
technisch generisch über `src/cms/flatten.ts` (zerlegt jedes verschachtelte
Textobjekt in einzelne Felder), nicht Feld für Feld von Hand verdrahtet.

**Wichtig, dieselbe Einschränkung wie beim CRM:** Änderungen landen als
Entwurf in `localStorage` – nur in diesem Browser sichtbar, NICHT live für
echte Besucher:innen. Über „Änderungen exportieren" lässt sich eine Liste
aller geänderten Felder (alt → neu) als Datei herunterladen, die dann von
Hand in die `src/data/*.ts`-Dateien übernommen und neu deployt werden muss.

Echtes WordPress-artiges Verhalten (Änderungen sofort für alle live, neue
Sektionen per Klick hinzufügen) braucht zwingend ein Backend mit Datenbank –
das ist mit einer rein statischen Seite ohne Server nicht möglich. Sobald
ein Backend angebunden wird (siehe CRM-Abschnitt), lässt sich dieser Editor
darauf umstellen.

## Formulare

Bewerbungsbogen, Kontaktformular und Audioübung schicken einen JSON-POST an die
Adresse aus `VITE_FORM_ENDPOINT`:

```bash
cp .env.example .env
# VITE_FORM_ENDPOINT=https://formspree.io/f/xxxx
```

Das Format passt zu Formspree, Basin, n8n, Make oder einer eigenen Function –
gesendet wird `{ formType, …Felder }`, wobei `formType` `bewerbung`, `kontakt`
oder `newsletter` ist.

**Ohne gesetzten Endpoint** passiert nichts weiter außer dem CRM-Eintrag (siehe
`lib/submitForm.ts`) – kein mailto-Popup mehr. Zusätzlich (unabhängig von
`VITE_FORM_ENDPOINT`) lässt sich über `VITE_LEAD_NOTIFY_ENDPOINT` eine
automatische E-Mail-Benachrichtigung an `anfrage@jasmindraxl.at` aktivieren,
siehe `supabase/functions/notify-lead/`.

## Tracking (Google Analytics, Google Ads, Meta Pixel)

Komplett vorbereitet, aber standardmäßig inaktiv – jedes Tool bleibt aus,
solange seine ID nicht gesetzt ist (`.env.example`), genau wie beim
Supabase-CRM. Sobald IDs gesetzt sind, erscheint automatisch ein
Cookie-Banner (`src/components/ConsentBanner.tsx`); die Tools laden
ausschließlich nach aktiver Zustimmung.

**Aktivieren:**

1. In `.env` (lokal) und als GitHub-Secrets (fürs Deployment) setzen, je
   nachdem was ihr nutzt:
   ```bash
   VITE_GA_MEASUREMENT_ID=G-XXXXXXX        # Google Analytics 4
   VITE_GOOGLE_ADS_ID=AW-XXXXXXXXX         # Google Ads
   VITE_META_PIXEL_ID=XXXXXXXXXXXXXXX      # Meta (Facebook/Instagram) Pixel
   ```
   ```bash
   gh secret set VITE_GA_MEASUREMENT_ID --repo RDclarity/coming-home --body "G-XXXXXXX"
   # analog für die anderen beiden
   ```

2. **Serverseitige Ergänzung (optional, aber empfohlen):** Bei jeder
   erfolgreichen Formular-Anfrage wird zusätzlich – nur mit Zustimmung – ein
   Event an eine Supabase Edge Function geschickt
   (`supabase/functions/send-conversion/`), die es serverseitig an die Meta
   Conversions API und das GA4 Measurement Protocol weiterleitet. Das zählt
   Conversions zuverlässiger, weil es auch dann noch funktioniert, wenn ein
   Adblocker das Browser-Pixel im Nutzer-Browser blockiert (ein bekanntes
   Problem bei reinem Client-Side-Tracking). Einrichtung: Kommentar am Anfang
   von `supabase/functions/send-conversion/index.ts` – kurz zusammengefasst:
   Function deployen, die passenden Secrets setzen (`META_PIXEL_ID`,
   `META_CAPI_ACCESS_TOKEN`, `GA4_MEASUREMENT_ID`, `GA4_API_SECRET`), die
   ausgegebene URL als `VITE_CONVERSION_ENDPOINT` eintragen.

Ohne Schritt 2 funktioniert das normale Browser-Pixel/gtag trotzdem ganz
normal – die Edge Function ist nur die zuverlässigere Ergänzung, kein
Ersatz.

## Deployment

`.github/workflows/deploy.yml` baut bei jedem Push auf `main` (und manuell
auslösbar) mit `npm ci && npm run build` und deployt `dist/` über
`actions/deploy-pages` nach GitHub Pages. Einmalig einzurichten (falls noch
nicht geschehen): Repo-Settings → Pages → Source „GitHub Actions".

## Farbwelt und Schriften

| Token       | Wert      | Einsatz                          |
| ----------- | --------- | -------------------------------- |
| `--c-dark`  | `#181817` | dunkle Sections, Schrift         |
| `--c-white` | `#F7F4EE` | Creme-Sections                   |
| `--c-light` | `#E9E0D4` | Sand-Sections, Navigation        |
| `--c-key1`  | `#C7B7A5` | Akzent: Punkte, Zahlen, Buttons  |
| `--c-key2`  | `#625E58` | zweiter, gedeckter Akzent        |

Schriften: Cormorant Garamond (Überschriften) und Inter (Fließtext), beide über
`@fontsource-variable` mitgeliefert – kein Google-Fonts-Aufruf, damit DSGVO-seitig
nichts nachzuziehen ist.

## Rechtstexte

Impressum, Datenschutzerklärung und AGB liegen unter `/impressum`, `/datenschutz`
und `/agb` (`src/pages/legal/`), verlinkt aus dem Footer. Sie folgen inhaltlich:

- dem **Musterimpressum** der Wirtschaftskammer Wien, Fachgruppe Personenberatung
  und Personenbetreuung,
- dem **Muster-Aufklärungsbogen für die Humanenergetik und Datenschutz** der WKO
  Wien (2024),
- den **Standesregeln des Fachverbands der gewerblichen Dienstleister für die
  freien Gewerbe der Humanenergetik** (genehmigt vom Erweiterten Präsidium der
  WKÖ am 23.4.2014).

Damit ist die Tätigkeit rechtlich als freies Gewerbe „Humanenergetik" eingeordnet –
das passt zur „keine Heilbehandlung"-Formulierung, die die Seite ohnehin schon
verwendet. Übt Jasmin daneben ein reglementiertes Gewerbe aus (z. B. Massage als
medizinische Masseurin), muss das ergänzt werden.

Die persönlichen Angaben in `src/data/legal.ts` (Name, Adresse, Telefon,
Gewerbebehörde, Landesinnung) sind seit 4. September 2026 die echten Angaben
von Jasmin, kein Platzhalter mehr. `scripts/prerender.mjs` (`isPlaceholder()`)
lässt trotzdem weiterhin jeden künftig neu eingetragenen `[Platzhalter: …]`-Wert
automatisch aus dem JSON-LD raus, falls hier je wieder etwas geändert wird,
bevor die echten Daten feststehen.

Alle drei Rechtsseiten (Impressum, Datenschutz, AGB) sollten vor dem
endgültigen Livegang trotzdem einmal von einer Rechtsberatung gegengelesen
werden – die WKO-Vorlagen, an denen sie sich orientieren, ersetzen keine
Rechtsberatung. Das steht bewusst nicht mehr direkt auf den Seiten selbst
(interne Hinweise gehören nicht auf eine öffentliche Seite), sondern nur hier.

## Weitere offene Punkte

- **Instagram-Link** in `src/data/site.ts` zeigt noch auf die Profil-Startseite.
- **CRM-Backend**: läuft über ein eigenes Supabase-Projekt, siehe Abschnitt
  „CRM" oben – erreichbar unter `/admin`. Offen bleibt nur: Jasmins Login im
  Supabase-Dashboard anlegen (Anleitung ebenfalls oben).
- **`llms.txt`**: wird nicht automatisch generiert, bei Preis-/Seitenänderungen
  von Hand nachziehen (`public/llms.txt`).
- **Hintergrundmusik**: Player fertig, Audiodatei liegt vor
  (`public/audio/theme.mp3`/`.m4a`).
- **Englische Version**: noch nicht umgesetzt, angefragt aber wegen Umfang
  (200+ Textfelder, drei Rechtstexte) noch nicht begonnen – siehe Chat.
- **Editor-Backend**: siehe Abschnitt „Text-Editor" oben – wie beim CRM
  aktuell nur pro Gerät, nicht live für Besucher:innen.
