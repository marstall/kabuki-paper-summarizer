'use client'

import '@/app/article.css'

import AnnotatedParagraph from "@/app/components/annotated-paragraph/annotated-paragraph";
import Attachment from "@/app/components/attachment/attachment";

function extractParagraphData(body) {
  const paragraphs = body.split(/[\r\n]/)
  return paragraphs.filter(p => p.length > 0).map(paragraph => {

    const matches = paragraph.match(/(.+)(?:\s)(\((?:\d.*)\))$/)
    if (!matches) {
      console.log("no matches")
      return [paragraph, []]
    }
    const text = matches[1]
    const parens = matches[2]

    const claimIndexes = parens.match(/\d+/g).map(id => Number(id))
    return [text, claimIndexes]
  })
}

export default function TranslationViewClient({article,translation,attachments}) {
  return <article>
    <header className="article-header">
      <div className={'article-supertitle'}>{translation.category}</div>
      <h1>{translation.title}</h1>
      <div className="dek">{translation.second_title}</div>
      <div className="byline"><p>An AI-generated plain-english version of the {article.year} article <span className={"article-link"}>&ldquo;<a href={article.url}>{article.original_title}</a>&rdquo;</span> by {article.attribution.trim()}.</p>
        <p>
        NB: This is an interactive document. It includes features that let you assess its
        completeness and accuracy by deeplinking to individual passages in the original paper.
        </p>
      </div>
    </header>
    <section className="article-body">
      {attachments.map(attachment => <Attachment key={attachment.id} attachment={attachment}/>)}
      {extractParagraphData(translation.body).map(([text, claimIndexes], i) => {
      return <AnnotatedParagraph key={`para=${i}`}
                                 id={i}
                                 article={article}
                                 translation={translation}
                                 articleParagraphText={text}
                                 claimIndexes={claimIndexes}
                                 />
    })}
    </section>

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

  // return <article>
  //   <h1 className="title">{translation.title}</h1>
  //   {extractParagraphData(translation.body).map(([text, claimIndexes], i) => {
  //     const claims = claimIndexes.map(j => translation.claims["claims"][j])
  //     return <AnnotatedParagraph key={i} id={i} articleParagraphText={text} claims={claims}/>
  //   })}
  // </article>
}
