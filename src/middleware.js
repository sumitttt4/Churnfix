import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect /dashboard routes
  if (pathname.startsWith("/dashboard")) {
    // Check for Better Auth session token cookie
    const sessionToken =
      request.cookies.get("better-auth.session_token")?.value;

    if (!sessionToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect authenticated users away from login/signup
  if (pathname === "/login" || pathname === "/signup") {
    const sessionToken =
      request.cookies.get("better-auth.session_token")?.value;

    if (sessionToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
