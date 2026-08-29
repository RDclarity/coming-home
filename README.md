# Coming Home

Neubau der Seite `achtsames-beruehren.onepage.me` als eigenständiges Projekt –
Vite + React 19 + TypeScript, CSS Modules, keine Baukasten-Abhängigkeit mehr.
Jede Seite wird zur Build-Zeit vorgerendert (SSG) und läuft danach als
interaktive React-App weiter (Hydration) – siehe „Rendering & SEO" unten.

Live: https://rdclarity.github.io/coming-home/ (GitHub Pages, per GitHub
Actions bei jedem Push auf `main` neu gebaut, siehe `.github/workflows/deploy.yml`).

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

- **`/begleitungen`** – Übersicht aller zehn Angebote (Einzelsessions,
  3-/12-Monats-Begleitung, Tagesworkshop, Gruppenformat, Retreats), jede mit
  eigener Detailseite unter `/begleitung/:slug` (Preis, Ablauf, Zielgruppe,
  passende FAQ, verwandte Angebote). Daten in `src/data/services.ts`.
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
  (aktuell nur `/intern/crm`, siehe unten).

### GitHub-Pages-Unterpfad

Die Seite läuft unter `https://rdclarity.github.io/coming-home/` – also nicht
auf einer eigenen Domain, sondern in einem Unterordner. `vite.config.ts` setzt
`base: '/coming-home/'` für Produktions-Builds (`mode === 'production'`, greift
für `build` **und** `preview`, nicht für `dev`). Jeder interne Link/jede
`public/`-Referenz im Code läuft deshalb durch `withBase()` aus `src/lib/url.ts`
statt rohe `"/pfad"`-Strings zu verwenden – das ist der einzige Ort, an dem der
Unterpfad angehängt wird. Zieht die Seite später auf eine eigene Domain
(z. B. `cominghome.de`) um: nur `base` in `vite.config.ts` wieder auf `/` setzen.

## Bilder

Alle großflächigen Fotos liegen als WebP vor (`public/images/*.webp`,
`cwebp -q 82`), das spart je nach Bild 54–59 % gegenüber den ursprünglichen
JPEGs. `hero.jpg` liegt zusätzlich als JPEG vor, weil das Open-Graph-Bild
(für Link-Vorschauen in Messengern/Social Media) bewusst beim kompatibleren
Format bleibt – nur die Sichtbare-Seite-Referenzen nutzen WebP.

## CRM (mit echtem Supabase-Backend)

Jede Formular-Anfrage (Bewerbungsbogen, Kontakt, Audioübung) landet zusätzlich
zum normalen Versand (siehe „Formulare" unten) in einem einfachen CRM unter
**`/intern/crm`** – bewusst nicht in Nav/Footer verlinkt, per `robots.txt`
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
Zugriffsschutz auf `/intern/crm` ist deshalb ein **echter Supabase-Login**
(E-Mail/Passwort, siehe `src/components/SupabaseLoginGate.tsx` und
`src/crm/auth.ts`) – keine reine Passphrase mehr wie zuvor.

**Jasmins Zugang selbst anlegen** (bewusst nicht automatisch von der KI
erstellt): Supabase-Dashboard → Projekt „coming-home" → *Authentication* →
*Users* → *Add user* → E-Mail und Passwort eurer Wahl eintragen, „Auto Confirm
User" aktivieren. Mit diesen Zugangsdaten kann sie sich danach direkt unter
`/intern/crm` einloggen.

Ist kein Supabase konfiguriert (z. B. in einer lokalen Vorschau ohne `.env`),
gilt weiterhin nur der alte Passphrase-Sichtschutz
(„cominghome2026", in `src/lib/internAuth.ts` änderbar) – **keine echte
Zugriffskontrolle**, weil eine rein statische Seite ohne Backend keine
serverseitige Prüfung machen kann. Das steht auch so auf der Seite selbst.

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

**Ohne gesetzten Endpoint** öffnet sich beim Absenden ein vorbereiteter
E-Mail-Entwurf an `hallo@cominghome.de`. So geht nichts verloren, solange das
Backend noch nicht steht – produktiv sollte aber ein echter Endpoint gesetzt sein.

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

**Vor dem Livegang unbedingt erledigen:**

1. In `src/data/legal.ts` alle `[Platzhalter: …]`-Werte durch die echten Angaben
   ersetzen: vollständiger Name, Adresse, Telefonnummer, zuständige
   Gewerbebehörde, Landesinnung. Ein Impressum mit falschen oder erfundenen
   Angaben ist in Österreich ein Wettbewerbsverstoß (§ 5 ECG). Diese Platzhalter
   fließen aktuell auch in das JSON-LD auf jeder Seite – dort werden sie
   automatisch weggelassen, solange sie als `[Platzhalter: …]` erkennbar sind
   (siehe `isPlaceholder()` in `scripts/prerender.mjs`), damit keine Fantasie-
   Adresse an Suchmaschinen/KI-Systeme ausgeliefert wird.
2. In `src/pages/legal/Datenschutz.tsx` den Hosting-Anbieter eintragen
   (Abschnitt 2 – aktuell „GitHub Pages" nicht genannt, sollte ergänzt werden),
   sowie den tatsächlichen Formular-Versandweg (Abschnitt 8).
3. In `src/pages/legal/Agb.tsx` die Stornofrist (Abschnitt 6) und die
   Zahlungsarten (Abschnitt 5) festlegen.
4. Alle drei Seiten von einer Rechtsberatung gegenlesen lassen – das steht so
   auch auf jeder Seite selbst, weil weder die WKO-Vorlagen noch diese daraus
   abgeleiteten Texte eine Rechtsberatung ersetzen.

## Weitere offene Punkte

- **E-Mail-Adresse**: `hallo@cominghome.de` ist aus der alten Seite übernommen.
- **Instagram-Link** in `src/data/site.ts` zeigt noch auf die Profil-Startseite.
- **Terminbuchung**: „Meinen Platz reservieren" führt aktuell zum Kontaktformular.
- **FAQ-Antworten** waren auf der alten Seite leer und sind hier neu formuliert –
  bitte fachlich gegenlesen.
- **CRM-Backend**: seit `bau ein backend für die seite` erledigt – siehe
  Abschnitt „CRM" oben, läuft über ein eigenes Supabase-Projekt. Offen bleibt
  nur: Jasmins Login im Supabase-Dashboard anlegen (Anleitung ebenfalls oben).
- **`llms.txt`**: wird nicht automatisch generiert, bei Preis-/Seitenänderungen
  von Hand nachziehen (`public/llms.txt`).
- **Hintergrundmusik**: Player ist fertig (`src/components/MusicPlayer.tsx`,
  Umschalter oben links), es fehlt nur die echte Audiodatei – siehe
  `public/audio/README.md`. Ohne Datei bleibt der Button sichtbar, spielt
  aber nichts ab (kein Fehler, nur leer).
- **Preise auf Anfrage**: Nur das Tagesseminar (369 €) hat einen festen,
  öffentlich genannten Preis. 1:1-Begleitung, 3-Monats- und Jahresbegleitung
  sind absichtlich ohne Preis – wird im Kennenlerngespräch besprochen.
- **Englische Version**: noch nicht umgesetzt, angefragt aber wegen Umfang
  (200+ Textfelder, drei Rechtstexte) noch nicht begonnen – siehe Chat.
- **Editor-Backend**: siehe Abschnitt „Text-Editor" oben – wie beim CRM
  aktuell nur pro Gerät, nicht live für Besucher:innen.
