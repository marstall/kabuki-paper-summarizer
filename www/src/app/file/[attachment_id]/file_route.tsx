import {prisma} from "@/app/lib/prisma"
import {ImageResponse} from "next/og";

function ChatAttachmentResponse(attachment) {
  const response = attachment.params;
  const json = JSON.parse(response)
  console.log(JSON.stringify(response,null,2))
  return new ImageResponse(<div style={{margin:"5rem",fontSize: 16, display: 'flex',flexDirection:'column'}}>
    <h1>CHAT</h1>

    {json.panels.map((panel) => <div style={{display: 'flex',marginBottom:'2rem',flexDirection: 'column'}}>
        <div style={{ display: 'flex'}}>q: {panel.question}</div>
        <div style={{ display: 'flex'}}>a: {panel.answer}</div>
      </div>
    )}
  </div>)
}

const componentMap = {"chat-exchange": ChatAttachmentResponse}


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
