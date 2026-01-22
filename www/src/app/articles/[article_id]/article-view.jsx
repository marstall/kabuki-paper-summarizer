import Link from "next/link";
import {prisma} from '@/app/lib/prisma'
import {translate} from '@/app/lib/translate'

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
    <Link onClick={translate} href='#' className="button">Translate into Plain English</Link>

    {sections.map(async (section) => {
        const paragraphs = await prisma.paragraphs.findMany(
          {where: {section_id:section.id}});
        return <>
          <h3>{section.title}</h3 >
          {paragraphs.map(paragraph =>
            <div key={paragraph.id}>
            <h4>
              {paragraph.title}
            </h4>
              <p style={{marginBottom:12}}>
                {paragraph.body}
              </p>
            </div>
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
