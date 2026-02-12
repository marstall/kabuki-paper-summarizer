import {useState} from "react";
import styles from './claims.module.css'

export default function Claims({claims}) {
  const [expanded,setExpanded] = useState(false)
  return <div className={styles.container}>
    {/*<pre>*/}
    {/*json: {JSON.stringify(claims[0].basedOnText,null,2)}*/}
    {/*  </pre>*/}
    <div><b>this paragraph is based on these passages from the original article:</b></div>
    <ul>
      {claims[0].basedOnText.map((t,i)=>
        <li  key={i}>&bull;&ldquo;{t}&rdquo;</li>
      )}
  </ul>
  </div>
}
