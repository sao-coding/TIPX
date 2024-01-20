// 課堂資訊
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import authOptions from "@/lib/auth"
import getCourse from "@/utils/course"

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams
  const session = await getServerSession(authOptions)
  const year = searchParams.get("year") ?? cookies().get("cookie_year")?.value
  const sem = searchParams.get("sem") ?? cookies().get("cookie_sem")?.value
  const userid = searchParams.get("userid") ?? session?.user.studentID

  if (req.nextUrl.searchParams.has("course") === false) {
    const courselist = await getCourse(userid ?? "", year ?? "", sem ?? "")
    return NextResponse.json(courselist)
  } else {
    const name = await getCourse(
      userid ?? "",
      year ?? "",
      sem ?? "",

      req.nextUrl.searchParams.get("course") ?? ""
    )
    return NextResponse.json(name)
  }
}
