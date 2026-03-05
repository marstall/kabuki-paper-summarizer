import styles from './translation-brief.module.css'
import {firstParagraph} from "@/utils/text";
import Link from "next/link";
import Attachment from "@/app/components/attachment/attachment";
import {shortDate } from "@/utils/date";
import TranslationSentenceBySentence
  from "@/app/components/translation-sentence-by-sentence/translation-sentence-by-sentence";
import EditableText from "@/app/components/editable-text/editable-text";
import {isLocal} from "@/app/lib/misc";
function extractText(body) {
  return firstParagraph(body)
}

export default async function TranslationBrief({translation,expanded=false}) {
  const article = translation.articles;
  if (!article) return null;
  const attachment = article && article.attachments && article.attachments.length>0 ? article.attachments[0] : null
  const text = extractText(translation.body)

  return <div className={`${styles.container} ${expanded ? styles.expandedContainer : ''}`}>
    <div className={styles.supertitle}>
      <EditableText id={article.id} model='article' field="category">
        {article.category||translation.category}
      </EditableText>
    </div>
    <h1>
      {isLocal() ?
          <EditableText id={article.id} model='article' field="title">
            {article.title||translation.title}
          </EditableText>
        :
          <EditableText id={article.id} model='article' field="title">
            {article.title||translation.title}
          </EditableText>
      }

    </h1>
    <h2>
      <EditableText id={article.id} model='article' field="second_title">
      {article.second_title||translation.second_title}
      </EditableText>
    </h2>
    <div className={styles.dateline}>Written by {translation.llms.provider} AI. Edited by KabukiDadChris. Posted on {shortDate(translation.published_at)}.</div>

    {expanded && attachment && <div className={styles.attachment}>
      <Attachment article={article} attachment={attachment} allowMaximize={false} showCaption={false}/>
    </div>}
    {expanded && <div className={styles.text}>
      <TranslationSentenceBySentence translation={translation} numParagraphsToShow={4}/>
    </div>}
    <div className={styles.readMoreLink}>
      <Link href={`/translations/${translation.id}`}
            className={'button'}>Read more</Link>
    </div>
  </div>
}
