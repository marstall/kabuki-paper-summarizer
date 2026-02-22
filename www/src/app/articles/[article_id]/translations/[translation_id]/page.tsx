import TranslationView from "./translation-view"
import Overlay from "@/app/components/overlay/overlay";

export default async function Page({params}: { params: Promise<any> }) {
  return <>
    <TranslationView {...await params}/>
  </>
}
