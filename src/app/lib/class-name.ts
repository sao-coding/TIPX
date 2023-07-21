import { JSDOM } from "jsdom"
import { ClassName } from "@/types"

const getClassNames = async (
    userid: string,
    year: string,
    sem: string,
    dept: string,
    es: string
) => {
    let className: ClassName = {
        class: "",
    }

    const res = await fetch("https://netinfo.takming.edu.tw/tip/newstu_sys/stu_main.php", {
        headers: {
            cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${year}; cookie_sem=${sem}; cookie_divcode=${dept}; cookie_programname=${es};`,
            Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php",
        },
    })

    const buffer = await res.arrayBuffer()
    let html = new TextDecoder("big5").decode(buffer)
    const dom = new JSDOM(html)
    const document = dom.window.document
    const rows = Array.from(document.querySelectorAll("table[bordercolor='#333333' ] tr"))

    rows.forEach((row, i) => {
        const cells = Array.from(row.querySelectorAll("td[bgcolor='#CCCCFF']"))
        cells.forEach((cell, j) => {
            const list = cell.textContent
            if (i === 5 && j === 1) {
                className.class = list ?? ""
            }
        })
    })

    return className
}

export default getClassNames
