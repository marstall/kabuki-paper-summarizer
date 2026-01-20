import SectionNew from './section-new'

export default async function Page(params) {
  return <SectionNew {...await params}/>
}
