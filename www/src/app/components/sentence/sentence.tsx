import styles from './sentence.module.css'
import {useContext, useEffect, useState} from "react";
import MungedSentence from "@/app/components/munged-sentence/munged-sentence";
import Link from "next/link";
import {
  TranslationContext,
  TranslationDispatchContext
} from "@/app/components/translation-view-client/translation-context";

function OriginalSentence({toggleOriginal, sentenceClaims, translatedText, originalPassages}) {
  const state = useContext(TranslationContext);
  const dispatch = useContext(TranslationDispatchContext);
  function selectClaims() {
    dispatch({
      type:'selectClaims',
      value: sentenceClaims
    })
    dispatch({
      type: 'selectTab',
      value:1
    })
  }
  return <span className={styles.originalContainer}>
    <span onClick={toggleOriginal} className={styles.original}>
      <span className={styles.label}>This sentence is based on the following original passage(s):</span>
      &ldquo;{originalPassages}&rdquo;
    </span>
    &nbsp;<Link href={'#'} onClick={selectClaims}>view&nbsp;within&nbsp;original&nbsp;paper</Link>
  </span>

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

  return showOriginal ?
        <OriginalSentence sentenceClaims={sentenceClaims} toggleOriginal={toggleOriginal} translatedText={sentenceText} originalPassages={originalPassages}/>
        :
        <span title={hoverText} onClick={toggleOriginal} className={styles.sentence}>
        <MungedSentence paragraphIndex={paragraphIndex}
                      sentenceIndex={sentenceIndex}
                      inline={true}
                      klass={styles.text}
                      text={finalText}/>
        </span>

    {sentenceClaims && <span className={styles.claims}>{sentenceClaims?.join(",")}</span>}
}
