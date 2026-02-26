import styles from './header.module.css'

export default function Header(params) {
  return <div className={styles.container}>
    <div className={styles.logo}>The Kabuki Papers</div>
    <div className={styles.slogan}>
      Making the science behind Kabuki Syndrome more accessible, one paper at a time
    </div>
    <div className={styles.credits}>
      Written by AI.<br/>
      Tap any sentence to show source text.<br/>
      Edited by Chris Marstall, Kabuki parent.<br/>
    </div>
  </div>

}
