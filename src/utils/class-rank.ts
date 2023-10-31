import { JSDOM } from "jsdom"
import getUser from "@/utils/user"
import getConduct from "@/utils/conduct"
import getTeacher from "@/utils/teacher"
import getClassName from "@/utils/class-name"
import getCurrentYearSem from "@/utils/current-year-sem"
import { FinalGradeRankClass, Conduct } from "@/types"

const getClassRank = async (userid: string, year: string, sem: string) => {
    const { currentYear, currentSem } = await getCurrentYearSem()
    const teacherid = (await getTeacher(userid ?? "", currentYear ?? "", currentSem ?? "")).id

    const resUrl = async (url: string, method: string, body?: { [key: string]: string }) => {
        let res
        if (method === "POST" && body) {
            res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    cookie: `cookie_userid=${teacherid}; cookie_year=${year}; cookie_sem=${sem}; cookie_worktype=1; cookie_level=1; cookie_logintimes=2; cookie_type=4;`,
                    Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php",
                },
                body: new URLSearchParams(body),
            })
        } else {
            res = await fetch(url, {
                method,
                headers: {
                    cookie: `cookie_userid=${teacherid}; cookie_year=${year}; cookie_sem=${sem}; cookie_worktype=1; cookie_level=1; cookie_logintimes=2; cookie_type=4;`,
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

    console.time("fetching-class-rank")

    const document = await resUrl("https://netinfo.takming.edu.tw/tip/guide_semscolist.php", "GET")

    const classList = document.querySelectorAll(
        "body > table > tbody > tr:nth-child(2) > td > form > table:nth-child(2) > tbody > tr > td:nth-child(1) > select > option:not(:first-child)"
    )

    const className = (await getClassName(userid, year)).class

    const classID = Array.from(classList)
        .find((e) => e.textContent === className)
        ?.getAttribute("value")

    const classRankDocument = await resUrl(
        "https://netinfo.takming.edu.tw/tip/guide_semscolist.php",
        "POST",
        {
            Class: classID ?? "",
        }
    )

    const classRankList = classRankDocument.querySelectorAll(
        "body > table > tbody > tr:nth-child(2) > td > form > table:nth-child(3) > tbody > tr:not(:first-child)"
    )

    console.log("此班", classRankList.length, "人")

    const finalGradeRankClass = await Promise.all(
        Array.from(classRankList).map(async (element) => {
            const userid = element.querySelector("td:nth-child(2)")?.textContent ?? ""
            const { img, name } = await getUser(userid)
            const conduct = (await getConduct(userid, year ?? "", sem ?? "", "one")) as Conduct
            const avg = Number(element.querySelector("td:nth-child(7)")?.textContent ?? "")
            const rank = Number(element.querySelector("td:nth-child(8)")?.textContent ?? "")

            return {
                userid,
                img,
                name,
                data: {
                    year,
                    sem,
                    conduct,
                    avg,
                    rank,
                },
            }
        })
    )

    console.timeEnd("fetching-class-rank")

    return finalGradeRankClass
}

export default getClassRank
