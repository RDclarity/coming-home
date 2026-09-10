// @ts-check
/**
 * Baut aus dem CSR-Client-Build (dist/) + einem separaten SSR-Bundle
 * (dist-ssr/, s. package.json "build"-Skript) für jede Seite aus
 * src/seo/pages.ts eine eigene, komplett vorgerenderte dist/<route>/index.html.
 *
 * Warum: Diese Seite ist eine reine React-SPA. Ohne Prerendering sehen Bots,
 * die kein JavaScript ausführen – darunter die meisten KI-Crawler wie
 * GPTBot, ClaudeBot oder PerplexityBot – nur ein leeres <div id="root">.
 * Mit Prerendering bekommt jede URL echten, sofort lesbaren HTML-Inhalt,
 * während Menschen im Browser ganz normal eine interaktive React-App
 * bekommen (hydrateRoot in main.tsx).
 *
 * Erzeugt außerdem dist/404.html (GitHub-Pages-SPA-Fallback für nicht
 * vorgerenderte Pfade wie /admin, /danke) und dist/sitemap.xml.
 */

import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const DIST = join(ROOT, 'dist')
const SSR_ENTRY = join(ROOT, 'dist-ssr', 'entry-server.js')

await ladeDotenvFallsVorhanden()

const {
  render,
  seoPages,
  services,
  articles,
  faq,
  jasmin,
  site,
  business,
  customSections,
  applyAtPath,
  siteModule,
  absoluteUrl,
  SITE_ORIGIN,
} = await import(SSR_ENTRY)

await ladeWebsiteEditorInhalte({ siteModule, services, articles, customSections, applyAtPath })

/**
 * `npm run build` lädt lokal normalerweise `.env` nur für den Vite-Build
 * (`import.meta.env`) – dieses reine Node-Skript hier läuft danach separat
 * und sieht `process.env` sonst leer. In GitHub Actions (siehe deploy.yml)
 * ist das kein Problem, dort stehen die Variablen schon als echte
 * Umgebungsvariablen bereit; das hier ist nur der lokale Komfort-Fallback.
 */
async function ladeDotenvFallsVorhanden() {
  if (process.env.VITE_SUPABASE_URL) return
  try {
    const raw = await readFile(join(ROOT, '.env'), 'utf8')
    for (const line of raw.split('\n')) {
      const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line)
      if (match && !process.env[match[1]]) process.env[match[1]] = match[2]
    }
  } catch {
    // Kein .env vorhanden – dann bleibt der Website-Editor-Inhalt beim
    // eingebauten Basis-Text, genau wie überall sonst in diesem Projekt
    // ohne Supabase-Konfiguration.
  }
}

/**
 * Website-Editor (Backend → Tab "Website"): holt die zuletzt von Jasmin
 * gespeicherten Text-/Foto-Änderungen (`content_overrides`) und frei
 * hinzugefügten Bereiche (`custom_sections`) aus Supabase und wendet sie auf
 * genau die Objekte an, die App.tsx beim Rendern gleich verwendet – siehe
 * `applyAtPath` in src/cms/flatten.ts (mutiert, statt zu kopieren) und die
 * ausführliche Erklärung in supabase/migrations/…_content_editor.sql.
 */
