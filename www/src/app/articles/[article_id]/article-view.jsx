import {prisma} from '@/app/lib/prisma'
import ArticleViewClient from "../../components/article-view-client/article-view-client.tsx";

export default async function ArticleView({id}) {
  const article = await prisma.articles.findUnique(
    {
      where: {id},
      include: {
        attachments: {
          orderBy: {
            id: 'asc'
          },
          select: {
            id: true,
            caption: true,
            size: true,
            width: true,
            height: true,
            alt_text: true
          },
        },
        translations: {
          include: {llms: true},
          orderBy: {
            created_at: 'desc'
          },
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
  const translations = await prisma.translations.findMany({
      where: {article_id: Number(id)},
      include: {llms: true},
      orderBy: {
        created_at: 'desc'
      },
    }
  )
  const attachments = await prisma.attachments.findMany({
      where: {article_id: Number(id)},
      select: {
        id: true,
        caption: true,
        size: true,
        width: true,
        height: true,
        alt_text: true
      },
    }
  )
  article.translations = translations;
  article.attachments = attachments;
  return <ArticleViewClient article={article}/>

}
