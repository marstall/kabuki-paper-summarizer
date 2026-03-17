import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPathRegexes: RegExp[] = [
  /^\/$/,
  /^\/translations\/\d+\/?$/,
  /^\/file\/\d+\/?$/,
  /^\/api\/attachment-translation\/\d+\/?$/
]

function isPublicPath(pathname: string): boolean {
  return publicPathRegexes.some((re) => re.test(pathname))
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const isLocal =
    process.env.APP_ENV === "development" || process.env.NODE_ENV === "development"

  if (!isLocal && !isPublicPath(pathname)) {
    return NextResponse.redirect(new URL("/", request.url))
  }
  return NextResponse.next()
}

export default proxy

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
