'use client'
import {prisma} from '@/app/lib/prisma'
import {useActionState} from 'react'
import createEditAttachment from './attachment-create-edit'
import Errors from "@/app/components/errors";
import Submit from "@/app/components/submit-button";

export default function AttachmentCreateEditForm({article}) {
  const initialState = {
    article_id: article.id,
    errors: []
  }
  const [state, formAction, _pending] = useActionState(createEditAttachment, initialState)
  return <div className={'content'}>
    <div className={'above-h1'}>{article.original_title}</div>
    <h1 className={'title'}>New Attachment</h1>
    <Errors errors={state}/>
    {state.success &&<div>success! (id: {state.attachment_id})</div>}
    <form action={formAction}>
      <div className="field">
        <label className="label">File</label>
        <div className="control">
          <input className="input"
                 type="file"
                 name="attachment"/>
        </div>
      </div>
      <div className="field">
        <label className="label">Caption</label>
        <div className="control">
          <input name='caption' type='text'/>
        </div>
      </div>
      <Submit/>
    </form>
  </div>
}
