'use client'

import Submit from '@/app/components/submit-button'
import {useActionState} from "react";
import Errors from '@/app/components/errors'

export default function TranslationForm({translation, action}) {

  const [formData, submitAction] = useActionState(action, null);

  function getval(name) {
    return translation ? translation[name] : formData ? formData[name] : ""
  }

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
      <Submit/>
    </form>
  </div>
}
