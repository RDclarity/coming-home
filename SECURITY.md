# Coming Home – Security

**Stand:** 30. August 2026. Ergebnis des Security-Reviews (Phase 3) auf Basis
von `AUDIT.md`. Dokumentiert das tatsächliche Sicherheitsmodell, was bereits
gehärtet wurde und was noch offen ist.

## Grundprinzip

Diese Website hat **keinen eigenen Anwendungsserver** und **keine
öffentliche Benutzer-Registrierung**. Die gesamte Absicherung läuft über zwei
Mechanismen:

1. **Row Level Security (RLS)** auf Datenbankebene (Supabase/Postgres) –
   erzwingt Zugriffsregeln unabhängig vom Frontend-Code.
2. **Ein einzelner echter Login** (Supabase Auth) für die Betreiberin, ohne
   Selbstregistrierung über die Website.

Der zentrale Leitsatz: *Der öffentliche `anon`-Key, der zwangsläufig im
Browser-Bundle liegt, darf technisch niemals mehr können, als einen neuen
Lead anzulegen.* Alles andere braucht einen echten, serverseitig geprüften
Login.

---

## Was in dieser Phase konkret gehärtet wurde

| Änderung | Datei | Warum |
|---|---|---|
| CORS von `*` auf die eigene Domain eingeschränkt | `supabase/functions/send-conversion/index.ts` | Verhindert, dass fremde Websites die Function missbrauchen, um gefälschte Conversion-Events in Meta-/GA4-Konten einzuspeisen. |
| Honeypot-Feld in allen 3 Formularen + zentrale Prüfung | `submitForm.ts`, `MultiStepContactForm.tsx`, `MultiStepBewerbungForm.tsx`, `Newsletter.tsx` | Reduziert automatisierten Formular-Spam, ohne CAPTCHA/zusätzliche Abhängigkeit oder Reibung für echte Besucher:innen. |

---

## Checkliste (vollständig, inkl. explizit nicht zutreffender Punkte)

### Secrets & Konfiguration
- ✅ **Secrets im Frontend:** Nur der `sb_publishable_...`-Anon-Key liegt im
  Bundle (bewusst dafür vorgesehen). Kein `service_role`/`sb_secret_...` im
  Client-Code gefunden (geprüft per Repository-weiter Suche).
- ✅ **`.env`/`.gitignore`:** `.env`, `.env.*` (außer `.env.example`),
  `.secrets/`, `supabase/.temp/` korrekt ausgeschlossen. `.env` ist nicht
  getrackt.
- ✅ **Git-Historie:** Keine Secrets im committeten Verlauf (Pattern-Suche
  über die gesamte Historie, nicht nur den aktuellen Stand).
- ⚠️ **Vorfall während des Audits:** Die Legacy-`anon`/`service_role`-JWT-Keys
  des Supabase-Projekts wurden versehentlich per CLI-Befehl im Klartext in
  ein Terminal ausgegeben (nicht an Dritte übertragen). **Empfehlung: beide
  Legacy-Keys im Supabase-Dashboard rotieren** (Project Settings → API →
  Legacy JWT Keys). Betrifft nicht die im Frontend tatsächlich genutzten
  neuen `sb_publishable_...`/`sb_secret_...`-Keys.

### Authentifizierung & Autorisierung
- ✅ **Auth-Mechanismus:** Supabase Auth, E-Mail/Passwort, Session-Speicherung
  in `localStorage` (Standard von `supabase-js` v2) – **kein** Cookie-basiertes
  Session-Handling, dadurch strukturell **kein CSRF-Risiko** für den
  CRM-Login (Cross-Site-Requests können den Bearer-Token nicht automatisch
  mitschicken).
- ✅ **Rollenmodell:** Genau zwei Rollen auf DB-Ebene (`anon`, `authenticated`),
  kein feingranulares RBAC nötig – es gibt nur eine vorgesehene Person mit
  Login (Jasmin).
- ⚠️ **Offen, nur manuell prüfbar:** Ob "Allow new users to sign up" im
  Supabase-Dashboard deaktiviert ist. Falls nicht, könnte sich theoretisch
  jede Person direkt über die Supabase-Auth-API (nicht über die
  Website-UI) selbst registrieren und hätte damit – weil die
  `authenticated`-Policy jedem eingeloggten Nutzer vollen Zugriff gibt –
  Zugriff auf alle Namen/E-Mails/Telefonnummern aller Anfragen. **Bitte im
  Dashboard prüfen und ggf. deaktivieren, das ist der wichtigste offene
  Punkt in diesem Dokument.**
- N/A **Multi-Tenant-Isolation:** Nicht zutreffend – es gibt nur einen
  "Mandanten" (Jasmin selbst), keine Kundenkonten, zwischen denen isoliert
  werden müsste.
- N/A **IDOR (Insecure Direct Object Reference):** Es gibt keine
  öffentlichen, per ID aufrufbaren Ressourcen mit Zugriffsprüfung im
  Frontend – der einzige öffentliche Schreibzugriff ist ein blindes
  `INSERT`, kein `GET /leads/:id`.

### Datenbank (Supabase/Postgres)
- ✅ **RLS aktiv** auf beiden Tabellen (`leads`, `lead_notes`).
- ✅ **`anon`:** nur `INSERT` auf `leads`, mit `with check (true)` – bewusst
  unbeschränkt, weil jede Person unangemeldet eine Anfrage stellen soll;
  Feldwerte werden durch `CHECK`-Constraints auf `source`/`status`
  eingeschränkt (nur bekannte Werte erlaubt).
- ✅ **`anon` auf `lead_notes`:** kein Zugriff – Notizen legt ausschließlich
  die eingeloggte Person im CRM an.
