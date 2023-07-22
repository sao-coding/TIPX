import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { JSDOM } from "jsdom"
import getUser from "@/lib/user"
import getConduct from "@/lib/conduct"
import getClassNames from "@/lib/class-name"
import { FinalGradeRankClass, FinalGradeRank, Conduct, ClassName } from "@/types"

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

            const classNameown: ClassName = await getClassNames(
                userid ?? "",
                year ?? "",
                sem ?? "",
                dept ?? "",
                es ?? ""
            )

            const fetchData = async (userid: string) => {
                const res = await fetch("https://netinfo.takming.edu.tw/tip/stu_rank.php", {
                    headers: {
                        cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${year}; cookie_sem=${sem}; cookie_divcode=${dept}; cookie_programname=${es};`,
                        Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php",
                    },
                })

                const { name, img } = await getUser(
                    userid,
                    year ?? "",
                    sem ?? "",
                    dept ?? "",
                    es ?? ""
                )

                const conduct = (await getConduct(
                    userid,
                    year ?? "",
                    sem ?? "",
                    dept ?? "",
                    es ?? "",
                    "one"
                )) as Conduct

                const className: ClassName = await getClassNames(
                    userid,
                    year ?? "",
                    sem ?? "",
                    dept ?? "",
                    es ?? ""
                )

                if (className.class !== classNameown.class) {
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

            const fetchPromises = []
            console.time("fetching")
            for (let i = 1; i < 60; i++) {
                const userid = classId + i.toString().padStart(2, "0")
                fetchPromises.push(fetchData(userid))
            }
            const results = await Promise.all(fetchPromises)

            console.timeEnd("fetching")
            finalGradeRankClass = results.filter(
                (result) => result !== null
            ) as FinalGradeRankClass[]

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

        const fetchData = async (userid: string, year: string, sem: string) => {
            const conduct = (await getConduct(
                userid,
                year ?? "",
                sem ?? "",
                dept ?? "",
                es ?? "",
                "one"
            )) as Conduct

            return {
                year: conduct.year,
                sem: conduct.sem,
                score: conduct.score,
            }
        }

        const buffer = await res.arrayBuffer()
        let html = new TextDecoder("big5").decode(buffer)
        const dom = new JSDOM(html)
        const document = dom.window.document
        const rows = Array.from(
            document.querySelectorAll("table[bgcolor='#CCCCCC' ] tr:not(:first-child)")
        )

        for (let i = 0; i < rows.length; i++) {
            const cells = Array.from(rows[i].querySelectorAll("td:not(:last-child) font"))

            for (let j = 0; j < cells.length; j++) {
                const list = cells[j].textContent
                if (j === 0) {
                    finalGradeRank.year = list ?? ""
                }
                if (j === 1) {
                    finalGradeRank.sem = list ?? ""
                }
                if (j === 2) {
                    finalGradeRank.avg = Number(list)
                }
                if (j === 3) {
                    finalGradeRank.rank = Number(list)
                }
            }
            const conduct = await fetchData(userid ?? "", finalGradeRank.year, finalGradeRank.sem)
            finalGradeRank.conduct = { ...conduct }
            finalGradeRankList.push({ ...finalGradeRank })
        }

        return NextResponse.json(finalGradeRankList)
    }
}
