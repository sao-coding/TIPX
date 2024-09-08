import { NextRequest, NextResponse } from 'next/server'

import { db } from '@/lib/firebase-admin'
import getAuth from '@/lib/get-auth'
import { prisma } from '@/lib/prisma'
import redis from '@/lib/redis'
import getClassName from '@/utils/class-name'
import { Log } from '@prisma/client'

export const GET = async (req: NextRequest) => {
  if (req.nextUrl.searchParams.has('id') && req.nextUrl.searchParams.has('limit')) {
    const id = req.nextUrl.searchParams.get('id')
    const limits = req.nextUrl.searchParams.get('limit') ?? '10'

    // const log =
    //     await prisma.$queryRaw`SELECT * FROM log ORDER BY time DESC LIMIT ${id}, ${limit}`

    // return NextResponse.json(log)

    if (id === '0') {
      const log = await db.collection('log').orderBy('time', 'desc').limit(parseInt(limits)).get()

      // return NextResponse.json(
      //     log.docs.map((doc) => {
      //         return { id: doc.id, ...doc.data() }
      //     })
      // )

      const logData = []

      for (const doc of log.docs) {
        const data = doc.data()
        data.class = await (await getClassName(data.stuID)).class
        data.id = doc.id
        logData.push(data)
      }

      return NextResponse.json(logData)
    } else {
      const log = await db
        .collection('log')
        .orderBy('time', 'desc')
        .startAfter(id)
        .limit(parseInt(limits))
        .get()

      // log.docs.map((doc) => {
      //     console.log(doc.id, doc.data())
      // })

      // return NextResponse.json(
      //     log.docs.map(async (doc) => {
      //         return { id: doc.id, class: await getClassName(doc.data().stuID), ...doc.data() }
      //     })
      // )
      const logData = []
      for (const doc of log.docs) {
        const data = doc.data()
        data.class = await (await getClassName(data.stuID)).class
        data.id = doc.id
        logData.push(data)
      }

      return NextResponse.json(logData)
    }
  }
}

export const POST = async (req: NextRequest) => {
  const accessToken = req.headers.get('authorization')?.replace('Bearer ', '') || ''
  const auth = await getAuth(accessToken)

  const res: Log = await req.json()

  if (
    process.env.NODE_ENV === 'production' &&
    auth?.userId &&
    auth?.userId !== process.env.ADMINSTUDENTID
  ) {
    try {
      await prisma.log.create({
        data: {
          ip: res.ip,
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
      const allLog = await prisma.log.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: true
        }
      })
      // 刪除原本的快取重新寫入
      await redis.del('log')
      await redis.call('JSON.SET', 'log', '$', JSON.stringify(allLog))
      return NextResponse.json({ status: 'success', message: 'Log created' })
    } catch (error) {
      console.log('error', error)
    }
  }

  return NextResponse.json({ status: 'fail', message: 'Log not created' })
}
