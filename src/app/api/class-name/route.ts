import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { JSDOM } from "jsdom"
import getClassNames from "@/app/lib/class-name"
import { ClassName } from "@/types"

export const GET = async (req: NextRequest) => {
    let userid
    if (req.nextUrl.searchParams.has("userid")) {
        userid = req.nextUrl.searchParams.get("userid")
    } else {
        userid = cookies().get("cookie_userid")?.value
    }
    const year = cookies().get("cookie_year")?.value
    const sem = cookies().get("cookie_sem")?.value
    const dept = cookies().get("cookie_dept")?.value
    const es = cookies().get("cookie_es")?.value

    if (!userid || !year || !sem || !dept || !es) {
        return NextResponse.redirect("/login")
    }

    const className: ClassName = await getClassNames(userid, year, sem, dept, es)

    // let className: string = ""

    // const res = await fetch("https://netinfo.takming.edu.tw/tip/newstu_sys/stu_main.php", {
    //     headers: {
    //         cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${year}; cookie_sem=${sem}; cookie_divcode=${dept}; cookie_programname=${es};`,
    //         Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php",
    //     },
    // })

    // const buffer = await res.arrayBuffer()
    // let html = new TextDecoder("big5").decode(buffer)
    // const dom = new JSDOM(html)
    // const document = dom.window.document
    // const rows = Array.from(document.querySelectorAll("table[bordercolor='#333333' ] tr"))

    // rows.forEach((row, i) => {
    //     const cells = Array.from(row.querySelectorAll("td[bgcolor='#CCCCFF']"))
    //     cells.forEach((cell, j) => {
    //         const list = cell.textContent
    //         if (i === 5 && j === 1) {
    //             className = list ?? ""
    //         }
    //     })
    // })

    return NextResponse.json(className)
}
