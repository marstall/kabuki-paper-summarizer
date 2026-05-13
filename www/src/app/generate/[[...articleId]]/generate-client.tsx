'use client'
import styles from './generate-client.module.css'
import LlmPickerClient from "@/app/components/llm-picker/llm-picker-client";
import {useState} from "react";
import ArticlePickerClient
    from "@/app/components/article-picker/article-picker-client";
import StatefulPicker from "@/app/components/stateful-picker/stateful-picker";
import {saveElement} from "@/app/lib/generation/generate_element";


export default function GenerateClient(params) {
    const {generateElement} = params;
    const [llmName, setLlmName] = useState(params['llm'] || "claude-haiku-latest")
    const [articleId, setArticleId] = useState(params['articleId'])
    const [generatorName, setGeneratorName] = useState(params['generator'] || "claims")
    const [step, setStep] = useState(null)
    const [response, setResponse] = useState("")
    const [thinking, setThinking] = useState("")
    const [responseVisual, setResponseVisual] = useState(null);
    const showSaveButton = !!step
    const saveButtonDisabled = step !== 'message_stop';
    const generateButtonDisabled = !articleId

    const successfullyCompleted = step === 'message_stop'

    async function runSaveElement() {
        await saveElement(generatorName, llmName, response, {articleId})
    }

    async function runGenerateElement() {
        //       setTimeout(async () => {
        setStep("waiting")
        setResponse("")
        const response = await generateElement(generatorName, llmName, {
            articleId,
            stream: true
        })
        let started = false;
        let stopped = false;
        setStep("waiting")
        for await (const messageStreamEvent of response) {
            setStep(messageStreamEvent.type)
            switch (messageStreamEvent.type) {
                case 'content_block_delta':
                    if (started) {
                        if (messageStreamEvent.delta.type === 'thinking_delta') { // minimax does this
                            const text = messageStreamEvent.delta.thinking
                            console.log("thinking:" + text)
                            setThinking(r => r + text)
                        }
                        else {
                            const text = messageStreamEvent.delta.text
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
        // }, 0)
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
        {step && <div className={styles.tinykeyval}>
            <span>step</span> <span>{step || "ready"}</span>
        </div>}
        <div className={styles.thinking}>
            {thinking}
        </div>
        <div className={styles.response}>
            {successfullyCompleted ?
                <pre>{JSON.stringify(JSON.parse(response), null, 2)}</pre> : responseVisual}
        </div>
    </div>
}
