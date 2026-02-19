import {prisma} from '@/app/lib/prisma'
import TranslationSentenceBySentence
  from "@/app/components/translation-sentence-by-sentence/translation-sentence-by-sentence"

export default async function TranslationView({translation_id}: any) {
  const translation = await prisma.translations.findUnique(
    {where: {id: translation_id}})
  const article = await prisma.articles.findUnique({where: {id: translation.article_id}})
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
  const attachment = attachments.length > 0 ? attachments[0] : null;
  const attachmentTranslations = attachment && await prisma.translations.findMany({
    where: {attachment_id: Number(attachment.id)},
    orderBy: {created_at: 'desc'}
  });
  const attachmentTranslation = attachmentTranslations.length>0 ? attachmentTranslations[0] : null
  if (!translation) return <div>Translation Not found</div>
  return <TranslationSentenceBySentence article={article} translation={translation} llm={llm}
                                        attachment={attachment} attachmentTranslation={attachmentTranslation}/>
}
