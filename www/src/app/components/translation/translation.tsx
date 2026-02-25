import styles from './translation.module.css'
import {firstParagraph} from "@/utils/text";
import Link from "next/link";
import Attachment from "@/app/components/attachment/attachment";
import {shortDate } from "@/utils/date";

function extractText(body) {
  return firstParagraph(body)
}

export default function Translation({translation}) {
  const article = translation.articles;
  if (!article) return null;
  const attachment = article && article.attachments && article.attachments.length>0 ? article.attachments[0] : null
  const text = extractText(translation.body)

  return <div className={styles.container}>
    <div className={styles.supertitle}>{translation.category}</div>
    <h1>{translation.title}</h1>
    <div className={styles.dateline}>Posted on {shortDate(translation.published_at)}</div>
    {attachment && <div className={styles.attachment}>
      <Attachment attachment={attachment} allowMaximize={false} showCaption={false}/>
    </div>}
    <div className={styles.text}>{text}</div>
    <div className={styles.readMoreLink}>
      <Link href={`/articles/${article.id}/translations/${translation.id}`}
            className={'button'}>Read more</Link>
    </div>
  </div>
}
