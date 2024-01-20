import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import authOptions from "@/lib/auth"
import getLineID from "@/utils/lineid"

export const GET = async (req: NextRequest) => {
  const session = await getServerSession(authOptions)
  const userid = session?.user.studentID

  const lineid = await getLineID(userid ?? "")

  return NextResponse.json(lineid)
}
