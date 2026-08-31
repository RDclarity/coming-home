# Coming Home – Audit

**Stand:** 30. August 2026 (ursprüngliche Erstellung) – **Status-Updates**
siehe Kasten direkt darunter.
**Umfang:** Vollständiger Code-, Security- und Production-Readiness-Audit gemäß
Auftrag. Alle Aussagen basieren auf dem tatsächlichen Repository-Zustand
(`npm ci`, `npm run build`, `npm audit`, Migration/RLS-Review, manuelle
Code-Durchsicht) zum Zeitpunkt der Erstellung – nicht auf Annahmen.

> ## Status (31. August 2026)
>
> | Punkt | Status |
> |---|---|
> | C1 – Legacy-Keys rotieren | ⏳ Offen – nur manuell im Dashboard möglich |
> | C2 – Auth-Signup-Toggle prüfen | ⏳ Offen – nur manuell im Dashboard möglich |
> | H1 – Tests | ✅ Erledigt (Phase 5, Playwright, 13 Tests, `e2e/`) |
> | H2 – CI-Gate | ✅ Erledigt (Phase 6, `.github/workflows/ci.yml`) |
> | H3 – Monitoring | ✅ Erledigt (`uptime.yml` + `src/lib/errorTracking.ts`, Sentry noch ohne DSN = inaktiv) |
> | H4 – Backup-/Recovery-Doku | ✅ Erledigt (`DEPLOYMENT.md`) |
> | M1 – CORS einschränken | ✅ Erledigt (`send-conversion/index.ts`) |
> | M2–M4, L1–L3 | ⏳ Weiterhin offen, optional/keine Dringlichkeit (siehe unten) |
>
> **C1 und C2 kann ich technisch nicht selbst erledigen** – beides sind
> Dashboard-Toggles, für die ich entweder eine riskante volle
> Konfigurationsüberschreibung (`supabase config push`) oder Zugriff auf ein
> Account-weites CLI-Token bräuchte, das *alle* Projekte des Betreibers
> verwalten kann. Bitte weiterhin manuell erledigen (Anleitung im jeweiligen
> Abschnitt unten).

## Einordnung des Projekts (wichtig für die Bewertung unten)

Coming Home ist eine **statische Marketing-Website** (Vite/React SSG, Prerender
zu echtem HTML) mit einem **schlanken internen CRM** (eine Supabase-Tabelle für
eingehende Leads, ein einziger Admin-Login für die Betreiberin). Es gibt:

- **keine öffentliche Benutzer-Registrierung**, keine Kund:innen-Konten
- **keinen Multi-Tenant-Betrieb** (ein Betreiber, eine Kundin: Jasmin)
- **keine Datei-Uploads**, kein Supabase Storage
- **keine öffentliche API** außer dem Formular-Insert (anon, insert-only) und
  einer optionalen, noch nicht aktiv genutzten Tracking-Relay-Function

Viele Punkte der Standard-Checkliste (RBAC mit mehreren Rollen, IDOR zwischen
Mandanten, Rate-Limiting einer öffentlichen API, Session-Handling mehrerer
Nutzer:innen, CSRF bei zustandsbehafteten Formularen) sind hier **strukturell
nicht relevant**, weil die Angriffsfläche dafür schlicht nicht existiert. Das
wird unten explizit vermerkt statt stillschweigend übersprungen.

---

## CRITICAL

### C1 – Legacy Supabase-Keys wurden versehentlich im Terminal ausgegeben
- **Betroffen:** Supabase-Projekt `coming-home` (`kvfjmptddweoaawesqyc`), Legacy
  `anon`- und `service_role`-JWT-Keys
- **Was passiert ist:** Im Rahmen dieses Audits habe ich versehentlich
  `supabase projects api-keys` ausgeführt – dieser Befehl gibt Schlüssel im
  Klartext aus. Der volle `service_role`-Key (voller Admin-Zugriff auf die
  Datenbank, umgeht RLS komplett) stand dadurch kurz in der Terminal-Ausgabe
  dieser Session.
- **Risiko:** Der Key selbst wurde nicht an einen Dritten übertragen (nur in
  deinem eigenen Terminal sichtbar), aber als Vorsichtsmaßnahme sollte er als
  potenziell kompromittiert behandelt werden – insbesondere falls diese
  Terminal-Session je aufgezeichnet, geteilt oder geloggt wird.
