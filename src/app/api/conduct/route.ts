// 操行成績
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { JSDOM } from "jsdom"
import { Conduct } from "@/types"

export const GET = async (req: NextRequest) => {
    const year = cookies().get("cookie_year")?.value
    const sem = cookies().get("cookie_sem")?.value
    const userid = cookies().get("cookie_userid")?.value
    const dept = cookies().get("cookie_dept")?.value
    const es = cookies().get("cookie_es")?.value

    const conduct: Conduct = {
        score: [],
    }

    let score: number[] = []

    const res = await fetch("https://netinfo.takming.edu.tw/tip/stu_stg04.php", {
        headers: {
            cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${year}; cookie_sem=${sem}; cookie_divcode=${dept}; cookie_programname=${es};`,
            Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php",
        },
    })

    const buffer = await res.arrayBuffer()
    let html = new TextDecoder("big5").decode(buffer)
    const dom = new JSDOM(html)
    const document = dom.window.document
    const rows = Array.from(
        document.querySelectorAll("table[bgcolor='#CCCCCC' ] tr:not(:first-child)")
    )

    rows.forEach((row, index) => {
        const cells = Array.from(row.querySelectorAll("td:not(:last-child)"))
        score = []
        cells.forEach((cell) => {
            const list = cell.textContent
            score.push(Number(list))
        })
        conduct.score[index] = [...score]
    })
    // 目前操行
    // req.nextUrl.searchParams.get("year")
    // req.nextUrl.searchParams.get("sem")
    if (req.nextUrl.searchParams.has("year") && req.nextUrl.searchParams.has("sem")) {
        if (
            year === req.nextUrl.searchParams.get("year") &&
            sem === req.nextUrl.searchParams.get("sem")
        ) {
            // 搜尋 year & sem 在 conduct 陣列
            // 有的話回傳
            for (let i = 0; i < conduct.score.length; i++) {
                if (conduct.score[i][0] === Number(year) && conduct.score[i][1] === Number(sem)) {
                    return NextResponse.json(conduct.score[i])
                }
            }
        }
    }

    return NextResponse.json(conduct)
}
