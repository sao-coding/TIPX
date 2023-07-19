// 學校公告
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { JSDOM } from "jsdom"
import { Announcement } from "@/types"
import { Post } from "@/types"

export const GET = async (req: NextRequest) => {
    const year = cookies().get("cookie_year")?.value
    const sem = cookies().get("cookie_sem")?.value
    const userid = cookies().get("cookie_userid")?.value
    const dept = cookies().get("cookie_dept")?.value
    const es = cookies().get("cookie_es")?.value

    // 獲取公告 全部貼文
    if (
        req.nextUrl.searchParams.get("type") === "all" &&
        req.nextUrl.searchParams.get("id") &&
        req.nextUrl.searchParams.get("limit")
    ) {
        let announcement: Announcement = {
            category: "",
            title: "",
            sticky: false,
            link: "",
            unit: "",
            date: "",
            deadline: "",
        }

        const announcementListAll: Announcement[] = []
        const announcementList: Announcement[] = []

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
            announcement.sticky = sticky
            const link = cells[1].querySelector("a")?.getAttribute("href")
            // post_OneShow.php?SerialItem=103304
            // 取得網址的ID
            const id = link?.split("=")[1]
            announcement.link = id ?? ""

            cells.forEach((cell, index) => {
                const list = cell.textContent
                // console.log("index", index, "list", list)
                if (index === 0) {
                    announcement.category = list ?? ""
                } else if (index === 1) {
                    announcement.title = list ?? ""
                } else if (index === 2) {
                    announcement.unit = list ?? ""
                } else if (index === 3) {
                    announcement.date = list ?? ""
                } else if (index === 4) {
                    announcement.deadline = list ?? ""
                }
            })

            announcementListAll.push(announcement)
            announcement = {
                category: "",
                title: "",
                sticky: false,
                link: "",
                unit: "",
                date: "",
                deadline: "",
            }
        })
        const id = Number(req.nextUrl.searchParams.get("id"))
        const limit = Number(req.nextUrl.searchParams.get("limit"))
        // console.log("id", id, "limit", limit)
        for (let i = id; i < id + limit; i++) {
            // console.log("起始值", id, "結束值", id + limit)
            // console.log(postListAll[i])
            if (announcementListAll[i]) {
                announcementList.push(announcementListAll[i])
            }
        }
        return NextResponse.json(announcementList)
    }
    if (req.nextUrl.searchParams.get("type") === "one" && req.nextUrl.searchParams.get("id")) {
        const post: Post = {
            title: "",
            date: "",
            deadline: "",
            unit: "",
            publisher: {
                name: "",
                email: "",
            },
            category: "",
            content: "",
            file: [],
            link: "",
        }

        const postdata: string[] = []

        const res = await fetch(
            `https://netinfo.takming.edu.tw/tip/post/post_OneShow.php?SerialItem=${req.nextUrl.searchParams.get(
                "id"
            )}`,
            {
                headers: {
                    cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${year}; cookie_sem=${sem}; cookie_divcode=${dept}; cookie_programname=${es};`,
                    Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php",
                },
            }
        )
        const buffer = await res.arrayBuffer()
        let html = new TextDecoder("big5").decode(buffer)
        const dom = new JSDOM(html)
        const document = dom.window.document
        const rows = Array.from(document.querySelectorAll(".newstd"))
        rows.forEach((row, index) => {
            if (index === 2) {
                postdata.push(row.textContent?.split("　")[0] ?? "")
                const cells = Array.from(row.querySelectorAll("a"))
                cells.forEach((cell, index) => {
                    const name = cell.textContent
                    const email = cell.getAttribute("href")?.replace("mailto:", "")
                    post.publisher.name = name ?? ""
                    post.publisher.email = email ?? ""
                })
            } else if (index === 6) {
                const cells = Array.from(row.querySelectorAll("a"))
                cells.forEach((cell, index) => {
                    const title = cell.textContent
                    const link = cell.getAttribute("href")
                    post.file.push({ title: title ?? "", link: link ?? "" })
                })
            } else if (index === 7) {
                const cells = Array.from(row.querySelectorAll("a"))
                cells.forEach((cell, index) => {
                    const link = cell.getAttribute("href")
                    post.link = link ?? ""
                })
            } else {
                postdata.push(row.textContent ?? "")
            }
        })

        post.title = postdata[0]
        post.date = postdata[1]
        post.unit = postdata[2]
        post.deadline = postdata[3]
        post.category = postdata[4]
        post.content = postdata[5]

        return NextResponse.json(post)
    }
}
