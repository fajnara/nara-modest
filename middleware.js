import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Pass current pathname to server components via header.
  // Used by AdminLayout to bypass auth check on /admin/login (prevents redirect loop).
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  // Allow login page through (no auth required to see the form)
  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Check token for all other /admin routes
  if (pathname.startsWith("/admin")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/admin/:path*"],
};
