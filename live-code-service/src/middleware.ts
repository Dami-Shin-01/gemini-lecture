import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, getAdminToken } from "@/lib/admin-auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 로그인 페이지·API는 인증 없이 허용
  if (pathname === "/admin" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const expected = await getAdminToken();

  if (!token || token !== expected) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
