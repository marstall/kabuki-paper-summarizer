'use client'
import {prisma} from '@/app/lib/prisma'
import {useActionState, useState} from 'react'
import createEditAttachment from './attachment-create-edit'
import Errors from "@/app/components/errors";
import Submit from "@/app/components/submit-button";

export default function AttachmentCreateEditForm({article}) {
  const initialState = {
    article_id: article.id,
    errors: []
  }
  const [state, formAction, _pending] = useActionState(createEditAttachment, initialState)
  // const [caption,setCaption] = useState(state.caption||"")
  // const [altText,setAltText] = useState(state.altText||"")
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
                 name="file"/>
        </div>
      </div>
      <div className="field">
        <label className="label">Caption</label>
        <div className="control">
          <input name='caption' type='text' defaultValue={state.caption||""}/>
        </div>
      </div>
      <div className="field">
        <label className="label">Alt Text</label>
        <div className="control">
          <input name='alt_text' type='text' defaultValue={state.alt_text}/>
        </div>
      </div>

      <Submit/>
    </form>
  </div>
}
