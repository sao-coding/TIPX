import { NextRequest, NextResponse } from "next/server"
import { JSDOM } from "jsdom"

export const dynamic = "force-dynamic"

export const GET = async (req: NextRequest) => {
    const year = req.cookies.get("cookie_year")?.value
    const sem = req.cookies.get("cookie_sem")?.value
    const userid = req.cookies.get("cookie_userid")?.value
    const dept = req.cookies.get("cookie_dept")?.value
    const es = req.cookies.get("cookie_es")?.value
    // const list = [
    //     {
    //         item: "item",
    //         id: "id",
    //     },
    // ]
    const courselist: { item: string; id: string }[] = []
    const filter = ["", "", "", "", "ok", "ok", "ok"]

    let res
    if (req.nextUrl.searchParams.get("id") === null) {
        res = await fetch("https://netinfo.takming.edu.tw/tip/list_fun_stucourse.php", {
            headers: {
                cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${year}; cookie_sem=${sem}; cookie_divcode=${dept}; cookie_programname=${es};`,
                Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php",
            },
        })
    } else {
        res = await fetch(
            `https://netinfo.takming.edu.tw/tip/list_course_new.php?opno=${req.nextUrl.searchParams.get(
                "id"
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

    if (req.nextUrl.searchParams.get("id") === null) {
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
    } else {
        const rows = Array.from(document.querySelectorAll("table tr"))
        rows.forEach((row) => {
            const cells = Array.from(row.querySelectorAll("td font a"))
            cells.forEach((cell, index) => {
                if (filter[index - 1] === "ok") {
                    let list = cell.textContent
                    const link = cell.getAttribute("href")
                    // console.log(list)
                    // console.log(link)
                    list = list?.replace("作業下載", "作業") ?? ""
                    list = list?.replace("修課同學", "修課學生") ?? ""
                    const id = link?.split("=")[1]
                    courselist.push({ item: list ?? "", id: id ?? "" })
                }
            })
        })
    }
    return NextResponse.json(courselist)
}
