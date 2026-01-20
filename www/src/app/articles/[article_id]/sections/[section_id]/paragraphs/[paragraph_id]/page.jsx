import ParagraphView from './paragraph-view'

export default async function Page({params}) {
  return <ParagraphView {...await params}/>
}
