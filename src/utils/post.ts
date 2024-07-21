// 學校公告
import * as cheerio from 'cheerio'

import redis from '@/lib/redis'
import { Announcement } from '@/types'
import { Post } from '@/types'

const getPost = async (
  type: string,
  id?: number,
  page?: number,
  limit?: number,
  exclude?: string
) => {
  // 獲取公告 全部貼文
  if (type === 'all') {
    let announcement: Announcement = {
      id: '',
      title: '',
      sticky: false,
      category: '',
      unit: '',
      date: '',
      deadline: ''
    }

    const announcementListAll: Announcement[] = []
    const announcementList: Announcement[] = []

    // 查尋是否有快取
    const cache = (await redis.call('JSON.GET', 'announcement')) as string | null

    const getData = async () => {
      console.log('no cache')
      const res = await fetch('https://netinfo.takming.edu.tw/tip/post/post_index_all.php')

      const buffer = await res.arrayBuffer()
      let html = new TextDecoder('big5').decode(buffer)

      const $ = cheerio.load(html)
      $("table[bordercolor='#FFFFFF' ] tr:not(:first-child)").map((_, row) => {
        const cells = $(row).find('td')
        const sticky = cells.eq(1).find('img').length ? true : false
        announcement.sticky = sticky
        const link = cells.eq(1).find('a').attr('href')
        // post_OneShow.php?SerialItem=103304
        // 取得網址的ID
        const id = link?.split('=')[1]
        announcement.id = id ?? ''

        if (exclude === 'outside' && cells.eq(0).text().includes('校外事項')) {
          return
        }

        cells.each((index, cell) => {
          const list = $(cell).text().replace(/\n/g, '')
          if (index === 0) {
            announcement.category = list
          } else if (index === 1) {
            announcement.title = list
          } else if (index === 2) {
            announcement.unit = list
          } else if (index === 3) {
            announcement.date = list
          } else if (index === 4) {
            announcement.deadline = list
          }
        })

        announcementListAll.push(announcement)
        announcement = {
          id: '',
          title: '',
          sticky: false,
          category: '',
          unit: '',
          date: '',
          deadline: ''
        }
      })
    }

    if (!cache) {
      await getData()
      // 快取公告 設定快取時間為 1 小時
      await redis.call('JSON.SET', 'announcement', '$', JSON.stringify(announcementListAll))
      await redis.call('EXPIRE', 'announcement', 3600)
    } else {
      console.log('use cache')
      announcementListAll.push(...JSON.parse(cache))
    }

    if (page && limit) {
      const start = page * limit - limit
      const end = start + limit
      announcementList.push(...announcementListAll.slice(start, end))
    } else {
      console.log('limit and page are not defined')
      announcementList.push(...announcementListAll)
    }

    return announcementList
  }
  // if (req.nextUrl.searchParams.get("type") === "one" && req.nextUrl.searchParams.get("id")) {
  if (type === 'one' && id !== undefined) {
    const post: Post = {
      id: id.toString(),
      title: '',
      date: '',
      deadline: '',
      unit: '',
      publisher: {
        name: '',
        email: ''
      },
      category: '',
      content: '',
      file: [],
      link: ''
    }

    const postdata: string[] = []

    const res = await fetch(
      `https://netinfo.takming.edu.tw/tip/post/post_OneShow.php?SerialItem=${id}`
    )
    const buffer = await res.arrayBuffer()
    let html = new TextDecoder('big5').decode(buffer)

    const $ = cheerio.load(html)
    $('.newstd').map((index, row) => {
      if (index === 3) {
        postdata.push($(row).text().split('　')[0])
        const cell = $(row).find('a')
        const name = cell.text()
        const email = cell.attr('href')?.replace('mailto:', '')
        post.publisher.name = name ?? ''
        post.publisher.email = email ?? ''
      } else if (index === 7) {
        const cells = $(row).find('a')
        cells.each((_, cell) => {
          const title = $(cell).text()
          const link = $(cell).attr('href')
          post.file.push({ title: title ?? '', link: link ?? '' })
        })
      } else if (index === 8) {
        const cells = $(row).find('a')
        cells.each((_, cell) => {
          const link = $(cell).attr('href')
          post.link = link ?? ''
        })
      } else {
        postdata.push($(row).text())
      }
    })

    post.title = postdata[0]
    post.date = postdata[1]
    post.deadline = postdata[2]
    post.unit = postdata[3].replace(/\n/g, '')
    post.category = postdata[4]
    post.content = postdata[6]

    return post
  }
}

export default getPost
