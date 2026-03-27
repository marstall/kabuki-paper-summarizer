'use client'
import styles from './editable-text.module.css'
import {useState} from "react";
import Link from "next/link";
import save from './save-change'
import {isLocal} from "@/app/lib/misc";

function InlineEditor({save,children,setEditing}) {
  return <div className={styles.editorContainer}>
    <div>
      <textarea id='inline-editor' defaultValue={children} rows={3}/>
    </div>
    <div className={styles.buttons}>
      <Link href='#' className={'button is-primary'} onClick={save}>Save</Link>
      <Link href='#' className={'button'} onClick={()=>setEditing(false)}>Cancel</Link>
    </div>
  </div>
}

export default function EditableText({model,id,field,type="string",subfield=null,children}) {
  if (!isLocal()) return <span>{children}</span>

  const [content,setContent] = useState(children)
  const [editing,setEditing] = useState(false)

  function handleContainerClick() {
    if (!editing) setEditing(true)
  }

  async function _save() {
    const element =
      document.getElementById('inline-editor') as HTMLTextAreaElement
    const value = element.value
    await save(model,id,field,type,subfield,value)
    setEditing(false);
    setContent(value)
  }

  return <span className={styles.container}
               onClick={editing ? null : handleContainerClick}>
    {editing ? <InlineEditor
        setEditing={setEditing}
        save={_save}>{content}
    </InlineEditor>
      : content
    }
  </span>
}
