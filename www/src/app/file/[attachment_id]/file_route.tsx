import {prisma} from "@/app/lib/prisma"
import ChatExchangePanel from "@/app/components/chat-exchange-panel/chat-exchange-panel";


const componentMap = {"chat-exchange-panel": ChatExchangePanel}


export async function get(request: Request,
                          ctx: RouteContext<'/file/[attachment_id]'>) {
  const params = await ctx.params;
  console.log({params})
  const attachment = await
    prisma.attachments.findUnique({where: {id: Number(params.attachment_id)}})
  if (attachment.type === 'component') {
    return new componentMap[attachment.component](attachment)
  } else {
    return new Response(attachment.bytes, {
      headers: {'Content-Type': attachment.content_type}
    })
  }

}
