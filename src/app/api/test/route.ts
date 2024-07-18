import { NextRequest, NextResponse } from "next/server"
import * as cheerio from "cheerio"

import getLineID from "@/utils/lineid"

export const dynamic = "force-dynamic"

export const GET = async (req: NextRequest) => {
  let year = req.cookies.get("cookie_year")?.value
  let sem = req.cookies.get("cookie_sem")?.value
  let userid = req.cookies.get("cookie_userid")?.value
  let dept = req.cookies.get("cookie_dept")?.value
  let es = req.cookies.get("cookie_es")?.value
  // const authToken = req.headers.get("Authorization")?.startsWith("Bearer ")

  // if (
  //     authToken === false ||
  //     req.headers.get("Authorization")?.split(" ")[1] !== process.env.AUTHORIZATION
  // ) {
  //     // Unauthorized

  //     await new Promise((resolve) => setTimeout(resolve, 5000))

  //     return NextResponse.json(
  //         {
  //             error: "Unauthorized",
  //         },
  //         {
  //             status: 401,
  //         }
  //     )
  // }

  const cookie = {
    cookie_worktype: "1",
    cookie_sex: "1",
    cookie_logintimes: "2",
    cookie_name: "%AAL%B0%B6%A4t",
    cookie_type: "4",
    cookie_deptid: "390390",
    cookie_dept: "%B8%EA%AC%EC%A8t",
    cookie_account: "wayne",
    cookie_level: "1",
    cookie_unitid: "19",
    cookie_sem: "2",
    cookie_year: "111",
    cookie_userid: "0004307" //"0003046",
  }
  // userid = "D11214124"
  // cookie_userid=D11214124;cookie_rgno=D11214124;cookie_year=112;year_sem=1;

  // js 設定 cookie

  // const cookie = {
  //     cookie_account: "D11214124",
  //     cookie_userid: "D11214124",
  //     cookie_rgno: "D11214124",
  //     cookie_program: "D",
  //     cookie_enyear: "112",
  //     cookie_dept: "14",
  //     cookie_year: "112",
  //     cookie_sem: "1",
  //     cookie_divcode: "1",
  //     cookie_level: "2",
  //     cookie_type: "2",
  // }

  // for (const [key, value] of Object.entries(cookie)) {
  //     document.cookie = `${key}=${value};`
  // }

  // Mail: only@sao-x.com
  // LineID: fuckjeter
  // https://netinfo.takming.edu.tw/tip/tea_absrec_chk.php
  const res = await fetch("https://netinfo.takming.edu.tw/tip/guide_semscolist.php", {
    method: "GET",
    headers: {
      // "Content-Type": "application/x-www-form-urlencoded",
      // cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${year}; cookie_sem=${sem}; cookie_divcode=${dept}; cookie_programname=${es};`,
      cookie: Object.entries(cookie)
        .map((e) => `${e[0]}=${e[1]}`)
        .join("; "),
      Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php"
    }
    // body: "TClass=D192112&TDate=1120223",
  })

  const buffer = await res.arrayBuffer()
  const html = new TextDecoder("big5").decode(buffer)
  const $ = cheerio.load(html)
  const test = await getLineID("D11019139")

  return NextResponse.json(test)
  // let headersList = {
  //     "Content-Type": "application/x-www-form-urlencoded",
  //     Cookie: "cookie_rgno=D11019139; cookie_level=2; cookie_type=2; cookie_userid=D11019139; cookie_name=%25F7%25E1%25A4%25E5%25B5q; cookie_program=D; cookie_programname=%A4%E9%A5%7C%A7%DE; cookie_dept=19; cookie_grade=3; cookie_divcode=1; cookie_classno=D1931; cookie_classname=%A4%E9%A5%7C%A7%DE%AC%EC%A4T%A5%D2; cookie_enyear=110; cookie_class=1; cookie_logintimes=2; cookie_sex=1; cookie_account=D11019139; cookie_year=111; cookie_sem=2; PHPSESSID=i9ksvmrh7fnbr6jr80asl2tfbg",
  //     Referer: "http://course.takming.edu.tw",
  // }

  // let bodyContent = "UserID=D11019139&Passwd=jeter1209"

  // let res = await fetch("http://course.takming.edu.tw/login_x.php", {
  //     method: "POST",
  //     body: bodyContent,
  //     headers: headersList,
  // })
  // const buffer = await res.arrayBuffer()
  // let html = new TextDecoder("big5").decode(buffer)
  // const dom = new JSDOM(html)
  // const document = dom.window.document
  // const verify = Array.from(document.querySelectorAll("script"))
  // console.log(verify[0].innerHTML)
  // // 去除 所有 \r, \n, \t
  // // const cap = verify[0].innerHTML.replace(/\r|\n|\t/g, "")
  // html = html.replace(/\r|\n|\t/g, "")
  // // html = html.replace(cap, "")

  // return NextResponse.json(html)
}
