import SectionView from "./section-view"

export default async function Page({params}: { params: Promise<any> }) {
  return <SectionView {...await params}/>
}
