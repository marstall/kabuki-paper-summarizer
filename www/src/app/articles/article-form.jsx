'use client'

import Submit from './submit-button'
import {useActionState} from "react";
//import Errors from './errors'

export default function ArticleForm({ action }){
  const [formData, signupAction] = useActionState(action, null);
  console.log({formData})
  return  <>
    {/*<Errors errors={formData}/>*/}
    <form id='_form' action={signupAction}>

    <div className="field">

      <label className="label">URL</label>
      <div className="control">
        <input className="input" type="text"
               name="url"
               defaultValue={formData?.url}
               placeholder="Text input"/>
      </div>
    </div>
    <div className="field">
      <label className="label">Title</label>
      <div className="control">
        <input className="input" type="text"
               name="original_title"
               defaultValue={formData?.original_title}
               placeholder="Text input"/>
      </div>
    </div>
    <div className="field">
      <label className="label">Publication year</label>
      <div className="control">
        <input className="input" type="text"
               name="year"
               defaultValue={formData?.year}
               placeholder="Text input"/>
      </div>
    </div>
    <div className="field">
      <label className="label">Attribution</label>
      <div className="control">
        <textarea
          className="textarea"
          name="attribution"
          defaultValue={formData?.attribution}
          placeholder="Text input"
          rows="3"
          style={{ resize: 'vertical' }}
        ></textarea>
      </div>
    </div>
    {/*<div className="field">*/}
    {/*  <label className="label">Body</label>*/}
    {/*  <div className="control">*/}
    {/*          <textarea*/}
    {/*            className="textarea"*/}
    {/*            name="full_text"*/}
    {/*            defaultValue={formData?.full_text}*/}
    {/*            rows="50" cols="33"*/}
    {/*            style={{ resize: 'vertical' }}*/}
    {/*          ></textarea>*/}
    {/*  </div>*/}
    {/*</div>*/}

    <Submit/>
  </form></>
}
