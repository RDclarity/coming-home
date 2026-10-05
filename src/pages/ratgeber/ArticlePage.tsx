import { useParams } from 'react-router-dom'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { Button } from '../../components/Button'
import { Eyebrow } from '../../components/Eyebrow'
import { Reveal } from '../../components/Reveal'
import { articles, getArticleBySlug, type ArticleBlock } from '../../data/articles'
import { getServiceBySlug } from '../../data/services'
import { withBase } from '../../lib/url'
import { Abschluss } from '../../sections/Abschluss'
import { NotFound } from '../NotFound'
import styles from './ArticlePage.module.css'

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case 'p':
      return <p className={styles.p}>{block.text}</p>
    case 'h2':
      return <h2 className={styles.h2}>{block.text}</h2>
    case 'quote':
      return <p className={styles.quote}>{block.text}</p>
    case 'list':
      return (
        <ul className={styles.list}>
          {block.items.map((item) => (
            <li key={item} className={styles.listItem}>
              <span className={styles.dot} aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      )
  }
}

export function ArticlePage() {
  const { slug } = useParams()
  const article = getArticleBySlug(slug)

  if (!article) return <NotFound />

  const relatedArticles = article.relatedSlugs
    .map((relatedSlug) => getArticleBySlug(relatedSlug))
    .filter((item) => item !== undefined)

  const relatedServices = article.relatedServiceSlugs
    .map((serviceSlug) => getServiceBySlug(serviceSlug))
    .filter((item) => item !== undefined)

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <Reveal>
            <Breadcrumbs
              items={[
                { label: 'Ratgeber', href: '/ratgeber' },
                { label: article.title },
              ]}
            />
            <Eyebrow style={{ color: 'var(--c-key1)' }}>{article.category}</Eyebrow>
            <h1 className={styles.title}>{article.title}</h1>
            <p className={styles.dek}>{article.dek}</p>
            <p className={styles.meta}>
              {article.readingMinutes} Min. Lesezeit · Stand: {article.updated}
            </p>
          </Reveal>
        </div>
      </section>

      <section className={styles.body}>
        <Reveal as="div" className={styles.bodyInner}>
          {article.body.map((block, index) => (
            <Block key={index} block={block} />
          ))}
        </Reveal>
      </section>

      {(relatedArticles.length > 0 || relatedServices.length > 0) && (
        <section className={styles.related}>
          <div className={styles.relatedInner}>
            {relatedArticles.length > 0 && (
              <>
                <p className={styles.relatedHeading}>Weiterlesen</p>
                <div className={styles.relatedLinks}>
                  {relatedArticles.map((item) => (
                    <a
                      key={item.slug}
                      className={styles.relatedLink}
                      href={withBase(`/ratgeber/${item.slug}`)}
                    >
                      {item.title}
                    </a>
                  ))}
                </div>
              </>
            )}

            {relatedServices.length > 0 && (
              <>
                <p className={styles.relatedHeading}>Passende Begleitungen</p>
                <div className={styles.serviceLinks}>
                  {relatedServices.map((item) => (
                    <Button key={item.slug} href={`/begleitung/${item.slug}`} variant="outline">
                      {item.shortTitle}
                    </Button>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      <Abschluss />
    </>
  )
}

/** Für den Prerender: alle Slugs, für die eine statische Seite gebaut wird. */
export const articleSlugs = articles.map((article) => article.slug)
