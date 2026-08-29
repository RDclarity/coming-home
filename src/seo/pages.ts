/**
 * Das eine Verzeichnis aller öffentlichen Seiten. Treibt drei Dinge:
 *  1. scripts/prerender.mjs – welche Seiten werden vorgerendert, mit welchem
 *     <title>/<meta description>/JSON-LD.
 *  2. Die generierte sitemap.xml.
 *  3. (indirekt) robots.txt/llms.txt, die von Hand denselben Pfaden folgen.
 *
 * /intern/crm ist absichtlich NICHT hier gelistet – das interne Werkzeug wird
 * nicht vorgerendert, nicht indexiert und nicht in der Sitemap geführt.
 */

import { articles } from '../data/articles'
import { services } from '../data/services'

export type SeoPage = {
  path: string
  title: string
  description: string
  /** Für die Sitemap-Priorität, grob: Startseite > Übersichten > Detailseiten > Rechtliches. */
  priority: number
  /** Steuert, welches JSON-LD scripts/prerender.mjs zusätzlich einbaut. */
  schema?: 'service' | 'article' | 'faq'
  schemaSlug?: string
}

const SITE_TITLE_SUFFIX = ' – Coming Home by Jasmin'

export const seoPages: SeoPage[] = [
  {
    path: '/',
    title: 'Coming Home – Körperorientierte Begleitung von Jasmin',
    description:
      'Coming Home ist körperorientierte Begleitung mit Breathwork, Holistic Bodywork und achtsamer Berührung. 1:1 Begleitung, Gruppenarbeit, Workshops und Retreats – persönlich von Jasmin.',
    priority: 1,
    schema: 'faq',
  },
  {
    path: '/begleitungen',
    title: `Alle Begleitungen im Überblick${SITE_TITLE_SUFFIX}`,
    description:
      'Breathwork, Holistic Bodywork, Cranio-Sacral, Kundalini Awakening, Prozessbegleitung, mehrmonatige Begleitungen, Workshops und Retreats – mit Preis und Ablauf, alle persönlich von Jasmin geleitet.',
    priority: 0.9,
  },
  ...services.map((service) => ({
    path: `/begleitung/${service.slug}`,
    title: `${service.title} – ${service.priceLabel}${SITE_TITLE_SUFFIX}`,
    description: service.metaDescription,
    priority: 0.8,
    schema: 'service' as const,
    schemaSlug: service.slug,
  })),
  {
    path: '/ratgeber',
    title: `Ratgeber${SITE_TITLE_SUFFIX}`,
    description:
      'Ausführliche Antworten auf Fragen rund um Breathwork, Körperarbeit und Nervensystemregulation – von Jasmin persönlich geschrieben.',
    priority: 0.7,
  },
  ...articles.map((article) => ({
    path: `/ratgeber/${article.slug}`,
    title: `${article.title}${SITE_TITLE_SUFFIX}`,
    description: article.metaDescription,
    priority: 0.6,
    schema: 'article' as const,
    schemaSlug: article.slug,
  })),
  {
    path: '/impressum',
    title: `Impressum${SITE_TITLE_SUFFIX}`,
    description: 'Impressum und Anbieterkennzeichnung von Coming Home by Jasmin.',
    priority: 0.2,
  },
  {
    path: '/datenschutz',
    title: `Datenschutzerklärung${SITE_TITLE_SUFFIX}`,
    description: 'Datenschutzerklärung von Coming Home by Jasmin gemäß DSGVO.',
    priority: 0.2,
  },
  {
    path: '/agb',
    title: `Allgemeine Geschäftsbedingungen${SITE_TITLE_SUFFIX}`,
    description: 'Allgemeine Geschäftsbedingungen für Begleitungen, Workshops und Retreats bei Coming Home.',
    priority: 0.2,
  },
]
