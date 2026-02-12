import {useState} from "react";
import styles from './annotated-paragraph.module.css'
import Claims from "@/app/components/claims/claims";
import _ from 'underscore'
import '@/app/article.css'

export default function AnnotatedParagraph({id, article, articleParagraphText, translation, claimIndexes}) {
  const [expanded, setExpanded] = useState(false)

  function toggleExpanded() {
    setExpanded(!expanded)
  }

  function disclosureIcon() {
    const klass = expanded ? 'fa-solid fa-chevron-down' : 'fa-solid fa-chevron-right'
    return <i style={{fontSize: 'smaller'}} className={klass}/>
  }

  const claims = claimIndexes.map(j => translation.claims["claims"][j])

  const subheader = translation.subheaders[id]
  const definition = translation.definitions[id]
  const pullquote = translation.pull_quote_index === id && translation.pull_quote;
  return <>

    <div className={styles.paragraph} key={`para-${translation.id}`}>
      {pullquote && <aside className="pull-quote">
        &ldquo;{pullquote}&rdquo;
      </aside>
      }
      <h1 className="article-subheader">{subheader}</h1>
      {articleParagraphText}
      <a
        onClick={toggleExpanded}
        className={styles.expandLink}>show basis{disclosureIcon()}
      </a>
      {expanded && <Claims claims={claims}/>}
    </div>
    {/*{definition &&*/}
    {/*<aside className="margin-note">*/}
    {/*  {definition}*/}
    {/*</aside>*/}
    {/*}*/}

  </>
}
