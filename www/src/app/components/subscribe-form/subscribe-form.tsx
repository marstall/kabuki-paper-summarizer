'use client'
import styles from './subscribe-form.module.css'
import "@/app/globals.css"

export default function SubscribeForm({onSubmit=null,dismiss=null,showNotRightNow=false}) {

  return <div className={styles.container}>
    <form
    action="https://buttondown.com/api/emails/embed-subscribe/marstall"
    method="post"
    onSubmit={()=>{
      setTimeout(()=>dismiss?.(), 0)
    }}
    className="embeddable-buttondown-form"
  >
    <label htmlFor="bd-email">Subscribe to free newsletter: </label>
    <input type="email" name="email" id="bd-email"/>&nbsp;
    <input className={styles.subscribeButton} type="submit" value="Subscribe"/>
      {showNotRightNow && <a href={'#'} className={styles.notRightNowButton} onClick={dismiss}>Not right now</a>}
  </form>
  </div>
}
