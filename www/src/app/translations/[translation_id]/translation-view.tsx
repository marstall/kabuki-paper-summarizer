import TranslationViewClient from "@/app/components/translation-view-client/translation-view-client";
import _ from 'lodash'
import {loadTranslation} from '@/app/lib/load-translation'

export default async function TranslationView({translation_id}: any) {
  const translation = await loadTranslation(translation_id)
  if (!translation) return <div>Translation Not found</div>

  return <TranslationViewClient
    translation={translation}
    article={translation.articles}
    llm={translation.llms}
    promptTitle={_.get(translation, "prompts.title")}
    attachments={_.get(translation,'articles.attachments',[])}
  />

}
