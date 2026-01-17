import postgres from 'postgres';
import Link from "next/link";

const query = postgres(process.env.POSTGRES_URL, {ssl: 'require'});

export default async function Articles() {
  const articles = await query
    `select *
     from articles
     order by id desc`;
  console.log({articles})
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
