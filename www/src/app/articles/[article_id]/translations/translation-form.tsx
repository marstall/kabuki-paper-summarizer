'use client'

import Submit from '@/app/components/submit-button'
import {useActionState} from "react";
import Errors from '@/app/components/errors'
import {useFormStatus} from "react-dom";

export default function TranslationForm({translation, action}) {

  const [formData, submitAction] = useActionState(action, null);
  const {pending} = useFormStatus();

  function getval(name) {
    return translation ? translation[name] : formData ? formData[name] : ""
  }

  const published_at_checked = getval('published_at') && 'checked'

  return <div className={'content'}>
    <h1>Edit Translation</h1>
    <Errors errors={formData}/>

    <form id='_form' action={submitAction}>
      <input type="hidden" name="translation_id" value={translation?.id}/>
      <div className="field">
        <label className="label">Title</label>
        <div className="control">
          <input className="input" type="text"
                 name="title"
                 defaultValue={getval("title")}
                 placeholder="Text input"/>
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
      <div className="field" style={{border:'1px dotted lightgrey',padding:'0.5rem'}}>
          <input type={'checkbox'} name={'published_at'} value={"1"} defaultChecked={getval('published_at')? true: false}/>
          &nbsp;published to web
      </div>
      <div className={'block'}>
      <Submit/>
      </div>
    </form>
  </div>
}
