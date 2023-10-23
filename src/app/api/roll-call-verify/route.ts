import { NextRequest, NextResponse } from "next/server"

export const POST = async (req: NextRequest) => {
    const { password } = await req.json()

    if (password === process.env.ROLL_CALL_PASSWORD) {
        return NextResponse.json({ status: "success" })
    } else {
        return NextResponse.json({ status: "error" })
    }
}
