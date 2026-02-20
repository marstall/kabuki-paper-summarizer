'use client'
import '@/app/article.css'
import Sentence from "@/app/components/sentence/sentence";

function extractParagraphs(body) {
  const paragraphs = body.split(/[\r\n]/)
  return paragraphs.filter(p => p.length > 0)
}

function extractAnnotatedSentences(paragraph) {
  const matches = [...paragraph.matchAll(/(.+?\.)\s*(\(\d[^)]*\))?/g)];
  if ((paragraph?.length > 0) && matches.length == 0) {
    return [[paragraph, ""]];
  }
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

function Paragraph({index, article, translation, processedParagraph}) {
  if (processedParagraph.length == 0) return null;
  const subheader = translation.subheaders[index]
  const definition = translation.definitions[index]
  const pullquote = translation.pull_quote_index === index && translation.pull_quote;

  return <div style={{marginBottom: "1em"}}>
    {pullquote && <aside className="pull-quote">
      &ldquo;{pullquote}&rdquo;
    </aside>
    }
    {processedParagraph.map(([text, claims], i) => <Sentence
      key={i}
      paragraphIndex={index}
      sentenceIndex={i}
      article={article}
      translation={translation}
      sentenceText={text}
      sentenceClaims={claims}/>)}

  </div>
}

export default function TranslationSentenceBySentence({article, translation, attachment, attachmentTranslation, llm}) {
  const unprocessedParagraphs = extractParagraphs(translation.body)
  const processedParagraphsArray = []
  for (const unprocessedParagraph of unprocessedParagraphs) {
    const processedSentences = []
    const sentencesEntries = extractAnnotatedSentences(unprocessedParagraph) // [['s','(1,2)'],etc.]
    for (const sentenceEntry of sentencesEntries) {
      const text = sentenceEntry[0];
      const parens = sentenceEntry[1];
      const claimIndexes = parens?.match(/\d+/g)?.map(id => Number(id))

      processedSentences.push([text, claimIndexes])
    }
    processedParagraphsArray.push(processedSentences)
  }
  // so we now have an array of paragraphs, each containing an array of sentences.

  return <>
  {processedParagraphsArray.map((processedParagraph, i) =>
        <Paragraph key={i} index={i} article={article} translation={translation}
                   processedParagraph={processedParagraph}/>
      )}
  </>

}
