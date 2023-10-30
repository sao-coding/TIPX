import { JSDOM } from "jsdom"
import getUser from "@/utils/user"
import getConduct from "@/utils/conduct"
import getTeacher from "@/utils/teacher"
import getClassName from "@/utils/class-name"
import getCurrentYearSem from "@/utils/current-year-sem"
import { FinalGradeRankClass, FinalGradeRank, Conduct } from "@/types"

const getClassRank = async (userid: string, year: string, sem: string) => {
    const { currentYear, currentSem } = await getCurrentYearSem()
    const teacherid = (await getTeacher(userid ?? "", currentYear ?? "", currentSem ?? "")).id

    let finalGradeRankClass: FinalGradeRankClass[] = []

    let finalGradeRank: FinalGradeRankClass = {
        userid: "",
        img: "",
        name: "",
        data: {
            year: "",
            sem: "",
            conduct: {
                year: "",
                sem: "",
                score: 0,
            },
            avg: 0,
            rank: 0,
        },
    }

    const resUrl = async (url: string, method: string, body?: { [key: string]: string }) => {
        let res
        if (method === "POST" && body) {
            res = await fetch(url, {
                method,
                headers: {
                    cookie: `cookie_userid=${teacherid}; cookie_year=${year}; cookie_sem=${sem}; cookie_worktype=1; cookie_level=1; cookie_logintimes=2; cookie_type=4;`,
                    Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php",
                },
                body: JSON.stringify(body),
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

    let document
    document = await resUrl("https://netinfo.takming.edu.tw/tip/guide_semscolist.php", "GET")

    const classList = document.querySelectorAll(
        "body > table > tbody > tr:nth-child(2) > td > form > table:nth-child(2) > tbody > tr > td:nth-child(1) > select > option:not(:first-child)"
    )

    const className = (await getClassName(userid, year)).class

    const classID = Array.from(classList)
        .find((e) => e.textContent === className)
        ?.getAttribute("value")

    document = await resUrl("https://netinfo.takming.edu.tw/tip/guide_semscolist.php", "POST", {
        Class: classID ?? "",
    })

    const classRankList = document.querySelectorAll(
        "body > table > tbody > tr:nth-child(2) > td > form > table:nth-child(3) > tbody > tr:not(:first-child)"
    )

    console.log(classRankList.length)

    for (let i = 0; i < classRankList.length; i++) {
        // body > table > tbody > tr:nth-child(2) > td > form > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(2)
        const userid =
            document.querySelector(
                `body > table > tbody > tr:nth-child(2) > td > form > table:nth-child(3) > tbody > tr:nth-child(${
                    i + 2
                }) > td:nth-child(2)`
            )?.textContent ?? ""
        finalGradeRank.userid = userid

        const { img, name } = await getUser(userid)
        finalGradeRank.img = img
        finalGradeRank.name = name

        finalGradeRank.data.year = year
        finalGradeRank.data.sem = sem

        const conduct = (await getConduct(userid, year ?? "", sem ?? "", "one")) as Conduct
        finalGradeRank.data.conduct = conduct

        // body > table > tbody > tr:nth-child(2) > td > form > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(7)
        finalGradeRank.data.avg = Number(
            document.querySelector(
                `body > table > tbody > tr:nth-child(2) > td > form > table:nth-child(3) > tbody > tr:nth-child(${
                    i + 2
                }) > td:nth-child(7)`
            )?.textContent ?? ""
        )

        finalGradeRank.data.rank = Number(
            document.querySelector(
                `body > table > tbody > tr:nth-child(2) > td > form > table:nth-child(3) > tbody > tr:nth-child(${
                    i + 2
                }) > td:nth-child(8)`
            )?.textContent ?? ""
        )

        finalGradeRankClass.push(finalGradeRank)

        finalGradeRank = {
            userid: "",
            img: "",
            name: "",
            data: {
                year: "",
                sem: "",
                conduct: {
                    year: "",
                    sem: "",
                    score: 0,
                },
                avg: 0,
                rank: 0,
            },
        }
    }

    return finalGradeRankClass
}

export default getClassRank
