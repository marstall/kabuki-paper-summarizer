import {get} from './file_route'
export async function GET(request: Request,
  ctx: RouteContext<'/file/[attachment_id]'>) {
  return await get(request,ctx)
}
