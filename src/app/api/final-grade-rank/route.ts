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

    let finalGradeRankClass: FinalGradeRankClass[] = []

    const finalGradeRankList: FinalGradeRank[] = []

    let finalGradeRank: FinalGradeRank = {
        year: "",
        sem: "",
        conduct: {
            year: "",
            sem: "",
            score: 0,
        },
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
            const year = req.nextUrl.searchParams.get("year")
            const sem = req.nextUrl.searchParams.get("sem")
            const url =
                process.env.NODE_ENV === "development"
                    ? "http://localhost:3000"
                    : "https://tip.sao-x.com"
            const res = await fetch(`${url}/api/class-name?userid=${userid}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${process.env.AUTHORIZATION}`,
                    "Content-Type": "application/json",
                },
            })

            const classNamedata = await res.json()
            const classNameown = classNamedata.className

            const fetchData = async (userid: string) => {
                const res = await fetch("https://netinfo.takming.edu.tw/tip/stu_rank.php", {
                    headers: {
                        cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${year}; cookie_sem=${sem}; cookie_divcode=${dept}; cookie_programname=${es};`,
                        Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php",
                    },
                })

                const res2 = await fetch(`${url}/api/user?userid=${userid}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${process.env.AUTHORIZATION}`,
                        "Content-Type": "application/json",
                    },
                })

                const data = await res2.json()
                const name: string = data.name
                const img: string = data.img

                const res3 = await fetch(
                    `${url}/api/conduct?userid=${userid}&year=${year}&sem=${sem}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${process.env.AUTHORIZATION}`,
                            "Content-Type": "application/json",
                        },
                    }
                )

                const data2 = await res3.json()
                const conduct = {
                    year: data2.year,
                    sem: data2.sem,
                    score: data2.score,
                }

                const res4 = await fetch(`${url}/api/class-name?userid=${userid}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${process.env.AUTHORIZATION}`,
                        "Content-Type": "application/json",
                    },
                })

                const data3 = await res4.json()
                const className = data3.className

                if (className !== classNameown) {
                    return null // If className doesn't match, return null
                }

                const buffer = await res.arrayBuffer()
                const html = new TextDecoder("big5").decode(buffer)
                const dom = new JSDOM(html)
                const document = dom.window.document
                const rows = Array.from(
                    document.querySelectorAll("table[bgcolor='#CCCCCC' ] tr:not(:first-child)")
                )

                finalGradeRank = {
                    year: "",
                    sem: "",
                    conduct: { ...conduct },
                    avg: 0,
                    rank: 0,
                }

                rows.forEach((row) => {
                    const cells = Array.from(row.querySelectorAll("td:not(:last-child) font"))
                    if (cells[0].textContent === year && cells[1].textContent === sem) {
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
                    }
                })

                return {
                    userid: userid ?? "",
                    img: img ?? "",
                    name: name ?? "",
                    data: { ...finalGradeRank },
                }
            }

            const startFetchingTime = new Date().toLocaleString()
            const fetchPromises = []

            for (let i = 1; i < 60; i++) {
                const userid = classId + i.toString().padStart(2, "0")
                fetchPromises.push(fetchData(userid))
            }

            const results = await Promise.all(fetchPromises)

            finalGradeRankClass = results.filter(
                (result) => result !== null
            ) as FinalGradeRankClass[]

            console.log(
                `Start fetching: ${startFetchingTime}\nEnd fetching: ` + new Date().toLocaleString()
            )

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
