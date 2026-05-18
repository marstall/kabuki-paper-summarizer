'use client'
import styles from './generate-client.module.css'
import LlmPickerClient from "@/app/components/llm-picker/llm-picker-client";
import {useEffect, useState,} from "react";
import ArticlePickerClient
    from "@/app/components/article-picker/article-picker-client";
import StatefulPicker from "@/app/components/stateful-picker/stateful-picker";
import {saveElement} from "@/app/lib/generation/generate_element";
import {redirect} from "next/navigation";
import TranslationPickerClient
    from "@/app/components/translation-picker/translation-picker-client";

export default function GenerateClient(params) {
    const {generateElement} = params;
    const [llmName, setLlmName] = useState(params['llm'] || "claude-haiku-latest")
    const [articleId, setArticleId] = useState(params['articleId'])
    const [translationId, setTranslationId] = useState(params['translationId'])
    const [generatorName, setGeneratorName] = useState(params['generator'] || "claims")
    const [generationState, setGenerationState] = useState("ready")
    const [responses, setResponses] = useState([])
    const [thinking, setThinking] = useState("")
    const [stream, setStream] = useState(true)
    const [finalResponse, setFinalResponse] = useState("")
    const saveButtonDisabled = generationState !== 'complete'
    const generateButtonDisabled = !articleId

    useEffect(() => {
        if (generationState === 'complete') {
            setResponses([])
            if (responses.length === 1) {
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
                        window.alert(errorString)
                    }
                }, [])
                setFinalResponse(JSON.stringify({claims}))
            }
        }
    }, [generationState])

    async function runSaveElement() {
        await saveElement(generatorName, llmName, finalResponse, {
            translationId,
            articleId
        })
        redirect("/articles/" + articleId)
    }

    async function runGenerateElement() {
        setResponses([])
        setFinalResponse("")
        setGenerationState(`sent request to ${llmName}`)
        setTimeout(async () => {
            const response = await generateElement(generatorName, llmName, {
                articleId,
                translationId,
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
                    console.log("received text from stream " + streamId)
                    if (text && text !== 'undefined') {
                        console.log(text)
                        setThinking("")
                        setResponses(r => {
                            const newResponses = [...r]
                            newResponses[streamId] ||= ""
                            newResponses[streamId] = newResponses[streamId] + text
                            newResponses[streamId] = newResponses[streamId].replace(/json|```json|```/g, '').trim();
                            return newResponses;
                        })
                    }
                }
                break;
            case 'chat.completion.chunk': // openai uses this one
                const text = messageStreamEvent.choices[0].delta.content
                if (text && text !== 'undefined') {
                    console.log(text)
                    setThinking("")
                    setResponses(r => {
                        const newResponses = [...r]
                        newResponses[streamId] ||= ""
                        newResponses[streamId] = newResponses[streamId] + text
                        newResponses[streamId] = newResponses[streamId].replace(/json|```json|```/g, '').trim();
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

    const streamingResponse = responses.map((response, i) => (<div key={i}>
        {response}
        <hr/>
    </div>))
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
                <ArticlePickerClient articleId={articleId}
                                     setArticleId={setArticleId}/>
            </div>
        </div>
        {articleId && <div className="field">
            <label className="label">Translation</label>
            <div className="control">
                <TranslationPickerClient
                    articleId={articleId}
                    translationId={translationId}
                    setTranslationId={setTranslationId}/>
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
            {streamingResponse}
        </div>
        <div className={styles.finalResponse}>
            {finalResponse}
        </div>
    </div>
}
