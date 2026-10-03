# Coming Home – Designsystem "Ankommen" (Redesign Oktober 2026)

Ein eigenständiges Design für Jasmins Körperarbeit (Breathwork, Bodywork,
Berührung). Es soll sich anfühlen wie ein Ort, an dem man ausatmet: warm,
erdig, lebendig, ruhig – nicht steril, nicht esoterisch-kitschig, nicht
"Wellness-Stock". Einziges Conversion-Ziel der Startseite: das kostenlose
20-Minuten-Kennenlerngespräch (Links auf `/#kennenlernen` öffnen das
Buchungs-Overlay automatisch).

## Leitmotiv: der Torbogen

Ein Bogen ist ein Durchgang – nach Hause ankommen. Er taucht wiederholt auf,
nie aufdringlich:
- Porträt- und Stimmungsbilder in Bogenform: `border-radius: var(--arch)`
  (oben vollrund, unten gerade), hochformatig.
- Kleine Bogen-Glyphe in der `<Eyebrow>` (schon eingebaut).
- Optional: Karten mit leicht gewölbter Oberkante oder ein großer, sehr
  zarter Bogen als Hintergrund-Linie (1px, ~15 % Deckkraft) hinter einer
  Überschrift. Sparsam – maximal ein großes Bogen-Element pro Sektion.

Zweites Motiv: **Atem** – ein weicher Kreis, der sich langsam weitet und
zusammenzieht (nur im Hero; nicht an anderen Stellen wiederholen).

## Farben (Tokens in src/styles/global.css)

| Token | Einsatz |
|---|---|
| `--c-linen` | Seitengrund (hell, warm) |
| `--c-paper` | Karten/Felder auf Leinen |
| `--c-sage` | ruhige abgesetzte Sektionen |
| `--c-moss` | dunkle Sektionen (statt Schwarz) |
| `--c-moss-2` | Karten auf Moos |
| `--c-ink`, `--c-ink-soft` | Text, Sekundärtext |
| `--c-line` | Linien auf Leinen; auf Moos `rgb(255 255 255 / .12)` |
| `--c-clay` | Akzent-Flächen, Haupt-Buttons |
| `--c-clay-ink` | Akzent als TEXT auf hellem Grund |
| `--c-clay-light` | Akzent als TEXT auf Moos |

Rhythmus der Startseite: Sektionen wechseln zwischen Leinen, Salbei und Moos –
nie zwei gleiche Hintergründe direkt hintereinander, Moos sparsam (max. 2–3
Sektionen + Footer). Dunkle Sektionen setzen `--accent-text:
var(--c-clay-light)` und `--b-line-fg: var(--c-linen)` auf ihrer Wurzel.

Text nie über `opacity` aufhellen – `--c-ink-soft` nutzen (auf Moos:
`color-mix(in srgb, var(--c-linen) 75%, transparent)`).

## Typografie

- Überschriften: Fraunces (`--font-header`), Gewicht ~350–420, normale
  Schreibweise, leicht negatives Tracking, Zeilenhöhe ~1.05. Einzelne Wörter
  dürfen kursiv sein (Fraunces Italic, schön weich) – z. B. das emotionale
  Schlüsselwort einer Überschrift in `<em>` oder per eigener Klasse.
  H2: `--fs-h2`. Hero-H1: `--fs-display`.
- Text: Manrope (`--font-text`), ~1.03rem, Zeilenhöhe 1.65.
- Kleine Labels (Schritte, Kategorien): Manrope 0.8–0.9rem, Gewicht 650,
  normale Schreibweise oder höchstens leichtes Tracking. **Kein**
  Versal-Sperrsatz mit weitem letter-spacing mehr (das war das alte Design).
- `<Eyebrow>` für Überzeilen benutzen, nicht nachbauen.

## Formen & Raum

- Karten: `background: var(--c-paper)` (auf Leinen) bzw. `var(--c-moss-2)`
  (auf Moos), `border-radius: var(--radius)`, kein harter Rahmen nötig;
  optional `--shadow-soft`. Innenabstand 1.8–2.6rem.
- Bilder: Bogenform (`--arch`) oder `--radius`.
- Buttons: `<Button>` (Pill). `variant="solid"` = Ton-Rosé für die
  Hauptaktion, `"outline"` für Nebenaktionen. Keine Inline-Farben an Buttons.
- Felder: `--c-paper`, 1px `--c-line`, `--radius-sm`, Fokus Ton-Rosé.
- Sektionen: `padding: var(--section-y) var(--gutter)`, Inhalt in
  `max-width: var(--wide)`; viel Weißraum, große Überschriften, wenig Text.
- Listenpunkte: kleiner Kreis in `--c-clay` (7px) oder ein dünner Bogen.

## Interaktion

- Hover dezent: leichtes Anheben (`translateY(-3px)`), Schatten, Farbwechsel.
  In `@media (hover: hover)` kapseln.
- Bestehende `<Reveal>`-Einblendungen weiter nutzen. `prefers-reduced-motion`
  respektieren.

## Unverändert lassen

- Alle Sektions-`id`s (Anker + Klick-zum-Bearbeiten im Website-Editor).
- Texte kommen aus `src/data/*` – nichts neu hart codieren, alles, was heute
  gerendert wird, weiter rendern.
- Barrierefreiheit: Überschriften-Hierarchie, sichtbarer Fokus, AA-Kontrast.
