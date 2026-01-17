import ArticleView from './article-view'

export default async function Page({params}) {
  const {id} = await params
  console.log("id",id)
  return <ArticleView id={id}/>
}