- **Empfehlung:** Im Supabase-Dashboard → Projekt „coming-home" →
  Project Settings → API → **Legacy JWT-Keys neu generieren** (`anon` und
  `service_role`). Der `service_role`-Key wird im Frontend nirgends verwendet
  (nur die neuen `sb_publishable_...`/`sb_secret_...`-Keys sind im Einsatz),
  daher ist die Rotation risikolos und bricht nichts.
- **Aufwand:** 5 Minuten (Dashboard-Klick)
- **Priorität:** Sofort, aber nicht dringend im Sinne von „Seite ist
  angreifbar" – reine Vorsichtsmaßnahme.

### C2 – Ungeprüft: Supabase-Auth-Signup könnte offen sein
- **Betroffen:** Supabase-Projekt „coming-home", Authentication-Einstellungen;
  `supabase/migrations/00000000000001_leads.sql`
- **Problem:** Die RLS-Policy `authenticated full access to leads` gibt
  **jedem** eingeloggten Supabase-Nutzer (nicht nur Jasmin) vollen Lese-/
  Schreib-/Löschzugriff auf alle Leads (`to authenticated using (true)`). Das
  ist für ein Ein-Personen-CRM beabsichtigt und in Ordnung – **aber nur, wenn
  sich niemand außer Jasmin selbst registrieren kann.** Der `anon`-Key liegt
  öffentlich im Frontend-Bundle; wenn in den Supabase-Auth-Einstellungen
  „Enable email signups" aktiv ist, könnte theoretisch jede Person direkt über
  die Supabase-Auth-API (nicht über die Website-UI) einen eigenen Account
  anlegen und sich damit vollen Zugriff auf alle Namen/E-Mails/Telefonnummern
  aller Anfragen verschaffen.
- **Warum ich das nicht selbst geprüft habe:** Der Check würde einen weiteren
  API-Aufruf mit Zugriffstoken erfordert – nach dem Vorfall oben (C1) wollte
  ich kein weiteres Risiko eingehen, echte Zugangsdaten in der
  Terminal-Ausgabe zu haben.
- **Empfehlung (bitte manuell prüfen):** Supabase-Dashboard → Projekt
  „coming-home" → Authentication → Sign In / Providers → **„Allow new users to
  sign up" deaktivieren** (nur bestehende, von dir manuell angelegte Nutzer
  wie Jasmin können sich dann noch einloggen). Das ist ein einzelner Toggle.
- **Aufwand:** 2 Minuten
- **Priorität:** Kritisch, falls der Toggle aktuell offen ist – bitte als
  Erstes prüfen.

---

## HIGH

### H1 – Keine automatisierten Tests vorhanden
- **Betroffen:** gesamtes Projekt, kein Test-Setup (kein Vitest/Jest/
  Playwright, kein `test`-Script in `package.json`)
- **Risiko:** Jede Änderung (auch von mir) kann unbemerkt bestehende Flows
  brechen (Formular-Submit → CRM-Insert, Multi-Step-Navigation,
  Prerender-Korrektheit aller 20 Seiten). Aktuell fällt sowas nur auf, wenn
  händisch im Browser getestet wird.
- **Empfehlung:** Playwright-E2E für die kritischen Flows (siehe Phase 5:
  Formular-Submit inkl. CRM-Eintrag, Multi-Step-Navigation, alle Routen laden
  ohne Hydration-Fehler, CRM-Login). Kein Unit-Test-Overhead nötig – bei einer
  Content-Site mit wenig Business-Logik bringt E2E den meisten Wert pro
  investierter Stunde.
- **Aufwand:** mittel (0,5–1 Tag für eine sinnvolle erste Suite)
- **Priorität:** Hoch, aber nicht blockierend für den laufenden Betrieb.

### H2 – Kein CI-Gate vor Deployment
- **Betroffen:** `.github/workflows/deploy.yml`
- **Problem:** Jeder Push auf `main` baut **und deployt sofort** – es gibt
  keinen separaten Workflow, der bei Pull Requests install/typecheck/build
  (und künftig Tests) laufen lässt, *bevor* etwas gemergt wird. `tsc -b` läuft
  zwar als Teil von `npm run build` und würde einen Typfehler abfangen, aber
  erst *während* des Deploy-Versuchs, nicht vorher als Review-Gate.
- **Risiko:** Ein kaputter Build wird zwar nicht live geschaltet (der
  Deploy-Schritt bricht ab), aber es gibt keine Rückmeldung *vor* dem Mergen,
  und aktuell wird ohnehin direkt auf `main` gearbeitet statt über PRs.
