import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { JSDOM } from "jsdom"
import getDeptRank from "@/lib/dept-rank"
import { FinalGradeRankClass, FinalGradeRank, Conduct, ClassName } from "@/types"

export const GET = async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams
    const year = searchParams.get("year") ?? cookies().get("cookie_year")?.value
    const sem = searchParams.get("sem") ?? cookies().get("cookie_sem")?.value
    const userid = searchParams.get("userid") ?? cookies().get("cookie_userid")?.value
    const dept = cookies().get("cookie_dept")?.value
    const es = cookies().get("cookie_es")?.value
    const classid = searchParams.get("classid")
    const start = searchParams.get("start")
    const end = searchParams.get("end")

    const deptRankList = await getDeptRank(
        userid ?? "",
        year ?? "",
        sem ?? "",
        dept ?? "",
        es ?? "",
        classid ?? "0",
        start ?? "0",
        end ?? "0"
    )

    return NextResponse.json(deptRankList)
}
