import {handleAttachmentTranslationGet} from "./attachment-translation-route";
import {NextRequest} from "next/server";

export async function GET(request: NextRequest,{params}) {
  return handleAttachmentTranslationGet(request,await params)
}