- ✅ **SQL Injection:** Nicht möglich – der gesamte Datenbankzugriff läuft
  über `supabase-js`, das parametrisierte Queries verwendet. Keine
  String-Konkatenation von Nutzereingaben in SQL irgendwo im Code.
- ✅ **Bekannter Postgres-Fallstrick korrekt behandelt:** `.insert()` im
  `anon`-Pfad wird **nie** mit `.select()` verkettet (das würde wegen
  `RETURNING` eine SELECT-Policy verlangen, die `anon` bewusst nicht hat) –
  dokumentiert direkt im Code (`src/crm/supabaseStore.ts`).
- N/A **Storage Policies:** Kein Supabase Storage im Einsatz, keine
  Datei-Uploads irgendwo auf der Website.

### Eingaben & Ausgaben
- ✅ **XSS:** Kein `dangerouslySetInnerHTML`, kein `eval()` im gesamten
  Code (geprüft). React escaped alle dynamischen Ausgaben standardmäßig;
  alle angezeigten Inhalte stammen aus statischen, entwicklerkontrollierten
  Daten (`src/data/*.ts`), nicht aus zurückgerenderten Nutzereingaben.
- ✅ **Mailto-Fallback ohne Header-Injection:** Betreff/Body des
  `mailto:`-Links werden korrekt per `encodeURIComponent()` kodiert
  (`submitForm.ts`) – Zeilenumbrüche o. Ä. in Nutzereingaben können keine
  zusätzlichen Mail-Header einschleusen.
- ✅ **Formular-Validierung:** HTML5-native Validierung (`required`,
  `type="email"`) plus eigene Schritt-für-Schritt-Prüfung in den
  Multi-Step-Formularen. Serverseitige Validierung erfolgt implizit über
  die `CHECK`-Constraints der Datenbank für die Felder, die dort landen.
- ⚠️ **Kein Rate-Limiting auf den `anon`-Insert-Endpoint.** Der Honeypot
  (siehe oben) bremst einfache Bots, verhindert aber keine gezielte
  Skript-Spam-Attacke, die das Honeypot-Feld kennt oder ignoriert. Für den
  aktuellen Umfang (kleine Marketing-Site, kein bekannter Missbrauch)
  vertretbar; bei tatsächlich beobachtetem Spam-Aufkommen wäre ein
  einfacher Cloudflare-Turnstile- oder hCaptcha-Baustein die nächste
  sinnvolle Stufe.
- N/A **File Uploads:** Keine vorhanden.
- N/A **Unsichere Redirects:** Keine dynamischen, nutzereingabegesteuerten
  Redirects im Code (nur der statische `mailto:`-Link, s. o.).

### Transport & Infrastruktur
- ✅ **HTTPS:** Custom Domain `jasmindraxl.at` mit gültigem, von GitHub
  ausgestelltem Zertifikat, „Enforce HTTPS" aktiv (in dieser Session
  eingerichtet und per API verifiziert).
- ⚠️ **Keine eigenen Security-Response-Header** (`Content-Security-Policy`,
  `X-Content-Type-Options`, `Referrer-Policy`, …). GitHub Pages erlaubt
  keine eigenen HTTP-Header – das wäre nur mit einem vorgeschalteten
  Dienst (z. B. Cloudflare, kostenlos) möglich. Für den aktuellen Umfang
  (keine Logins von Endkund:innen, kein clientseitig verarbeitetes
  Vertrauensmodell, das auf CSP angewiesen wäre) ein akzeptables Risiko,
  aber dokumentiert als Verbesserungspotenzial.
- N/A **CORS für die Haupt-Website:** Nicht zutreffend im klassischen Sinn –
  es ist eine statisch ausgelieferte Website, kein API-Server mit
  eigenen CORS-Regeln (außer der einen Edge Function, s. o.).

### DSGVO/Datenschutz (siehe auch `src/pages/legal/Datenschutz.tsx`)
- ✅ Tracking (Google Analytics/Ads, Meta Pixel) lädt nachweislich erst nach
  aktiver Cookie-Zustimmung (`ConsentBanner.tsx`).
- ✅ Bei serverseitiger Conversion-Weiterleitung werden E-Mail/Telefon
  ausschließlich SHA-256-gehasht übertragen, nie im Klartext.
- ✅ Interne Anfragen-Datenbank (Supabase) liegt in der EU (Frankfurt),
  keine Drittlandübertragung für diesen Teil.
- ✅ Hosting (GitHub Pages, USA) korrekt mit Hinweis auf
  Standardvertragsklauseln in der Datenschutzerklärung offengelegt.

---

## Offene Punkte (Priorität wie in `AUDIT.md`)

1. **Kritisch, nur manuell im Dashboard lösbar:** Supabase-Auth-Signup
   prüfen/deaktivieren (siehe oben).
2. **Kritisch, nur manuell im Dashboard lösbar:** Legacy-JWT-Keys rotieren
   (Vorfall während des Audits, siehe oben).
3. **Mittel:** Bei tatsächlichem Spam-Aufkommen zusätzliches Rate-Limiting/
   Captcha auf dem Formular-Insert erwägen.
4. **Mittel:** Security-Response-Header nachrüsten, falls je ein Dienst wie
   Cloudflare vor die Domain geschaltet wird.

## Verantwortungsvolle Offenlegung

Es gibt aktuell keinen dedizierten Sicherheitskontakt für diese Seite
(Ein-Personen-Projekt). Sicherheitsrelevante Funde bitte direkt an die in
`src/data/legal.ts` hinterlegte Kontakt-E-Mail-Adresse melden.
