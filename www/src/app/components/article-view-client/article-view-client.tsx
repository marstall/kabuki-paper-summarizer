'use client'

import styles from './article-view-client.module.css'
import Link from "next/link";
import Attachment from "../../components/attachment/attachment";
import _ from 'lodash'
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


export default function ArticleViewClient({
    article,
    llms,
    generateElement,
    deleteArticleAction,
    deleteAllUnpublishedTranslationsAction,
    deleteAllUnpublishedAttachmentsAction,
    deleteClaimsAction
}) {
    const [response, setResponse] = useState("")
    const [claimsLimit, setClaimsLimit] = useState(2);
    const [activeLlm, setActiveLlm] = useState("claude-haiku-latest")


    function toggleClaimsLimit() {
        setClaimsLimit(claimsLimit ? null : 2)
    }

    function LlmPicker() {
        return <select className='select' name={'llm'} value={activeLlm}
                       onChange={e => setActiveLlm(e.target.value)}>
            {llms.map(llm => {
                    return <option value={llm.name} key={llm.id}>{llm.name}</option>
                }
            )}</select>
    }

    function generateClaimsDescription(article) {
        const claims = article?.claims
        if (_.isEmpty(claims)) {
            return "no claims"
        }
        if (!claims) return "no claims"
        let claimTexts = claims.claims.map(claim => claim.claim)
        const claimCount = claimTexts.length;
        if (claimsLimit) claimTexts = claimTexts.slice(0, claimsLimit)
        return <>
            <ul>
                {claimTexts.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
            <div>
                ... and {claimCount - claimsLimit} others
            </div>
            <div><br/>
                <a className={'button'} href={'#'}
                   onClick={toggleClaimsLimit}>{claimsLimit ? 'Show all claims' : 'Show fewer claims'}</a>
            </div>
        </>
    }

    const deleteDisabled = !(_.isEmpty(article.translations)
        && _.isEmpty(article.sections) && _.isEmpty(article.attachments))
    const createAttachmentUrl = `/articles/${article.id}/attachments/create-edit`
    const [generating, setGenerating] = useState(false)

    function performElementGeneration(elementName, params = {}) {
        console.log(`performElementGeneration,activeLlm: ${activeLlm}`)
        document.querySelectorAll("button").forEach(b => b.disabled = true)
        setTimeout(async () => {
            // setGenerating(true);
            const response = await generateElement(elementName, activeLlm, params)
            let started = false;
            let stopped = false;
            const completeResponseText = ""
            for await (const messageStreamEvent of response) {
                switch (messageStreamEvent.type) {
                    case 'content_block_delta':
                        if (started) {
                            const text = messageStreamEvent.delta.text
                            console.log(text)
                            setResponse(r => r + text)
                        }
                        break;
                    case 'content_block_start':
                        console.log("received content_block_start")
                        started = true;
                        break;
                    case 'message_start':
                        console.log("received message_start")
                        break;
                    //started=true;
                    case 'content_block_stop':
                        console.log("received content_block_stop")
                        stopped = true;
                        break;
                    default:
                        console.log("unknown type: " + messageStreamEvent.type)
                }
            }
            // setGenerating(false);
            document.querySelectorAll("button").forEach(b => b.disabled = false)
        }, 0)
    }

    const hasClaims = !_.isEmpty(article.claims)
    const claimsDescription = generating ? "..." : generateClaimsDescription(article)
    return <div className="content">
        <h1>{article.original_title}</h1>
        <p>
            <i>{article.attribution}&nbsp;
                ({article.url &&
                    <Link className="has-text-primary has-text-weight-bold"
                          href={article.url}>
                        {article.year}
                    </Link>})
            </i>
        </p>
        <div className={"block"}>
            <Link className={"button"} href={`/generate/${article.id}`}>
                Generate article elements</Link>
        </div>
        <hr/>
        <h3>Active Llm</h3>
        <div className={'block'}>
            <LlmPicker/>
        </div>
        <h3>Claims</h3>
        <div className={'block'}>
            <div className={'block'}>
                {response}
            </div>
            {claimsDescription}
            <br/>
            <br/>
            <p>
                <Link className={"button"}
                      href={`/generate/${article.id}?generator=claims`}>
                    {hasClaims ? 'Reg' : 'G'}enerate claims</Link>
            </p>
            <div>
                {hasClaims &&
                    <>
                        <br/>
                        <form action={deleteClaimsAction}>
                            <button className={"button is-danger"}
                                    type={'submit'}>
                                Delete Claims
                            </button>
                        </form>
                    </>
                }
            </div>
            <hr/>


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
                            &nbsp;<Link
                            href={`/translations/${translation.id}/edit`}
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
                                && <Link
                                    href={`/multiversions/${translation.generation}`}>
                                    {translation.generation}
                                </Link>}
                            <br/>
                            {translation.generation_note}
                        </td>
                    </tr>
                })}
                </tbody>
            </table>
            <p>
                <Link className={"button"}
                      href={`/generate/${article.id}?generator=article-translation`}>
                    Generate translation
                </Link>
            </p>
            <hr/>
            {!_.isEmpty(article.translations) &&
                <>
                    <form
                        action={() => performElementGeneration("headlines", {translationId: article.translations[0].id})}>
                        <button disabled={generating} className={"button"}
                                type={'submit'}>
                            {generating ? "generating ... " : "Generate Headlines"}
                        </button>
                    </form>
                    <br/>
                    <>
                        <form
                            action={() => performElementGeneration("chat-exchange-panel-attachments", {prompt: "comic book 1"})}>
                            <button disabled={generating} className={"button"}
                                    type={'submit'}>
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
                    <Attachment article={article} attachment={attachment}
                                allowMaximize={false} showCaption={false}/>
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
                            <button className={"button is-danger"}
                                    type={'submit'}>
                                Delete All unpublished attachments for this
                                Article
                            </button>
                        </form>
                        <br/>
                        <form action={() => {
                            return deleteAllUnpublishedAttachmentsAction("component")
                        }}>
                            <button className={"button is-danger"}
                                    type={'submit'}>
                                Delete All unpublished component-type
                                attachments for this Article
                            </button>
                        </form>
                        <hr/>
                    </>
                </>
            }
        </div>
        <hr/>
        <div className={"block"}>
            <Link className={"button"}
                  href={`/articles/${article.id}/sections`}>
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
