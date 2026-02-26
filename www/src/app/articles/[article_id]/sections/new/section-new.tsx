import SectionForm from '../section-form'
import {redirect} from 'next/navigation'
import { prisma } from '@/app/lib/prisma'

async function submit(prevState: any, formData: FormData) {
  'use server'
  console.log("submit 1")
  const title = formData.get('title') as string || "";
  const articleId = Number(formData.get('article_id'));
  const errors = []
  if (!articleId) errors.push("articleId not found")

  if (typeof title === 'string' && title.length < 3) errors.push("title is not long enough")

  if (errors.length === 0) {
    const now = new Date()
    let section
    try {
      section = await prisma.sections.create({
        data: {
          created_at: now,
          updated_at: now,
          article_id: articleId,
          title,
        }
      })
    } catch (e) {
      errors.push((e as Error).message)
    }
    if (errors.length === 0) {
      redirect(`/articles/${articleId}/sections/${section.id}`)
    }
  }
  if (errors.length > 0) return {
    title,
    errors
  }
}

export default async function SectionNew({params}: { params: Promise<any> }) {
  const _params = await params;
  return (
    <SectionForm article_id={_params.article_id} action={submit}/>
  );
}
