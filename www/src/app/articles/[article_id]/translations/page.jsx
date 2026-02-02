import Translations from './translations.tsx'
export default async function Page({params}) {
  return <Translations {...await params}/>
}
