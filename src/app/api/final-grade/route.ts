import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { JSDOM } from "jsdom"
import getUser from "@/lib/user"
import getFinalGrade from "@/lib/final-grade"
import { FinalGradeRankClass, FinalGradeRank, Conduct, ClassName } from "@/types"

export const GET = async (req: NextRequest) => {
    const year = cookies().get("cookie_year")?.value
    const sem = cookies().get("cookie_sem")?.value
    const userid = cookies().get("cookie_userid")?.value
    const dept = cookies().get("cookie_dept")?.value
    const es = cookies().get("cookie_es")?.value

    // type class or all

    // final-grade-rank?type=class&year=110&sem=1

    const finalGradeRankList = await getFinalGrade(
        userid ?? "",
        year ?? "",
        sem ?? "",
        dept ?? "",
        es ?? ""
    )

    return NextResponse.json(finalGradeRankList)
}
