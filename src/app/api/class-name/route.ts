import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import getClassName from "@/utils/class-name"
import getCurrentYearSem from "@/utils/current-year-sem"
import { ClassName } from "@/types"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"

export const GET = async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams
    const session = await getServerSession(authOptions)
    const userid = searchParams.get("userid") ?? session?.user.studentID
    const year = searchParams.get("year") ?? cookies().get("cookie_year")?.value

    const className: ClassName = await getClassName(userid ?? "", year ?? "")

    return NextResponse.json(className)
}
