import {prisma} from "@/app/lib/prisma"
export async function get(request: Request,
  ctx: RouteContext<'/file/[attachment_id]'>) {
  const params = await ctx.params;
  console.log({params})
  const attachment = await prisma.attachments.findUnique({where:{id:Number(params.attachment_id)}})
  return new Response(attachment.bytes, {headers: {'Content-Type': attachment.content_type}})

}
