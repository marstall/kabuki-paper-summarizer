'use client'
import styles from './sentence.module.css'
import {useContext, useEffect, useState} from "react";
import MungedSentence from "@/app/components/munged-sentence/munged-sentence";
import Link from "next/link";
import _ from 'lodash'

import {
  TranslationContext,
  TranslationDispatchContext
} from "@/app/components/translation-view-client/translation-context";

function OriginalSentence({toggleOriginal, sentenceClaims,
                            translatedText,
                            originalPassages}) {
  const dispatch = useContext(TranslationDispatchContext);
  function selectClaims(claims) {
    if (!dispatch) return;
    dispatch({
      type: 'selectClaims',
      claims: claims||sentenceClaims,
      originalPassages
    })
    dispatch({type: 'showOriginalOverlay'})
  }

  return <span className={styles.originalContainer}>
    <span onClick={toggleOriginal} className={styles.original}>
      <span className={styles.label}>
        This sentence is based on the following original passage(s):
      </span>
      {sentenceClaims.map((claim,i)=><span key={i} className={styles.originalPassage}>
        {claim.basedOnText}
        {dispatch && <span className={styles.popupButton}>
    <Link href={'#'} title="view this passage in the original paper" onClick={(e)=>{e.stopPropagation(); selectClaims([claim])}}>
      <span className={styles.icon}>⩹</span>
    </Link></span>}
        </span>
      )}
    </span>
  </span>

}

export default function Sentence({
                                   paragraphIndex, sentenceIndex,
                                   translation, sentenceText,
                                   sentenceClaimIndexes
                                 }) {
  const [showOriginal, setShowOriginal] = useState(false)
  const [finalText, setFinalText] = useState(sentenceText)
  const sentenceClaims = sentenceClaimIndexes && sentenceClaimIndexes.length > 0
    && translation.claims.claims.filter((claim) => {
    return sentenceClaimIndexes.includes(Number(claim.reference_id))
  })

  // for each claim, join the sentences together.
  const claimSentences = sentenceClaims?.map(claim => {
    const assembledSentences = claim.basedOnText.reduce((acc, sentence) => {
      if (acc) {
        let s = acc.trim()
        if (!s.endsWith(".")) s = s + "."
        s = s + " "
        return s + sentence
      } else return sentence
    }, null)
    return assembledSentences;
  })

  const originalPassages = claimSentences?.reduce((acc, sentence) => {
    if (acc == null) return sentence;
    else {
      return _.trimEnd(acc, ".") + " … " + sentence;
    }
  }, null)

  const hasOriginalPassages = originalPassages && originalPassages.length > 0


  function toggleOriginal() {
    sentenceClaims && sentenceClaims.length > 0 && setShowOriginal(!showOriginal)
  }

  // useEffect(() => {
  //   setFinalText(showOriginal ? originalPassages : sentenceText)
  // }, [showOriginal])

  const hoverText = showOriginal ? "click to return to to plain-english version" :
    "click to show the passages in the original paper this sentence is based on."

  return showOriginal ?
    <span>
    <OriginalSentence sentenceClaims={sentenceClaims} toggleOriginal={toggleOriginal}
                      translatedText={sentenceText}
                      originalPassages={originalPassages}/>
      </span>
    :
    hasOriginalPassages ? <span title={hoverText} onClick={toggleOriginal}
                                className={styles.sentence}>
        <MungedSentence paragraphIndex={paragraphIndex}
                        sentenceIndex={sentenceIndex}
                        inline={true}
                        klass={styles.text}
                        text={finalText}/>
        </span> :
      <MungedSentence paragraphIndex={paragraphIndex}
                      sentenceIndex={sentenceIndex}
                      inline={true}
                      klass={styles.text}
                      text={finalText}/>

}
