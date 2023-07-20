import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { JSDOM } from "jsdom"
import { FinalGradeRankClass, FinalGradeRank } from "@/types"

export const GET = async (req: NextRequest) => {
    const year = cookies().get("cookie_year")?.value
    const sem = cookies().get("cookie_sem")?.value
    const userid = cookies().get("cookie_userid")?.value
    const dept = cookies().get("cookie_dept")?.value
    const es = cookies().get("cookie_es")?.value

    // type class or all

    // final-grade-rank?type=class&year=110&sem=1

    const finalGradeRankClass: FinalGradeRankClass[] = []

    const finalGradeRankList: FinalGradeRank[] = []

    const finalGradeRank: FinalGradeRank = {
        year: "",
        sem: "",
        avg: 0,
        rank: 0,
    }

    if (req.nextUrl.searchParams.get("type") === "class") {
        if (
            req.nextUrl.searchParams.has("type") &&
            req.nextUrl.searchParams.has("year") &&
            req.nextUrl.searchParams.has("sem")
        ) {
            // D11019139
            // 取前7碼
            const classId = userid?.slice(0, 7)
            const searchYear = req.nextUrl.searchParams.get("year")
            const searchSem = req.nextUrl.searchParams.get("sem")
            const url =
                process.env.NODE_ENV === "development"
                    ? "http://localhost:3000"
                    : "https://tip.sao-x.com"
            const res = await fetch(`${url}/api/user?userid=${userid}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${process.env.AUTHORIZATION}`,
                    "Content-Type": "application/json",
                },
            })

            const majordata = await res.json()
            const majorown = majordata.major

            for (let i = 0; i < 70; i++) {
                // 1~9號補0
                const userid = classId + i.toString().padStart(2, "0")
                const res = await fetch("https://netinfo.takming.edu.tw/tip/stu_rank.php", {
                    headers: {
                        cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${searchYear}; cookie_sem=${searchSem}; cookie_divcode=${dept}; cookie_programname=${es};`,
                        Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php",
                    },
                })

                // 從"api/user" 取得學生姓名
                const res2 = await fetch(`${url}/api/user?userid=${userid}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${process.env.AUTHORIZATION}`,
                        "Content-Type": "application/json",
                    },
                })

                const data = await res2.json()
                const name = data.name
                const img = data.img
                const major = data.major
                if (major !== majorown) {
                    continue
                }
                const buffer = await res.arrayBuffer()
                let html = new TextDecoder("big5").decode(buffer)
                const dom = new JSDOM(html)
                const document = dom.window.document
                const rows = Array.from(
                    document.querySelectorAll("table[bgcolor='#CCCCCC' ] tr:not(:first-child)")
                )

                rows.forEach((row, index) => {
                    const cells = Array.from(row.querySelectorAll("td:not(:last-child) font"))
                    // 判斷當前學年學期
                    if (cells[0].textContent === searchYear && cells[1].textContent === searchSem) {
                        cells.forEach((cell, index) => {
                            const list = cell.textContent
                            if (index === 0) {
                                finalGradeRank.year = list ?? ""
                            }
                            if (index === 1) {
                                finalGradeRank.sem = list ?? ""
                            }
                            if (index === 2) {
                                finalGradeRank.avg = Number(list)
                            }
                            if (index === 3) {
                                finalGradeRank.rank = Number(list)
                            }
                        })

                        finalGradeRankClass.push({
                            userid: userid ?? "",
                            img: img ?? "",
                            name: name ?? "",
                            data: { ...finalGradeRank },
                        })
                    }
                })
            }
            return NextResponse.json(finalGradeRankClass)
        }
    }

    if (req.nextUrl.searchParams.get("type") === "all") {
        const res = await fetch("https://netinfo.takming.edu.tw/tip/stu_rank.php", {
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
            const cells = Array.from(row.querySelectorAll("td:not(:last-child) font"))
            cells.forEach((cell, index) => {
                const list = cell.textContent
                if (index === 0) {
                    finalGradeRank.year = list ?? ""
                }
                if (index === 1) {
                    finalGradeRank.sem = list ?? ""
                }
                if (index === 2) {
                    finalGradeRank.avg = Number(list)
                }
                if (index === 3) {
                    finalGradeRank.rank = Number(list)
                }
            })
            finalGradeRankList.push({ ...finalGradeRank })
        })

        return NextResponse.json(finalGradeRankList)
    }
}
