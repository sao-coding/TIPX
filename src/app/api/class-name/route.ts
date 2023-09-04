import { NextRequest, NextResponse } from "next/server"
import getClassName from "@/utils/class-name"
import { ClassName } from "@/types"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"

export const GET = async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams
    const session = await getServerSession(authOptions)
    const userid = searchParams.get("userid") ?? session?.user.studentID

    const className: ClassName = await getClassName(userid ?? "")

    return NextResponse.json(className)
}
