import { JSDOM } from "jsdom"
import getConduct from "@/utils/conduct"
import { FinalGradeRankClass, FinalGradeRank, Conduct, ClassName } from "@/types"

const getFinalGrade = async (userid: string, year: string, sem: string) => {
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

    const res = await fetch("https://netinfo.takming.edu.tw/tip/stu_rank.php", {
        headers: {
            cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${year}; cookie_sem=${sem}; `,
            Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php",
        },
    })

    const fetchData = async (userid: string, year: string, sem: string) => {
        const conduct = (await getConduct(
            userid,
            year ?? "",
            sem ?? "",

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

    return finalGradeRankList
}

export default getFinalGrade
