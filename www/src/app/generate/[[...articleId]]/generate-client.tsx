'use client'
import styles from './generate-client.module.css'
import LlmPickerClient from "@/app/components/llm-picker/llm-picker-client";
import {use, useEffect, useState} from "react";
import ArticlePickerClient
    from "@/app/components/article-picker/article-picker-client";
import StatefulPicker from "@/app/components/stateful-picker/stateful-picker";
import {saveElement} from "@/app/lib/generation/generate_element";
import {redirect} from "next/navigation";
import {step} from "next/dist/experimental/testmode/playwright/step";
import TranslationPickerClient
    from "@/app/components/translation-picker/translation-picker-client";

export default function GenerateClient(params) {
    const {generateElement} = params;
    const [llmName, setLlmName] = useState(params['llm'] || "claude-haiku-latest")
    const [articleId, setArticleId] = useState(params['articleId'])
    const [translationId, setTranslationId] = useState(params['translationId'])
    const [generatorName, setGeneratorName] = useState(params['generator'] || "claims")
    const [step, setStep] = useState(null)
    const [generationState, setGenerationState] = useState("ready")
    const [response, setResponse] = useState("")
    const [thinking, setThinking] = useState("")
    const [responseVisual, setResponseVisual] = useState(null);
    const showSaveButton = !!step
    const saveButtonDisabled = generationState !== 'complete'
    const generateButtonDisabled = !articleId

    useEffect(() => {
        if (generationState === 'complete') {
            console.log("--- response")
            console.log(response)
            console.log("--- response end")
            try {
                JSON.parse(response)
            } catch (e) {
                console.log({e})
            }
        }
    }, [generationState]);

    const successfullyCompleted = step === 'message_stop'

    async function runSaveElement() {
        await saveElement(generatorName, llmName, response, {
            translationId,
            articleId
        })
        redirect("/articles/" + articleId)
    }

    async function runGenerateElement() {
        setStep("waiting")
        setResponse("")
        setResponseVisual("")
        setGenerationState(`sent request to ${llmName}`)
        setTimeout(async () => {
            const response = await generateElement(generatorName, llmName, {
                articleId,
                translationId,
                stream: true
            })
            let started = false;
            let stopped = false;
            setStep("waiting")
            setGenerationState("response received");
            for await (const messageStreamEvent of response) {
                setStep(messageStreamEvent.type)
                setGenerationState("streaming");

                const type = messageStreamEvent.type || messageStreamEvent.object // openai uses object

                switch (type) {
                    case 'content_block_delta': // claude uses this one
                        // if (started) {
                        if (messageStreamEvent.delta.type === 'thinking_delta') { // minimax does this
                            const text = messageStreamEvent.delta.thinking
                            console.log("thinking:" + text)
                            setThinking(r => r + text)
                        }
                        else {
                            const text = messageStreamEvent.delta.text
                            if (text && text !== 'undefined') {
                                console.log(text)
                                setThinking("")
                                setResponse(r => {
                                    let ret = r + text;
                                    ret = ret.replace(/json|```json|```/g, '').trim();
                                    return ret;
                                })
                                setResponseVisual(text)
                            }
                        }
                        //}
                        break;
                    case 'chat.completion.chunk': // openai uses this one
                        const text = messageStreamEvent.choices[0].delta.content
                        //                                .reduce((acc, choice)s
                        //                                => {
                        //     return acc + choice.delta.content
                        // }, "");
                        if (text && text !== 'undefined') {
                            console.log(text)
                            setThinking("")
                            setResponse(r => {
                                let ret = r + text;
                                ret = ret.replace(/json|```json|```/g, '').trim();
                                return ret;
                            })
                            setResponseVisual(text)
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
                    case 'message_stop':
                        console.log("received message_stop")
                        stopped = true;
                        break;
                    default:
                        console.log("unknown type: " + messageStreamEvent.type)
                }
            }
            setGenerationState("complete");

        }, 0)
    }

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
        {generationState !== 'ready' && <div className={styles.tinykeyval}>
            <span>state</span> <span>{generationState} ({response.length} bytes received)</span>
        </div>}
        <div className={styles.thinking}>
            {thinking}
        </div>
        <div className={styles.response}>
            {response}
            {/*{generationState === 'complete' ?*/}
            {/*    <pre>{JSON.stringify(JSON.parse(response), null, 2)}</pre> : responseVisual}*/}
        </div>
    </div>
}
