import Link from 'next/link'
import Image from 'next/image'
import styles from './attachment.module.css'

export default function Attachment({attachment, allowEdit = false}) {
  const url = '/file/' + attachment.id
  return <div className={styles.container} key={attachment.id}>
    {allowEdit ?
      <Link href={`/articles/${attachment.article_id}/attachments/${attachment.id}`} className="button">
        <Image alt={attachment.alt_text} src={url} width={attachment.width} height={attachment.height}/>
      </Link>
      :
      <div className={styles.image}>
      <Image alt={attachment.alt_text} src={url} width={attachment.width} height={attachment.height}/>
      </div>
    }
    <div className={styles.caption}>
      {attachment.caption}
    </div>
  </div>
}
