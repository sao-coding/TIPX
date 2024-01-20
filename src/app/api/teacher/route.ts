import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import authOptions from "@/lib/auth"
import { Teacher } from "@/types"
import getTeacher from "@/utils/teacher"

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams
  const session = await getServerSession(authOptions)
  const year = searchParams.get("year") ?? cookies().get("cookie_year")?.value
  const sem = searchParams.get("sem") ?? cookies().get("cookie_sem")?.value
  const userid = searchParams.get("userid") ?? session?.user.studentID

  const teacher: Teacher = await getTeacher(
    userid ?? "",
    year ?? "",
    sem ?? "",
    req.nextUrl.searchParams.get("type") ?? "",
    req.nextUrl.searchParams.get("course") ?? ""
  )

  return NextResponse.json(teacher)
}
