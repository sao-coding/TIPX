import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import authOptions from '@/lib/auth'
import { User } from '@/types'
import getUser from '@/utils/user'

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams
  const session = await getServerSession(authOptions)
  const userid = searchParams.get('userid') ?? session?.user.studentID
  const year = cookies().get('cookie_year')?.value
  const sem = cookies().get('cookie_sem')?.value
  const type = searchParams.get('type')

  const infolist: User = await getUser(userid ?? '', type ?? '')

  return NextResponse.json(infolist)
}
