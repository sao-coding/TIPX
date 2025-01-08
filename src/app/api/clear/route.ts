// 操行成績
import { NextRequest, NextResponse } from 'next/server'

import getAuth from '@/lib/get-auth'
import redis from '@/lib/redis'

export const DELETE = async (req: NextRequest) => {
  const accessToken = req.headers.get('authorization')?.replace('Bearer ', '') || ''
  const auth = await getAuth(accessToken)

  const userid = req.nextUrl.searchParams.get('userid') ?? auth?.userId
  // const { userid } = await req.json()
  // 清理 redis 有關 名字有包含 userid 的所有 key
  try {
    const keys = (await redis.call('KEYS', `*${userid}*`)) as string[]
    console.log(`${userid} keys`, keys)
    keys.forEach(async (key) => {
      // 如果 userid 是 D11019139 不清除 searchAuth_D11019139
      if (key === `searchAuth_${userid}`) return
      await redis.call('DEL', key)
    })
    return NextResponse.json({ message: 'success' })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ message: 'error' })
  }
}
