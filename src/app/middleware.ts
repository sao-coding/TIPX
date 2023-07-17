// 如果 cookies 中没有 token，跳转到登录页
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
    if (!req.cookies.get("token")) {
        return NextResponse.redirect("/login")
    }
}
