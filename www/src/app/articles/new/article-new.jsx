import { prisma } from '@/app/lib/prisma'
import ArticleForm from '../article-form'
import { redirect } from 'next/navigation'
import {PrismaClientValidationError} from "@prisma/client/runtime/client";

/*
this form is being rendered on the server (and returned to the client as RSC).
when you press submit, submit() is run on the server. so there is no true way of preventing
that. but a POST is also seen in the Network tab. I wonder if the POST is how the server
picks up that the submit() function should then be run.

In the old days, the POST would re-render the same page, with the same params - so you
could re-populate the fields with the right data.
 */

async function submit(prevState, formData) {
  'use server'
  const url = formData.get('url')||"";
  const original_title = formData.get('original_title')||"";
  const year = formData.get('year')||"";
  const attribution = formData.get('attribution')||"";
  const full_text = formData.get('full_text')||"";

  const errors = []
  if (url?.length<1) errors.push("URL is not long enough")
  if (original_title?.length<1) errors.push("Original title is not long enough")

  if (year?.length<1||!isFinite(Number(year))) errors.push("Year must be in format 1929, 2024, etc.")
  //if (full_text?.length<1) errors.push("Body is not long enough")
  if (attribution?.length<1) errors.push("Attribution is not long enough")

  if (errors.length===0) {
    const now = new Date()
    try {
      const article = await prisma.articles.create({
        data: {
          created_at: now,
          updated_at: now,
          url,
          original_title,
          year:Number(year),
          attribution
        }
      })
    } catch (e) {
      errors.push(e.message)
    }
    if (errors.length===0) {
      redirect('/articles')
    }
  }
  if (errors.length>0) return {
    url,
    original_title,
    year,
    attribution,
    full_text,
    errors
  }

}

export default async function ArticleNew() {
  return (
    <ArticleForm action={submit}/>
  );
}
