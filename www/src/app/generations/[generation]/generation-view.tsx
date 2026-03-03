import {prisma} from "@/app/lib/prisma";
import {shortDateTime} from "@/utils/date";
import TranslationViewClient from "@/app/components/translation-view-client/translation-view-client";
import TranslationView from "@/app/translations/[translation_id]/translation-view";
import Link from "next/link";

export default async function GenerationView(params) {
  const {generation} = params;
  const translations = await prisma.translations.findMany({
      where: {
        generation,
        NOT: {article_id: null}
      }, include: {
        articles: true
    }
    }
  )
  const article = translations[0]?.articles
  if (!article) {
    return <div>article not found</div>
  }
  return <div className={'content'}>
    <h1 className={'title'}> generation: {generation} {article.original_title} ({article.id})</h1>
    {translations.map((translation) => {
      return <div style={{padding:'1rem',marginBottom:'1rem',border:"4px dashed lightblue"}}>
        <div className={'title'}>
          <Link href={`/translations/${translation.id}/edit`}>translation id {translation.id}</Link>
        </div>
        <TranslationView translation_id={translation.id}/>
      </div>
    })
    }
  </div>
}
