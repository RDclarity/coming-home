import { Breadcrumbs } from '../../components/Breadcrumbs'
import { Reveal } from '../../components/Reveal'
import { articles } from '../../data/articles'
import { withBase } from '../../lib/url'
import { Abschluss } from '../../sections/Abschluss'
import styles from './RatgeberIndex.module.css'

export function RatgeberIndex() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <Reveal>
            <Breadcrumbs items={[{ label: 'Ratgeber' }]} />
            <h1 className={styles.title}>Ratgeber</h1>
            <p className={styles.lead}>
              Ausführliche Antworten auf Fragen rund um Breathwork, Körperarbeit und
              Nervensystemregulation – unabhängig davon, ob du gerade eine Session buchst
              oder dich einfach informieren möchtest.
            </p>
          </Reveal>
        </div>
      </section>

      <section className={styles.list}>
        <div className={styles.listInner}>
          {articles.map((article) => (
            <a
              key={article.slug}
              className={styles.card}
              href={withBase(`/ratgeber/${article.slug}`)}
            >
              <span className={styles.category}>{article.category}</span>
              <h2 className={styles.cardTitle}>{article.title}</h2>
              <p className={styles.dek}>{article.dek}</p>
              <span className={styles.meta}>{article.readingMinutes} Min. Lesezeit</span>
            </a>
          ))}
        </div>
      </section>

      <Abschluss />
    </>
  )
}
