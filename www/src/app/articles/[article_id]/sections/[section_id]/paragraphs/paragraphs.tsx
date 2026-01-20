import Link from "next/link";
import { prisma } from "@/app/lib/prisma";

export default async function Paragraphs(params: any) {
  const {article_id,section_id} = params;
  const paragraphs = await prisma.paragraphs.findMany({
    where: {
      section_id
    }
  })

  return <div>
    <h1 className="title">Paragraphs</h1>
    <div>
      {paragraphs.length === 0 && <div>no paragraphs</div>}
      {paragraphs.map((paragraph) => {
        const href = `/articles/${article_id}/sections/${section_id}`+
          "/paragraphs/"+paragraph.id
        return <div style={{marginBottom:8}} key={paragraph.id}>
          <Link className="button" href={href}>
            {paragraph.title||paragraph.body}
          </Link>
        </div>
      })}</div>
    <br/>
    <Link className="button is-primary" href={`/articles/${article_id}/sections/${section_id}/paragraphs/new`}>
      New Paragraph
    </Link>
  </div>
}
