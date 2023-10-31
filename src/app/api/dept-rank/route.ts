import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import getDeptRank from "@/utils/dept-rank"
import { FinalGradeRankClass } from "@/types"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"

export const GET = async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams
    const session = await getServerSession(authOptions)
    const year = searchParams.get("year") ?? cookies().get("cookie_year")?.value
    const sem = searchParams.get("sem") ?? cookies().get("cookie_sem")?.value
    const userid = searchParams.get("userid") ?? session?.user.studentID

    const classid = searchParams.get("classid")
    const start = searchParams.get("start")
    const end = searchParams.get("end")

    const deptRankList: FinalGradeRankClass[] = await getDeptRank(
        userid ?? "",
        year ?? "",
        sem ?? ""
    )

    return NextResponse.json(deptRankList)
}
