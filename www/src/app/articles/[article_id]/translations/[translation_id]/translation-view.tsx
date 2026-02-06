import Link from "next/link";
import {prisma} from '@/app/lib/prisma'
import AnnotatedParagraph from "@/app/components/annotated-paragraph";
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

export default async function TranslationView({article_id, translation_id}: any) {
  const article = await prisma.articles.findUnique({where: {id: article_id}})
  const translation = await prisma.translations.findUnique({where: {id: translation_id}})
  if (!translation) return <div>Translation Not found</div>
  const annotatedParagraphs = extractParagraphData(translation.body).map(([text, claimIndexes], i) => {
    const claims = claimIndexes.map(j=> article.claims["claims"][j])
    return <AnnotatedParagraph key={i} id={i} text={text} claims={claims}/>
  })
  return <><h1 className="title">Translation: {translation.title}</h1>
    <div className={'block'}>
      <Link className={'button'} href={`/articles/${article_id}/translations/${translation_id}/edit`}>edit</Link>
    </div>
    <div className="content">
      {annotatedParagraphs}

    </div>
  </>
}
