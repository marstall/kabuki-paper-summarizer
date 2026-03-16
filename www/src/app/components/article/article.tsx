'use client'

import styles from '/article.module.css'
import {useContext, useEffect, useState} from "react";
import {TranslationContext} from "@/app/components/translation-view-client/translation-context";
import _ from 'lodash'

function Section({section, passagesToHighlight}) {
  const [scrollTarget,setScrollTarget] = useState(null)
  useEffect(()=>{
    if (scrollTarget) {
      const element = window.document.getElementById(scrollTarget)
      element && element.scrollIntoView()
    }
  },[scrollTarget])
  let found = false;
  const ret = section.paragraphs.map(paragraph => {
      let body = paragraph.body;
      const openingTag="<span style='background-color: #f3f3f3;color: dodgerblue;font-weight:bold;border:0px dotted gray'>"
      const endingTag = "</span>"
      for (const passage of passagesToHighlight) {
        const parts = _.split(passage,".")
        for (const part of parts) {
          if (part.length>0) {
            const _body = body
            if (body.search(part)>=0) {
              found= true;
              if (scrollTarget!==paragraph.id) setScrollTarget(paragraph.id)
              body = _.replace(body,part,openingTag+part+endingTag)
          }
          }
        }
      }
      return <div id={paragraph.id} key={paragraph.id}>
        <h4>
          {paragraph.title}
        </h4>
        <p style={{marginBottom: 12}} dangerouslySetInnerHTML={{__html:body}}>
        </p>
      </div>
    }
  )
 console.log(found ? "found:": "not found:",passagesToHighlight)

  return ret;
}

export default function Article({article, highlightClaims=[]}) {
  const state = useContext(TranslationContext);
  const passagesToHighlight = highlightClaims.reduce((acc, claim) => {
    return [...acc, ...claim.basedOnText]
  }, [])
  return <div>
    {/*<pre>*/}
    {/*  {JSON.stringify(state.selectedClaims, null, 2)}*/}
    {/*</pre>*/}
    {/*<div style={{backgroundColor: 'lightblue', padding: 10}}>*/}
    {/*  {JSON.stringify(state.originalPassages, null, 2)}*/}
    {/*</div>*/}
    {/*{highlightClaims &&<div style =*/}
    {/*                          {{fontStyle:'italic',color:'red',fontWeight:'bold',marginBottom:'1rem',}}>*/}
    {/*  The selected passage was derived from the highlighted section(s).*/}
    {/*</div>}*/}
    <div>{article.sections.map((section) => {
      return <div key={section.id} id={section.id}>
        <h3>{section.title}</h3>
        <Section section={section} passagesToHighlight={passagesToHighlight}/>
      </div>
    })}</div>
  </div>
}
