import { NextRequest, NextResponse } from 'next/server'

import getAuth from '@/lib/get-auth'
import { prisma } from '@/lib/prisma'

export const POST = async (req: NextRequest) => {
  const accessToken = req.headers.get('authorization')?.replace('Bearer ', '') || ''
  const auth = await getAuth(accessToken)

  // model Download {
  //     id        String   @id @default(nanoid())
  //     userId    String
  //     createdAt DateTime @default(now())
  //     user      User     @relation(fields: [userId], references: [id])

  //     @@index([userId], map: "Download_userId_fkey")
  //   }

  if (auth) {
    await prisma.download.create({
      data: {
        userId: auth.userId
      }
    })
    return NextResponse.json({ success: true })
  } else {
    await prisma.download.create({
      data: {
        userId: 'D11019139'
      }
    })
    return NextResponse.json({ success: true })
  }
}
