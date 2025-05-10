import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams
  const type = searchParams.get('type')
  switch (type) {
    case 'chart': {
      const analytics = (await prisma.$queryRaw`
        WITH RECURSIVE DateRange AS (
            SELECT CURDATE() - INTERVAL 6 DAY AS day
            UNION ALL
            SELECT day + INTERVAL 1 DAY
            FROM DateRange
            WHERE day + INTERVAL 1 DAY <= CURDATE()
        ),
        LogData AS (
            SELECT
                DATE(CONVERT_TZ(createdAt, '+00:00', '+08:00')) AS local_day,
                userId
            FROM Logs
            WHERE createdAt >= CONVERT_TZ(CURDATE() - INTERVAL 6 DAY, '+08:00', '+00:00')
              AND createdAt < CONVERT_TZ(CURDATE() + INTERVAL 1 DAY, '+08:00', '+00:00')
        ),
        Aggregated AS (
            SELECT
                local_day,
                COUNT(*) AS user_view,
                COUNT(DISTINCT userId) AS user_active
            FROM LogData
            GROUP BY local_day
        )
        SELECT
            DATE_FORMAT(dr.day, '%c/%e') AS day,
            COALESCE(ag.user_active, 0) AS user_active,
            COALESCE(ag.user_view, 0) AS user_view
        FROM DateRange dr
        LEFT JOIN Aggregated ag ON dr.day = ag.local_day
        ORDER BY dr.day ASC;
    `) as { day: string; user_active: number; user_view: number }[]

      // 處理 BigInt
      analytics.forEach((item) => {
        item.user_active = Number(item.user_active)
        item.user_view = Number(item.user_view)
      })

      return NextResponse.json({
        status: 'success',
        message: '獲取成功',
        data: analytics
      })
    }
    case 'today': {
      // 今日人數
      // 相同 user 只算一次 不可重複計算
      const today = (await prisma.$queryRaw`
      -- 計算台北時間今天的唯一活躍用戶數量
        SELECT
            COUNT(DISTINCT userId) AS count
        FROM
            Logs
        WHERE
            CONVERT_TZ(createdAt, '+00:00', '+08:00') >= CURDATE() -- 台北時間今天的開始時間
            AND CONVERT_TZ(createdAt, '+00:00', '+08:00') < CURDATE() + INTERVAL 1 DAY; -- 台北時間明天的開始時間
      `) as { count: number }[]

      // 處理 BigInt
      today.forEach((item) => {
        item.count = Number(item.count)
      })
      return NextResponse.json({
        count: today[0].count
      })

      // 台北今天日期
      // const today = (await prisma.$queryRaw`
      //   SELECT COUNT(*) AS count
      //   FROM Logs
      //   WHERE createdAt >= CONVERT_TZ(CURDATE(), '+08:00', '+00:00')
      //     AND createdAt < CONVERT_TZ(CURDATE() + INTERVAL 1 DAY, '+08:00', '+00:00');
      // `) as { count: number }[]

      // // 處理 BigInt
      // today.forEach((item) => {
      //   item.count = Number(item.count)
      // })

      // return NextResponse.json(today[0])
    }
    case 'user': {
      const user = await prisma.user.count()
      return NextResponse.json({
        count: user
      })
    }
    default:
      return NextResponse.json({ message: '錯誤的查詢類型' }, { status: 400 })
  }
}