async function ladeWebsiteEditorInhalte({ siteModule, services, articles, customSections, applyAtPath }) {
  const url = process.env.VITE_SUPABASE_URL
  const key = process.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) {
    console.log('prerender: kein Supabase konfiguriert – Website-Editor-Inhalte werden übersprungen')
    return
  }
  const headers = { apikey: key, Authorization: `Bearer ${key}` }

  try {
    const overridesRes = await fetch(`${url}/rest/v1/content_overrides?select=path,value`, { headers })
    if (overridesRes.ok) {
      const overrides = await overridesRes.json()
      // Exakt dieselbe Form wie EDITABLE_SOURCE in pages/crm/AdminWebsite.tsx
      // (nur die Nicht-Funktions-Exporte von data/site.ts), sonst passen die
      // dort erzeugten Pfade nicht zu dem, was hier gemutiert wird.
      const siteRoot = Object.fromEntries(Object.entries(siteModule).filter(([, v]) => typeof v !== 'function'))
      const roots = { site: siteRoot, services, articles }
      for (const { path, value } of overrides) applyAtPath(roots, path, value)
      console.log(`prerender: ${overrides.length} Text-/Foto-Änderung(en) aus dem Website-Editor übernommen`)
    } else {
      console.error('prerender: content_overrides konnte nicht geladen werden', overridesRes.status)
    }
  } catch (err) {
    console.error('prerender: content_overrides konnte nicht geladen werden', err)
  }

  try {
    const sectionsRes = await fetch(
      `${url}/rest/v1/custom_sections?select=id,block_type,content&order=sort_order.asc`,
      { headers },
    )
    if (sectionsRes.ok) {
      const rows = await sectionsRes.json()
      customSections.length = 0
      for (const row of rows) customSections.push({ id: row.id, blockType: row.block_type, content: row.content })
      console.log(`prerender: ${rows.length} zusätzliche Bereich(e) aus dem Website-Editor übernommen`)
    } else {
      console.error('prerender: custom_sections konnte nicht geladen werden', sectionsRes.status)
    }
  } catch (err) {
    console.error('prerender: custom_sections konnte nicht geladen werden', err)
  }
}

const isPlaceholder = (value) => typeof value === 'string' && value.startsWith('[Platzhalter')

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// ---------------------------------------------------------------------------
// JSON-LD
// ---------------------------------------------------------------------------

const jasminId = `${absoluteUrl('/')}#jasmin`
const orgId = `${absoluteUrl('/')}#organization`

function personNode() {
  return {
    '@type': 'Person',
    '@id': jasminId,
    name: 'Jasmin',
    jobTitle: business.tradeTitle,
    description:
      'Körperorientierte Begleiterin für Breathwork, Holistic Bodywork und achtsame Berührung.',
    knowsAbout: ['Breathwork', 'Holistic Bodywork', 'Cranio-Sacrale Impulsarbeit', 'Kundalini Awakening'],
    hasCredential: jasmin.credentials.map((c) => ({
      '@type': 'EducationalOccupationalCredential',
      name: `${c.title} ${c.detail}`.trim(),
    })),
  }
}

function organizationNode() {
  const node = {
    '@type': 'Organization',
    '@id': orgId,
    name: site.brandLong,
    url: absoluteUrl('/'),
    email: site.email,
    founder: { '@id': jasminId },
    sameAs: [site.instagram].filter((url) => !isPlaceholder(url)),
  }
  return node
}

function serviceNode(slug) {
  const service = services.find((s) => s.slug === slug)
  if (!service) return null
  const node = {
    '@type': 'Service',
    name: service.title,
    description: service.metaDescription,
    provider: { '@id': jasminId },
    areaServed: 'Niederösterreich, Österreich',
    url: absoluteUrl(`/begleitung/${service.slug}`),
  }
  if (typeof service.priceValue === 'number') {
    node.offers = {
      '@type': 'Offer',
      price: service.priceValue,
      priceCurrency: 'EUR',
      url: absoluteUrl(`/begleitung/${service.slug}`),
    }
  }
  return node
}

function articleNode(slug) {
  const article = articles.find((a) => a.slug === slug)
  if (!article) return null
  return {
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription,
    author: { '@id': jasminId },
    datePublished: article.updatedIso,
    dateModified: article.updatedIso,
    url: absoluteUrl(`/ratgeber/${article.slug}`),
  }
}

function faqPageNode() {
  return {
    '@type': 'FAQPage',
    mainEntity: faq.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}

function breadcrumbNode(page) {
  const parts = page.path.split('/').filter(Boolean)
  if (parts.length === 0) return null

  const crumbs = [{ name: 'Start', path: '/' }]
  if (parts[0] === 'begleitung' && parts[1]) {
    crumbs.push({ name: 'Begleitungen', path: '/begleitungen' })
    const service = services.find((s) => s.slug === parts[1])
    if (service) crumbs.push({ name: service.shortTitle, path: page.path })
  } else if (parts[0] === 'ratgeber' && parts[1]) {
    crumbs.push({ name: 'Ratgeber', path: '/ratgeber' })
    const article = articles.find((a) => a.slug === parts[1])
    if (article) crumbs.push({ name: article.title, path: page.path })
  } else {
    crumbs.push({ name: page.title.split(' – ')[0], path: page.path })
  }

  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  }
}

