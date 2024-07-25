// 作業清單
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import * as cheerio from 'cheerio'

import authOptions from '@/lib/auth'
import { Course, HwList } from '@/types'
import getCourse from '@/utils/course'

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams
  const session = await getServerSession(authOptions)
  const year = searchParams.get('year') ?? cookies().get('cookie_year')?.value
  const sem = searchParams.get('sem') ?? cookies().get('cookie_sem')?.value
  const userid = searchParams.get('userid') ?? session?.user.studentID
  const course = searchParams.get('course') ?? ''
  const type = searchParams.get('type') ?? 'hw'

  let hwlist: HwList[] = []

  const fetchURL = async (type: string, course?: string) => {
    const url = `https://netinfo.takming.edu.tw/tip/list_course_${type}.php?opno=${course}`
    let res = await fetch(url, {
      headers: {
        cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${year}; cookie_sem=${sem}; `,
        Referer: 'https://netinfo.takming.edu.tw/tip/list_fun.php'
      }
    })

    const buffer = await res.arrayBuffer()
    const html = new TextDecoder('big5').decode(buffer)

    return cheerio.load(html)
  }

  const crawler = async (courseId: string, courseName?: string) => {
    const hwdata1: string[][] = []
    const hwdata2: string[][] = []

    let $: cheerio.CheerioAPI

    $ = await fetchURL('uploadhw', courseId)
    // 剔除前兩行 跟 最後一行
    const rows = $('body >  form > table > tbody > tr > td > table > tbody > tr').slice(2, -1)
    rows.each((_, ele) => {
      const cells = $(ele).find("td[bgcolor='#FFFFCC'] font")
      const hw: string[] = []
      cells.each((i, cell) => {
        let text = $(cell).text().trim()
        switch (i) {
          case 0:
            const file =
              $(cell)
                .find('input')
                .attr('onclick')
                ?.replace(/DownDoc\(\"|\"\)/g, '') ?? ''
            // console.log(i + " " + text + "\n" + file)
            hw.push(text)
            hw.push(file)
            break
          case 3:
            const upload =
              $(cell)
                .find('input')
                .attr('onclick')
                ?.replace(/OpenWin\(|\);/g, '') ?? ''
            // console.log(i + " " + upload)
            hw.push(upload)
            break
          case 4:
            if (text === '已上傳本作業') {
              text = '已繳交'
            } else {
              text = '未繳交'
            }
            // console.log(i + " " + text)
            hw.push(text)
            break
          default:
            // console.log(i + " " + text)
            hw.push(text)
            break
        }
      })
      // console.log("-------------------------")
      hwdata1.push(hw)
    })

    $ = await fetchURL('downhw', courseId)
    // 剔除前兩行 跟 最後一行
    const rows2 = $('body > form > table > tbody > tr > td > table > tbody > tr').slice(2, -1)
    if (rows2.length === 0) {
      // 於期中考/期末考期間不提供下載功能
      if ($('body').text().includes('考試期間不開放本功能')) {
        for (let i = 0; i < hwdata1.length; i++) {
          hwlist.push({
            title: hwdata1[i][0],
            file: hwdata1[i][1],
            start: hwdata1[i][3],
            end: hwdata1[i][4],
            upload: hwdata1[i][2],
            download: '考試期間不開放本功能',
            size: '考試期間不開放本功能',
            status: hwdata1[i][5]
          })
        }
        return NextResponse.json({
          status: '段考期間',
          msg: '於期中考/期末考期間\n不提供下載功能',
          data: hwlist
        })
      }
    }

    rows2.each((_, ele) => {
      const cells = $(ele).find("td[bgcolor='#FFFFCC'] font")
      const hw: string[] = []
      cells.each((i, cell) => {
        switch (i) {
          case 3:
            const link =
              $(cell)
                .find('input')
                .attr('onclick')
                ?.replace(/DownDoc\(\"|\"\)/g, '') ?? ''
            // console.log(i + " " + link)
            hw.push(link)
            break
          case 4:
            // const text = $(cell).text().replace(/bytes/g, "").trim()
            const text = $(cell).text().split('bytes')[0].trim()
            // console.log(i + " " + text)
            // 若有包含 請同學重新上傳 表示檔案已被刪除
            if (text === '0') {
              hw.push('檔案已被刪除')
            } else {
              hw.push(text)
            }
            // if (text.includes("請同學重新上傳")) {
            //   hw.push("檔案已被刪除")
            // } else {
            //   hw.push(text)
            // }
            break
          default:
            // console.log(i + " " + $(cell).text().trim())
            break
        }
      })
      // console.log("-------------------------")
      hwdata2.push(hw)
    })

    for (let i = 0; i < hwdata1.length; i++) {
      hwlist.push({
        title: hwdata1[i][0],
        file: hwdata1[i][1],
        start: hwdata1[i][2],
        end: hwdata1[i][3],
        upload: hwdata1[i][4],
        download: hwdata2[i][0],
        size: hwdata2[i][1],
        status: hwdata1[i][5],
        course: courseName
      })
    }
  }

  if (type === 'tool') {
    const courseList = (await getCourse(userid ?? '', year ?? '', sem ?? '')) as Course[]
    for (const course of courseList) {
      await crawler(course.id, course.course)
      // 篩選出尚未繳交的作業
      hwlist = hwlist.filter((hw) => {
        if (hw.status === '未繳交') {
          // console.log(hw)
          return hw
        }
      })
    }
  } else {
    await crawler(course)
  }

  return NextResponse.json({ data: hwlist })
}

export const POST = async (req: NextRequest) => {
  const formData = await req.formData()
  const id = formData.get('id')
  const file = formData.get('userfile')
  // const submit = formData.get("Submit")

  let bodyContent = new FormData()
  if (id) {
    bodyContent.append('id', id)
  } else {
    // TODO:使用 fetch status 來判斷是否成功
    return NextResponse.json({ status: 'error', message: '沒有作業ID' })
  }

  if (file && file !== 'null') {
    bodyContent.append('userfile', file)
  } else {
    // TODO:使用 fetch status 來判斷是否成功
    return NextResponse.json({ status: 'error', message: '沒有檔案' })
  }

  const res = await fetch('https://netinfo.takming.edu.tw/tip/list_course_uploadhw_file_x.php', {
    method: 'POST',
    headers: {
      cookie: cookies().toString()
    },
    body: bodyContent
  })

  if (!res.ok) {
    // TODO:使用 fetch status 來判斷是否成功
    return NextResponse.json({ status: 'error', message: '上傳失敗' })
  }

  const data = await res.text()

  if (data.includes('File Upload Successful')) {
    return NextResponse.json({ status: 'success' })
  } else {
    return NextResponse.json({ status: 'fail' })
  }
}
