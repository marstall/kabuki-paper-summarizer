import postgres from 'postgres';
import Link from "next/link";
import { prisma } from '../lib/prisma'


export default async function Articles() {
  const articles = await prisma.articles.findMany()

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
        </div>
      })}</div>
    <br/>
    <Link className="button is-primary" href="/articles/new">
      New Article
    </Link>
  </div>
}
