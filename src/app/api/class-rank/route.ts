import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { JSDOM } from "jsdom"
import getClassRank from "@/lib/class-rank"
import { FinalGradeRankClass, FinalGradeRank, Conduct, ClassName } from "@/types"

export const GET = async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams
    const year = searchParams.get("year") ?? cookies().get("cookie_year")?.value
    const sem = searchParams.get("sem") ?? cookies().get("cookie_sem")?.value
    const userid = searchParams.get("userid") ?? cookies().get("cookie_userid")?.value
    const dept = cookies().get("cookie_dept")?.value
    const es = cookies().get("cookie_es")?.value
    const start = searchParams.get("start")
    const end = searchParams.get("end")

    const classRankList = await getClassRank(
        userid ?? "",
        year ?? "",
        sem ?? "",
        dept ?? "",
        es ?? "",
        start ?? "0",
        end ?? "20"
    )

    return NextResponse.json(classRankList)
}
