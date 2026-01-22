'use client'

import Submit from '../components/submit-button.tsx'
import {useActionState} from "react";
import Errors from '../components/errors'

export default function ArticleForm({ article,action }){

  const [formData, submitAction] = useActionState(action, null);
  function getval(name) {
    return article ? article[name] : formData ? formData[name] : ""
  }
  return  <>
    <Errors errors={formData}/>
    <form id='_form' action={submitAction}>
    <input type="hidden" name="article_id" value={article?.id}/>
    <div className="field">
      <label className="label">URL</label>
      <div className="control">
        <input className="input" type="text"
               name="url"
               defaultValue={getval("url")}
               placeholder="Text input"/>
      </div>
    </div>
    <div className="field">
      <label className="label">Title</label>
      <div className="control">
        <input className="input" type="text"
               name="original_title"
               defaultValue={getval("original_title")}
               placeholder="Text input"/>
      </div>
    </div>
    <div className="field">
      <label className="label">Publication year</label>
      <div className="control">
        <input className="input" type="text"
               name="year"
               defaultValue={getval("year")}
               placeholder="Text input"/>
      </div>
    </div>
    <div className="field">
      <label className="label">Attribution</label>
      <div className="control">
        <textarea
          className="textarea"
          name="attribution"
          defaultValue={getval("attribution")}
          placeholder="Text input"
          rows="3"
          style={{ resize: 'vertical' }}
        ></textarea>
      </div>
    </div>
    <Submit/>
  </form></>
}
