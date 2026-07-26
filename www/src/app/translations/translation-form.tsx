'use client'

import Submit from '@/app/components/submit-button'
import {useActionState, useState} from "react";
import Errors from '@/app/components/errors'
import {useFormStatus} from "react-dom";
import LlmPickerClient from "@/app/components/llm-picker/llm-picker-client";

export default function TranslationForm({
    translation,
    article,
    action,
    generateElement
}) {

    function getval(name) {
        return translation ? translation[name] : formData ? formData[name] : ""
    }

    const [formData, submitAction] = useActionState(action, null);
    const {pending} = useFormStatus();
    const [suggestedEdit, setSuggestedEdit] = useState('')
    const [llmName, setLlmName] = useState("deepseek")
    const [generatedBody, setGeneratedBody] = useState(null)


    async function regenerate() {
        // need to call a server action that initiates a regeneration of the
        // prompt and updates the client via SSR. look at /generate route
        // to see how this works
        const response = await generateElement('article-translation', llmName, {
            articleId: article?.id,
            translationId: translation?.id,
            additionalPrompt: suggestedEdit,
            stream: false
        })
        const responses = Array.isArray(response) ? response : [response];
        setGeneratedBody(responses[0].answer)
    }


    const published_at_checked = getval('published_at') && 'checked'
    return <div className={'content'}>
        <h1>Edit Translation</h1>
        <Errors errors={formData}/>

        <form id='_form' action={submitAction}>
            <input type="hidden" name="translation_id" value={translation?.id}/>
            <div className="field">
                <label className="label">Category</label>
                <div className="control">
                    <input className="input" type="text"
                           name="category"
                           defaultValue={getval("category")}
                           placeholder="category"/>
                </div>
            </div>
            <div className="field">
                <label className="label">Title</label>
                <div className="control">
                    <input className="input" type="text"
                           name="title"
                           defaultValue={getval("title")}
                           placeholder="title"/>
                </div>
            </div>
            <div className="field">
                <label className="label">Second Title</label>
                <div className="control">
          <textarea className="textarea"
                    name="second_title"
                    defaultValue={getval("second_title")}
                    placeholder="second title"
                    rows={2}
                    style={{resize: 'vertical'}}
          />
                </div>
            </div>

            <div className="field">
                <label className="label">body</label>
                <div className="control">
          <textarea
              className="textarea"
              name="body"
              defaultValue={getval("body")}
              placeholder="Text input"
              rows={30}
              style={{resize: 'vertical'}}
          ></textarea>
                </div>
            </div>
            <div className="field"
                 style={{border: '1px dotted lightgrey', padding: '0.5rem'}}>
                <input type={'checkbox'} name={'published_at'} value={"1"}
                       defaultChecked={getval('published_at') ? true : false}/>
                &nbsp;published to web
            </div>
            <div className={'block'}>
                <Submit/>
            </div>
        </form>
        <hr/>
        <div style={{
            padding: '1em',
            border: '1px solid lightblue',
            borderRadius: 8
        }}>
            <label className="label">suggest a change</label>
            <div className="control">
          <textarea
              className="textarea"
              name="body"
              value={suggestedEdit}
              placeholder="Tell the AI what change you'd like to make (example: 'explain concept x more simply')"
              rows={3}
              onChange={(e) => setSuggestedEdit(e.target.value)}
              style={{resize: 'vertical'}}
          ></textarea>
            </div>
            {suggestedEdit.length > 0 && <>
            <br/>
            <div className={'field'}>
                <LlmPickerClient llmName={llmName} setLlmName={setLlmName}/>
            </div>

            <button onClick={() => {
                regenerate();
                return true;
            }}
                    className={'button'}
                    type={'submit'}>
                Generate
            </button>
                <br/>
                <br/>
            {generatedBody && <textarea rows={30}
                                        defaultValue={generatedBody as String}
                                        style={{width:'100%',resize: 'vertical'}}/>}
                </>}
            </div>

                </div>
            }
