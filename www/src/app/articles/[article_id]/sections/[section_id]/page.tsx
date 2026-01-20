import SectionView from "./section-view"

export default async function Page({params}) {
  return <SectionView {...await params}/>
}
