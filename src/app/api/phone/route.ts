import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { JSDOM } from 'jsdom'

import getAuth from '@/lib/get-auth'

export const GET = async (req: NextRequest) => {
  const accessToken = req.headers.get('authorization')?.replace('Bearer ', '') || ''
  const auth = await getAuth(accessToken)

  const searchParams = req.nextUrl.searchParams

  const year = searchParams.get('year') ?? (await cookies()).get('year')?.value
  const sem = searchParams.get('sem') ?? (await cookies()).get('sem')?.value
  const userid = searchParams.get('userid') ?? auth?.userId

  const res = await fetch('https://netinfo.takming.edu.tw/tip/stu_setphone.php', {
    headers: {
      cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${year}; cookie_sem=${sem}; `,
      // cookie: Object.entries(cookie)
      //     .map((e) => `${e[0]}=${e[1]}`)
      //     .join("; "),
      Referer: 'https://netinfo.takming.edu.tw/tip/list_fun.php'
    }
  })

  const buffer = await res.arrayBuffer()
  const html = new TextDecoder('big5').decode(buffer)
  const dom = new JSDOM(html)
  const document = dom.window.document

  const phone =
    document
      .querySelector(
        'body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > input[type=text]'
      )
      ?.getAttribute('value') ?? ''

  return NextResponse.json({ phone })
}

export const POST = async (req: NextRequest) => {
  const formData = await req.formData()
  //     Phone: 0925385500
  // NPhone: 0925385500
  const phone = formData.get('phone')
  // const submit = formData.get("Submit")

  const bodyContent = new FormData()
  if (phone) {
    bodyContent.append('NPhone', phone)
  } else {
    return NextResponse.json({ status: 'error', message: '請輸入電話' })
  }

  const res = await fetch('https://netinfo.takming.edu.tw/tip/stu_setphone_x.php', {
    method: 'POST',
    headers: {
      cookie: (await cookies()).toString()
    },
    body: bodyContent
  })

  if (!res.ok) {
    return NextResponse.json({ status: 'error', message: '發生錯誤' })
  }

  const data = await res.text()

  return NextResponse.json(data)
  // if (data.includes('File Upload Successful')) {
  //   return NextResponse.json({ status: 'success' })
  // } else {
  //   return NextResponse.json({ status: 'fail' })
  // }
}
