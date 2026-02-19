import React from "react";
import MarkdownIt from "markdown-it";

const mdParser = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})


export default function MungedSentence({ paragraphIndex,sentenceIndex,klass, text, inline = false }) {
  let html = text

  // make ## an H1
  if (text.startsWith("##")) html=`<strong>${text.replace("## ","")}</strong>`
  if (text.startsWith("# ")) html=`<strong>${text.replace("# ","")}</strong>`

  // make ** text ** into </strong>
  if (text.startsWith("**") && text.endsWith("**"))
    html=`<strong>${text.replaceAll("**","")}</strong>`

  if (text.startsWith("- ")) html = text.replace(/^-/,"&bull;")
  // don't start the whole article with a header since we already have a headline in the header
  if (paragraphIndex===0 && sentenceIndex===0 && text.startsWith("#")) return null


  return (
    <span className={klass}
         dangerouslySetInnerHTML={{__html: html}}
    />
  )
}
