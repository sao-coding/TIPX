// 處理身分驗證
import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
    console.log("middleware: ", req.nextUrl.pathname)
    const nextAuthToken = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    })

    if (req.nextUrl.pathname.startsWith("/api")) {
        console.log("middleware: api")
        if (
            req.nextUrl.pathname === "/api/authorize" ||
            req.nextUrl.pathname.startsWith("/api/post") ||
            req.nextUrl.pathname.startsWith("/api/auth")
        ) {
            return
        }
        const authToken = req.headers.get("Authorization")?.startsWith("Bearer ")
        if (
            authToken === false ||
            req.headers.get("Authorization")?.split(" ")[1] !== process.env.AUTHORIZATION
        ) {
            if (!nextAuthToken) {
                return NextResponse.json(
                    {
                        error: "Unauthorized",
                    },
                    {
                        status: 401,
                    }
                )
            }
        }
        // timetable course user
    } else if (
        req.nextUrl.pathname.startsWith("/timetable") ||
        req.nextUrl.pathname.startsWith("/course") ||
        req.nextUrl.pathname.startsWith("/user")
    ) {
        const token = req.cookies.get("token")?.value

        if (!token && !nextAuthToken) {
            console.log("middleware: no token")
            return NextResponse.redirect(
                new URL(`/login?callbackUrl=${req.nextUrl.pathname}`, req.nextUrl)
            )
        }
    }
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|login|img|_vercel|pwa|^/$).*)"],
}
