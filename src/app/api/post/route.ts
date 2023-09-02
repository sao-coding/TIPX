// 學校公告
import { NextRequest, NextResponse } from "next/server"
import getPost from "@/lib/post"

export const GET = async (req: NextRequest) => {
    // 獲取公告 全部貼文
    if (
        req.nextUrl.searchParams.get("type") === "all" &&
        req.nextUrl.searchParams.has("id") &&
        req.nextUrl.searchParams.has("limit")
    ) {
        const id = Number(req.nextUrl.searchParams.get("id"))
        const limit = Number(req.nextUrl.searchParams.get("limit"))

        const PostListAll = await getPost("all", id, limit)
        return NextResponse.json(PostListAll)
    }
    if (req.nextUrl.searchParams.get("type") === "one" && req.nextUrl.searchParams.get("id")) {
        const id = Number(req.nextUrl.searchParams.get("id"))
        const Post = await getPost("one", id)

        return NextResponse.json(Post)
    }
}
