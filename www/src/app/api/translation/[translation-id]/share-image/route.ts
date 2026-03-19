import {handleTranslationShareImageGet} from "./translation-share-image-route";
import {NextRequest} from "next/server";

export async function GET(request: NextRequest,{params}) {
  console.log("share-image")
  return handleTranslationShareImageGet(request,await params)
}
