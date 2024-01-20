import { NextRequest, NextResponse } from "next/server"

import getGitLog from "@/utils/git-log"

export const GET = async (req: NextRequest) => {
  const commits = await getGitLog()
  return NextResponse.json(commits)
}
