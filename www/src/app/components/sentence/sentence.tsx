import styles from './sentence.module.css'
import {useEffect, useState} from "react";
import MungedSentence from "@/app/components/munged-sentence/munged-sentence";

function OriginalSentence({translatedText,originalPassages}) {
  return <span className={styles.original}>{originalPassages}</span>
}

export default function Sentence({paragraphIndex, sentenceIndex, article, translation, sentenceText, sentenceClaims}) {
  const [showOriginal, setShowOriginal] = useState(false)
  const [finalText, setFinalText] = useState(sentenceText)
  const originalPassages = sentenceClaims && sentenceClaims.length > 0 && translation.claims.claims.filter((claim) => {
    return sentenceClaims.includes(Number(claim.reference_id))
  }).map(claim => claim.basedOnText).join(" ... ")

  function toggleOriginal() {
    sentenceClaims && sentenceClaims.length > 0 && setShowOriginal(!showOriginal)
  }

  // useEffect(() => {
  //   setFinalText(showOriginal ? originalPassages : sentenceText)
  // }, [showOriginal])

  const hoverText = showOriginal ? "click to return to to plain-english version" :
    "click to show the passages in the original paper this sentence is based on."

  return <span title={hoverText} onClick={() => {toggleOriginal()}} className={styles.sentence}>
      {showOriginal ?
        <OriginalSentence translatedText={sentenceText} originalPassages={originalPassages}/>
        :
        <MungedSentence paragraphIndex={paragraphIndex}
                      sentenceIndex={sentenceIndex}
                      inline={true}
                      klass={styles.text}
                      text={finalText}/>
        }
    {sentenceClaims && <span className={styles.claims}>{sentenceClaims?.join(",")}</span>}
  </span>
}
