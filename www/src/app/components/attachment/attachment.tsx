'use client'

import Link from 'next/link'
import Image from 'next/image'
import styles from './attachment.module.css'
import {prisma} from '@/app/lib/prisma'
import Markdown from "@/app/components/markdown/markdown";
import {useState} from "react";

export default function Attachment({attachment, attachmentTranslation, allowEdit = false}) {
  const captionStates = [
    "minimized",
    "maximized",
    "original"
  ]

  const [captionState, setCaptionState] = useState(0);

  function stepCaption() {
    let newStep = captionState + 1;
    if (newStep >= captionStates.length) {
      newStep = 0
    }
    setCaptionState(newStep)
  }

  const url = '/file/' + attachment.id
  const hoverTextOptions = ["click to show full plain-english caption",
    "click to show original caption", "click to return to plain-english caption."
  ]
  return <div className={styles.container} key={attachment.id}>
    <div className={styles.imageContainer}>
    {allowEdit ?
      <Link href={`/articles/${attachment.article_id}/attachments/${attachment.id}`} className="button">
        <Image alt={attachment.alt_text} src={url} width={attachment.width} height={attachment.height}/>
      </Link>
      :
      // <Link href={`/articles/${attachment.article_id}/attachments/${attachment.id}`} className="button">
        <Image className={styles.image} alt={attachment.alt_text} src={url} width={attachment.width}
               height={attachment.height}/>
      // </Link>
    }
    </div>
    <div title={hoverTextOptions[captionState]} onClick={stepCaption}
         className={captionStates[captionState] === "minimized" ? styles.captionMinimized : styles.captionMaximized}>
      {captionStates[captionState] === "original" && <div><b>original caption</b></div>}
      <Markdown text={captionStates[captionState] === "original" ? attachment.caption : attachmentTranslation.body}/>
    </div>
  </div>
}
