// 課堂資訊
import { JSDOM } from "jsdom"
import { Course } from "@/types"
import getCourseTeacher from "@/utils/course-teacher"

const getCourse = async (
    userid: string,
    year: string,
    sem: string,

    course?: string
) => {
    const courselist: Course[] = []

    let res
    if (course === undefined) {
        res = await fetch("https://netinfo.takming.edu.tw/tip/list_fun_stucourse.php", {
            headers: {
                cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${year}; cookie_sem=${sem}; `,
                Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php",
            },
        })
    } else {
        res = await fetch(`https://netinfo.takming.edu.tw/tip/list_course_new.php?opno=${course}`, {
            headers: {
                cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${year}; cookie_sem=${sem}; `,
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

        for (let i = 0; i < rows.length; i++) {
            const cells = Array.from(rows[i].querySelectorAll("td:not(:first-child) font span a"))
            for (let j = 0; j < cells.length; j++) {
                const list = cells[j].textContent
                const link = cells[j].getAttribute("href")
                const id = link?.split("=")[1]
                courselist.push({
                    id: id ?? "",
                    name: list ?? "",
                    teacher: await getCourseTeacher(userid, year, sem, id ?? ""),
                })
            }
        }

        return courselist
    } else {
        const name = document
            .querySelector("font[color='#800000']")
            ?.textContent?.replace("目前無公告資訊!!", "")
        return {
            id: course,
            name: name ?? "",
        } as Course
    }
}

export default getCourse
