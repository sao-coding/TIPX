// middlewares/withHeaders.ts
import { NextFetchEvent, NextMiddleware, NextRequest } from "next/server"
import { MiddlewareFactory } from "./types"
export const withHeaders: MiddlewareFactory = (next: NextMiddleware) => {
    return async (request: NextRequest, _next: NextFetchEvent) => {
        const res = await next(request, _next)
        if (res) {
            res.headers.set("X-Content-Type-Options", "nosniff")
            res.headers.set("X-DNS-Prefetch-Control", "off")
            res.headers.set("X-Frame-Options", "SAMEORIGIN")
            res.headers.set("X-Permitted-Cross-Domain-Policies", "none")
            res.headers.set("X-XSS-Protection", "1; mode=block")
            res.headers.set("X-Download-Options", "noopen")
            res.headers.set("Set-Cookie", "Secure")
        }
        return res
    }
}
