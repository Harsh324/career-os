import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get("career_os_refresh_token")?.value;

  // 1. If trying to access /dashboard/login while already holding refresh cookie, redirect to /dashboard
  if (pathname === "/dashboard/login") {
    if (refreshToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // 2. Protected /dashboard routes: redirect to login if no refresh cookie is present
  if (pathname.startsWith("/dashboard")) {
    if (!refreshToken) {
      const loginUrl = new URL("/dashboard/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
