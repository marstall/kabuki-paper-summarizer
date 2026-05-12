import {handleArticleShareImageGet} from "./article-share-image-route";
import {NextRequest} from "next/server";

export async function GET(request: NextRequest, {params}) {
    return handleArticleShareImageGet(request, await params)
}
