import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams
  const type = searchParams.get('type')
  switch (type) {
    case 'chart':
      const chart = (await prisma.$queryRaw`
        -- 生成過去7天的日期範圍
        WITH DateRange AS (
            SELECT
                CURDATE() - INTERVAL (n - 1) DAY AS day
            FROM
                (SELECT 1 AS n UNION ALL
                SELECT 2 UNION ALL
                SELECT 3 UNION ALL
                SELECT 4 UNION ALL
                SELECT 5 UNION ALL
                SELECT 6 UNION ALL
                SELECT 7) AS numbers
        ),
        ActiveUsers AS (
            SELECT
                DATE_FORMAT(CONVERT_TZ(createdAt, '+00:00', '+08:00'), '%Y-%m-%d') AS day,
                COUNT(DISTINCT userId) AS user_active
            FROM
                Log
            WHERE
                createdAt >= CONVERT_TZ(CURDATE() - INTERVAL 6 DAY, '+08:00', '+00:00')
            GROUP BY
                DATE_FORMAT(CONVERT_TZ(createdAt, '+00:00', '+08:00'), '%Y-%m-%d')
        )
        SELECT
            DATE_FORMAT(dr.day, '%c/%e') AS day,
            COALESCE(au.user_active, 0) AS user_active
        FROM
            DateRange dr
        LEFT JOIN
            ActiveUsers au
        ON
            DATE_FORMAT(dr.day, '%Y-%m-%d') = au.day
        ORDER BY
            dr.day ASC
        LIMIT 7;
      `) as { day: string; user_active: number }[]

      // 處理 BigInt
      chart.forEach((item) => {
        item.user_active = Number(item.user_active)
      })

      // 獲取最近五天的所有資料 createdAt輸出格式為 x/x
      // const data = await prisma.log.groupBy({
      //   by: ['createdAt'],
      //   _count: {
      //     userId: true
      //   },
      //   where: {
      //     createdAt: {
      //       gte: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 4)
      //     }
      //   }
      // })

      // // 目前日期 - 5天 創建陣列{ day: string; user_active: number }[] 預設user_active為0
      // const chart = Array.from({ length: 5 }, (_, i) => {
      //   const date = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * i)
      //   return {
      //     day: `${date.getMonth() + 1}/${date.getDate()}`,
      //     user_active: 0
      //   }
      // })

      // // 迴圈處理資料
      // data.forEach((item) => {
      //   const date = new Date(item.createdAt)
      //   const index = chart.findIndex((chartItem) => {
      //     return chartItem.day === `${date.getMonth() + 1}/${date.getDate()}`
      //   })

      //   if (index !== -1) {
      //     chart[index].user_active = item._count.userId
      //   }
      // })

      return NextResponse.json(chart)
    case 'today':
      // 今日人數
      // 相同 user 只算一次 不可重複計算
      // const today = (await prisma.$queryRaw`
      // -- 計算台北時間今天的唯一活躍用戶數量
      //   SELECT
      //       COUNT(DISTINCT userId) AS count
      //   FROM
      //       Log
      //   WHERE
      //       CONVERT_TZ(createdAt, '+00:00', '+08:00') >= CURDATE() -- 台北時間今天的開始時間
      //       AND CONVERT_TZ(createdAt, '+00:00', '+08:00') < CURDATE() + INTERVAL 1 DAY; -- 台北時間明天的開始時間
      // `) as { count: number }[]

      // // 處理 BigInt
      // today.forEach((item) => {
      //   item.count = Number(item.count)
      // })
      // return NextResponse.json({
      //   count: today[0].count
      // })

      const today = await prisma.log.count({
        where: {
          createdAt: {
            gte: new Date(new Date().toDateString())
          }
        }
      })

      return NextResponse.json({
        count: today
      })
    case 'user':
      const user = await prisma.user.count()
      return NextResponse.json({
        count: user
      })

    default:
      return NextResponse.json({ message: '錯誤的查詢類型' }, { status: 400 })
  }
}
