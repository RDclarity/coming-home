/**
 * Generische Werkzeuge, um ein beliebiges Textobjekt (z. B. `site` aus
 * data/site.ts) in eine flache Liste bearbeitbarer Felder zu zerlegen und
 * Änderungen daran wieder anzuwenden. Kennt die Struktur von `site.ts` nicht
 * im Detail – funktioniert für jedes verschachtelte Objekt aus Strings,
 * Zahlen, Arrays und Objekten.
 */

export type EditableField = {
  /** Punkt-/Klammer-Pfad, z. B. "hero.titleLines[0]" – eindeutiger Schlüssel. */
  path: string
  /** Für Menschen lesbarer Pfad, z. B. "hero → titleLines → 1". */
  label: string
  value: string
}

export function flattenToFields(value: unknown, path = '', label = ''): EditableField[] {
  if (typeof value === 'string') {
    return [{ path, label, value }]
  }

  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      flattenToFields(item, `${path}[${index}]`, `${label} → ${index + 1}`),
    )
  }

  if (value !== null && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, item]) => {
      const nextPath = path ? `${path}.${key}` : key
      const nextLabel = label ? `${label} → ${key}` : key
      return flattenToFields(item, nextPath, nextLabel)
    })
  }

  // Zahlen, Booleans etc. werden bewusst nicht bearbeitbar gemacht – nur Texte.
  return []
}

/** Liefert den Wert an einem Pfad wie "hero.titleLines[0]" aus einem Objekt. */
export function getAtPath(obj: unknown, path: string): unknown {
  const tokens = pathTokens(path)
  let current: unknown = obj
  for (const token of tokens) {
    if (current == null) return undefined
    current = (current as Record<string, unknown>)[token]
  }
  return current
}

/**
 * Setzt einen Wert an einem Pfad in einer TIEFEN KOPIE von `obj` (mutiert
 * das Original nicht) und gibt die Kopie zurück.
 */
export function setAtPath<T>(obj: T, path: string, value: string): T {
  const tokens = pathTokens(path)
  const clone: T = structuredClone(obj)
  let current: unknown = clone

  for (let i = 0; i < tokens.length - 1; i++) {
    current = (current as Record<string, unknown>)[tokens[i]]
  }

  const lastToken = tokens[tokens.length - 1]
  ;(current as Record<string, unknown>)[lastToken] = value

  return clone
}

function pathTokens(path: string): string[] {
  return path
    .split(/[.[\]]/)
    .filter((token) => token.length > 0)
}
