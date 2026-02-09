'use client'

import '@/app/article.css'

import AnnotatedParagraph from "@/app/components/annotated-paragraph/annotated-paragraph";

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
    return [text + " (" + claimIndexes.join(", ") + ")", claimIndexes]
  })
}

export default function TranslationViewClient({translation}) {
  return <article>
    <header className="article-header">
      <h1>{translation.title}</h1>
      <p className="dek">Why metabolism keeps showing up in learning and memory.</p>
    </header>
    <section className="article-body">
      {extractParagraphData(translation.body).map(([text, claimIndexes], i) => {
      const claims = claimIndexes.map(j => translation.claims["claims"][j])
      return <AnnotatedParagraph key={i} id={i} text={text} claims={claims}/>
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
    {extractParagraphData(translation.body).map(([text, claimIndexes], i) => {
      const claims = claimIndexes.map(j => translation.claims["claims"][j])
      return <AnnotatedParagraph key={i} id={i} text={text} claims={claims}/>
    })}
  // </article>
}
