import postgres from 'postgres';
import Link from "next/link";
import { prisma } from '@/app/lib/prisma'
import Article from "../../models/article.ts";

const query = postgres(process.env.POSTGRES_URL, {ssl: 'require'});

export default async function ArticleView({id}) {
  console.log("id+",id)
  const articles = await prisma.articles.findMany()
  if (articles.length===0) return <div/>
  const article = articles[0]
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
      <div>
        {article.full_text}
      </div>

    </section>
  </>
}