- **Empfehlung:** Zweiten Workflow `ci.yml` ergänzen, der bei jedem Push/PR
  `npm ci && npm run build` (und später Tests) ausführt – unabhängig vom
  Deploy-Workflow. Optional: Branch-Protection auf `main`, die diesen Check
  verlangt.
- **Aufwand:** klein (neue, einfache Workflow-Datei)
- **Priorität:** Hoch für „professionellen" Prozess, aber aktuell kein akutes
  Sicherheitsrisiko.

### H3 – Kein Error-/Uptime-Monitoring
- **Betroffen:** gesamtes Projekt
- **Problem:** Es gibt keinerlei Fehler-Tracking (z. B. Sentry) und kein
  Uptime-Monitoring. Ein kaputtes Formular, ein fehlgeschlagener
  Supabase-Insert oder ein Hydration-Fehler bei echten Besucher:innen bliebe
  unbemerkt, außer Jasmin meldet sich zufällig.
- **Empfehlung:** Minimal-Lösung ohne Kosten: GitHub Actions Cron-Job, der
  stündlich `https://jasmindraxl.at` pingt und bei Fehlstatus eine
  Benachrichtigung schickt (z. B. via ntfy.sh oder E-Mail). Für
  Frontend-Fehler: Sentry Free-Tier (5k Events/Monat reichen für diese
  Seitengröße bei Weitem).
- **Aufwand:** klein bis mittel
- **Priorität:** Hoch für Sichtbarkeit, aber nicht sicherheitskritisch.

### H4 – Kein Backup-/Recovery-Konzept dokumentiert
- **Betroffen:** Supabase-Projekt „coming-home" (Leads-Daten)
- **Problem:** Supabase Free/Pro-Tier macht automatische tägliche Backups
  (abhängig vom Plan), aber es ist nirgends dokumentiert, welcher Plan aktiv
  ist, wie lange Backups aufbewahrt werden, und wie ein Restore im Ernstfall
  abläuft. Verlorene Leads-Daten wären für Jasmin geschäftlich relevant.
- **Empfehlung:** Im Supabase-Dashboard prüfen, welcher Plan aktiv ist und was
  die Backup-Policy dieses Plans ist; das Ergebnis in `DEPLOYMENT.md`
  dokumentieren (siehe Phase 10).
- **Aufwand:** klein (Recherche + Dokumentation)
- **Priorität:** Hoch, sobald echte Kundendaten reinkommen.

---

## MEDIUM

### M1 – CORS der `send-conversion`-Edge-Function ist komplett offen
- **Betroffen:** `supabase/functions/send-conversion/index.ts`
- **Problem:** `Access-Control-Allow-Origin: '*'` erlaubt Requests von jeder
  beliebigen Website, nicht nur von `jasmindraxl.at`. Die Function selbst
  liest keine sensiblen Daten zurück (write-only Relay an Meta/GA4), aber
  fremde Websites könnten sie missbrauchen, um beliebige (falsche)
  Conversion-Events in Jasmins Meta-/GA4-Konten einzuspeisen, sobald die
  Function aktiv geschaltet ist (aktuell noch nicht deployt).
- **Empfehlung:** `Access-Control-Allow-Origin` auf `https://jasmindraxl.at`
  fest einschränken, bevor die Function deployt wird.
- **Aufwand:** trivial (eine Zeile)
- **Priorität:** Mittel – die Function ist aktuell noch gar nicht live.

### M2 – Kein PR-basierter Git-Workflow
- **Betroffen:** Git-Struktur allgemein
- **Beobachtung:** Alle Änderungen dieser Session gingen direkt auf `main`,
  kein Branching, keine Pull Requests, kein Review-Schritt. Für ein
  Ein-Personen-Projekt mit einer betreuenden KI ist das pragmatisch, aber es
  fehlt jede Möglichkeit, eine Änderung vor dem Live-Gang nochmal zu
  begutachten.
- **Empfehlung:** Kein Muss, aber optional: künftige größere Änderungen über
  einen Feature-Branch + PR laufen lassen, sobald H2 (CI-Gate) steht – dann
  sieht man Build-Status vor dem Mergen.
- **Aufwand:** organisatorisch, kein Code
- **Priorität:** Mittel, abhängig davon wie viele Personen künftig am Code
  arbeiten.

