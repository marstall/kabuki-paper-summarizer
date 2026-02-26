import styles from './header.module.css'
import Link from "next/link";

export default function Header({minimal}) {
  return <div className={styles.container}>
    <div className={styles.logo}>
      <Link href='/'>The Kabuki Papers</Link>

    </div>
    <div className={styles.slogan}>
      Making the science behind Kabuki Syndrome more accessible, one paper at a time
    </div>
    {!minimal && <div className={styles.credits}>
      <ul className={styles.creditsList}>
        <li className={styles.creditItem}>
          <span className={styles.creditIcon}>🧬</span>
          <span className={styles.creditText}>Kabuki-related academic papers translated into plain English by AI.</span>
        </li>
        <li className={styles.creditItem}>
          <span className={styles.creditIcon}>🔍</span>
          <span className={styles.creditText}>Tap any sentence to show source passages.</span>
        </li>
        <li className={styles.creditItem}>
          <span className={styles.creditIcon}>👨</span>
          <span className={styles.creditText}>Our Editor and AI wrangler is Chris Marstall, a curious Kabuki parent.</span>
        </li>
      </ul>
    </div>}
  </div>

}
