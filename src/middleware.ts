import { getSession } from "@/utils/session"
import { NextRequest, NextResponse } from "next/server"

// 1. Specify protected and public routes
const startRoutes = ['/smashx/start']
export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname

  console.log("middleware > path:", path)
  const isStartRoute = startRoutes.includes(path)
 
  // 3. Decrypt the session from the cookie
  const session = await getSession()
 
  // 5. Redirect to /login if the user is not authenticated
  if (!isStartRoute && !session?.user) {
    console.log("middleware > redirecting to /start")
    return NextResponse.redirect(new URL('/smashx/start', req.nextUrl))
  }

  console.log("middleware > session:", session)
 
  // 6. Redirect to play if the user is authenticated
  if (
    session?.user &&
    path.startsWith('/smashx/start')
  ) {
    console.log("middleware > redirecting to /smashx")
    return NextResponse.redirect(new URL('/smashx', req.nextUrl))
  }
 
  return NextResponse.next()
}
 
// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|.*\\.js$|.*\\.mp3$).*)'],
}