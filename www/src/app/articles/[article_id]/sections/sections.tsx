import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import _ from 'lodash'
export default async function Sections(params: any) {
  const {article_id} = params;
  const sections = await prisma.sections.findMany({
    where: {
      article_id
    }
  })
  const article = await prisma.articles.findUnique({where:{id:article_id}})

  return <div>
    <Link className={'button'} href={`/articles/${article_id}`}>&lt; Back to article '{article.original_title.substring(0,50)} ...'</Link>
    <br/>
    <br/>
    <h1 className="title">Sections</h1>
    <div>
      {sections.length === 0 && <div>no sections</div>}
      {sections.map((section) => {
        const href = `/articles/${article_id}/sections/${section.id}`
        return <div style={{marginBottom:8}} key={section.id}>
          <Link className="button" href={href}>
            {section.title}
          </Link>
        </div>
      })}</div>
    <br/>
    <Link className="button is-primary" href={`/articles/${article_id}/sections/new`}>
      New Section
    </Link>
  </div>
}
