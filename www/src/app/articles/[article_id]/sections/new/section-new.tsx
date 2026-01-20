import SectionForm from '../section-form'
import {redirect} from 'next/navigation'
import { prisma } from '@/app/lib/prisma'

async function submit(prevState, formData) {
  'use server'
  console.log({formData})
  const title = formData.get('title') || "";
  const articleId = formData.get('article_id') || "";

  const errors = []
  if (title?.length < 3) errors.push("title is not long enough")

  if (errors.length === 0) {
    const now = new Date()
    try {
      const section = await prisma.sections.create({
        data: {
          created_at: now,
          updated_at: now,
          article_id: articleId,
          title,
        }
      })
    } catch (e) {
      errors.push(e.message)
    }
    if (errors.length === 0) {
      redirect(`/articles/${articleId}/sections`)
    }
  }
  if (errors.length > 0) return {
    title,
    errors
  }
}

export default async function SectionNew({params}) {
  const _params = await params;
  return (
    <SectionForm article_id={_params.article_id} action={submit}/>
  );
}
