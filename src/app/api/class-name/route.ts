import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import authOptions from "@/lib/auth"
import { ClassName } from "@/types"
import getClassName from "@/utils/class-name"

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams
  const session = await getServerSession(authOptions)
  const userid = searchParams.get("userid") ?? session?.user.studentID
  const year = searchParams.get("year") ?? cookies().get("cookie_year")?.value
  console.log("userid", userid)

  const className: ClassName = await getClassName(userid ?? "")

  return NextResponse.json(className)
}
