import { JSDOM } from "jsdom"

const getCourseTeacher = async (
    userid: string,
    year: string,
    sem: string,

    course: string
) => {
    const res = await fetch(
        `https://netinfo.takming.edu.tw/tip/teach/teach_classqry.php?opno=${course}`,
        {
            headers: {
                cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${year}; cookie_sem=${sem}; `,
                Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php",
            },
        }
    )

    const buffer = await res.arrayBuffer()
    const html = new TextDecoder("big5").decode(buffer)
    const dom = new JSDOM(html)
    const document = dom.window.document

    const teacher =
        document.querySelector(
            "#AutoNumber1 > tbody > tr > td > table > tbody > tr:nth-child(4) > td:nth-child(2)"
        )?.textContent ?? ""

    return teacher
}

export default getCourseTeacher
