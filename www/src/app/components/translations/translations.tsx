import styles from './translations.module.css'
import {prisma} from '@/app/lib/prisma'
import Translation from '@/app/components/translation/translation'

export default async function Translations(params: any) {
  const translations = await prisma.translations.findMany(
    {
      where: {NOT: {published_at:null}},
      orderBy: {published_at: "desc"},
      include: {
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
  return translations.map(translation => <Translation key={translation.id} translation={translation}/>)
}
