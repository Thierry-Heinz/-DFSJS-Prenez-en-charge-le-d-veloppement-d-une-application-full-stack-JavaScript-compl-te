import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';
export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  // THIS IS NOT SECURE!
  // This is the recommended approach to optimistically redirect users
  // We recommend handling auth checks in each page/route
  if (!sessionCookie) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL('/dashboard', request.url));
}
export const config = {
  matcher: ['/'], // Specify the routes the middleware applies to
};
