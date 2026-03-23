import styles from './translation-brief.module.css'
import {firstParagraph} from "@/utils/text";
import Link from "next/link";
import Attachment from "@/app/components/attachment/attachment";
import {shortDate} from "@/utils/date";
import TranslationSentenceBySentence
  from "@/app/components/translation-sentence-by-sentence/translation-sentence-by-sentence";
import EditableText from "@/app/components/editable-text/editable-text";
import {isLocal} from "@/app/lib/misc";

function extractText(body) {
  return firstParagraph(body)
}

export default async function TranslationBrief({
                                                 translation,
                                                 showFirstAttachmentBelowHeadline = false,
                                                 showFirstAttachmentBelowCreditLine = false,
                                                 showFirstParagraphs = false
                                               }) {
  const article = translation.articles;
  if (!article) return null;
  const attachment = article && article.attachments && article.attachments.length > 0 ? article.attachments[0] : null
  const text = extractText(translation.body)

  return <article className={styles.superContainer}>
    <header className="article-header">
      <div className={styles.supertitle} style={{fontSize: '14px', lineHeight: '0.5'}}>
        <EditableText id={article.id} model='article' field="category">
          {article.category || translation.category}
        </EditableText>
      </div>
      <h1 style={{fontSize: '34px'}}>
        {isLocal() ?
          <EditableText id={article.id} model='article' field="title">
            {article.title || translation.title}
          </EditableText>
          :
          <Link href={`/translations/${translation.id}`}>
            {article.title || translation.title}
          </Link>
        }
      </h1>
      {showFirstAttachmentBelowHeadline && attachment && <div className={styles.attachment}>
        <Attachment article={article} attachment={attachment} allowMaximize={false} showCaption={false}/>
      </div>}
      <h2>
        <EditableText id={article.id} model='article' field="second_title">
          {article.second_title || translation.second_title}
        </EditableText>
      </h2>
      <div className={styles.dateline}>Written by {translation.llms.provider} AI. Edited by <a
        href={'https://www.linkedin.com/in/chrismarstall/'}>KabukiDadChris</a>. Posted
        on {shortDate(translation.published_at)}.
      </div>
      {showFirstAttachmentBelowCreditLine && attachment && <div className={styles.attachment}>
        <Attachment article={article} attachment={attachment} allowMaximize={false} showCaption={false}/>
      </div>}

      {showFirstParagraphs && <div className={styles.text}>
        <TranslationSentenceBySentence translation={{
          body: translation.body,
          claims: translation.claims
        }} showSubscribeForm={false} numParagraphsToShow={4}/>
      </div>}
      <div className={styles.readMoreLink}>
        <Link href={`/translations/${translation.id}`}
              className={'button'}>Read more</Link>
      </div>
    </header>
  </article>
}
