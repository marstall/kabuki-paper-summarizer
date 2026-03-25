import styles from './translations.module.css'
import {prisma} from '@/app/lib/prisma'
import TranslationBrief from '@/app/components/translation-brief/translation-brief'

export default async function Translations(params: any) {
  const translations = await prisma.translations.findMany(
    {
      where: {NOT: {published_at: null}},
      orderBy: {published_at: "desc"},
      include: {
        llms: true,
        articles:
          {
          include: {
            attachments: {
              where: {active: true},
              select: {
                id: true,
                caption: true,
                size: true,
                width: true,
                height: true,
                alt_text: true
              },
              orderBy: {order: 'asc'}
            }
          }
        }
      }
    })
  return <div> {translations.map((translation, i) =>
    <TranslationBrief showFirstParagraphs={i == 0}
                      showFirstAttachmentBelowCreditLine={i == 0}
                      showFirstAttachmentBelowHeadline={i != 0}
                      key={translation.id} translation={translation}/>)
}</div>
}
