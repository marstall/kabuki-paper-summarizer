import TranslationView from "./translation-view"
import TCratch from './tcratch'
import PCratch from './pcratch'
export default async function Page({params}: { params: Promise<any> }) {
  return <TranslationView {...await params}/>
}
