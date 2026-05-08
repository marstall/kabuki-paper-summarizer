'use client'

import Submit from '../components/submit-button.tsx'
import {useActionState, useEffect, useState} from "react";
import Errors from '../components/errors'

export default function ArticleForm({article, action}) {

    const [formData, submitAction, isPending] = useActionState(action, {});

    function getval(name) {
        return article ? article[name] : formData ? formData[name] : ""
    }

    const [type, setType] = useState(getval("type"))  // seeds from article on edit
    useEffect(() => {
        if (formData && formData.type) {
            setType(formData.type)
        }
    }, [formData?.type])
    const isPlain = type==='plain'

    return !isPending && <>
        <Errors errors={formData}/>
        <form id='_form' action={submitAction}>
            <input type="hidden" name="article_id" value={article?.id}/>
            <div className="field">
                <label className="label">Type</label>
                <div className="control">
                    <select className={"select"}
                            onChange={e => setType(e.target.value)}
                            name="type"
                            value={type}
                    >
                        <option value={"article"}>article based on paper</option>
                        <option value={"plain"}>plain article</option>
                    </select>
                </div>
            </div>
            {!isPlain && <div className="field">
                <label className="label">URL</label>
                <div className="control">
                    <input className="input" type="text"
                           name="url"
                           defaultValue={getval("url")}
                           placeholder="Text input"/>
                </div>
            </div>}
            {!isPlain && <div className="field">
                <label className="label">Category</label>
                <div className="control">
                    <input className="input" type="text"
                           name="category"
                           defaultValue={getval("category")}
                           placeholder="Text input"/>
                </div>
            </div>}
            <div className="field">
                <label className="label">{isPlain ? "Title" : "Body"}</label>
                <div className="control">
                    <input className="input" type="text"
                           name="original_title"
                           defaultValue={getval("original_title")}
                           placeholder="Text input"/>
                </div>
            </div>
            {!isPlain && <div className="field">
                <label className="label">Title</label>
                <div className="control">
                    <input className="input" type="text"
                           name="title"
                           defaultValue={getval("title")}
                           placeholder="Text input"/>
                </div>
            </div>}
            {!isPlain && <div className="field">
                <label className="label">Second Title</label>
                <div className="control">
        <textarea
            className="textarea"
            name="second_title"
            defaultValue={getval("second_title")}
            placeholder="Text input"
            rows="3"
            style={{resize: 'vertical'}}
        ></textarea>
                </div>
            </div>}
            {!isPlain && <div className="field">
                <label className="label">Publication year</label>
                <div className="control">
                    <input className="input" type="text"
                           name="year"
                           defaultValue={getval("year")}
                           placeholder="Text input"/>
                </div>
            </div>}


            {!isPlain && <div className="field">
                <label className="label">Attribution</label>
                <div className="control">
                    <textarea
                        className="textarea"
                        name="attribution"
                        defaultValue={getval("attribution")}
                        placeholder="Text input"
                        rows="3"
                        style={{resize: 'vertical'}}
                    ></textarea>
                </div>
            </div>}
            {isPlain && <div className="field">
                <label className="label">Body</label>
                <div className="control">
                <textarea
                    className="textarea"
                    name="full_text"
                    defaultValue={getval("full_text")}
                    placeholder="article text"
                    rows="30"
                    style={{resize: 'vertical'}}
                ></textarea>
                </div>
            </div>}
            <Submit/>
        </form>
    </>
}
