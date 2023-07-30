import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import getUser from "@/lib/user"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
import { User } from "@/types"

export const GET = async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams
    const session = await getServerSession(authOptions)
    const userid = searchParams.get("userid") ?? session?.user.studentID
    const year = cookies().get("cookie_year")?.value
    const sem = cookies().get("cookie_sem")?.value
    const dept = cookies().get("cookie_dept")?.value
    const es = cookies().get("cookie_es")?.value

    const infolist: User = await getUser(userid ?? "", year ?? "", sem ?? "", dept ?? "", es ?? "")

    return NextResponse.json(infolist)
}
