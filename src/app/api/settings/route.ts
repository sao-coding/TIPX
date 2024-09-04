import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import getAuth from '@/lib/get-auth'
import { prisma } from '@/lib/prisma'

export const GET = async (req: NextRequest) => {
  const accessToken = req.headers.get('authorization')?.replace('Bearer ', '') || ''
  const auth = await getAuth(accessToken)

  const searchParams = req.nextUrl.searchParams

  const userid = searchParams.get('userid') ?? auth?.userId
  const year = searchParams.get('year') ?? cookies().get('year')?.value
  const sem = searchParams.get('sem') ?? cookies().get('sem')?.value

  //   model UserSettings {
  //     id       String  @id @default(nanoid())
  //     theme    String
  //     location Boolean
  //     userId   String  @unique
  //     user     User    @relation(fields: [userId], references: [id])
  // }

  const settings = await prisma.userSettings.findFirst({
    where: {
      userId: userid
    }
  })

  return NextResponse.json(settings)
}
