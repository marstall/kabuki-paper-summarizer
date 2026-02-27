import Link from "next/link";
import {prisma} from '@/app/lib/prisma'
import {redirect} from 'next/navigation'


export default async function ParagraphView({
                                              article_id,
                                              section_id,
                                              paragraph_id
                                            }: any
) {
  async function deleteParagraphAction() {
    'use server'
    await prisma.paragraphs.delete({
      where: {
        id: paragraph_id
      },
    });
    redirect(`/articles/${article_id}/sections/${section_id}`)

  }

  const paragraph = await prisma.paragraphs
    .findUnique(
      {
        where: {id: paragraph_id},
        include: {sections: true}
      })
  if (!paragraph) return <div>Paragraph Not found</div>

  return <div className={"content"}>
    <Link className={'button'} href={`/articles/${article_id}/sections/${section_id}`}>
      &lt; Back to '{paragraph.sections.title}'
    </Link>

    <h1 className="title">Paragraph: {paragraph.title}</h1>
    <p>
      {paragraph.body}
    </p>
    <form action={deleteParagraphAction}>
      <button className={'button is-danger'} type={'submit'}>
        Delete
      </button>
    </form>
  </div>
}
