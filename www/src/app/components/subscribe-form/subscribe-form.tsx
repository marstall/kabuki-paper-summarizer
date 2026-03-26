'use client'
import styles from './subscribe-form.module.css'
import {useState} from "react";
import {useIsMobile} from '@/app/lib/client'

export default function SubscribeForm({onSubmit = null, dismiss = null, showNotRightNow = false,showLabel= true}) {
  let [widthMinimized,setWidthMinimized] = useState(false)
  const isMobile = useIsMobile()
  function handleInputFocused(bool) {
    if (isMobile) {
      setWidthMinimized(bool)
    }
  }
  let showSubmitButton = true
  if (isMobile) {
    if (!widthMinimized) showSubmitButton = false;
  }
  return <div className={styles.container} >
    <form
      action="https://buttondown.com/api/emails/embed-subscribe/marstall"
      method="post"
      onSubmit={() => {
        setTimeout(() => dismiss?.(), 0)
      }}
      className="embeddable-buttondown-form"
    >
      {!widthMinimized && showLabel && <label className={styles.label} htmlFor="bd-email">Subscribe to free newsletter:</label>}
     <input style={{height:'1.3rem'}} className={styles.emailInput} onFocus={()=>handleInputFocused(true)} onBlur={()=>handleInputFocused(false)}
             placeholder={"email address"}
             type="email" name="email" id="bd-email"/>
      {showSubmitButton && <input className={styles.subscribeButton} type="submit" value="Subscribe"/>}
      {showNotRightNow && <a href={'#'} className={styles.notRightNowButton} onClick={dismiss}>Not right now</a>}
    </form>
  </div>
}
