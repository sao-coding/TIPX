import { JSDOM } from "jsdom"
import getCurrentYearSem from "@/utils/current-year-sem"
import { SemGrade } from "@/types"

const getSemGrade = async (userid: string, year: string, sem: string) => {
    const resUrl = async (url: string, method: string, body?: { [key: string]: string }) => {
        let res
        if (method === "POST" && body) {
            const bodyContent = new URLSearchParams(body).toString().replace(/%25/g, "%")
            // console.log("RgNo=D11019139&R1=1&B1=%ACd%B8%DF")
            // console.log(
            //     "RgNo=D11019139&R1=1&B1=%ACd%B8%DF" === new URLSearchParams(body).toString()
            // )
            res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${
                        getCurrentYearSem().currentYear
                    }; cookie_sem=${getCurrentYearSem().currentSem};`,
                    Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php",
                },
                body: bodyContent,
            })
        } else {
            res = await fetch(url, {
                method,
                headers: {
                    cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${year}; cookie_sem=${sem};`,
                    Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php",
                },
            })
        }
        const buffer = await res.arrayBuffer()
        const html = new TextDecoder("big5").decode(buffer)
        const dom = new JSDOM(html)
        const document = dom.window.document

        return document
    }

    let document

    document = await resUrl("https://netinfo.takming.edu.tw/tip/stu_score.php", "POST", {
        RgNo: userid,
        R1: "1",
        B1: "%ACd%B8%DF",
    })

    // body > form > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table:nth-child(3) > tbody
    const historySemGradeRows = Array.from(
        document.querySelectorAll(
            "body > form > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table:nth-child(3) > tbody  tr:not(:first-child)"
        )
    )

    const historySemGrade: SemGrade[] = []

    historySemGradeRows.forEach((row) => {
        const cells = Array.from(row.querySelectorAll("td"))
        // 獲取 年度 學期
        const historyYear = cells[0].textContent ?? ""
        const historySem = cells[1].textContent ?? ""
        // 若是 year, sem 等於 111, 2 就存學期成績

        if (historyYear == year && historySem == sem) {
            // 存課程 id 名稱 學期成績
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
            semScore.id = cells[2].textContent ?? ""
            semScore.name = cells[3].textContent ?? ""
            semScore.finalGrade = Number(cells[7].textContent ?? "")

            historySemGrade.push(semScore)
        }
    })

    document = await resUrl("https://netinfo.takming.edu.tw/tip/stu_semscore.php", "GET")

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
                    // 如果Number(list) 是 NaN 去尋找 historySemGrade 的成績 如果沒有就給 0
                    semScore.finalGrade = Number.isNaN(Number(list))
                        ? historySemGrade.find((e) => e.id === semScore.id)?.finalGrade ?? 0
                        : Number(list)
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
