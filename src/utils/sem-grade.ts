import { JSDOM } from "jsdom"
import { SemGrade } from "@/types"

const getSemGrade = async (userid: string, year: string, sem: string, dept: string, es: string) => {
    const res = await fetch("https://netinfo.takming.edu.tw/tip/stu_semscore.php", {
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
        document.querySelectorAll("table[bgcolor='#666666'] tr:not(:first-child)")
    )

    const semScoreList: SemGrade[] = []

    rows.forEach((row) => {
        const cells = Array.from(row.querySelectorAll("td"))
        const semScore: SemGrade = {
            id: "",
            name: "",
            category: "",
            type: "",
            credit: 0,
            midtermGrade: 0,
            finalGrade: 0,
            class: "",
        }
        cells.forEach((cell, i) => {
            const list = cell.textContent
            switch (i) {
                case 0:
                    semScore.id = list ?? ""
                    break
                case 1:
                    semScore.name = list ?? ""
                    break
                case 2:
                    semScore.category = list ?? ""
                    break
                case 3:
                    semScore.type = list ?? ""
                    break
                case 4:
                    semScore.credit = Number(list)
                    break
                case 5:
                    // 如果Number(list) 是 NaN 就給 0
                    semScore.midtermGrade = Number.isNaN(Number(list)) ? 0 : Number(list)
                    break
                case 6:
                    semScore.finalGrade = Number.isNaN(Number(list)) ? 0 : Number(list)
                    break
                case 7:
                    semScore.class = list ?? ""
                    break
            }
        })
        semScoreList.push(semScore)
    })
    return semScoreList
}
export default getSemGrade
