import { NextRequest, NextResponse } from 'next/server'

import getAuth from '@/lib/get-auth'
import { prisma } from '@/lib/prisma'
import redis from '@/lib/redis'
import getUser from '@/utils/user'
// import getClassName from '@/utils/class-name'
import { Logs } from '@prisma/client'

export const GET = async (req: NextRequest) => {
  const accessToken = req.headers.get('authorization')?.replace('Bearer ', '') || ''
  const auth = await getAuth(accessToken)

  const searchParams = req.nextUrl.searchParams

  const page = searchParams.get('page') || '1'
  const limit = searchParams.get('limit') || '10'

  // 權限要是 SUPER_ADMIN

  if (auth?.role === 'SUPER_ADMIN') {
    const allLog = await prisma.logs.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: true
      },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit)
    })

    return NextResponse.json(allLog)
  }
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export const POST = async (req: NextRequest) => {
  const accessToken = req.headers.get('authorization')?.replace('Bearer ', '') || ''
  const auth = await getAuth(accessToken)

  const res: Logs = await req.json()

  if (
    process.env.NODE_ENV === 'production' &&
    auth?.userId &&
    auth.userId !== process.env.ADMINSTUDENTID &&
    auth.provider !== 'credentials'
  ) {
    try {
      const { img } = await getUser(auth.userId)
      await prisma.logs.create({
        data: {
          ip: res.ip,
          avatar: img.replace('https://tipfile.takming.edu.tw/stuphoto/', ''),
          deviceType: res.deviceType,
          deviceVendor: res.deviceVendor,
          deviceModel: res.deviceModel,
          browserName: res.browserName,
          browserVersion: res.browserVersion,
          osName: res.osName,
          osVersion: res.osVersion,
          referer: res.referer,
          path: res.path,
          user: {
            connect: {
              id: auth.userId
            }
          }
        }
      })
      const allLog = await prisma.logs.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: true
        }
      })
      // 刪除原本的快取重新寫入
      await redis.del('logs')
      await redis.call('JSON.SET', 'logs', '$', JSON.stringify(allLog))
      return NextResponse.json({ status: 'success', message: 'Log created' })
    } catch (error) {
      console.log('error', error)
    }
  }

  return NextResponse.json({ status: 'fail', message: 'Log not created' })
}
