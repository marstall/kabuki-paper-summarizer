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
  if (text.startsWith("###")) {
    html=`<h3 class="title">${text.replace(/\#+/,"")}</h3>`
  } else if (text.startsWith("##")) {
    html=`<h2 class="title">${text.replace(/\#+/,"")}</h2>`
  }else if (text.startsWith("#")) {
    html=`<h1 class="title">${text.replace(/\#+/,"")}</h1>`
  }

     if (text.startsWith("---")) html="<p style='border-top:1px solid lightgray'/>"

  // make ** text ** into </strong>
  if (text.startsWith("**") && text.endsWith("**"))
    html=`<strong>${text.replaceAll("**","")}</strong>`

  if (text.startsWith("- ")) html = text.replace(/^-/,"&bull;")
  // don't start the whole article with a header since we already have a headline in the header
  if (paragraphIndex===0 && sentenceIndex===0 && text.startsWith("#")) return null

  html = html.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, "<em>$1</em>")
  html = html.replace(/(?<!\*)\*\*([^*]+?)\*\*(?!\*)/g, "<strong>$1</strong>")


  return (
    <span className={klass}
         dangerouslySetInnerHTML={{__html: " "+html}}
    />
  )
}
