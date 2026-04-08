import {prisma} from '@/app/lib/prisma'
import ArticleViewClient
  from "../../components/article-view-client/article-view-client.tsx";
import {redirect} from "next/navigation";
import {generateElement} from "../../generation/generate_element.ts";


export default async function ArticleView({id}) {
  const article = await prisma.articles.findUnique(
    {
      where: {id},
      include: {
        attachments: {
          orderBy: [{order: 'asc'}, {created_at: 'desc'}],
          select: {
            id: true,
            caption: true,
            size: true,
            width: true,
            height: true,
            alt_text: true,
            type: true,
            component: true,
            params: true
          },
        },
        translations: {
          include: {llms: true, prompts: true},
          orderBy: [
            {published_at: 'asc'},
            {created_at: 'desc'}
          ],
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
          }
        }
      }
    }
  )
  // const sections = await prisma.sections.findMany(
  //   {where: {article_id: id}}
  // )
  // const translations = await prisma.translations.findMany({
  //     where: {article_id: Number(id)},
  //     include: {llms: true, prompts: true},
  //     orderBy: [
  //       {published_at: 'asc'},
  //       {created_at: 'desc'}
  //     ],
  //   }
  // )
  // const attachments = await prisma.attachments.findMany({
  //     where: {article_id: Number(id)},
  //     orderBy:{created_at: 'desc'},
  //     select: {
  //       id: true,
  //       caption: true,
  //       size: true,
  //       width: true,
  //       height: true,
  //       alt_text: true
  //     },
  //   }
  // )
  // article.translations = translations;
  // article.attachments = attachments;

  async function deleteArticleAction() {
    'use server'
    await prisma.articles.delete({
                                   where: {
                                     id: article.id
                                   },
                                 });
    redirect("/articles")
  }

  async function deleteAllUnpublishedTranslationsAction() {
    'use server'
    await prisma.translations.deleteMany({
                                           where: {
                                             article_id: article.id,
                                             published_at: null
                                           }
                                         })
    redirect(`/articles/${article.id}`)
  }

  async function deleteAllUnpublishedAttachmentsAction(type = null) {
    'use server'
    const typeWhereClause = type ? {type} : {}
    await prisma.attachments.deleteMany({
                                          where: {
                                            article_id: article.id,
                                            active: false,
                                            ...typeWhereClause,
                                          }
                                        })
    console.log("deleteAllUnpublishedAttachmentsAction 1")
    redirect(`/articles/${article.id}`)
  }

  async function generateElement_(elementName,llmName="claude",params={}) {
    'use server'
    console.log(`generating element ${elementName} for article ${article.id}`)

    await generateElement(elementName,llmName,{...params,save:true,articleId:article.id})
    console.log(`generated element ${elementName} for article ${article.id}`)
    redirect(`/articles/${article.id}`)
  }

  return <ArticleViewClient
    article={article}
    generateElement={generateElement_}
    deleteArticleAction={deleteArticleAction}
    deleteAllUnpublishedTranslationsAction={deleteAllUnpublishedTranslationsAction}
    deleteAllUnpublishedAttachmentsAction={deleteAllUnpublishedAttachmentsAction}
  />

}
