import Link from "next/link";
import Image from "next/image";
import {prisma} from '@/app/lib/prisma'
import {translate} from '@/app/lib/translate'
import Attachment from "../../components/attachment/attachment";

export default async function ArticleView({id}) {
  const article = await prisma.articles.findUnique({where: {id}})
  const sections = await prisma.sections.findMany(
    {where: {article_id: id}}
  )
  const translations = await prisma.translations.findMany({
      where: {article_id: Number(id)},
      include: {llms: true},
      orderBy: {
        created_at: 'desc'
      },
    }
  )
  const attachments = await prisma.attachments.findMany({
      where: {article_id: Number(id)},
      select: {
        id: true,
        caption: true,
        size: true,
        width: true,
        height: true,
        alt_text: true
      },
    }
  )
  const createAttachmentUrl = `/articles/${id}/attachments/create-edit`
  return <div className="content">
    <h1>{article.original_title}</h1>
    <p>
      <i>{article.attribution}&nbsp;
        (<Link className="has-text-primary has-text-weight-bold" href={article.url}>
          {article.year}
        </Link>)
      </i>
    </p>

    <h3>Translations</h3>
    <div className={"block"}>
      <table>
      {translations.map(translation => {
        return <tr key={translation.id}>
          <td>
          <Link href={`/articles/${id}/translations/${translation.id}`} className="button">{translation.title}&nbsp;
            <span style={{
              color: 'lightgray',
              fontSize: 'smaller'
            }}>&nbsp; /  / </span></Link></td>
          <td>
            {new Date(translation.created_at).toDateString()}<br/>
            {new Date(translation.created_at).toTimeString()}
          </td>
          <td>
            {translation.llms.model}
          </td>
          <td>
            {translation.llms.type}
          </td>
          <td>
            {translation.generation_note}
          </td>
        </tr>
      })}
      </table>
      <h3>Attachments</h3>
      <p>
        <Link className={'button'} href={createAttachmentUrl}>Add attachment</Link>
      </p>
      {attachments.map(attachment => <Attachment key={attachment.id} attachment={attachment}/>)}
    </div>

    {sections.map(async (section) => {
        const paragraphs = await prisma.paragraphs.findMany(
          {where: {section_id: section.id}});
        return <>
          <h3>{section.title}</h3>
          {paragraphs.map(paragraph =>
            <div key={paragraph.id}>
              <h4>
                {paragraph.title}
              </h4>
              <p style={{marginBottom: 12}}>
                {paragraph.body}
              </p>
            </div>
          )}
        </>
      }
    )}
    <div className={"block"}>
      <Link className={"button"} href={`/articles/${id}/edit`}>Edit</Link>
    </div>
    <div className={"block"}>
      <Link className={"button"} href={`/articles/${id}/delete`}>Delete</Link>
    </div>
    <div className={"block"}>
      <Link className={"button"} href={`/articles/${id}/sections`}>View Sections</Link>
    </div>
  </div>
}
