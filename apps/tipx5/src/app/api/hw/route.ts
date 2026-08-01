// 作業清單
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

import getAuth from '@/lib/get-auth'
import { Course, Hw } from '@/types'
import getCourse from '@/utils/course'

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams
  const accessToken = req.headers.get('authorization')?.replace('Bearer ', '') || ''
  const auth = await getAuth(accessToken)

  const userid = searchParams.get('userid') ?? auth?.userId
  const year = searchParams.get('year') ?? (await cookies()).get('year')?.value
  const sem = searchParams.get('sem') ?? (await cookies()).get('sem')?.value
  const course = searchParams.get('course') ?? ''
  const type = searchParams.get('type') ?? 'hw'

  let hwlist: Hw[] = []

  const fetchURL = async (type: string, course?: string) => {
    const url = `https://netinfo.takming.edu.tw/tip/list_course_${type}.php?opno=${course}`
    const res = await fetch(url, {
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
        // console.log(i + ' ' + text)
        switch (i) {
          case 0: {
            const file =
              $(cell)
                .find('input')
                .attr('onclick')
                ?.replace(/DownDoc\("|"\)/g, '') ?? ''
            // console.log(i + " " + text + "\n" + file)
            hw.push(text)
            hw.push(file)
            break
          }
          case 3: {
            const upload =
              $(cell)
                .find('input')
                .attr('onclick')
                ?.replace(/OpenWin\(|\);/g, '') ?? ''
            // console.log(i + " " + upload)
            hw.push(upload)
            break
          }
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
    // console.log('hwdata1', hwdata1)
    const rows2 = $('body > form > table > tbody > tr > td > table > tbody > tr').slice(2, -1)
    if (rows2.length === 0) {
      // 於期中考/期末考期間不提供下載功能
      if ($('body').text().includes('考試期間不開放本功能')) {
        for (let i = 0; i < hwdata1.length; i++) {
          hwlist.push({
            title: hwdata1[i][0],
            file: hwdata1[i][1],
            start: hwdata1[i][2],
            end: hwdata1[i][3],
            upload: hwdata1[i][4],
            download: '段考期間不開放本功能',
            size: '段考期間不開放本功能',
            status: hwdata1[i][5],
            course: courseName,
            courseId: courseId
          })
        }
        console.log('段考期間不提供下載功能')
        // return NextResponse.json({
        //   status: '段考期間',
        //   msg: '於期中考/期末考期間\n不提供下載功能',
        //   data: hwlist
        // })
        return 'exam'
      }
    }

    rows2.each((_, ele) => {
      const cells = $(ele).find("td[bgcolor='#FFFFCC'] font")
      const hw: string[] = []
      cells.each((i, cell) => {
        switch (i) {
          case 3: {
            const link =
              $(cell)
                .find('input')
                .attr('onclick')
                ?.replace(/DownDoc\("|"\)/g, '') ?? ''
            // console.log(i + " " + link)
            hw.push(link)
            break
          }
          case 4: {
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
          }
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
        course: courseName,
        courseId: courseId
      })
    }

    return 'default'
  }

  // 工具列裡的作業才會顯示課程名稱
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
    // await crawler(course)
    const status = await crawler(course)
    if (status === 'exam') {
      return NextResponse.json({
        status: '段考期間',
        msg: '段考期間不提供下載功能',
        data: hwlist
      })
    }
  }

  return NextResponse.json({
    status: '非段考期間',
    msg: '獲取成功',
    data: hwlist
  })
}

export const POST = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams
    const accessToken = req.headers.get('authorization')?.replace('Bearer ', '') || ''
    const auth = await getAuth(accessToken)

    // 獲取用戶基本資訊
    const userid = searchParams.get('userid') ?? auth?.userId
    const year = searchParams.get('year') ?? (await cookies()).get('year')?.value
    const sem = searchParams.get('sem') ?? (await cookies()).get('sem')?.value

    if (!userid || !year || !sem) {
      return NextResponse.json(
        {
          status: 'error',
          message: '缺少必要的用戶資訊'
        },
        { status: 400 }
      )
    }

    // 解析表單數據
    const formData = await req.formData()
    const id = formData.get('id')
    const file = formData.get('userfile')

    // 驗證作業ID
    if (!id) {
      return NextResponse.json(
        {
          status: 'error',
          message: '沒有作業ID'
        },
        { status: 400 }
      )
    }

    // 驗證檔案
    if (!file || file === 'null' || !(file instanceof File)) {
      return NextResponse.json(
        {
          status: 'error',
          message: '沒有檔案或檔案格式錯誤'
        },
        { status: 400 }
      )
    }

    // 準備要發送的表單數據
    const bodyContent = new FormData()
    bodyContent.append('id', id.toString())
    bodyContent.append('userfile', file)

    // console.log('上傳資訊:', { userid, year, sem, fileName: file.name })

    // 發送請求到遠端伺服器
    const res = await fetch('https://netinfo.takming.edu.tw/tip/list_course_uploadhw_file_x.php', {
      method: 'POST',
      headers: {
        cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${year}; cookie_sem=${sem};`,
        Referer: 'https://netinfo.takming.edu.tw/tip/list_fun.php'
      },
      body: bodyContent
    })

    // 檢查 HTTP 狀態碼
    if (!res.ok) {
      return NextResponse.json(
        {
          status: 'error',
          message: `上傳失敗: HTTP ${res.status}`
        },
        { status: res.status }
      )
    }

    // 解析回應內容
    const data = await res.text()

    // 判斷上傳結果
    if (data.includes('File Upload Successful')) {
      return NextResponse.json(
        {
          status: 'success',
          message: '上傳成功',
          data: {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified
          }
        },
        { status: 200 }
      )
    } else {
      // 返回更詳細的失敗信息
      return NextResponse.json(
        {
          status: 'fail',
          message: '上傳被伺服器拒絕',
          serverResponse: data
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('作業上傳錯誤:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: '處理上傳時發生錯誤',
        error: error instanceof Error ? error.message : '未知錯誤'
      },
      { status: 500 }
    )
  }
}
