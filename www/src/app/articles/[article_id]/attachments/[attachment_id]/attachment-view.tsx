import {prisma} from "@/app/lib/prisma";
import Link from "next/link";
import Attachment from "@/app/models/attachment";
import {redirect} from "next/navigation";
import {shortDate, shortDateTime} from "@/utils/date";
import Markdown from "@/app/components/markdown/markdown";
import Header from "@/app/components/header/header";

export default async function AttachmentView({attachment_id}: any) {

  const attachmentId = BigInt(attachment_id)

  const attachment = await prisma.attachments.findUnique(
    {
      where: {id: attachmentId},
      include: {
        translations: {
          include: {llms: true},
          orderBy: {created_at: 'desc'}
        }
      }
    })
  const article = await prisma.articles.findUnique({where: {id: attachment.article_id}})
  const numTranslations = await prisma.translations.count({where: {attachment_id: attachmentId}})
  const allowDeleteAttachment = numTranslations == 0

  async function deleteAllUnpublishedTranslations() {
    'use server'
    await prisma.translations.deleteMany({where: {attachment_id: attachmentId, published_at: null}})
    redirect(`/articles/${article.id}/attachments/${attachmentId}`)
  }

  async function deleteAttachment() {
    'use server'
    if (!allowDeleteAttachment) return;
    await prisma.attachments.delete({where: {id: attachmentId}})
    redirect(`/articles/${article.id}`)
  }

  async function toggleActive() {
    'use server'
    const isActive = attachment.active||false
    await prisma.attachments.update(
      {
        where: {id: attachmentId},
        data: {
          active:!isActive
        }
      }
    )
    redirect(`/articles/${article.id}/attachments/${attachmentId}`)
  }

  const imgUrl = `/file/${attachment.id}`
  const isActive = attachment.active||false
  return <div className={'content'}>
    <Header admin={true}/>

    <div className={'above-h1'}>{article.original_title}</div>
    <div className={'block'}>
      <h1 className={'title'}>Attachment</h1>
      <img src={imgUrl}/>
    </div>
    <div className={'block'}>
      <h4 className={'title'}>Original caption</h4>
      <Markdown text={attachment.caption}/>

    </div>
    <div className={'block'}>
      <h4 className={'title'}>Generated captions</h4>
      {attachment.translations.map((translation, i) => {
        return <div key={i} className={'content'}>
          <div style={{borderBottom: '1px dotted #ccc', marginBottom: 8}}><strong>
            <Link href={`/translations/${translation.id}/edit`}>
              {`translation ${translation.id}`}
            </Link>
            &nbsp;</strong>
            <span style={{color: '#999'}}>{translation.llms.model},&nbsp;
              {shortDateTime(translation.created_at)}</span>
            {translation.published_at &&
              <span style={{borderRadius: 4, padding: 4, margin: 4, backgroundColor: "#eee"}}>
              ✅&nbsp;published</span>}
          </div>
          <Markdown text={translation.body}/>
        </div>
      })}
    </div>
    <br/>
    <form action={toggleActive}>
      <button className={'button'} type={'submit'}>
        {isActive ? "Unpublish" : "Publish"}
      </button>
    </form>
    <br/>
    <form action={deleteAllUnpublishedTranslations}>
      <button className={'button is-danger'} type={'submit'}>
        Delete All unpublished translations for this Attachment
      </button>
    </form>
    <br/>
    <br/>
    <form action={deleteAttachment}>
      <button className={'button is-danger'} type={'submit'} disabled={!allowDeleteAttachment}>
        Delete Attachment
      </button>
    </form>
  </div>

}