function jsonLdFor(page) {
  const graph = [personNode(), organizationNode()]

  if (page.schema === 'service' && page.schemaSlug) {
    const node = serviceNode(page.schemaSlug)
    if (node) graph.push(node)
  }
  if (page.schema === 'article' && page.schemaSlug) {
    const node = articleNode(page.schemaSlug)
    if (node) graph.push(node)
  }
  if (page.schema === 'faq') {
    graph.push(faqPageNode())
  }
  const breadcrumb = breadcrumbNode(page)
  if (breadcrumb) graph.push(breadcrumb)

  return { '@context': 'https://schema.org', '@graph': graph }
}

// ---------------------------------------------------------------------------
// <head>
// ---------------------------------------------------------------------------

function headFor(page, { noindex = false } = {}) {
  const url = absoluteUrl(page.path)
  const image = absoluteUrl('/images/hero-jasmin.jpg')
  const robots = noindex ? 'noindex, nofollow' : 'index, follow'

  return `
    <title>${escapeHtml(page.title)}</title>
    <meta name="description" content="${escapeHtml(page.description)}" />
    <meta name="robots" content="${robots}" />
    <link rel="canonical" href="${url}" />

    <meta property="og:type" content="website" />
    <meta property="og:locale" content="de_AT" />
    <meta property="og:site_name" content="${escapeHtml(site.brandLong)}" />
    <meta property="og:title" content="${escapeHtml(page.title)}" />
    <meta property="og:description" content="${escapeHtml(page.description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${image}" />
    <meta name="twitter:card" content="summary_large_image" />

    <script type="application/ld+json">${JSON.stringify(jsonLdFor(page))}</script>
  `.trim()
}

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

async function outPathFor(routePath) {
  if (routePath === '/') return join(DIST, 'index.html')
  return join(DIST, routePath.replace(/^\//, ''), 'index.html')
}

async function main() {
  const template = await readFile(join(DIST, 'index.html'), 'utf8')
  const headBlock = /<!--app-head-->[\s\S]*?<!--\/app-head-->/

  let written = 0
  for (const page of seoPages) {
    const appHtml = render(page.path)
    const head = headFor(page)
    const html = template
      .replace(headBlock, head)
      .replace('<!--app-html-->', appHtml)

    const outPath = await outPathFor(page.path)
    await mkdir(dirname(outPath), { recursive: true })
    await writeFile(outPath, html, 'utf8')
    written += 1
  }
  console.log(`prerender: ${written} Seiten geschrieben`)

  // 404.html – GitHub-Pages-Fallback für nicht vorgerenderte Pfade (z. B. /admin, /danke).
  const notFoundPage = {
    path: '/404',
    title: `Seite nicht gefunden – ${site.brandLong}`,
    description: 'Diese Seite wurde nicht gefunden.',
  }
  const notFoundHtml = template
    .replace(headBlock, headFor(notFoundPage, { noindex: true }))
    .replace('<!--app-html-->', render('/__not_found__'))
  await writeFile(join(DIST, '404.html'), notFoundHtml, 'utf8')
  console.log('prerender: 404.html geschrieben')

  // sitemap.xml
  const urls = seoPages
    .map(
      (page) => `  <url>
    <loc>${absoluteUrl(page.path)}</loc>
    <priority>${page.priority.toFixed(1)}</priority>
  </url>`,
    )
    .join('\n')
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
  await writeFile(join(DIST, 'sitemap.xml'), sitemap, 'utf8')
  console.log('prerender: sitemap.xml geschrieben')

  // SSR-Zwischenbundle wird nicht deployt.
  await rm(join(ROOT, 'dist-ssr'), { recursive: true, force: true })
}

await main()
