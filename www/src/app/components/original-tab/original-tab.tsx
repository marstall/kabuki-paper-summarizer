'use client'

import styles from './original-tab.module.css'
import Article from '@/app/components/article/article'

export default function OriginalTab({article,translation}) {
  return <div className={'content'}>
    <Article article={article}/>
  </div>
}
