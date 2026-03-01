import styles from './homepage.module.css'
import Translations from '@/app/components/translations/translations'
import Header from '@/app/components/header/header'

export default async function Homepage() {
  return <div className={styles.container}>
    <Header minimal={false}/>
    <div className={styles.latestPostsHeading}>Latest posts</div>
    <Translations/>
  </div>
}
