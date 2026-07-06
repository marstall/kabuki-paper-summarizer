'use client'
import styles from './generate-client.module.css'
import LlmPickerClient from "@/app/components/llm-picker/llm-picker-client";
import {useEffect, useState} from "react";
import ArticlePickerClient
    from "@/app/components/article-picker/article-picker-client";
import StatefulPicker from "@/app/components/stateful-picker/stateful-picker";
import {saveElement} from "@/app/lib/generation/generate_element";
import {redirect} from "next/navigation";
import {parse as parsePartialJson} from 'partial-json';
import TranslationPickerClient
    from "@/app/components/translation-picker/translation-picker-client";
import TranslationViewClient
    from "@/app/components/translation-view-client/translation-view-client";

function ClaimsLiveRenderer({response: responses}) {
    return responses ? responses.map((response, i) => {
        if (response) {
            const json = parsePartialJson(response);
            const numClaims = json?.claims?.length
            return <div className={styles.claimSet} key={i}>
                <ol className={styles.claimsContainer}>
                    {json?.claims?.map((c, i) => <li className={styles.claim}
                                                     key={i}>{c['claim']}</li>)}
                </ol>
            </div>
        }
    }) : "null responses"
}

function ArticleTranslationLiveRenderer({
    article,
    translation,
    llmName,
    response: responses
}) {
    const _response = responses[0]
    let _translation = translation ? {...translation} : null
    //return <pre>{"fox and the \r\n confessor"}</pre>
    console.log({ArticleTranslationLiveRendererArticle: article})
    // add headlines if they were part of the response
    if (_translation) { // if the translation is here, it means it was
        // selected in the dropdown and we're probably generating another
        // piece of translation-dependent metadata,

        // like headlines
        try {
            const responseJSON = parsePartialJson(_response);
            if (responseJSON['hed']) _translation.title = responseJSON['hed']
            if (responseJSON['dek']) _translation.second_title = responseJSON['dek']

            // or chat-exchange-panels
            if (responseJSON['panels']) {
                _translation.attachments = responseJSON['panels'].map((panel, i) => {
                    return {
                        llm_id: llmName,
                        type: 'component',
                        component: 'chat-exchange-panel',
                        params: panel,
                        article_id: article.id,
                        order: i,
                        active: true
                    }
                })
            }
        } catch (e) {

        }
    }
    else {
        _translation = {
            body: _response,
            claims: article.claims,
            article
        }
    }
    return article && <TranslationViewClient
        showHeader={false}
        translation={_translation}
        article={article}
        llm={llmName}
        promptTitle={"prompt"}
        showAttachmentCaptions={false}
        //attachments={_.get(translation,'articles.attachments',[])}
        attachments={_translation.attachments}
    />
    // return <article>
    //     <div className={styles.articleTranslation}>
    //         <Markdown text={response[0]}/>
    //     </div>
    // </article>
}

function LiveRenderer(params) {
    const LiveRendererMap = {
        "headlines": ArticleTranslationLiveRenderer,
        "claims": ClaimsLiveRenderer,
        "article-translation": ArticleTranslationLiveRenderer,
        "chat-exchange-panel-attachments": ArticleTranslationLiveRenderer
    }
    const Component = LiveRendererMap[params['generatorName']]
    return <Component {...params}/>
}

