import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import authOptions from "@/lib/auth"
import { FinalGradeRankClass } from "@/types"
import getClassRank from "@/utils/class-rank"

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams
  const session = await getServerSession(authOptions)
  const userid = searchParams.get("userid") ?? session?.user.studentID
  const year = searchParams.get("year") ?? cookies().get("cookie_year")?.value
  const sem = searchParams.get("sem") ?? cookies().get("cookie_sem")?.value

  const classRankList: FinalGradeRankClass[] = await getClassRank(
    userid ?? "",
    year ?? "",
    sem ?? ""
  )

  return NextResponse.json(classRankList)
}
