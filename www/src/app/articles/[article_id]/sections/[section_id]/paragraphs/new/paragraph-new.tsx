import ParagraphForm from '../paragraph-form'
import {redirect} from 'next/navigation'
import { prisma } from '@/app/lib/prisma'

async function submit(prevState: any, formData: FormData) {
  'use server'
  const title = formData.get('title') as string || "";
  const body = formData.get('body') as string || "";
  const sectionId = Number(formData.get('section_id'));
  const articleId = Number(formData.get('article_id'));
  if (!sectionId) return <div>sectionId not found.</div>
  console.log({body})
  const errors = []
  if (body.length < 3) errors.push("body is not long enough")
  if (errors.length === 0) {
    const now = new Date()
    try {
      await prisma.paragraphs.create({
        data: {
          created_at: now,
          updated_at: now,
          section_id: sectionId,
          title,
          body
        }
      })
    } catch (e) {
      errors.push((e as Error).message)
    }
    if (errors.length === 0) {
      redirect(`/articles/${articleId}/sections/${sectionId}`)
    }
  }
  if (errors.length > 0) return {
    title,
    body,
    errors
  }
}

export default async function ParagraphNew(params) {
  return (
    <ParagraphForm section_id={params.section_id} article_id={params.article_id} action={submit}/>
  );
}
