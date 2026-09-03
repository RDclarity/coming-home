# Coming Home – Deployment, Monitoring & Backups

**Stand:** 31. August 2026.

## Deployment

Jeder Push auf `main` löst automatisch aus:

1. **`.github/workflows/ci.yml`** – Typecheck (`tsc -b`) + komplette
   Playwright-Suite (`e2e/`), unabhängig vom Deploy. Siehe `AUDIT.md` H2.
2. **`.github/workflows/deploy.yml`** – baut (`npm run build`, inkl.
   Prerendering aller Routen) und deployt nach GitHub Pages, ausgeliefert
   unter der Custom Domain `jasmindraxl.at` (HTTPS erzwungen).

Kein Staging-Environment – jeder Push geht direkt live. Für den aktuellen
Umfang (Ein-Personen-Projekt, KI-gestützte Entwicklung, CI-Gate seit Phase 6)
ist das ein bewusster, dokumentierter Kompromiss (siehe `AUDIT.md` M2), keine
Fahrlässigkeit.

**Secrets/Umgebungsvariablen** (GitHub Repo → Settings → Secrets and
variables → Actions), alle optional außer Supabase:

| Secret | Zweck | Pflicht? |
|---|---|---|
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | CRM-Backend | Ja, für zentrales CRM (sonst localStorage-Fallback) |
| `VITE_LEAD_NOTIFY_ENDPOINT` | E-Mail-Benachrichtigung an anfrage@jasmindraxl.at | Nein |
| `VITE_GA_MEASUREMENT_ID` / `VITE_GOOGLE_ADS_ID` / `VITE_META_PIXEL_ID` | Tracking | Nein |
| `VITE_CONVERSION_ENDPOINT` | Serverseitiges Conversion-Tracking | Nein |
| `VITE_SENTRY_DSN` | Frontend-Fehler-Tracking | Nein |

## Monitoring (AUDIT.md H3)

- **Uptime:** `.github/workflows/uptime.yml` pingt `jasmindraxl.at` jede
  volle Stunde. Schlägt der Check fehl, markiert GitHub den Run als
  fehlgeschlagen und benachrichtigt den Repo-Owner automatisch per E-Mail
  (Standard-GitHub-Verhalten für fehlgeschlagene Actions, kein
  Zusatzsetup nötig – nur sicherstellen, dass E-Mail-Benachrichtigungen für
  Actions in den eigenen GitHub-Kontoeinstellungen nicht deaktiviert sind).
- **Frontend-Fehler:** `src/lib/errorTracking.ts` – Sentry, aktiv sobald
  `VITE_SENTRY_DSN` gesetzt ist (Free-Tier reicht bei Weitem: 5.000
  Events/Monat). Fängt sowohl von der `ErrorBoundary` abgefangene
  React-Fehler als auch nicht abgefangene JS-Fehler/Promise-Rejections.
  **Noch nicht aktiv** – kostenlosen Account auf sentry.io anlegen, DSN als
  `VITE_SENTRY_DSN` eintragen (lokal + GitHub-Secret), fertig.
- **Backend-Fehler (Supabase):** Supabase-Dashboard → Projekt „coming-home" →
  Logs/Reports zeigt fehlgeschlagene Queries, RLS-Verweigerungen etc. Kein
  externes Tool nötig, nur gelegentlich reinschauen, solange kein
  automatisches Alerting dafür eingerichtet ist.

## Backup & Recovery (AUDIT.md H4)

**Betroffene Daten:** Ausschließlich die Supabase-Tabellen `leads` und
`lead_notes` im Projekt „coming-home" (`kvfjmptddweoaawesqyc`, Region
Frankfurt/EU) – das ist die einzige Stelle mit echten, nicht aus dem Code
reproduzierbaren Daten. Alles andere (Website-Inhalte, Code, Konfiguration)
liegt vollständig in diesem Git-Repository und ist damit implizit über die
GitHub-Historie gesichert.

### Automatische Backups durch Supabase

Der genaue Umfang hängt vom **Abrechnungsplan** des Projekts ab:

| Plan | Automatische Backups |
|---|---|
| Free | **Keine** automatischen Backups |
| Pro | Tägliche Backups, 7 Tage Aufbewahrung |
| Team/Enterprise | Tägliche Backups, längere Aufbewahrung, optional Point-in-Time-Recovery |

**Das kann ich nicht über die CLI/API einsehen** (Abrechnungsinformationen
sind nicht Teil der von mir genutzten Schnittstellen) – bitte einmalig
manuell prüfen: [Supabase Dashboard → Projekt „coming-home" → Settings →
Billing](https://supabase.com/dashboard/project/kvfjmptddweoaawesqyc/settings/billing),
welcher Plan aktiv ist. **Falls „Free" aktiv ist:** Es gibt aktuell keinerlei
automatische Sicherung der Leads-Daten – sobald echte Kundenanfragen
reinkommen, sollte entweder auf Pro (24 $/Monat) hochgestuft oder eine der
unten stehenden manuellen Methoden regelmäßig genutzt werden.

### Manuelle Backup-Möglichkeiten (unabhängig vom Plan)

1. **Schnell, ohne Technik:** Im CRM (`/admin`) einloggen → **„Als CSV
   exportieren"** klickt alle aktuell sichtbaren Leads als Datei herunter.
   Reicht für eine gelegentliche, manuelle Sicherung.
2. **Vollständig, für Entwickler:innen:**
   ```bash
   supabase link --project-ref kvfjmptddweoaawesqyc
   supabase db dump --data-only -f backup-$(date +%Y-%m-%d).sql
   ```
   Erzeugt einen vollständigen Datenexport lokal. **Wichtig:** Diese Datei
   enthält personenbezogene Daten (Namen, E-Mails, Telefonnummern) – niemals
   in dieses (oder ein anderes) Git-Repository committen, nur lokal/verschlüsselt
   und mit derselben Sorgfalt wie die Datenbank selbst aufbewahren, und nach
   Gebrauch wieder löschen, sobald sie nicht mehr gebraucht wird
   (Datensparsamkeit, DSGVO).

### Recovery im Ernstfall

- **Bei aktivem Pro-Plan:** Restore direkt im Supabase-Dashboard → Projekt →
  Database → Backups.
- **Ohne Plan-Backup, aber mit manuellem Dump (siehe oben):**
  ```bash
  supabase db push --db-url <ziel-connection-string> < backup-DATUM.sql
  ```
  oder die Datei direkt per `psql` gegen die (neue oder wiederhergestellte)
  Datenbank einspielen.
- **Ohne jedes Backup:** Daten sind verloren. Das ist der Grund, warum dieser
  Abschnitt existiert – bitte Plan/manuelle Routine wie oben festlegen,
  *bevor* das relevant wird.
