import postgres from 'postgres';
import Link from "next/link";
import {prisma} from '@/app/lib/prisma'

const query = postgres(process.env.POSTGRES_URL, {ssl: 'require'});

export default async function ArticleView({id}) {
  const article = await prisma.articles.findUnique({where: {id}})
  return <><h1 className="title">{article.original_title}</h1>
    <section className="section">
      <div>
        <i>{article.attribution}</i>
      </div>
      <div>
        <Link className="button" href={article.url}>
          {article.year}
        </Link>
      </div>

    </section>
    <Link className="button" href={`/articles/${id}/sections`}>View Sections</Link>
  </>
}
