// 課堂資訊
import { JSDOM } from "jsdom"
import { Course } from "@/types"

const getCourse = async (
    userid: string,
    year: string,
    sem: string,
    dept: string,
    es: string,
    course?: string
) => {
    const courselist: Course[] = []

    let res
    if (course === undefined) {
        res = await fetch("https://netinfo.takming.edu.tw/tip/list_fun_stucourse.php", {
            headers: {
                cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${year}; cookie_sem=${sem}; cookie_divcode=${dept}; cookie_programname=${es};`,
                Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php",
            },
        })
    } else {
        res = await fetch(`https://netinfo.takming.edu.tw/tip/list_course_new.php?opno=${course}`, {
            headers: {
                cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${year}; cookie_sem=${sem}; cookie_divcode=${dept}; cookie_programname=${es};`,
                Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php",
            },
        })
    }

    const buffer = await res.arrayBuffer()
    let html = new TextDecoder("big5").decode(buffer)
    const dom = new JSDOM(html)
    const document = dom.window.document

    if (course === undefined) {
        const rows = Array.from(document.querySelectorAll("table tbody tr:not(:first-child)"))
        rows.forEach((row) => {
            const cells = Array.from(row.querySelectorAll("td:not(:first-child) font span a"))
            cells.forEach((cell) => {
                const list = cell.textContent
                const link = cell.getAttribute("href")
                const id = link?.split("=")[1]
                courselist.push({ item: list ?? "", id: id ?? "" })
            })
        })
        return courselist
    } else {
        const name = document
            .querySelector("font[color='#800000']")
            ?.textContent?.replace("目前無公告資訊!!", "")
        return name
    }
}

export default getCourse
