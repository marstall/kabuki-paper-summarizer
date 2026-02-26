import styles from './subscribe-form.module.css'
import "@/app/globals.css"

export default function SubscribeForm(params) {
  return <div className={styles.container}>
    <form
    action="https://buttondown.com/api/emails/embed-subscribe/marstall"
    method="post"
    className="embeddable-buttondown-form"
  >
    <label htmlFor="bd-email">Subscribe to our newsletter: </label>
    <input type="email" name="email" id="bd-email"/>&nbsp;
    <input type="submit" value="Subscribe"/>
  </form>
  </div>
}
