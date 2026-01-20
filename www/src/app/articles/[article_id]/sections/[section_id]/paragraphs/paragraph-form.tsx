'use client'

import Submit from "@/app/components/submit-button"
import {useActionState} from "react";
import Errors from "@/app/components/errors"

export default function ParagraphForm(params: any) {
  const {section_id,action} = params;
  const [formData, submitAction] = useActionState(action, null);
  return <>
    <Errors errors={formData}/>
    <div className={"content"}>
      <h1>New paragraph</h1>
    <form id='_form' action={submitAction}>
      <input type="hidden" name="section_id" value={section_id}/>
      <div className="field">
        <label className="label">title</label>
        <div className="control">
          <input className="input" type="text"
                 name="title"
                 defaultValue={formData?.title}
                 placeholder="Text input"/>
        </div>
      </div>
      <div className="field">
        <label className="label">body</label>
        <div className="control">
        <textarea
          className="textarea"
          name="body"
          defaultValue={formData?.body}
          placeholder="Text input"
          rows={20}
          style={{ resize: 'vertical' }}
        ></textarea>
        </div>
      </div>
      <Submit/>
    </form>
    </div>
  </>
}
