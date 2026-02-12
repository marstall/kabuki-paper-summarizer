import Link from "next/link";
import {prisma} from '@/app/lib/prisma'
import AnnotatedParagraph from "@/app/components/annotated-paragraph/annotated-paragraph";
import {log} from "@/app/lib/logger";

function extractParagraphData(body) {
  const paragraphs = body.split(/[\r\n]/)
  return paragraphs.filter(p => p.length > 0).map(paragraph => {

    const matches = paragraph.match(/(.+)(?:\s)(\((?:\d.*)\))$/)
    if (!matches) {
      console.log("no matches")
      return [paragraph,[]]
    }
    const text = matches[1]
    const parens = matches[2]

    const claimIndexes = parens.match(/\d+/g).map(id => Number(id))
    return [text + " (" + claimIndexes.join(", ") + ")", claimIndexes]
  })
}

export default async function TranslationView(params: any) {
  console.log({params})
  const translation_id = params.tr_id || params.id
  const translation = await prisma.translations.findUnique({where: {id: translation_id}})
  if (!translation) return <div>Translation Not found</div>
  const article = await prisma.articles.findUnique({where: {id: translation.article_id}})
  const annotatedParagraphs = extractParagraphData(translation.body).map(([text, claimIndexes], i) => {
    return (
      <AnnotatedParagraph
        key={i}
        id={i}
        article={article}
        translation={translation}
        articleParagraphText={text}
        claimIndexes={claimIndexes}
      />
    )
  })
  return <div className={"translation-container"}><h1 className="title">title</h1>
    {/*<div className={'block'}>*/}
    {/*  <Link className={'button'} href={`/articles/${article_id}/translations/${translation_id}/edit`}>edit</Link>*/}
    {/*</div>*/}

    <div className="content">
      {annotatedParagraphs}
    </div>
  </div>
}
