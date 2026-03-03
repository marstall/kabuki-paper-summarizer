import TranslationNew from './translation-new'

export default async function Page(params: any) {
  return <TranslationNew {...await params}/>
}
