'use client'
import styles from './chat-exchange-panel.module.css'
import {ImageResponse} from "next/og";
import EditableText from "@/app/components/editable-text/editable-text";

function format(s) {
  return s?.replaceAll(/\(.+\)/g,"").trim()
}
export default function ChatExchangePanel({attachment}) {
  const panel = attachment.params;
  if (!panel) {
    return <div>panel not found</div>
  }


  return <div className={styles.container}>
    <div className={styles.question}>
      <div className={styles.iconContainer}>
        <div className={styles.icon}>
            <img src={'/redhead.png'}/>
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.textContainer}>
          <div className={styles.text}>
            <EditableText id={attachment.id} model='attachment' field="jsonb:params.question">
            {format(panel.question)}
            </EditableText>
          </div>
        </div>
      </div>
    </div>
    <div className={styles.answer}>
      <div className={styles.iconContainer}>
        <div className={styles.icon}>
          <img src={'/dadhead.png'}/>
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.textContainer}>
          <div className={styles.text}>
            <EditableText id={attachment.id} model='attachment'
                          type='jsonb' field="params" path="answer">
            {format(panel.answer)}
            </EditableText>
          </div>
        </div>
      </div>
    </div>
  </div>
}
