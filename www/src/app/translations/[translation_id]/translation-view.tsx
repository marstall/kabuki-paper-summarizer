import {prisma} from '@/app/lib/prisma'
import TranslationViewClient from "@/app/components/translation-view-client/translation-view-client";
import _ from 'lodash'
import {cache} from 'react'
import type { Metadata, ResolvingMetadata } from 'next'

export const loadTranslation = cache(async (translation_id) =>{
  return await prisma.translations.findUnique({
      where: {id: translation_id},
      include: {
        llms: true,
        prompts: true,
        articles: {
          include: {
            attachments: {
              select: {
                id: true,
                caption: true,
                size: true,
                width: true,
                height: true,
                alt_text: true
              }
            },
            sections: {
              orderBy: {
                id: 'asc'
              },
              include: {
                paragraphs: {
                  orderBy: {
                    id: 'asc'
                  }
                }
              },
            }
          }
        }
      }
    }
  )
})


export default async function TranslationView({translation_id}: any) {
  const translation = await loadTranslation(translation_id)
  if (!translation) return <div>Translation Not found</div>

  return <TranslationViewClient
    translation={translation}
    article={translation.articles}
    llm={translation.llms}
    promptTitle={_.get(translation, "prompts.title")}
    attachment={_.get(translation,'articles.attachments[0]',null)}
  />

}
