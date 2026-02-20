'use client'

import styles from './article-view-client.module.css'
import Link from "next/link";
import Image from "next/image";
import {translate} from '@/app/lib/translate'
import Attachment from "../../components/attachment/attachment";


function Section({section}) {
  return section.paragraphs.map(paragraph =>
    <div key={paragraph.id}>
      <h4>
        {paragraph.title}
      </h4>
      <p style={{marginBottom: 12}}>
        {paragraph.body}
      </p>
    </div>
  )
}

export default function ArticleViewClient({article}) {
  const createAttachmentUrl = `/articles/${article.id}/attachments/create-edit`
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
        <tbody>
        {article.translations.map(translation => {
          return <tr key={translation.id}>
            <td>
              <Link href={`/articles/${article.id}/translations/${translation.id}`} className="button">{translation.title}&nbsp;
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
        </tbody>
      </table>
      <h3>Attachments</h3>
      <p>
        <Link className={'button'} href={createAttachmentUrl}>Add attachment</Link>
      </p>
      {article.attachments.map(attachment => <Attachment key={attachment.id} attachment={attachment}/>)}
    </div>

    {article.sections.map((section) => {
      return <>
        <h3>{section.title}</h3>
        <Section section={section}/>
      </>
    })}
    <div className={"block"}>
      <Link className={"button"} href={`/articles/${article.id}/edit`}>Edit</Link>
    </div>
    <div className={"block"}>
      <Link className={"button"} href={`/articles/${article.id}/delete`}>Delete</Link>
    </div>
    <div className={"block"}>
      <Link className={"button"} href={`/articles/${article.id}/sections`}>View Sections</Link>
    </div>
  </div>}
