import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import authOptions from '@/lib/auth'
import getPasseord from '@/utils/password'

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams
  const session = await getServerSession(authOptions)
  const userid = searchParams.get('userid') ?? session?.user.studentID
  const password = await getPasseord(userid ?? '')

  return NextResponse.json({ password })
}
