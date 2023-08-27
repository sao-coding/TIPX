// 修課學生名單
// TODO: 待優化
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { JSDOM } from "jsdom"
import { CourseStuList } from "@/types"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"

export const GET = async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams
    const session = await getServerSession(authOptions)
    const year = searchParams.get("year") ?? cookies().get("cookie_year")?.value
    const sem = searchParams.get("sem") ?? cookies().get("cookie_sem")?.value
    const userid = searchParams.get("userid") ?? session?.user.studentID
    const dept = cookies().get("cookie_dept")?.value
    const es = cookies().get("cookie_es")?.value

    const courseStuList: CourseStuList[] = []
    let stuList: string[] = []

    const res = await fetch(
        `https://netinfo.takming.edu.tw/tip/list_course_stupic.php?opno=${req.nextUrl.searchParams.get(
            "course"
        )}`,
        {
            headers: {
                cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${year}; cookie_sem=${sem}; cookie_divcode=${dept}; cookie_programname=${es};`,
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
