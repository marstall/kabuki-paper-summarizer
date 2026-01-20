import Link from "next/link";
import { prisma } from '@/app/lib/prisma'


export default async function ParagraphView({
                                             article_id,
                                             section_id,
                                             paragraph_id
                                           }: any
) {
  const paragraph = await prisma.paragraphs
    .findUnique({where: {id:paragraph_id}})
  if (!paragraph) return <div>Paragraph Not found</div>
  return <div className={"content"}>
    <h1 className="title">Paragraph: {paragraph.title}</h1>
    <p>
      {paragraph.body}
    </p>
  </div>
}
