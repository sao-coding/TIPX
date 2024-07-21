// 修課學生名單
// TODO: 待優化
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { JSDOM } from 'jsdom'

import authOptions from '@/lib/auth'
import { CourseStuList } from '@/types'

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams
  const session = await getServerSession(authOptions)
  const year = searchParams.get('year') ?? cookies().get('cookie_year')?.value
  const sem = searchParams.get('sem') ?? cookies().get('cookie_sem')?.value
  const userid = searchParams.get('userid') ?? session?.user.studentID

  const courseStuList: CourseStuList[] = []
  let stuList: string[] = []

  const res = await fetch(
    `https://netinfo.takming.edu.tw/tip/list_course_stupic.php?opno=${req.nextUrl.searchParams.get(
      'course'
    )}`,
    {
      headers: {
        cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${year}; cookie_sem=${sem}; `,
        Referer: 'https://netinfo.takming.edu.tw/tip/list_fun.php'
      }
    }
  )

  const buffer = await res.arrayBuffer()
  const html = new TextDecoder('big5').decode(buffer)
  const dom = new JSDOM(html)
  const document = dom.window.document

  const stuListTable = Array.from(
    document.querySelectorAll(
      'body > table:nth-child(7) > tbody > tr > td > form > table:nth-child(2) > tbody >tr'
    )
  )

  const stuListTableLength = stuListTable.length

  for (let i = 0; i < stuListTableLength; i++) {
    stuList = []
    const stuInfo = stuListTable[i].querySelectorAll('td:nth-child(2) > p')
    const stuInfoLength = stuInfo.length

    for (let j = 0; j < stuInfoLength; j++) {
      // 若是最後一個 用email的方式取得
      if (j === stuInfoLength - 1) {
        // 取 mailto: 後面的字串
        const email = stuInfo[j].querySelectorAll('a')
        const emailLength = email.length
        for (let k = 0; k < emailLength; k++) {
          // 若是 takming.edu.tw 的信箱 則換成 gs.takming.edu.tw
          stuList.push(
            email[k]
              .getAttribute('href')
              ?.replace('mailto:', '')
              .replace('@takming.edu.tw', '@gs.takming.edu.tw') ?? ''
          )
        }
      } else {
        // 去除空白等奇怪的字元
        stuList.push(stuInfo[j].textContent?.trim() ?? '')
      }
    }
    const stuData: CourseStuList = {
      img: stuListTable[i].querySelector('td:nth-child(1) > font > img')?.getAttribute('src') ?? '',
      class: stuList[0].replace('班級:', ''),
      id: stuList[1].replace('學號:', ''),
      gender: stuList[3].replace('性別:', ''),
      name: stuList[2].replace('姓名:', ''),
      email: [stuList[4], stuList[5]]
    }
    courseStuList.push(stuData)
  }

  // console.log(rows.forEach((row) => console.log(row.textContent)))

  return NextResponse.json(courseStuList)
}
