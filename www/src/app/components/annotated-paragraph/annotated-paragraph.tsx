import {useState} from "react";
import styles from './annotated-paragraph.module.css'

export default function AnnotatedParagraph({id,text, claims}) {
  const [expanded,setExpanded] = useState(false)
  function toggleExpanded() {
    setExpanded(!expanded)
  }
  function disclosureIcon() {
    const klass = expanded ? 'fa-solid fa-chevron-down' : 'fa-solid fa-chevron-right'
    return <i style={{fontSize:'smaller'}} className={klass}/>
  }
  return <p key={"para-"+id} >
      {text}
      <a
        onClick={toggleExpanded}
        className={styles.expandLink}>show basis {disclosureIcon()}
      </a>
      {/*{expanded && <Claims claims={claims}/>}*/}
    </p>
}
