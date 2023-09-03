import { JSDOM } from "jsdom"
import { Credit } from "@/types"

const getCredit = async (userid: string, year: string, sem: string, dept: string, es: string) => {
    const title: string[] = []
    const total: number[] = []
    const get: number[] = []

    const credit: Credit[] = []

    const res = await fetch("https://netinfo.takming.edu.tw/tip/stu_data_new.php", {
        headers: {
            cookie: `cookie_programname=${es}; cookie_rgno=${userid}; cookie_userid=${userid}; cookie_year=${year}; cookie_sem=${sem}; cookie_divcode=${dept};`,
            Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php",
        },
    })
    const buffer = await res.arrayBuffer()
    let html = new TextDecoder("big5").decode(buffer)
    const dom = new JSDOM(html)
    const document = dom.window.document
    const rows = Array.from(
        document.querySelectorAll(
            "body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > p:nth-child(13) > table > tbody > tr"
        )
    )

    for (let i = 0; i < rows.length; i++) {
        const cells = Array.from(rows[i].querySelectorAll("td"))
        for (let j = 0; j < cells.length; j++) {
            if (i === 0 && j === 0) continue
            if (i === 0) {
                title.push(cells[j].textContent ?? "")
            }
            if (i === 1 && j !== 0) {
                total.push(Number(cells[j].textContent ?? ""))
            }
            if (i === 2 && j !== 0) {
                get.push(Number(cells[j].textContent ?? ""))
            }
        }
    }

    for (let i = 0; i < title.length; i++) {
        credit.push({
            year: title[i].slice(0, 3),
            sem: title[i].slice(3, 4) === "上" ? "1" : "2", // "上" => "1" "下" => "2
            total: Number(total[i]),
            get: Number(get[i]),
        })
    }

    return credit
}

export default getCredit
