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
    const response = new componentMap[attachment.component](attachment)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    return response
  } else {
    return new Response(attachment.bytes, {
      headers: {
        'Content-Type': attachment.content_type,
        // 'Cache-Control': 'no-store, no-cache, must-revalidate',
        // 'Pragma': 'no-cache',
        // 'Expires': '0'
      }
    })
  }

}
