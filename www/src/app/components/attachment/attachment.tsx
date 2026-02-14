import Link from 'next/link'
import Image from 'next/image'

export default function Attachment({attachment}) {
  const url = '/file/' + attachment.id
  return <div key={attachment.id}>
    <Link href={`/articles/${attachment.article_id}/attachments/${attachment.id}`} className="button">
      <Image alt={attachment.alt_text} src={url} width={attachment.width} height={attachment.height}/>
    </Link>
    <br/>
    <div style={{fontSize: 'smaller', fontStyle: 'italic'}}>
      {attachment.caption}
    </div>
  </div>
}
