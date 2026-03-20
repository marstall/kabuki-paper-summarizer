import postgres from 'postgres';
import Link from "next/link";
import { prisma } from '../lib/prisma'


export default async function Articles() {
  const articles = await prisma.articles.findMany(
    {
      orderBy: {created_at: 'desc'},
      include: {translations: {where: {NOT: {published_at: null}}}}
//      include: {translations: true}
    }
  )

  return <div>
    <h1 className="title">Articles</h1>
    <div>
      {articles.length === 0 && <div>no articles</div>}
      {articles.map((article) => {
        const href = `/articles/${article.id}`
        return <div style={{marginBottom:8}} key={article.id}>
          <Link className="button" href={href}>
            {article.original_title}
          </Link>
          {article.translations.map((translation) => {
            const published = translation.published_at ? "✅" : ""
            return <div key={translation.id}>
              {published} <Link href={`/translations/${translation.id}`}>{article.title}</Link>
            </div>
          })}
        </div>
      })}</div>
    <br/>
    <Link className="button is-primary" href="/articles/new">
      New Article
    </Link>
  </div>
}
