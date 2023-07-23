import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import getSemGrade from "@/lib/sem-grade"

export const GET = async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams
    const year = searchParams.get("year") ?? cookies().get("cookie_year")?.value
    const sem = searchParams.get("sem") ?? cookies().get("cookie_sem")?.value
    const userid = searchParams.get("userid") ?? cookies().get("cookie_userid")?.value
    const dept = cookies().get("cookie_dept")?.value
    const es = cookies().get("cookie_es")?.value

    const semGrade = await getSemGrade(userid ?? "", year ?? "", sem ?? "", dept ?? "", es ?? "")
    // console.log({ semScore })

    return NextResponse.json(semGrade)
}
