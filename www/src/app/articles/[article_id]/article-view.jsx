import postgres from 'postgres';
import Link from "next/link";
import {prisma} from '@/app/lib/prisma'

const query = postgres(process.env.POSTGRES_URL, {ssl: 'require'});

export default async function ArticleView({id}) {
  const article = await prisma.articles.findUnique({where: {id}})
  const sections = await prisma.sections.findMany(
    {where: {article_id: id}}
  )
  return <div className="content">
    <h1>{article.original_title}</h1>
    <p>
      <i>{article.attribution}&nbsp;
        (<Link className="has-text-primary has-text-weight-bold" href={article.url}>
          {article.year}
        </Link>)
      </i>
    </p>

    {sections.map(async (section) => {
        const paragraphs = await prisma.paragraphs.findMany(
          {where: {section_id:section.id}});
        return <>
          <h3>{section.title}</h3 >
          {paragraphs.map(paragraph =>
            <>
            <h4>
              {paragraph.title}
            </h4>
              <p>
                {paragraph.body}
              </p>
            </>
            )}
        </>
      }
    )}
    <div className={"block"}>
    <Link className={"button"} href={`/articles/${id}/edit`}>Edit</Link>
    </div>
    <div className={"block"}>
      <Link className={"button"} href={`/articles/${id}/delete`}>Delete</Link>
    </div>
    <div className={"block"}>
    <Link className={"button"} href={`/articles/${id}/sections`}>View Sections</Link>
    </div>
  </div>
}
