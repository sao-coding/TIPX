import { NextRequest, NextResponse } from "next/server"

import getGitLog from "@/utils/git-log"

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams
  const limit = searchParams.get("limit") ?? undefined
  const commits = await getGitLog(limit)
  // 延遲 1000 毫秒
  await new Promise((resolve) => setTimeout(resolve, 5000))
  return NextResponse.json(commits)
}
