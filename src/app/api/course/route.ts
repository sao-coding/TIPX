// 課堂資訊
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { JSDOM } from "jsdom"
import { Course } from "@/types"
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

    const courselist: Course[] = []
    const filter = ["", "", "", "", "ok", "ok", "ok"]

    let res
    if (req.nextUrl.searchParams.get("course") === null) {
        res = await fetch("https://netinfo.takming.edu.tw/tip/list_fun_stucourse.php", {
            headers: {
                cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${year}; cookie_sem=${sem}; cookie_divcode=${dept}; cookie_programname=${es};`,
                Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php",
            },
        })
    } else {
        res = await fetch(
            `https://netinfo.takming.edu.tw/tip/list_course_new.php?opno=${req.nextUrl.searchParams.get(
                "course"
            )}`,
            {
                headers: {
                    cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${year}; cookie_sem=${sem}; cookie_divcode=${dept}; cookie_programname=${es};`,
                    Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php",
                },
            }
        )
    }

    const buffer = await res.arrayBuffer()
    let html = new TextDecoder("big5").decode(buffer)
    const dom = new JSDOM(html)
    const document = dom.window.document
    const verify = Array.from(document.querySelectorAll("script"))
    // 去除 所有 \r, \n, \t
    const cap = verify[0].innerHTML.replace(/\r|\n|\t/g, "")
    html = html.replace(/\r|\n|\t/g, "")
    html = html.replace(cap, "")

    if (req.nextUrl.searchParams.get("course") === null) {
        const rows = Array.from(document.querySelectorAll("table tbody tr:not(:first-child)"))
        rows.forEach((row) => {
            const cells = Array.from(row.querySelectorAll("td:not(:first-child) font span a"))
            cells.forEach((cell, index) => {
                const list = cell.textContent
                const link = cell.getAttribute("href")
                const id = link?.split("=")[1]
                courselist.push({ item: list ?? "", id: id ?? "" })
            })
        })
        return NextResponse.json(courselist)
    } else {
        const name = document
            .querySelector("font[color='#800000']")
            ?.textContent?.replace("目前無公告資訊!!", "")
        return NextResponse.json({ name })
    }
}
