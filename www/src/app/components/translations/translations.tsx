import styles from './translations.module.css'
import {prisma} from '@/app/lib/prisma'
import TranslationBrief from '@/app/components/translation-brief/translation-brief'

export default async function Translations(params: any) {
  const translations = await prisma.translations.findMany(
    {
      where: {NOT: {published_at:null}},
      orderBy: {published_at: "desc"},
      include: {
        llms: true,
        articles: {
          include: {
            attachments: {
              orderBy: {id: 'desc'},
              include: {
                translations: true
              }
            }
          }
        }
      }
    })
  return translations.map((translation,i) =>
    <TranslationBrief expanded={i==0} key={translation.id} translation={translation}/>)
}
