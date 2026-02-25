'use client'
import styles from './translation.module.css'
import {firstParagraph} from "@/utils/text";
import Link from "next/link";
import Attachment from "@/app/components/attachment/attachment";

function extractText(body) {
  return firstParagraph(body)
}

export default function Translation({translation}) {
  const article = translation.articles;
  if (!article) return null;
  const attachment = article && article.attachments && article.attachments.length>0 ? article.attachments[0] : null
  const text = extractText(translation.body)

  return <div className={styles.container}>
    <div className={styles.title}>{translation.title}</div>
    <div className={styles.text}>{text}</div>
    {attachment && <div className={styles.attachment}>
      <Attachment attachment={attachment}/>
    </div>}
    <div className={styles.readMoreLink}>
      <Link href={`/articles/${article.id}/translations/${translation.id}`}
            className={'button'}>Read more</Link>
    </div>
  </div>
}
