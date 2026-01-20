import Sections from './sections'
export default async function Page({params}) {
  return <Sections {...await params}/>
}
