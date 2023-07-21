// 操行成績
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { JSDOM } from "jsdom"
import { Conduct } from "@/types"

export const GET = async (req: NextRequest) => {
    let userid
    let year
    let sem
    if (req.nextUrl.searchParams.has("userid")) {
        userid = req.nextUrl.searchParams.get("userid")
    } else {
        userid = cookies().get("cookie_userid")?.value
    }
    if (req.nextUrl.searchParams.has("year")) {
        year = req.nextUrl.searchParams.get("year")
    } else {
        year = cookies().get("cookie_year")?.value
    }
    if (req.nextUrl.searchParams.has("sem")) {
        sem = req.nextUrl.searchParams.get("sem")
    } else {
        sem = cookies().get("cookie_sem")?.value
    }
    const dept = cookies().get("cookie_dept")?.value
    const es = cookies().get("cookie_es")?.value

    const conductList: Conduct[] = []

    const conduct: Conduct = {
        year: "",
        sem: "",
        score: 0,
    }

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

    rows.forEach((row) => {
        const cells = Array.from(row.querySelectorAll("td:not(:last-child)"))
        conduct.year = ""
        conduct.sem = ""
        conduct.score = 0
        cells.forEach((cell, index) => {
            const list = cell.textContent
            if (index === 0) {
                conduct.year = list ?? ""
            }
            if (index === 1) {
                conduct.sem = list ?? ""
            }
            if (index === 2) {
                conduct.score = Number(list ?? "")
            }
        })
        conductList.push({ ...conduct })
    })

    // 目前操行
    // req.nextUrl.searchParams.get("year")
    // req.nextUrl.searchParams.get("sem")
    if (req.nextUrl.searchParams.has("year") && req.nextUrl.searchParams.has("sem")) {
        // 搜尋 year & sem 在 conduct 陣列
        // 有的話回傳
        for (let i = 0; i < conductList.length; i++) {
            if (
                conductList[i].year === req.nextUrl.searchParams.get("year") &&
                conductList[i].sem === req.nextUrl.searchParams.get("sem")
            ) {
                return NextResponse.json(conductList[i])
            }
        }
    }

    return NextResponse.json(conductList)
}
