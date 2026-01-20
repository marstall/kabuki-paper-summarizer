'use client'

import Submit from "@/app/components/submit-button"
import {useActionState} from "react";
import Errors from "@/app/components/errors"

export default function SectionForm(params: any) {
  const {article_id,action} = params;
  const [formData, submitAction] = useActionState(action, {title: ""});
  return <>
    <Errors errors={formData}/>
    <form id='_form' action={submitAction}>
      <input type="hidden" name="article_id" value={article_id}/>
      <div className="field">
        <label className="label">title</label>
        <div className="control">
          <input className="input" type="text"
                 name="title"
                 defaultValue={formData?.title}
                 placeholder="Text input"/>
        </div>
      </div>
      <Submit/>
    </form>
  </>
}
