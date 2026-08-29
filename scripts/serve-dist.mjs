// @ts-check
/**
 * Minimaler statischer Server für dist/ – bewusst statt `vite preview`.
 *
 * `vite preview` bringt einen SPA-History-Fallback mit, der JEDE Anfrage ohne
 * erkannte Datei-Endung auf die WURZEL-index.html umleitet. Das ist für eine
 * normale Single-Page-App richtig, ignoriert hier aber die einzeln
 * vorgerenderten Seiten aus scripts/prerender.mjs komplett – lokal sah dadurch
 * jede Route außer "/" wie ein Hydration-Fehler aus, obwohl die erzeugte
 * Datei auf der Platte korrekt war (der Fehler trat nur beim Testen auf,
 * nicht im echten GitHub-Pages-Deployment).
 *
 * Dieser Server verhält sich stattdessen wie GitHub Pages: „/pfad" liefert
 * „pfad/index.html" (samt 301 auf den Slash), unbekannte Pfade liefern
 * 404.html mit Status 404. Kein SPA-Fallback auf die Startseite.
 */

import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join } from 'node:path'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(dirname(fileURLToPath(import.meta.url))), 'dist')
const PORT = Number(process.argv[2]) || 4300
// dist/ enthält die Dateien so, wie sie auf GitHub Pages unter /coming-home/
// liegen würden – dieses Präfix also vor dem Datei-Lookup abschneiden, damit
// man lokal exakt dieselben URLs wie live verwenden kann.
const BASE_PREFIX = '/coming-home'

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
}

async function resolveFile(urlPath) {
  let cleanPath = decodeURIComponent(urlPath.split('?')[0])
  if (cleanPath.startsWith(BASE_PREFIX)) cleanPath = cleanPath.slice(BASE_PREFIX.length) || '/'
  let filePath = join(ROOT, cleanPath)

  try {
    const info = await stat(filePath)
    if (info.isDirectory()) {
      filePath = join(filePath, 'index.html')
      await stat(filePath)
    }
    return filePath
  } catch {
    return null
  }
}

const server = createServer(async (req, res) => {
  const found = await resolveFile(req.url ?? '/')

  if (found) {
    const body = await readFile(found)
    res.writeHead(200, { 'Content-Type': MIME[extname(found)] ?? 'application/octet-stream' })
    res.end(body)
    return
  }

  try {
    const body = await readFile(join(ROOT, '404.html'))
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(body)
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('404 Not Found')
  }
})

server.listen(PORT, () => {
  console.log(`dist/ läuft auf http://localhost:${PORT}/coming-home/ (wie GitHub Pages, ohne SPA-Fallback)`)
})
