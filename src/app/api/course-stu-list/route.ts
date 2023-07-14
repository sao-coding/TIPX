import { NextRequest, NextResponse } from "next/server"
import { JSDOM } from "jsdom"
import db from "@/db/timetable.json"
import { CourseStuList } from "@/types"

export const dynamic = "force-dynamic"

export const GET = async (req: NextRequest) => {
    const year = req.cookies.get("cookie_year")?.value
    const sem = req.cookies.get("cookie_sem")?.value
    const userid = req.cookies.get("cookie_userid")?.value

    const courseStuList: CourseStuList[] = []
    let stuList: string[] = []

    const res = await fetch(
        `https://netinfo.takming.edu.tw/tip/list_course_stupic.php?opno=${req.nextUrl.searchParams.get(
            "id"
        )}`,
        {
            headers: {
                cookie: `cookie_year=${year}; cookie_sem=${sem}; cookie_rgno=${userid}; cookie_userid=${userid};`,
                Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php",
            },
        }
    )

    const buffer = await res.arrayBuffer()
    const html = new TextDecoder("big5").decode(buffer)
    const dom = new JSDOM(html)
    const document = dom.window.document

    const rows = Array.from(document.querySelectorAll("form > table:nth-child(2) > tbody > tr"))

    rows.forEach((row) => {
        stuList = []
        const cells = Array.from(row.querySelectorAll("td font"))

        cells.forEach((cell, index) => {
            let list = cell.textContent
            const img = cell.querySelector("img")
            if (index === 0) {
                const img = cell.querySelector("img")
                // 取得img src
                list = img?.getAttribute("src") || ""
            } else if (index === 5) {
                // <font size=\"2\">Mail:<a href='mailto:weihongh90@gmail.com'>常用Mail</a> ; <a
                // href='mailto:D10619233@mail.takming.edu.tw'>學校Mail</a></font>
                // 取得mail
                const maillist: string[] = []
                const mail = cell.querySelectorAll("a")

                mail.forEach((m) => {
                    // mail.takming.edu.tw 改 gs.takming.edu.tw
                    // maillist.push(m.getAttribute("href")?.replace("mailto:", "") || "")
                    // 如果 m 是 undefined 就改成空字串

                    if (mail.length === 1) {
                        maillist.push("")
                    }

                    maillist.push(
                        m
                            .getAttribute("href")
                            ?.replace("mailto:", "")
                            .replace("mail.takming.edu.tw", "gs.takming.edu.tw") || ""
                    )
                })
                // console.log("maillist", maillist)
                list = maillist.join(";")
            } else {
                // 移除空白
                list = list?.replace(/\s/g, "") || list
            }
            // console.log(list)
            stuList.push(list ?? "")
        })
        courseStuList.push({
            img: stuList[0],
            class: stuList[1],
            id: stuList[2],
            name: stuList[3],
            gender: stuList[4],
            email: stuList[5].split(";"),
        })
    })

    return NextResponse.json(courseStuList)
}
