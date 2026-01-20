import Paragraphs from "./paragraphs";

export default async function View({params}) {
  return <Paragraphs {...await params}/>
}
