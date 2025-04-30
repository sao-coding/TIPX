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

  const res = await fetch('https://netinfo.takming.edu.tw/tip/stu_setmail.php', {
    headers: {
      cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${year}; cookie_sem=${sem}; `,
      // cookie: Object.entries(cookie)
      //     .map((e) => `${e[0]}=${e[1]}`)
      //     .join("; "),
      Referer: 'https://netinfo.takming.edu.tw/tip/list_fun.php'
    }
  })

  const buffer = await res.arrayBuffer()
  let html = new TextDecoder('big5').decode(buffer)
  const dom = new JSDOM(html)
  const document = dom.window.document

  const email = {
    userid: '',
    email: '',
    lineid: ''
  }

  email.userid =
    document.querySelector(
      'body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td:nth-child(2) > font > font'
    )?.textContent ?? ''

  email.email =
    document
      .querySelector(
        'body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > input[type=text]'
      )
      ?.getAttribute('value') ?? ''

  email.lineid =
    document
      .querySelector(
        'body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table > tbody > tr:nth-child(3) > td:nth-child(2) > input[type=text]'
      )
      ?.getAttribute('value') ?? ''
  // console.log(html)
  return NextResponse.json(email)
}

export const POST = async (req: NextRequest) => {
  const formData = await req.formData()
  const email = formData.get('Mail')
  const lineid = formData.get('LineID')
  // const submit = formData.get("Submit")

  let bodyContent = new FormData()
  if (email) {
    bodyContent.append('Mail', email)
  } else {
    return NextResponse.json({ status: 'error', message: '未填寫Email' })
  }
  if (lineid) {
    bodyContent.append('LineID', lineid)
  } else {
    return NextResponse.json({ status: 'error', message: '未填寫LineID' })
  }

  const res = await fetch('https://netinfo.takming.edu.tw/tip/stu_setmail_x.php', {
    method: 'POST',
    headers: {
      cookie: (await cookies()).toString()
    },
    body: bodyContent
  })
  console.log(res)
  if (!res.ok) {
    return NextResponse.json({ status: 'error', message: '存檔失敗' })
  }

  const data = await res.text()
  console.log(data)
  return NextResponse.json(data)
}
