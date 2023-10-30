import { JSDOM } from "jsdom"
import iconv from "iconv-lite"
import getCourseTeacher from "@/utils/course-teacher"

const getTeacher = async (
    userid: string,
    year: string,
    sem: string,
    type?: string,
    course?: string
) => {
    const resUrl = async (url: string, method: string, body?: { [key: string]: string }) => {
        let res
        if (method === "POST" && body) {
            if (body.sname) {
                body.sname = iconv
                    .encode(body.sname, "big5")
                    .toString("hex")
                    .replace(/(.{2})/g, "%$1")
            }
            const bodyContent = Object.entries(body)
                .map(([key, value]) => `${key}=${value}`)
                .join("&")
            // console.log(bodyContent)
            res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    cookie: `cookie_userid=${userid}; cookie_rgno=${userid};cookie_account=${userid}; cookie_year=${year}; cookie_sem=${sem};`,
                    Referer: "https://netinfo.takming.edu.tw/tip/stu_absrec.php",
                },
                body: bodyContent,
            })
        } else {
            res = await fetch(url, {
                method,
                headers: {
                    cookie: `cookie_userid=${userid}; cookie_rgno=${userid};cookie_account=${userid}; cookie_year=${year}; cookie_sem=${sem};`,
                    Referer: "https://netinfo.takming.edu.tw/tip/stu_absrec.php",
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

    let teacherName = ""
    if (type === "course") {
        teacherName = await getCourseTeacher(userid ?? "", year ?? "", sem ?? "", course ?? "")
    } else {
        document = await resUrl("https://netinfo.takming.edu.tw/tip/stu_absrec.php", "GET")

        teacherName =
            document.querySelector("#AutoNumber4 > tbody > tr:nth-child(2) > td > div > span")
                ?.textContent ?? ""
    }

    document = await resUrl("https://netinfo.takming.edu.tw/tip/comm_teadept.php", "POST", {
        sname: teacherName,
    })

    let teacherDept =
        document.querySelector(
            "#AutoNumber1 > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > div"
        )?.textContent ?? ""

    // 通識教育中心 => 通識中心

    teacherDept === "通識教育中心" && (teacherDept = "通識中心")

    document = await resUrl("https://netinfo.takming.edu.tw/tip/comm_teach2.php", "GET")

    const selectDept = document.querySelector(
        "body > table > tbody > tr:nth-child(2) > td > form > table:nth-child(1) > tbody > tr > td > p > select:nth-child(5)"
    ) as HTMLSelectElement

    // 尋找 teacherDept 代碼

    const teacherDeptId = Array.from(selectDept.options).find(
        (option) => option.textContent === teacherDept
    )?.value

    document = await resUrl("https://netinfo.takming.edu.tw/tip/comm_teach2.php", "POST", {
        Year: year ?? "",
        Sem: sem ?? "",
        Dept: teacherDeptId ?? "",
        Teacher: "0310",
    })

    const selectTeacher = document.querySelector(
        "body > table > tbody > tr:nth-child(2) > td > form > table:nth-child(1) > tbody > tr > td > p > select:nth-child(7)"
    ) as HTMLSelectElement

    const teacherId =
        Array.from(selectTeacher.options).find((option) => option.textContent === teacherName)
            ?.value ?? ""

    document = await resUrl("https://netinfo.takming.edu.tw/tip/comm_teach2.php", "POST", {
        Year: year ?? "",
        Sem: sem ?? "",
        Dept: teacherDeptId ?? "",
        Skind: "0",
        Teacher: teacherId ?? "",
    })

    return {
        id: teacherId,
        name: teacherName,
    }
}

export default getTeacher
