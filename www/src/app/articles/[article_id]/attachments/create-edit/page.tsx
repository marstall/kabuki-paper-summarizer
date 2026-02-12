import AttachmentCreateEditForm from "./attachment-create-edit-form";
import {prisma} from "@/app/lib/prisma";

export default async function Page(props) {
  const params = await props.params
  params.article = await prisma.articles.findUnique(({where: {id:params.article_id}}))

  return <AttachmentCreateEditForm {...params}/>
}
