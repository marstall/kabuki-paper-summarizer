import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isLocal } from "./src/app/lib/misc";

const publicPathRegexes: RegExp[] = [
  /^\/$/,
  /^\/articles\/\d+\/translations\/\d+\/?$/,
  /^\/file\/\d+\/?$/,
]

function isPublicPath(pathname: string): boolean {
  return publicPathRegexes.some((re) => re.test(pathname))
}

export function middleware(request: NextRequest) {
  console.log("middleware")
  const pathname = request.nextUrl.pathname

  if (!isLocal() && !isPublicPath(pathname)) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
