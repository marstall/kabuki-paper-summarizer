import {prisma} from '@/app/lib/prisma'
import ArticleForm from '../translation-form'
import {redirect} from 'next/navigation'
import {PrismaClientValidationError} from "@prisma/client/runtime/client";
import toast from "react-hot-toast";
import TranslationForm from "../translation-form";

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

  const title = formData.get('title');
  const body = formData.get('body') || "";
  let translationId = Number(formData.get('translation_id'));
  const translation = translationId && await prisma.translations.findUnique({where: {id: translationId}});
  const articleId = translation.article_id;
  const errors = []
  if (title?.length < 1) errors.push("Original title is not long enough")

  if (body?.length < 1) errors.push("bodyis not long enough")

  if (errors.length === 0) {
    const now = new Date()
    try {
      if (translationId) {
        await prisma.translations.update(
          {
            where: {
              id: translationId
            },
            data: {
              title,
              body
            }
          }
        )
      } else {
        const _translation = await prisma.translations.create({
          data: {
            created_at: now,
            updated_at: now,
            title,
            body
          }
        })
        translationId = _translation.id as unknown as number;
      }

    } catch (e) {
      errors.push(e.message)
    }
    if (errors.length === 0) {
      //toast("Success!")
      if (translationId) {
        redirect(`/articles/${articleId}/translations/${translationId}`)
      } else {
        redirect(`/articles/${articleId}/translations`)
      }
    } else return {
      title,
      body,
      errors
    }

  }
}

export default async function TranslationNew({article_id,translation_id}) {
  const translation = translation_id && await prisma.translations.findUnique({where: {id: translation_id}});

  return (
    <TranslationForm translation={translation} action={submit}/>
  );
}
