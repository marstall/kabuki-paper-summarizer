import TranslationView from "./translation-view"

export default async function Page({params}: { params: Promise<any> }) {
  return <TranslationView {...await params}/>
}
