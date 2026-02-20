'use client'
import TranslationSentenceBySentence
  from "@/app/components/translation-sentence-by-sentence/translation-sentence-by-sentence"
import {shortDateTime} from "@/utils/date";
import Attachment from "@/app/components/attachment/attachment";
import NavTabs from "@/app/components/nav-panel/nav-tabs";
import {initialState,translationReducer, TranslationContext,TranslationDispatchContext} from "@/app/components/translation-view-client/translation-context";

import styles from './translation-view-client.module.css'
import {useContext, useReducer, useState} from "react";
import ClaimsTab from "@/app/components/claims-tab/claims-tab";
import OriginalTab from "@/app/components/original-tab/original-tab";



export default function TranslationViewClient({translation,article,llm,attachment,attachmentTranslation}) {
  const [tab,setTab] = useState(0)
  const [state,dispatch] = useReducer(translationReducer,initialState)

  return <TranslationContext value={state}>
    <TranslationDispatchContext value={dispatch}>
    <article>
      <header className="article-header">
        <div className={'article-supertitle'}>{translation.category}</div>
        <h1>{translation.title}</h1>
        <div className="dek">{translation.second_title}</div>
        <div className="byline"><p>This is an AI-generated plain-english version of the {article.year} article <span
          className={"article-link"}>&ldquo;<a
          href={article.url}>{article.original_title}</a>&rdquo;</span> by {article.attribution.trim()}.
          llm:&nbsp;{llm.id} {llm.provider} {llm.model} {llm.type},
          note:&nbsp;{translation.generation_note},
          generated:&nbsp;{shortDateTime(translation.created_at)}
        </p>
        </div>
      </header>
      <div className="article-body">
        <Attachment key={attachment.id} attachment={attachment} attachmentTranslation={attachmentTranslation}/>
        <NavTabs/>
        {state.selectedTab===0 &&
          <TranslationSentenceBySentence article={article} translation={translation} llm={llm}
                                         attachment={attachment} attachmentTranslation={attachmentTranslation}/>}
        {state.selectedTab==1 && <ClaimsTab article={article} translation={translation}/>}
        {state.selectedTab==2 && <OriginalTab article={article} translation={translation}/>}
      </div>
    </article>
    </TranslationDispatchContext>
  </TranslationContext>
}
