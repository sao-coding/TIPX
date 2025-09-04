import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export const GET = async (req: NextRequest) => {
  // 建立函式重用
  const getCalendarPage = async (page: number) => {
    const url = `https://secretary.takming.edu.tw/p/412-1004-532-${page}.php`
    const res = await fetch(url)
    const html = await res.text()
    return html
  }

  // 先取得第一頁，並解析總頁數
  const firstPageHtml = await getCalendarPage(1)
  const $ = cheerio.load(firstPageHtml)

  // 獲取頁數
  const totalPagesText = $('.pg-txt span').first().text()
  const totalPages = parseInt(totalPagesText, 10) || 1
  // 宣告一個陣列來存放所有頁面的活動
  let allCalendarItems: { title: string; link: string }[] = []

  // 迭代所有頁面
  for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
    const pageHtml = currentPage === 1 ? firstPageHtml : await getCalendarPage(currentPage)
    const $page = cheerio.load(pageHtml)

    // 抓取當前頁面的活動
    const calendarItems = $page('#pageptlist .row.listBS')
      .map((i, el) => {
        const title = $page(el)
          .find('.mtitle a')
          .text()
          .replace(/\n\s*\n\s*/g, '')
          .trim()
        const link =
          'https://secretary.takming.edu.tw' + ($page(el).find('.mtitle a').attr('href') || '')
        return { title, link }
      })
      .get()

    // 將當前頁面的活動加入總陣列
    allCalendarItems = allCalendarItems.concat(calendarItems)
  }

  return NextResponse.json({
    status: 'success',
    message: '取得行事曆成功',
    data: allCalendarItems
  })
}
