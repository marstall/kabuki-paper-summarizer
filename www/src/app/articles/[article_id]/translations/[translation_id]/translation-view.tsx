import Link from "next/link";
import {prisma} from '@/app/lib/prisma'
import AnnotatedParagraph from "@/app/components/annotated-paragraph";

function extractParagraphData(body) {
  const paragraphs = body.split(/[\r*\n]/)
  //console.log({paragraphs})
  return paragraphs.filter(p => p.length > 0).map(paragraph => {
    const matches = paragraph.match(/(.+)(\s)(\(.+\))$/)
    if (!matches) {
      console.log(`match miss ${paragraph}`)
      return [paragraph, []]
    }
    const text = matches[1]
    const parens = matches[3]

    const claimIndexes = parens.match(/\d+/g).map(id => Number(id))
    return [text+" ("+claimIndexes.join(", ")+")", claimIndexes]
  })

}

export default async function TranslationView({article_id, translation_id}: any) {
  const article = await prisma.articles.findUnique({where: {id: article_id}})
  const translation = await prisma.translations.findUnique({where: {id: translation_id}})
  if (!translation) return <div>Translation Not found</div>
  const annotatedParagraphs = extractParagraphData(translation.body).map((paragraphData, i) => {
    const [text,claimIndexes] = paragraphData;
    const claims = claimIndexes.map(i=>article.claims["claims"][i])
    return <AnnotatedParagraph key={i} text={text} claims={claims}/>
  })
  return <><h1 className="title">Translation: {translation.title}</h1>
    <div className={'block'}>
      <Link className={'button'} href={`/articles/${article_id}/translations/${translation_id}/edit`}>edit</Link>
    </div>
    <div className="content">
      {annotatedParagraphs}
      {article.claims["claims"].map((claim, i) =>
        <p key={i}>
          <b>claim {i}</b>
          {claim["claim"]}
        </p>
      )}
    </div>
  </>
}
