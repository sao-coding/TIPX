// 登入驗證
import { NextRequest, NextResponse } from "next/server"

export const POST = async (req: NextRequest) => {
    const token = await req.json()

    if (token.token !== process.env.AUTHORIZATION) {
        return NextResponse.json(
            {
                error: "Unauthorized",
            },
            {
                status: 401,
            }
        )
    }

    return NextResponse.json({
        token: process.env.AUTHORIZATION,
    })
}
