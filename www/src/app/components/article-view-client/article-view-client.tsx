'use client'

import styles from './article-view-client.module.css'
import Link from "next/link";
import Image from "next/image";
import {translate} from '@/app/lib/translate'
import Attachment from "../../components/attachment/attachment";
import _ from 'lodash'

function Section({section}) {
  return section.paragraphs.map(paragraph =>
    <div key={paragraph.id}>
      <div>
        <b>
          {paragraph.title}
        </b>
      </div>
      <p style={{marginBottom: 12}}>
        {paragraph.body}
      </p>
    </div>
  )
}

export default function ArticleViewClient({article}) {

  const deleteDisabled = !(_.isEmpty(article.translations) && _.isEmpty(article.sections) && _.isEmpty(article.attachments))
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
    <hr/>

    <h3>Translations</h3>
    <div className={"block"}>
      {!article.translations || article.translations.length == 0 && <div>no translations.</div>}

      <table>
        <tbody>
        {article.translations.map(translation => {
          return <tr key={translation.id}>
            <td>
              <Link href={`/articles/${article.id}/translations/${translation.id}`}
                    className="button">{translation.title}&nbsp;
                <span style={{
                  color: 'lightgray',
                  fontSize: 'smaller'
                }}></span></Link></td>
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
              {translation.generation && <Link href={`/generations/${translation.generation}`}>
                {translation.generation}
              </Link>}
              <br/>
              {translation.generation_note}
            </td>
          </tr>
        })}
        </tbody>
      </table>
      <hr/>
      <h3>Attachments</h3>
      {!article.attachments || article.attachments.length == 0 && <div className={'block'}>no attachments.</div>}
      {article.attachments.map(attachment =>
        <Link key={attachment.id} href={`/articles/${article.id}/attachments/${attachment.id}`}>
          <Image alt={attachment.alt_text} src={`/file/${attachment.id}`} width={attachment.width} height={attachment.height}/>
        </Link>
      )}
      <br/>
      <br/>
      <p>
        <Link className={'button'} href={createAttachmentUrl}>Add attachment</Link>
      </p>
    </div>
    <hr/>
    <div className={"block"}>
      <Link className={"button"} href={`/articles/${article.id}/sections`}>View Sections</Link>
    </div>
    <hr/>
    {article.sections.map((section) => {
      return <div key={section.id}>
        <h3>{section.title}</h3>
        <Section section={section}/>
      </div>
    })}
    <div className={"block"}>
      <Link className={"button"} href={`/articles/${article.id}/edit`}>Edit</Link>
    </div>
    <div className={"block"}>

      <Link disabled={deleteDisabled} className={"button"} href={`/articles/${article.id}/delete`}>Delete</Link>
    </div>
  </div>
}
