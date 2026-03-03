'use client'

import Link from 'next/link'
import Image from 'next/image'
import styles from './attachment.module.css'
import Markdown from "@/app/components/markdown/markdown";
import {useState,useEffect} from "react";

export default function Attachment({attachment, allowMaximize=true,showCaption=true,allowEdit = false}) {

  const [translation,setTranslation] = useState("")

  useEffect(()=>{
    fetch(`/api/attachment-translation/${attachment.id}`).then((response)=>{
      response.json().then((json)=>{
        setTranslation(json[0].body)
      })
    })
  },[])

  const captionStates = [
    "minimized",
    "maximized",
    "original"
  ]

  const [captionState, setCaptionState] = useState(0);
  const [maximized, setMaximized] = useState(false);

  function stepCaption() {
    let newStep = captionState + 1;
    if (newStep >= captionStates.length) {
      newStep = 0
    }
    setCaptionState(newStep)
  }

  function toggleMaximized() {
    if (!allowMaximize) return;
    const newVal = !maximized
    setMaximized(newVal)
    if (newVal===true) {
      setCaptionState(1)
    } else {
      setCaptionState(0)
    }
  }

  const url = '/file/' + attachment.id
  const hoverTextOptions = ["click to show full plain-english caption",
    "click to show original caption", "click to return to plain-english caption."
  ]
  return <div className={maximized ? styles.containerMaximized : styles.containerInline} style={!showCaption ? {backgroundColor:'white'}: {}} key={attachment.id}>
    <div onClick={toggleMaximized} className={styles.imageContainer}>
    {allowEdit ?
      <Link href={`/attachments/${attachment.id}`} className="button">
        <Image alt={attachment.alt_text} src={url} width={attachment.width} height={attachment.height}/>
      </Link>
      :
        <Image className={styles.image} alt={attachment.alt_text} src={url} width={attachment.width}
               height={attachment.height}/>
    }
    </div>
    {showCaption && <div title={hoverTextOptions[captionState]} onClick={stepCaption}
         className={captionStates[captionState] === "minimized" ? styles.captionMinimized : styles.captionMaximized}>
      {captionStates[captionState] === "original" && <div><b>original caption</b></div>}
      <Markdown text={captionStates[captionState] === "original" ? attachment.caption : translation}/>
    </div>}
  </div>
}
