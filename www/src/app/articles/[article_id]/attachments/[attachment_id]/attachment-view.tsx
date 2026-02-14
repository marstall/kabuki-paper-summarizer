import {prisma} from "@/app/lib/prisma";
import Link from "next/link";
import Attachment from "@/app/models/attachment";

export default async function AttachmentView({attachment_id}: any) {
  const attachment = await prisma.attachments.findUnique({where: {id: attachment_id}})
  const article = await prisma.articles.findUnique({where: {id: attachment.article_id}})
  const imgUrl = `/file/${attachment.id}`
  return <div className={'content'}>
    <div className={'above-h1'}>{article.original_title}</div>
    <h1 className={'title'}>Attachment</h1>
    <img src={imgUrl}/>
    <p>
      {attachment.caption}
    </p>
  </div>

}
