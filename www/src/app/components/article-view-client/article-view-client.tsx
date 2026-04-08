'use client'

import styles from './article-view-client.module.css'
import Link from "next/link";
import Image from "next/image";
import {translate} from '@/app/lib/translate'
import Attachment from "../../components/attachment/attachment";
import _ from 'lodash'
import {prisma} from "@/app/lib/prisma";
import {redirect} from "next/navigation";
import {shortDateTime} from "@/utils/date";
import {useState} from "react";

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

function generateClaimsDescription(article) {
  const claims = article?.claims
  if (_.isEmpty(claims)) {
    return "no claims"
  }
  if (!claims) return "no claims"
  const claimTexts =  claims.claims.map(claim=>claim.claim)
  return <><ul>
  {claimTexts.slice(0,2).map((t,i)=><li key={i}>{t}</li>)}
  </ul>
  <div>
  ... and {claimTexts.length-2} others
    </div>
  </>
}

export default function ArticleViewClient({
                                            article,
                                            generateElement,
                                            deleteArticleAction,
                                            deleteAllUnpublishedTranslationsAction,
                                            deleteAllUnpublishedAttachmentsAction
                                          }) {
  const deleteDisabled = !(_.isEmpty(article.translations)
    && _.isEmpty(article.sections) && _.isEmpty(article.attachments))
  const createAttachmentUrl = `/articles/${article.id}/attachments/create-edit`
  const [generating,setGenerating] = useState(false)

  function performElementGeneration(elementName,llmName="claude",params={}) {

    console.log("performElementGeneration")
    document.querySelectorAll("button").forEach(b=>b.disabled=true)
    setTimeout(async ()=>{
      // setGenerating(true);
      await generateElement(elementName,llmName,params)
      // setGenerating(false);
      document.querySelectorAll("button").forEach(b=>b.disabled=false)
    },0)
  }


  const claimsDescription = generating ? "..." : generateClaimsDescription(article)
  return <div className="content">
    <h1>{article.original_title}</h1>
    <p>
      <i>{article.attribution}&nbsp;
        ({article.url && <Link className="has-text-primary has-text-weight-bold"
                               href={article.url}>
          {article.year}
        </Link>})
      </i>
    </p>
    <hr/>
    <h3>Claims</h3>
    <div className={'block'}>
      {claimsDescription}
      {_.isEmpty(article.claims) && <>
        <br/>
        <form action={() => performElementGeneration("claims")}>
          <button disabled={generating} className={"button"} type={'submit'}>
            {generating ? "generating ... " : "Generate claims"}
          </button>
        </form>
      </>
      }

    </div>
    <h3>Translations</h3>
    <div className={"block"}>
      {!article.translations || article.translations.length == 0
        && <div>no translations.</div>}

      <table className={styles.noWrapTable}>
        <tbody>
        {!_.isEmpty(article.translations) &&
          <tr>
            <th>title</th>
            <th>created</th>
            <th>published</th>
            <th>model</th>
            <th>prompt</th>
            <th>generation</th>
          </tr>}
        {article.translations.map(translation => {
          return <tr key={translation.id}>
            <td>
              {translation.title || article.title}<br/>
              <Link href={`/translations/${translation.id}`}
              >View
              </Link>
              &nbsp;<Link href={`/translations/${translation.id}/edit`}
            >Edit
            </Link>
            </td>
            <td>
              {shortDateTime(new Date(translation.created_at))}
            </td>
            <td>
              {translation.published_at
                && shortDateTime(new Date(translation.published_at))}
            </td>
            <td>
              {translation.llms.model}
            </td>
            <td>
              {translation.prompts?.title}
            </td>
            <td>
              {translation.generation
                && <Link href={`/generations/${translation.generation}`}>
                  {translation.generation}
                </Link>}
              <br/>
              {translation.generation_note}
            </td>
          </tr>
        })}
        </tbody>
      </table>
      {!_.isEmpty(article.claims) &&
        <form action={()=>performElementGeneration("article-translation","claude","eli5 with 3 examples refined")}>
          <button disabled={generating} className={"button"} type={'submit'}>
            {generating ? "generating ... " : "Generate Translation"}
          </button>
        </form>
      }
      <hr/>
      {!_.isEmpty(article.translations) &&
        <>
          <form action={() => performElementGeneration("headlines","claude",{translationId:article.translations[0].id})}>
            <button disabled={generating} className={"button"} type={'submit'}>
              {generating ? "generating ... " : "Generate Headlines"}
            </button>
          </form>
          <br/>
          <>
            <form action={() => performElementGeneration("chat-exchange-panel-attachments","claude",{prompt:"comic book 1"})}>
              <button disabled={generating} className={"button"} type={'submit'}>
                {generating ? "generating ... " : "Generate Chat Exchange Attachments"}
              </button>
            </form>
            <hr/>
          </>

        </>

      }
      {!_.isEmpty(article.translations) &&
        <>
          <form action={deleteAllUnpublishedTranslationsAction}>
            <button className={"button is-danger"} type={'submit'}>
              Delete All unpublished translations for this Article
            </button>
          </form>
          <hr/>
        </>
      }
      <h3>Attachments</h3>
      {!article.attachments || article.attachments.length == 0 &&
        <div className={'block'}>no attachments.</div>}
      {article.attachments.map(attachment =>
        <Link key={attachment.id}
              href={`/articles/${article.id}/attachments/${attachment.id}`}>
          <Attachment article={article} attachment={attachment} allowMaximize={false} showCaption={false}/>
        </Link>
      )}
      <br/>
      <br/>
      <p>
        <Link className={'button'} href={createAttachmentUrl}>
          Add attachment</Link>
      </p>
      {!_.isEmpty(article.attachments) &&
        <>
          <>
            <form action={deleteAllUnpublishedAttachmentsAction}>
              <button className={"button is-danger"} type={'submit'}>
                Delete All unpublished attachments for this Article
              </button>
            </form>
            <br/>
            <form action={() => {
              return deleteAllUnpublishedAttachmentsAction("component")
            }}>
              <button className={"button is-danger"} type={'submit'}>
                Delete All unpublished component-type attachments for this Article
              </button>
            </form>
            <hr/>
          </>
        </>
      }
    </div>
    <hr/>
    <div className={"block"}>
      <Link className={"button"} href={`/articles/${article.id}/sections`}>
        View Sections</Link>
    </div>
    <hr/>
    {article.sections.map((section) => {
      return <div key={section.id}>
        <h3>{section.title}</h3>
        <Section section={section}/>
      </div>
    })}
    <div className={"block"}>
      <Link className={"button"} href={`/articles/${article.id}/edit`}>
        Edit</Link>
    </div>
    <div className={"block"}>
      <form action={deleteArticleAction}>
        <button disabled={deleteDisabled} className={"button is-danger"}
                type={'submit'}>Delete
        </button>
      </form>
    </div>
  </div>
}
