'use client'
import {useEffect, useState} from "react";

import styles from './translation-sentence-by-sentence.module.css'
import '@/app/article.css'

import AnnotatedParagraph from "@/app/components/annotated-paragraph/annotated-paragraph";
import Attachment from "@/app/components/attachment/attachment";

function extractParagraphs(body) {
  const paragraphs = body.split(/[\r\n]/)
  return paragraphs.filter(p => p.length > 0)
}

function extractAnnotatedSentences(paragraph) {
  const matches = [...paragraph.matchAll(/(.+?\.)\s*(\(\d[^)]*\))?/g)];
  return matches.map((match) => {
    return [match[1], match[2]]
  })
}

function parseAnnotatedSentence(paragraphText) { // returns ["bare sentence",[2,3]]
  const matches = paragraphText.match(/(.+)(?:\s)(\((?:\d.*)\))$/)
  if (!matches) {
    console.log("no matches")
    return null;
  }
  const text = matches[1]
  const parens = matches[2]

  const claimIndexes = parens.match(/\d+/g).map(id => Number(id))
  return [text, claimIndexes]
}


/** create array like this:

 [
 [ # paragraph 1
 ["sentence 1",[4,5]],
 ["sentence 2",[6,7]]
 ],
 [ # paragraph 2
 ["sentence 1",[14,15]],
 ["sentence 2",[16,17]]
 ],
 ]
 **/

/* claims json ex:
{
  "claims": [
    {
      "claim": "Kabuki syndrome is a rare cause of intellectual disability caused by having one faulty copy of KMT2D.",
      "basedOnText": [
        "Kabuki syndrome (KS) is a rare cause of intellectual disability resulting from heterozygous pathogenic variants in the gene encoding the histone methyltransferase KMT2D."
      ],
      "reference_id": "0"
    },
    {
      "claim": "A previously made mouse model with loss of Kmt2d function shows key Kabuki syndrome features, and treatment studies in that model suggest symptoms in the brain can improve after birth.",
      "basedOnText": [
        "A previously established loss-of-function mouse model of KS exhibits key phenotypic features, and therapeutic trials in this mouse model suggest postnatal malleability of neurological symptoms."
      ],
      "reference_id": "1"
    }
  ]
}
 */
function Sentence({article, translation, text, claims}) {
  const [showOriginal, setShowOriginal] = useState(false)
  const [finalText, setFinalText] = useState(text)
  const originals = claims && claims.length > 0 && translation.claims.claims.filter((claim) => {
    return claims.includes(Number(claim.reference_id))
  }).map(claim => claim.basedOnText).join("...")
  const hasOriginals = originals && originals.length > 0 ? true : false;

  function toggleOriginal() {
    claims && claims.length > 0 && setShowOriginal(!showOriginal)
  }

  useEffect(() => {
    setFinalText(showOriginal ? originals : text)
  }, [showOriginal])
  const hoverText = showOriginal ? "click to return to to plain-english version" :
    "click to show the passages in the original paper this sentence is based on."
  return <span title={hoverText}
               onClick={() => {
                 toggleOriginal()
               }} className={styles.sentence}>
    <span className={showOriginal ? styles.original : styles.text}>{finalText}</span>
    <span className={styles.claims}>{claims?.join(",")}</span>
  </span>
}

function Paragraph({article, translation, processedParagraph}) {
  if (processedParagraph.length == 0) return null;
  return <p>
    {processedParagraph.map(([text, claims], i) => <Sentence
      key={i}
      article={article}
      translation={translation}
      text={text}
      claims={claims}/>)}
  </p>
}

export default function TranslationSentenceBySentence({article, translation, attachments}) {
  const unprocessedParagraphs = extractParagraphs(translation.body)
  const processedParagraphsArray = []
  for (const unprocessedParagraph of unprocessedParagraphs) {
    const processedSentences = []
    const sentencesEntries = extractAnnotatedSentences(unprocessedParagraph) // [['s','(1,2)'],etc.]
    for (const sentenceEntry of sentencesEntries) {
      const text = sentenceEntry[0];
      const parens = sentenceEntry[1];
      const claimIndexes = parens?.match(/\d+/g).map(id => Number(id))

      processedSentences.push([text, claimIndexes])
    }
    processedParagraphsArray.push(processedSentences)
  }
  // so we now have an array of paragraphs, each containing an array of sentences.
  return <article>
    <header className="article-header">
      <div className={'article-supertitle'}>{translation.category}</div>
      <h1>{translation.title}</h1>
      <div className="dek">{translation.second_title}</div>
      <div className="byline"><p>This is an AI-generated plain-english version of the {article.year} article <span
        className={"article-link"}>&ldquo;<a
        href={article.url}>{article.original_title}</a>&rdquo;</span> by {article.attribution.trim()}.</p>
      </div>
    </header>
    <div className="article-body">
      {processedParagraphsArray.map((processedParagraph, i) =>
        <Paragraph key={i} article={article} translation={translation} processedParagraph={processedParagraph}/>
      )}
    </div>
    ss
    ss
    {/*<section className="article-body">*/}

    {/*  <p>lorem imspum</p>*/}
    {/*  <p className="claim">KMT2D regulates enhancer priming in neurons.</p>*/}

    {/*  <aside className="margin-note">*/}
    {/*    Enhancers are regulatory DNA regions that amplify gene expression.*/}
    {/*  </aside>*/}

    {/*  <figure className="breakout">*/}
    {/*    <img src="figure1.png"/>*/}
    {/*    <figcaption>CREB-dependent transcription in hippocampal neurons.</figcaption>*/}
    {/*  </figure>*/}

    {/*  <aside className="pull-quote">*/}
    {/*    “Kabuki is less about broken genes and more about broken regulation.”*/}
    {/*  </aside>*/}
    {/*</section>*/}
  </article>

}
