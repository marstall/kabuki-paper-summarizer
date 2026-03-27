'use client'

import Link from 'next/link'
import Image from 'next/image'
import styles from './attachment.module.css'
import Markdown from "@/app/components/markdown/markdown";
import {useState, useEffect} from "react";
import _ from 'lodash'
import ChatExchangePanel from "@/app/components/chat-exchange-panel/chat-exchange-panel";

export const attachmentComponentMap = {
  'chat-exchange-panel': ChatExchangePanel
}
export default function Attachment({article, attachment, allowMaximize = false, showCaption = true, allowEdit = false}) {

  const [translation, setTranslation] = useState("")
  useEffect(() => {
    fetch(`/api/attachment-translation/${attachment.id}`).then((response) => {
      response.json().then((json) => {
        const trans = _.get(json, '[0].body')
        if (!trans) return;
        setTranslation(trans)
      })
    })
  }, [])

  const captionStates = [
    "minimized",
    "maximized",
    "original"
  ]

  const [captionState, setCaptionState] = useState(0);
  const [maximized, setMaximized] = useState(false);
  const [activeCaption, setActiveCaption] = useState(attachment.caption)
  const reallyShowCaption = showCaption && activeCaption
  useEffect(() => {
    if (_.isEmpty(attachment.caption)) {
      setActiveCaption(translation)
    } else {
      setActiveCaption(captionStates[captionState] === "original"
      && !_.isEmpty(attachment.caption) ? attachment.caption : translation)
    }

  }, [translation, captionState])

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
    if (newVal === true) {
      setCaptionState(1)
    } else {
      setCaptionState(0)
    }
  }

  const cacheBuster = `?t=${Date.now()}`
  const url = '/file/' + attachment.id// + cacheBuster
  const hoverTextOptions = ["click to show full plain-english caption",
    "click to show original caption", "click to return to plain-english caption."
  ]

  return <div className={maximized ? styles.containerMaximized : styles.containerInline}
              style={!reallyShowCaption ? {backgroundColor: 'white'} : {}} key={attachment.id}>
    <div onClick={toggleMaximized} className={styles.imageContainer}>
      {allowEdit ?
        <Link href={`/attachments/${attachment.id}`} className="button">
          <Image alt={attachment.alt_text || attachment.caption || 'Article attachment'} src={url}
                 width={attachment.width || 600} height={attachment.height || 1200}
                 style={{width: '100%', height: 'auto'}}
          />
        </Link>
        : attachment.type === 'component' ?
          <ChatExchangePanel attachment={attachment}/>
          :
          <div>
            <Image alt={attachment.alt_text || attachment.caption || 'Article attachment'}
                   loading="eager"
                   className={styles.image} src={url} width={attachment.width || 600}
                   height={attachment.height || 1200}
            /></div>

      }
    </div>
    {reallyShowCaption && <div title={hoverTextOptions[captionState]} onClick={stepCaption}
                               className={captionStates[captionState] === "minimized" ? styles.captionMinimized : styles.captionMaximized}>
      {captionStates[captionState] === "original" && <div><b>original caption</b></div>}
      <Markdown text={activeCaption}/>
      {/*<AdminSection>*/}
      {/*  <Link className={'button'} href={`/articles/${article.id}/attachments/${attachment.id}`}>manage translation</Link>*/}
      {/*</AdminSection>*/}
    </div>}
  </div>
}
