import {prisma} from '@/app/lib/prisma'
import AnnotatedParagraph from "@/app/components/annotated-paragraph/annotated-paragraph";
import TranslationViewClient from "@/app/articles/[article_id]/translations/[translation_id]/translation-view-client";


export default async function TranslationView({translation_id}: any) {
  const translation = await prisma.translations.findUnique({where: {id: translation_id}})
  if (!translation) return <div>Translation Not found</div>
  return <TranslationViewClient translation={translation}/>
}
