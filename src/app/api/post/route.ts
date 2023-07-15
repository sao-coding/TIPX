import { NextRequest, NextResponse } from "next/server"
import { JSDOM } from "jsdom"
// import db from "@/db/timetable.json"
import { Post } from "@/types"

export const dynamic = "force-dynamic"

export const GET = async (req: NextRequest) => {
    const year = req.cookies.get("cookie_year")?.value
    const sem = req.cookies.get("cookie_sem")?.value
    const userid = req.cookies.get("cookie_userid")?.value
    const dept = req.cookies.get("cookie_dept")?.value
    const es = req.cookies.get("cookie_es")?.value

    let post: Post = {
        category: "",
        title: "",
        sticky: false,
        link: "",
        unit: "",
        date: "",
        deadline: "",
    }

    const postListAll: Post[] = []
    const postList: Post[] = []

    const res = await fetch("https://netinfo.takming.edu.tw/tip/post/post_index_all.php", {
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
        document.querySelectorAll("table[bordercolor='#FFFFFF' ] tr:not(:first-child)")
    )

    rows.forEach((row, index) => {
        const cells = Array.from(row.querySelectorAll("td"))
        const sticky = cells[1].querySelector("img") ? true : false
        post.sticky = sticky
        const link = cells[1].querySelector("a")?.getAttribute("href")
        // post_OneShow.php?SerialItem=103304
        // 取得網址的ID
        const id = link?.split("=")[1]
        post.link = id ?? ""

        cells.forEach((cell, index) => {
            const list = cell.textContent
            // console.log("index", index, "list", list)
            if (index === 0) {
                post.category = list ?? ""
            } else if (index === 1) {
                post.title = list ?? ""
            } else if (index === 2) {
                post.unit = list ?? ""
            } else if (index === 3) {
                post.date = list ?? ""
            } else if (index === 4) {
                post.deadline = list ?? ""
            }
        })

        postListAll.push(post)
        post = {
            category: "",
            title: "",
            sticky: false,
            link: "",
            unit: "",
            date: "",
            deadline: "",
        }
    })
    // req.nextUrl.searchParams.get("id")
    // req.nextUrl.searchParams.get("limit")
    // 從ID的下一個開始取資料 limit是取幾筆

    // 如果有id和limit就取資料
    if (req.nextUrl.searchParams.get("id") && req.nextUrl.searchParams.get("limit")) {
        const id = Number(req.nextUrl.searchParams.get("id"))
        const limit = Number(req.nextUrl.searchParams.get("limit"))
        console.log("id", id, "limit", limit)
        for (let i = id; i < id + limit; i++) {
            console.log("起始值", id, "結束值", id + limit)
            console.log(postListAll[i])
            if (postListAll[i]) {
                postList.push(postListAll[i])
            }
        }
        return NextResponse.json(postList)
    }

    return NextResponse.json(postListAll)
}
