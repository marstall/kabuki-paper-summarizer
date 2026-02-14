import AttachmentView from "./attachment-view"

export default async function Page({params}: { params: Promise<any> }) {
  return <AttachmentView {...await params}/>

}
