import styles from './homepage.module.css'
import Translations from '@/app/components/translations/translations'

export default async function Homepage() {
  return <div className={'content'}>
    <h1>Latest</h1>
    <Translations/>
  </div>
}