export default function GenerateClient(params) {
    const {generateElement} = params;
    const [llmName, setLlmName] = useState(params['llm'] || "deepseek")
    const [article, setArticle] = useState(params['article'])
    const [translation, setTranslation] = useState(params['translation'])
    const [generatorName, setGeneratorName] = useState(params['generator'] || "article-translation")
    const [generationState, setGenerationState] = useState("ready")
    const [responses, setResponses] = useState([])
    const [thinking, setThinking] = useState("")
    const [stream, setStream] = useState(true)
    const [finalResponse, setFinalResponse] = useState("")
    const saveButtonDisabled = generationState !== 'complete'
    const generateButtonDisabled = !article

    useEffect(() => {
        console.log("useEffect, generationSstate is:", generationState)
        if (generationState === 'complete') {
            console.log("generationState=complete")

            setResponses([])
            if (responses.length === 1) {
                console.log("setting final response w length 1")
                setFinalResponse(responses[0])
            }
            else {
                let reference_id = 0
                const claims = responses.reduce((acc, response) => {
                    try {
                        const json = JSON.parse(response)
                        const claims = json.claims.map((claim) => ({
                            ...claim,
                            reference_id: reference_id++
                        }))
                        return [...acc, ...claims]
                    } catch (e) {
                        const errorString = "fatal error parse response json"
                        console.log(errorString, e)
                        //window.alert(errorString)
                    }
                }, [])
                console.log("setting final response w length> 1,", claims)
                setFinalResponse(JSON.stringify({claims}))
            }
        }
    }, [generationState])

    useEffect(() => {
        setFinalResponse("")
        setResponses([])
    }, [translation, generatorName, article, llmName]);

    async function runSaveElement() {
        await saveElement(generatorName, llmName, finalResponse, {
            translationId: translation?.id,
            articleId: article.id
        })
        redirect("/articles/" + article.id)
    }

    async function runGenerateElement() {
        setResponses([])
        setFinalResponse("")
        setGenerationState(`sent request to ${llmName}`)
        setTimeout(async () => {
            const response = await generateElement(generatorName, llmName, {
                articleId: article.id,
                translationId: translation?.id,
                stream
            })

            const responses = Array.isArray(response) ? response : [response];

            setGenerationState("response received");
            if (stream) {
                setGenerationState("streaming");
                await Promise.all(responses.map(async (stream, streamId) => {
                    for await (const event of stream) {
                        processStreamEvent(event, streamId)
                    }
                }))

                setGenerationState("complete");
            }
            else {
                setGenerationState("complete")
                setResponses([response.answer || response])
                return;
            }
        }, 10)
    }

    function processStreamEvent(messageStreamEvent, streamId) {
        const type = messageStreamEvent.type || messageStreamEvent.object // openai uses object
        switch (type) {
            case 'content_block_delta': // claude uses this one
                if (messageStreamEvent.delta.type === 'thinking_delta') { // minimax does this
                    const text = messageStreamEvent.delta.thinking
                    console.log("thinking:" + text)
                    setThinking(r => r + text)
                }
                else {
                    const text = messageStreamEvent.delta.text
                    if (text && text !== 'undefined') {
                        setThinking("")
                        console.log(text)
                        setResponses(r => {
                            const newResponses = [...r]
                            newResponses[streamId] ||= ""
                            newResponses[streamId] = newResponses[streamId] + text
                            newResponses[streamId] = newResponses[streamId].replace(/json|```json|```/g, '');
                            return newResponses;
                        })
                    }
                }
                break;
            case 'chat.completion.chunk': // openai uses this one
                const text = messageStreamEvent.choices[0].delta.content
                if (text && text !== 'undefined') {
                    setThinking("")
                    setResponses(r => {
                        const newResponses = [...r]
                        newResponses[streamId] ||= ""
                        newResponses[streamId] = newResponses[streamId] + text
                        newResponses[streamId] = newResponses[streamId].replace(/json|```json|```/g, '');
                        return newResponses;
                    })
                }
                break;
            case 'content_block_start':
                console.log("received content_block_start")
                break;
            case 'message_start':
                console.log("received message_start")
                break;
            //started=true;
            case 'content_block_stop':
                console.log("received content_block_stop")
                break;
            case 'message_stop':
                console.log("received message_stop")
                break;
            default:
                console.log("unknown type: " + messageStreamEvent.type)
        }
    }

    const bytesReceived = responses.reduce((acc, response) => acc += response?.length, 0) || finalResponse.length
    return <div className='content'>
        <div className="field">
            <label className="label">LLM</label>
            <div className="control">
                <LlmPickerClient llmName={llmName} setLlmName={setLlmName}/>
            </div>
        </div>
        <div className="field">
            <label className="label">Article</label>
            <div className="control">
                <ArticlePickerClient
                    articleId={article?.id}
                    setArticle={(article) => setArticle(article)}/>
                {article && <div className={styles.pills}>
                    <div className={styles.pill}>
                        claims: {article?.claims?.claims?.length || 0}
                    </div>
                    <div className={styles.pill}>
                        attachments: {article.attachments?.length || 0}
                    </div>
                </div>}
            </div>
        </div>
        {article && <div className="field">
            <label className="label">Translation</label>
            <div className="control">
                <TranslationPickerClient
                    articleId={article.id}
                    translationId={translation?.id}
                    setTranslation={setTranslation}/>
            </div>
        </div>}
        <div className="field">
            <label className="label">Generator</label>
            <div className="control">
                <StatefulPicker
                    values={[
                        "",
                        "headlines",
                        "claims",
                        "article-translation",
                        "chat-exchange-panel-attachments"
                    ]}
                    value={generatorName}
                    setter={setGeneratorName}
                />
            </div>
        </div>
        <div className={styles.checkboxContainer}>
            <input onChange={() => setStream(s => !s)}
                   checked={stream}
                   className='checkbox'
                   type='checkbox'/><span>stream response</span>
        </div>

        <div className={styles.buttonsContainer}>
            <form action={runGenerateElement}>
                <button disabled={generateButtonDisabled} className={"button"}
                        type={'submit'}>
                    Generate
                </button>
            </form>
            <form action={runSaveElement}>
                <button disabled={saveButtonDisabled} className={"button"}
                        type={'submit'}>
                    Save
                </button>
            </form>
        </div>
        <div className={styles.tinykeyval}>
            <span>state</span> <span>{generationState} ({bytesReceived} bytes received)</span>
        </div>
        <div className={styles.thinking}>
            {thinking}
        </div>
        <div className={styles.response}>
            {responses && responses.length > 0 &&
                <LiveRenderer generatorName={generatorName}
                              article={article}
                              translation={translation}
                              llmName={llmName}
                              response={responses}/>}
        </div>
        <div className={styles.finalResponse}>
            {finalResponse && finalResponse.length > 0 &&
                <LiveRenderer generatorName={generatorName}
                              translation={translation}
                              article={article}
                              llmName={llmName}
                              response={[finalResponse]}/>}
        </div>

    </div>
}