### M3 – Hero-Video ist mit 6,2 MB das mit Abstand größte Asset
- **Betroffen:** `public/videos/hero-bg.mp4`, wird auf **jeder** Startseiten-
  Ladung nachgeladen (nach dem schnellen Poster-Bild, siehe `Hero.tsx`)
- **Risiko:** Kein Sicherheitsproblem, aber auf langsamen mobilen Verbindungen
  spürbar – auch wenn `preload="auto"` erst nach dem ersten Paint greift und
  `saveData`/`prefers-reduced-motion` bereits berücksichtigt werden (gute
  Grundlage, siehe `Hero.tsx`).
- **Empfehlung:** Optional eine zusätzliche, kürzere/kleinere Version für
  Mobilgeräte (z. B. per `<source media="...">` mit kleinerer Auflösung)
  ergänzen, falls Ladezeit auf Mobile mal konkret negativ auffällt. Aktuell
  kein akutes Problem, da bereits mit Bedacht gebaut (Poster-first, State-
  Bewusstsein).
- **Aufwand:** klein bis mittel
- **Priorität:** Mittel, nur bei tatsächlich gemessenem Problem umsetzen.

### M4 – Keine Security-Response-Header gesetzt
- **Betroffen:** gesamte Seite (GitHub Pages liefert keine eigenen Header)
- **Problem:** Keine `Content-Security-Policy`, `X-Content-Type-Options`,
  `Referrer-Policy` o. ä. GitHub Pages erlaubt keine eigenen HTTP-Header
  direkt, das ist eine bekannte Plattform-Einschränkung.
- **Empfehlung:** Falls das wichtig wird, bräuchte es einen Layer davor (z. B.
  Cloudflare kostenlos vor die Domain schalten, das ermöglicht eigene
  Response-Header). Für den aktuellen Umfang (keine Logins von
  Endkund:innen, keine sensiblen client-seitigen Operationen) ist das
  Risiko ohne diese Header überschaubar.
- **Aufwand:** mittel (zusätzlicher Dienst nötig)
- **Priorität:** Mittel, eher „nice to have" auf dieser Plattform.

---

## LOW

### L1 – `INTERN_PASSPHRASE`-Fallback ist ein reiner Sichtschutz, kein echter Schutz
- **Betroffen:** `src/lib/internAuth.ts`, `src/components/InternGate.tsx`
- **Beobachtung:** Bereits im Code selbst korrekt als „kein echter Schutz"
  dokumentiert. Greift nur, wenn `VITE_SUPABASE_URL`/`_ANON_KEY` **nicht**
  gesetzt sind (z. B. lokale Preview ohne `.env`) – im echten Deployment ist
  dieser Pfad tot, weil Supabase konfiguriert ist und stattdessen der echte
  `SupabaseLoginGate` greift.
- **Empfehlung:** Kein Handlungsbedarf, nur zur Vollständigkeit dokumentiert.

### L2 – Zwei sehr ähnliche Multi-Step-Formular-Komponenten
- **Betroffen:** `src/components/MultiStepContactForm.tsx` (309 Zeilen),
  `src/components/MultiStepBewerbungForm.tsx` (366 Zeilen)
- **Beobachtung:** Beide implementieren dieselbe Schritt-für-Schritt-Logik
  (Progress-Dots, Fokus-Handling, Validierung) separat, mit leicht
  unterschiedlichen Frage-Sets. Echte Code-Duplikation, aber bewusst in
  Kauf genommen für einfache, unabhängige Wartbarkeit beider Formulare.
- **Empfehlung:** Optional zu einem gemeinsamen `useStepWizard`-Hook
  extrahieren, falls ein drittes ähnliches Formular dazukommt. Aktuell kein
  Refactoring-Zwang – zwei Instanzen sind noch überschaubar.
- **Aufwand:** mittel
- **Priorität:** Niedrig, rein Code-Qualität.

### L3 – Kein `lint`-Tooling konfiguriert
- **Betroffen:** gesamtes Projekt, kein ESLint/Prettier
- **Beobachtung:** TypeScript läuft bereits mit strengen Compiler-Flags
  (`strict`, `noUnusedLocals`, `noUnusedParameters`,
  `noFallthroughCasesInSwitch`) – das deckt einen großen Teil dessen ab, was
  ESLint sonst zusätzlich prüfen würde. Kein `any`, kein `@ts-ignore`, kein
  `@ts-expect-error` im gesamten Code gefunden (verifiziert).
