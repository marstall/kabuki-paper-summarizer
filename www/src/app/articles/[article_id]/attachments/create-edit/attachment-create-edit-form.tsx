'use client'
import {prisma} from '@/app/lib/prisma'
import { useActionState } from 'react'
import createEditAttachment from './attachment-create-edit'

export default function AttachmentCreateEditForm({article}) {
  const [state, formAction, _pending] = useActionState(createEditAttachment, {errors:[]})
  let blob = new Blob([state.bytes], {type: "image/png"})
  let imageUrl = URL.createObjectURL(blob)
  let img = document.createElement("img")
  img.src=imageUrl;
  //document.body.appendChild(img)
  return <div className={'content'}>
    <div className={'above-h1'}>{article.original_title}</div>
    <h1 className={'title'}>New Attachment</h1>
    <div style={{color:'red',fontWeight: 'bold',marginBottom:'1em'}}>
      {state.errors?.map((error,i)=><div key={`error-${i}`}>{error}</div>)}
    </div>
    <div>
      length: {state.bytes?.length}
      {state.bytes?.length && <img src={imageUrl}/>}
      <pre>
        {state.bytes}
      </pre>
    </div>
    <div className={'content'}>
      <form action={formAction}>
        <p>
          <input name='attachment' type='file'/>
        </p>
        <p>
          <input type='submit'/>
        </p>
      </form>
    </div>
  </div>
}
