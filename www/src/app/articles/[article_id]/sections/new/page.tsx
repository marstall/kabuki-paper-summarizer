import SectionNew from './section-new'

export default async function Page(params: any) {
  return <SectionNew {...await params}/>
}
