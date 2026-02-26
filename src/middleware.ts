import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const pathname = request.nextUrl.pathname;

  if (token && (pathname.startsWith("/login") || pathname.startsWith("/signup"))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // if (!token && (pathname.startsWith("/api/order"))) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  if (!token && (pathname.startsWith("/dashboard") || pathname.startsWith("/api/dashboard"))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (
    (token?.role !== "Admin") && (pathname.startsWith("/dashboard/admin") || pathname.startsWith("/api/dashboard/admin"))) {
    return NextResponse.redirect(new URL("/logout", request.url));
  }

  if (
    !["Admin", "Seller"].includes(token?.role as string) &&
    (pathname.startsWith("/api/dashboard/seller") || pathname.startsWith("/dashboard/seller"))
  ) {
    return NextResponse.redirect(new URL("/logout", request.url));
  }

  return NextResponse.next();

}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/api/order",
    "/dashboard/:path*",
    "/api/dashboard/:path*",
  ],
}