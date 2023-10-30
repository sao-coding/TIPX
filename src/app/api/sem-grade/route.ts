import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import getSemGrade from "@/utils/sem-grade"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"

export const GET = async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams
    const session = await getServerSession(authOptions)
    const year = searchParams.get("year") ?? cookies().get("cookie_year")?.value
    const sem = searchParams.get("sem") ?? cookies().get("cookie_sem")?.value
    const userid = searchParams.get("userid") ?? session?.user.studentID

    const semGrade = await getSemGrade(userid ?? "", year ?? "", sem ?? "")
    // console.log({ semScore })

    return NextResponse.json(semGrade)
}
