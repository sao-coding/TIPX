// 作業清單
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { JSDOM } from "jsdom"

import authOptions from "@/lib/auth"
import { HwList } from "@/types"

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams
  const session = await getServerSession(authOptions)
  const year = searchParams.get("year") ?? cookies().get("cookie_year")?.value
  const sem = searchParams.get("sem") ?? cookies().get("cookie_sem")?.value
  const userid = searchParams.get("userid") ?? session?.user.studentID

  let status = true
  let hwdata1: string[][] = []
  let hwdata2: string[][] = []

  const hwlist: HwList[] = []

  const fetchURL = async (id: string) => {
    const url = `https://netinfo.takming.edu.tw/tip/list_course_${id}.php?opno=${req.nextUrl.searchParams.get(
      "course"
    )}`
    let res = fetch(url, {
      headers: {
        cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${year}; cookie_sem=${sem}; `,
        Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php"
      }
    })
    return res
  }

  const rules = (id: string, cells: Element[]) => {
    let hw: string[] = []
    if (id === "uploadhw") {
      cells.forEach((cell, index) => {
        let list = cell.textContent
        if (list) {
          if (index === 0) {
            // 移除空白
            list = list.replace(/\s/g, "")
          }
          if (index === 4) {
            if (list === "已上傳本作業") {
              list = "已繳交"
            } else {
              list = "未繳交"
            }
          }
          if (index !== 3) {
            hw.push(list)
          }
        }

        if (index === 0) {
          let link = cell.querySelector("input")?.getAttribute("onclick") ?? ""
          // <input type="button" value="下載" onclick="DownDoc("teach_n/1112/T11120000162.docx")">
          // 取得下載連結
          link = link.replace(/DownDoc\(\"|\"\)/g, "")
          hw.push(link)
        }
        if (index === 3) {
          let link = cell.querySelector("input")?.getAttribute("onclick") ?? ""
          if (list === "未到或已過上傳時間") {
            link = ""
          } else {
            // <input type=button value='我要上傳作業' onclick='OpenWin(98892);'>
            // 取得上傳連結 並去除";"
            link = link.replace(/OpenWin\(|\);/g, "")
          }
          hw.push(link)
        }
      })
    } else if (id === "downhw") {
      cells.forEach((cell, index) => {
        let list = cell.textContent
        if (list) {
          if (index === 3) {
            let link = cell.querySelector("input")?.getAttribute("onclick") ?? ""
            link = link.replace(/DownDoc\(\"|\"\)/g, "")
            list = link
            hw.push(link)
          }
          if (index === 4) {
            // 去除bytes
            list = list.replace(/bytes/g, "")
            hw.push(list)
          }
        }
      })
    }
    return hw
  }
  const crawler = async (res: Response, id: string) => {
    let hw: string[] = []
    const buffer = await res.arrayBuffer()
    let html = new TextDecoder("big5").decode(buffer)
    const dom = new JSDOM(html)
    const document = dom.window.document

    // 選擇不包含前兩個 tr
    let rows = Array.from(document.querySelectorAll("form table tr td table tr"))
    rows = rows.slice(2)
    // 排除 最後一個 tr
    rows = rows.slice(0, rows.length - 1)
    // console.log("crawler", id, rows.length)
    if (rows.length === 0) {
      // 於期中考/期末考期間不提供下載功能
      if (html.includes("考試期間不開放本功能")) {
        console.log("於期中考/期末考期間不提供下載功能")
        status = false
      }
    }
    rows.forEach((row) => {
      const cells = Array.from(row.querySelectorAll('td[bgcolor="#FFFFCC"]  font'))
      hw = rules(id, cells)
      if (id === "uploadhw") {
        hwdata1.push(hw)
      }
      if (id === "downhw") {
        hwdata2.push(hw)
      }
    })
  }

  const writeHw = (hw1: string[][], hw2: string[][]) => {
    for (let i = 0; i < hw1.length; i++) {
      hw1[i].splice(5, 0, hw2[i][0])
      hw1[i].splice(6, 0, hw2[i][1])
    }
    hw1.forEach((hw) => {
      hwlist.push({
        title: hw[0],
        file: hw[1],
        start: hw[2],
        end: hw[3],
        upload: hw[4],
        download: hw[5],
        size: hw[6],
        status: hw[7]
      })
    })
  }

  const res = await fetchURL("uploadhw")
  const res2 = await fetchURL("downhw")
  await crawler(res, "uploadhw")
  await crawler(res2, "downhw")
  if (!status) {
    // 產生空陣列
    for (let i = 0; i < hwdata1.length; i++) {
      hwdata2.push(["", ""])
    }
    await writeHw(hwdata1, hwdata2)
    return NextResponse.json({
      status: "段考期間",
      message: "於期中考/期末考期間\n不提供下載功能",
      data: hwlist
    })
  } else {
    // console.log("writeHw", "hwdata1", hwdata1, "hwdata2", hwdata2)
    await writeHw(hwdata1, hwdata2)
  }
  return NextResponse.json({ data: hwlist })
}

export const POST = async (req: NextRequest) => {
  const formData = await req.formData()
  const id = formData.get("id")
  const file = formData.get("userfile")
  // const submit = formData.get("Submit")

  let bodyContent = new FormData()
  if (id) {
    bodyContent.append("id", id)
  } else {
    // TODO:使用 fetch status 來判斷是否成功
    return NextResponse.json({ status: "error", message: "沒有作業ID" })
  }

  if (file && file !== "null") {
    bodyContent.append("userfile", file)
  } else {
    // TODO:使用 fetch status 來判斷是否成功
    return NextResponse.json({ status: "error", message: "沒有檔案" })
  }

  const res = await fetch("https://netinfo.takming.edu.tw/tip/list_course_uploadhw_file_x.php", {
    method: "POST",
    headers: {
      cookie: cookies().toString()
    },
    body: bodyContent
  })

  if (!res.ok) {
    // TODO:使用 fetch status 來判斷是否成功
    return NextResponse.json({ status: "error", message: "上傳失敗" })
  }

  const data = await res.text()

  if (data.includes("File Upload Successful")) {
    return NextResponse.json({ status: "success" })
  } else {
    return NextResponse.json({ status: "fail" })
  }
}
