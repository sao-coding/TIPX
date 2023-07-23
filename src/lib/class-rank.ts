import { JSDOM } from "jsdom"
import getUser from "@/lib/user"
import getConduct from "@/lib/conduct"
import getClassName from "@/lib/class-name"
import { FinalGradeRankClass, FinalGradeRank, Conduct, ClassName } from "@/types"

const getClassRank = async (
    userid: string,
    year: string,
    sem: string,
    dept: string,
    es: string,
    classid: string,
    start: string,
    end: string
) => {
    let finalGradeRankClass: FinalGradeRankClass[] = []

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

    const classId = userid?.slice(0, 6)

    const classNameown: ClassName = await getClassName(
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

        const { name, img } = await getUser(userid, year ?? "", sem ?? "", dept ?? "", es ?? "")

        const conduct = (await getConduct(
            userid,
            year ?? "",
            sem ?? "",
            dept ?? "",
            es ?? "",
            "one"
        )) as Conduct

        const className: ClassName = await getClassName(
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
    for (let i = Number(start); i < Number(end); i++) {
        const userid = classId + (Number(classid) + 1).toString() + i.toString().padStart(2, "0")
        fetchPromises.push(fetchData(userid))
    }
    const results = await Promise.all(fetchPromises)

    console.timeEnd("fetching")
    finalGradeRankClass = results.filter((result) => result !== null) as FinalGradeRankClass[]

    return finalGradeRankClass
}

export default getClassRank
