'use server'
import {prisma} from '@/app/lib/prisma'
import { imageSize } from 'image-size'
import {redirect} from "next/navigation";

export default async function createEditAttachment(initialState: any, formData: FormData) {
  if (!formData) return initialState;
  const rawFormData = Object.fromEntries(formData)
  const file = formData.get("attachment") as File
  const caption = formData.get("caption") as string
  const alt_text = formData.get("alt_text") as string

  const errors = []
  if (!file?.type?.startsWith("image")) {
    errors.push("only images are allowed as uploads.")
  }
  if (caption.length<10) {
    errors.push("caption is not long enough")
  }
  if (errors.length === 0) {
    const bytes = new Uint8Array(await file.arrayBuffer())
    const dimensions = imageSize(bytes)
    console.log(dimensions.width, dimensions.height)


    const now = new Date();
    const attachment = await prisma.attachments.create({
      data: {
        bytes,
        caption,
        article_id: Number(initialState.article_id),
        content_type: file.type,
        size: bytes.length,
        width: dimensions.width,
        height: dimensions.height,
        alt_text,
        created_at: now,
        updated_at: now
      }
    })
    redirect("/articles/"+initialState.article_id)
    return {...initialState,caption:formData.get("caption"),errors,bytes,success:true,attachment_id:attachment.id}
  } else {
    return {...initialState,...rawFormData,errors}
  }
}
