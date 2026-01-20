import Link from "next/link";
import { prisma } from '@/app/lib/prisma'


export default async function SectionView({article_id,section_id}: any) {
  const section = await prisma.sections.findUnique({where: {id:section_id}})
  if (!section) return <div>Section Not found</div>
  return <><h1 className="title">Section: {section.title}</h1>
    <Link
      className="button"
      href={`/articles/${article_id}/sections/${section_id}/paragraphs`}>
      View Paragraphs
    </Link>
  </>
}
