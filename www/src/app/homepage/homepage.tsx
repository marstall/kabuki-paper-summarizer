import styles from './homepage.module.css'
import Translations from '@/app/components/translations/translations'
import Header from '@/app/components/header/header'

export default async function Homepage() {
  return <div className={styles.container}>
    <div style={{border: '0px solid red'}}>
    <Header minimal={false}/>
    </div>
    <div style={{border: '0px solid blue'}} className={styles.latestPostsHeading}>Latest posts</div>
    <div style={{border: '0px solid green'}}>
    <Translations/>
    </div>
  </div>
}
