import {prisma} from '@/app/lib/prisma'
import TranslationViewClient from "@/app/components/translation-view-client/translation-view-client";
import _ from 'lodash'

export default async function TranslationView(params: any) {
  const {translation_id} = params
  const translation = await prisma.translations.findUnique(
    {
      where: {id: translation_id},
      include: {prompts:true}
    })

  if (!translation) return <div>Translation Not found</div>

  const article = translation.article_id && await prisma.articles.findUnique(
    {
      where: {id:translation.article_id},
      include: {
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
          }
        }
      }
    }
  )


  const llm = await prisma.llms.findUnique({where: {id: translation.llm_id}})
  const attachments = await prisma.attachments.findMany({
      where: {article_id: Number(article.id)},
      select: {
        id: true,
        caption: true,
        size: true,
        width: true,
        height: true,
        alt_text: true
      }
    }
  )

  let promptTitle = _.get(translation,"prompts.title")

  const attachment = attachments.length > 0 ? attachments[0] : null;
  return <TranslationViewClient
    translation={translation}
    article={article}
    llm={llm}
    promptTitle={promptTitle}
    attachment={attachment}
  />

}
