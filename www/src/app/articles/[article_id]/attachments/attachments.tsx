import {prisma} from '@/app/lib/prisma'
import Attachment from "@/app/models/attachment";
import Link from "next/link";

export default async function Attachments() {
  const attachments = await prisma.attachments.findMany()

  return <div className={'content'}>
    <h1 className={'title'}>Attachments</h1>
    {attachments.map(async (attachment, i) => {
      const src = `/file/${attachment.id}`
      const url = `/attachments/${attachment.id}`
      return <p key={"attachment-" + i}>
        <Link href={url}>
          <img src={src} style={{width: 200}}/><br/>
        </Link>
        {attachment.caption}
      </p>
    })}
  </div>
}
