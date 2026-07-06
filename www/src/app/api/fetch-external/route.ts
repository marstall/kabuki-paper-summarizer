import {NextRequest} from "next/server";
import {FetchExternal} from "./fetch-external-route";


export async function POST(request: NextRequest) {
    const r = request;
    return FetchExternal(r)
}

