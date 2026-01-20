import ArticleView from './article-view'

export default async function Page({params}) {
  const {article_id} = await params;
  return <ArticleView id={article_id}/>
}
