'use client'
import {useState} from "react";

export default function IngestViewClient({article}) {
    const [url, setUrl] = useState(article.url)
    const [response, setResponse] = useState(null)

    async function performIngest() {
        console.log("perform Ingest")
        // setResponse("x")
        // return;
        const payload = {
            method: 'POST',
            body: JSON.stringify({
                url
            })
        }
        const resp = await fetch(`/api/fetch-external`, payload)
        const text = await resp.text()
        setResponse(text)
    }

    return <div className={'content'}>
        <h1>ingest</h1>
        <div className="field">
            <label className="label">url</label>
            <div className="control">
                <input onChange={e => setUrl(e.target.value)} className="input"
                       type="text"
                       name="url"
                       value={url}
                       placeholder="Text input"/>
            </div>
        </div>
        <button
            onClick={() => {
                performIngest();
                return true;
            }}
            className={"button"}
        >
            Ingest
        </button>
        <br/>
        <hr/>
        <div>response:</div>
        <div>{response}</div>
    </div>
}