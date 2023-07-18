// 處理身分驗證
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
    console.log("middleware: ", req.nextUrl.pathname)
    if (req.nextUrl.pathname.startsWith("/api")) {
        console.log("middleware: api")
        if (
            req.nextUrl.pathname === "/api/authorize" ||
            req.nextUrl.pathname.startsWith("/api/post")
        ) {
            return
        }
        const authToken = req.headers.get("Authorization")?.startsWith("Bearer ")
        if (
            authToken === false ||
            req.headers.get("Authorization")?.split(" ")[1] !== process.env.AUTHORIZATION
        ) {
            return NextResponse.json(
                {
                    error: "Unauthorized",
                },
                {
                    status: 401,
                }
            )
        }
    } else if (req.nextUrl.pathname !== "/") {
        const token = req.cookies.get("token")?.value
        if (!token) {
            console.log("middleware: no token")
            return NextResponse.redirect(
                new URL(`/login?redirect=${req.nextUrl.pathname}`, req.nextUrl)
            )
        }
    }
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login|^/$).*)"],
}
