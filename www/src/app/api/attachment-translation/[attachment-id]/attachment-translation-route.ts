import {NextRequest} from "next/server";
import {prisma} from '@/app/lib/prisma'

export async function handleAttachmentTranslationGet(request: NextRequest, params: any) {
  const attachment_id = Number(params['attachment-id']);
  const translation = await prisma.translations.findMany(
    {
//      where: {attachment_id, AND: {NOT: {published_at: null}}},
      where: {attachment_id},
      select: {
        id: true,
        body: true
      }
    })
  const jsonSafeTranslation = JSON.parse(
    JSON.stringify(translation, (_key, value) => (typeof value === 'bigint' ? value.toString() : value))
  )
  return Response.json(jsonSafeTranslation)
}
