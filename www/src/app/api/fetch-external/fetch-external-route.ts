import {NextRequest, NextResponse} from "next/server";
import {prisma} from '@/app/lib/prisma'

export async function FetchExternal(request: NextRequest) {
    const json = await request.json()
    const url = json.url
    const response = await fetch(url)
    const r = await response.text();
    return new NextResponse(r);
}
