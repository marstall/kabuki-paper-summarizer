'use client'
import styles from './generate-client.module.css'
import LlmPickerClient from "@/app/components/llm-picker/llm-picker-client";
import {use, useState} from "react";
import ArticlePickerClient from "@/app/components/article-picker/article-picker-client";
import StatefulPicker from "@/app/components/stateful-picker/stateful-picker";


export default function GenerateClient(params) {
    const {generateElement} = params;
    const [llmName, setLlmName] = useState("claude")
    const [articleId, setArticleId] = useState(34)
    const [generatorName, setGeneratorName] = useState("article-translation")
    const [response, setResponse] = useState("")
    const [thinking, setThinking] = useState("")


    async function runGenerateElement() {
        //       setTimeout(async () => {
        setResponse("")
        const response = await generateElement(generatorName, llmName, {articleId, stream: true})
        let started = false;
        let stopped = false;
        for await (const messageStreamEvent of response) {
            switch (messageStreamEvent.type) {
                case 'content_block_delta':
                    if (started) {
                        if (messageStreamEvent.delta.type === 'thinking_delta') { // minimax does this
                            const text = messageStreamEvent.delta.thinking
                            console.log("thinking:" + text)
                            setThinking(r => r + text)
                        } else {
                            const text = messageStreamEvent.delta.text
                            console.log(text)
                            setThinking("")
                            setResponse(r => r + text)
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
                <ArticlePickerClient articleId={articleId} setArticleId={setArticleId}/>
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
        <div>
            <form action={runGenerateElement}>
                <button className={"button"} type={'submit'}>
                    Generate
                </button>
            </form>
        </div>
        <div className={styles.thinking}>
            {thinking}
        </div>
        <div className={styles.response}>
            {response}
        </div>
    </div>
}
