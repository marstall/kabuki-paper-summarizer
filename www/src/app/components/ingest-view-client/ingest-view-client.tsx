'use client'
import {useState} from "react";
import postgres from "postgres";

function clean(text) {
    text = text?.replace(/\[.*\]\s*\(.*\)/g, '')
    return text;
}

function process(text): [Array<string>, Record<string, Array<string>>] {
    let section = 'main'
    const sections = ['main']
    const sectionsToParagraphsMap = {}
    const blocks = text?.split(/\n+/)
    blocks?.forEach(block => {
        if (block.match(/^\#\#/)) {
            section = block.replaceAll("##", "").trim()
            sections?.push(section)
        }
        else {
            sectionsToParagraphsMap[section] ||= []
            sectionsToParagraphsMap[section].push(block)
        }
    })
    return [sections, sectionsToParagraphsMap];
}


export default function IngestViewClient({article, saveSectionsAndParagraphs}) {
    const [url, setUrl] = useState(article.url)
    const [response, setResponse] = useState(null)
    const mungedUrl = "https://r.jina.ai/" + url

    async function performIngest() {
        const payload = {
            method: 'POST',
            body: JSON.stringify({
                url: mungedUrl
            })
        }
        const resp = await fetch("/api/fetch-external", payload)
        const text = await resp.text()
        //const cleanText = clean(text)
        setResponse(text)
    }


    const cleanText = clean(response)
    const [sections, sectionsToParagraphsMap] = process(cleanText)

    function save() {
        saveSectionsAndParagraphs(article, sections, sectionsToParagraphsMap)
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
        {cleanText && <>
            <h3>Raw response</h3>
            <div>
            <textarea onChange={e => setResponse(e.target.value)}
                      value={cleanText}/>
            </div>
            <h3>Processed version</h3>
            <hr/>
            <div>
                {sections?.map((section, i) => sectionsToParagraphsMap[section] &&
                    <div className={'block'} key={i}>
                        <h4>{section}</h4>
                        {sectionsToParagraphsMap[section]?.map(((paragraph, i) =>
                            <div
                                key={i} className={'block'}>{paragraph}</div>))}
                    </div>)}
            </div>
            <button
                onClick={() => {
                    save();
                    return true;
                }}
                className={"button"}
            >
                Save
            </button>
        </>}

    </div>
}