- **Empfehlung:** Optional ESLint mit `eslint-plugin-react-hooks` ergänzen
  (fängt z. B. fehlende `useEffect`-Dependencies ab, was TS allein nicht
  prüft). Kein Muss, Code-Qualität ist bereits hoch ohne dieses Tool.
- **Aufwand:** klein
- **Priorität:** Niedrig.

---

## Explizit geprüft und für gut befunden (keine Maßnahme nötig)

- **`npm audit`**: 0 Vulnerabilities (Produktions- und Dev-Dependencies).
- **Secrets im Frontend**: Nur `sb_publishable_...` (Anon-Key, für
  Client-Nutzung vorgesehen) im Bundle. Kein `service_role`/`sb_secret_...`
  im Frontend-Code gefunden.
- **`.gitignore`**: `.env`, `.env.*` (außer `.env.example`), `.secrets`,
  `supabase/.temp` korrekt ausgeschlossen. `.env` ist nicht getrackt.
- **Git-Historie**: Keine Secrets im committeten Verlauf gefunden (geprüft
  per Pattern-Suche über die gesamte Historie).
- **RLS auf `leads`/`lead_notes`**: `anon` darf ausschließlich `INSERT` auf
  `leads` (kein Read/Update/Delete), `lead_notes` hat gar keine
  `anon`-Policy. Korrekt umgesetzt, inkl. des bekannten Postgres-Fallstricks
  (kein `.select()` nach `insert()` im anon-Pfad, siehe Kommentar in
  `supabaseStore.ts`).
- **XSS**: Kein `dangerouslySetInnerHTML`, kein `eval()` im gesamten Code.
  React escaped Ausgaben standardmäßig; alle dynamischen Inhalte kommen aus
  statischen, entwicklerkontrollierten Daten (`src/data/*.ts`), nicht aus
  Nutzereingaben, die zurückgerendert werden.
- **TypeScript-Strenge**: `strict: true` bereits aktiv, keine Escape-Hatches
  (`any`, `@ts-ignore`) im Code.
- **DSGVO/Formulare**: E-Mail/Telefon werden bei der serverseitigen
  Conversion-Weiterleitung ausschließlich gehasht (SHA-256) übertragen, nie
  im Klartext. Tracking lädt nachweislich erst nach aktiver
  Cookie-Zustimmung.
- **Barrierefreiheit (Stichprobe)**: Formularfehler nutzen `role="alert"`,
  Bilder haben `alt`-Texte, dekorative Elemente sind `aria-hidden`,
  Skip-Link vorhanden (`App.tsx`), Reduced-Motion wird konsequent
  respektiert (mehrfach verifiziert in dieser Session).
- **SEO**: Sitemap, robots.txt, JSON-LD pro Seite, OG-Tags, `llms.txt` für
  KI-Suche – bereits umfassend umgesetzt und in dieser Session aktuell
  gehalten.
- **HTTPS**: Custom Domain `jasmindraxl.at` mit gültigem Zertifikat,
  `Enforce HTTPS` aktiv (heute in dieser Session eingerichtet und
  verifiziert).

---

## Zusammenfassung & empfohlene Reihenfolge

1. **C2 zuerst prüfen** (Supabase-Auth-Signup-Toggle) – 2 Minuten, potenziell
   der einzige Punkt mit echtem Datenschutz-Risiko.
2. **C1 umsetzen** (Legacy-Keys rotieren) – 5 Minuten, reine Vorsicht.
3. **H2** (CI-Gate) und **H1** (erste E2E-Tests für die kritischen Flows:
   Formular → CRM, Navigation, Hydration) – schützt vor künftigen Regressionen.
4. **H3/H4** (Monitoring, Backup-Doku) – Sichtbarkeit für den laufenden
   Betrieb, sobald echte Anfragen reinkommen.
5. **M1** (CORS einschränken) – bevor `send-conversion` deployt wird.
6. Rest (M2–M4, L1–L3) – bei Gelegenheit, keine Dringlichkeit.

**Kein Punkt in diesem Audit erfordert einen Rewrite, den Austausch
funktionierender Features oder eine Design-Änderung.** Das Projekt ist für
seinen Umfang (Marketing-Site + schlankes CRM) bereits ungewöhnlich sauber
gebaut – die Lücken sind fast ausschließlich Prozess/Tooling
(Tests, CI-Gate, Monitoring), nicht strukturelle Code- oder
Sicherheitsprobleme.
