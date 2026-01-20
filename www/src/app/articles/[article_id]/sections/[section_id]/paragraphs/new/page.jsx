import ParagraphNew from "./paragraph-new";

export default async function({params}) {
  return <ParagraphNew {...await params}/>
}
