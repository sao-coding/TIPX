import * as cheerio from 'cheerio'

import redis from '@/lib/redis'
import { Credit } from '@/types'

const getCredit = async (userid: string, year: string, sem: string) => {
  const title: string[] = []
  const total: number[] = []
  const get: number[] = []

  const credit: Credit[] = []

  const getData = async () => {
    const res = await fetch('https://netinfo.takming.edu.tw/tip/stu_data_new.php', {
      headers: {
        cookie: `cookie_rgno=${userid}; cookie_userid=${userid}; cookie_year=${year + 1}; cookie_sem=${sem};`,
        Referer: 'https://netinfo.takming.edu.tw/tip/list_fun.php'
      }
    })
    const buffer = await res.arrayBuffer()
    const html = new TextDecoder('big5').decode(buffer)

    const $ = cheerio.load(html)
    const rows = Array.from(
      $(
        'body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > p:nth-child(13) > table > tbody > tr'
      )
    )

    for (let i = 0; i < rows.length; i++) {
      const cells = Array.from($(rows[i]).find('td'))
      for (let j = 0; j < cells.length; j++) {
        if (i === 0 && j === 0) continue
        if (i === 0) {
          title.push($(cells[j]).text() ?? '')
        }
        if (i === 1 && j !== 0) {
          total.push(Number($(cells[j]).text() ?? ''))
        }
        if (i === 2 && j !== 0) {
          get.push(Number($(cells[j]).text() ?? ''))
        }
      }
    }

    for (let i = 0; i < title.length; i++) {
      credit.push({
        year: title[i].slice(0, 3),
        sem: title[i].slice(3, 4) === '上' ? '1' : '2', // "上" => "1" "下" => "2
        total: Number(total[i]),
        get: Number(get[i])
      })
    }
  }

  const cache = (await redis.call('JSON.GET', `${userid}:${year}:${sem}:credit`)) as string | null
  if (!cache) {
    console.log('no cache')
    await getData()
    // 設定快取時間為 1 個月
    await redis.call('JSON.SET', `${userid}:${year}:${sem}:credit`, '$', JSON.stringify(credit))
    await redis.call('EXPIRE', `${userid}:${year}:${sem}:credit`, 2592000)
  } else {
    console.log('use cache')
    credit.push(...JSON.parse(cache))
  }

  return credit
}

export default getCredit
