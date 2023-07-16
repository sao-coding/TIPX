import { NextRequest, NextResponse } from "next/server"

export const POST = async (req: NextRequest) => {
    // const authToken = req.headers.get("Authorization")?.startsWith("Bearer ")

    // if (
    //     authToken === false ||
    //     req.headers.get("Authorization")?.split(" ")[1] !== process.env.AUTHORIZATION
    // ) {
    //     // Unauthorized
    //     return NextResponse.json(
    //         {
    //             error: "Unauthorized",
    //         },
    //         {
    //             status: 401,
    //         }
    //     )
    // }

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
