// 請假
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
import { JSDOM } from "jsdom"
import getCourse from "@/utils/course"
import getGender from "@/utils/gender"
import { Leave, LeaveItem } from "@/types"

const formatDate = (type: string, date: string) => {
    // 112.09.11(一) to 2023-09-11
    if (type === "TIPX") {
        let [year, month, day] = date.split(".")
        // 去除 (X)
        day = day.replace(/\(.+\)/, "")
        return `${Number(year) + 1911}-${month}-${day}`
    }
    if (type === "TIP") {
        // 2023-09-11 to 1120911
        let [year, month, day] = date.split("-")
        // 2023 - 1911
        return `${Number(year) - 1911}${month}${day}`
    }
    return ""
}

export const GET = async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams
    const session = await getServerSession(authOptions)
    const year = searchParams.get("year") ?? cookies().get("cookie_year")?.value
    const sem = searchParams.get("sem") ?? cookies().get("cookie_sem")?.value
    const userid = searchParams.get("userid") ?? session?.user.studentID
    const dept = cookies().get("cookie_dept")?.value
    const es = cookies().get("cookie_es")?.value

    // const res = await fetch("https://netinfo.takming.edu.tw/tip/stu_absrec.php", {
    //     headers: {
    //         cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${year}; cookie_sem=${sem}; cookie_divcode=${dept}; cookie_programname=${es};`,
    //         Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php",
    //     },
    // })

    // const buffer = await res.arrayBuffer()
    // const html = new TextDecoder("big5").decode(buffer)
    // const dom = new JSDOM(html)
    // const document = dom.window.document

    const leaveDate: Leave = {
        start: "",
        end: "",
        type: [],
        leave: {
            date: "",
            list: [],
        },
    }

    // leaveDate.start = formatDate(
    //     "TIPX",
    //     document.querySelector(
    //         "#AutoNumber4 > tbody > tr:nth-child(2) > td > div > select > option:nth-child(2)"
    //     )?.textContent ?? ""
    // )

    // leaveDate.end = formatDate(
    //     "TIPX",
    //     document.querySelector(
    //         "#AutoNumber4 > tbody > tr:nth-child(2) > td > div > select > option:last-child"
    //     )?.textContent ?? ""
    // )

    // leaveDate.leave.date = req.nextUrl.searchParams.get("date") ?? ""

    if (req.nextUrl.searchParams.has("date")) {
        // const bodyContent = new FormData()
        console.log(formatDate("TIP", req.nextUrl.searchParams.get("date") ?? ""))
        let bodyContent = `TDate=${formatDate("TIP", req.nextUrl.searchParams.get("date") ?? "")}`
        const res = await fetch("https://netinfo.takming.edu.tw/tip/stu_absrec.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                cookie: `cookie_userid=${userid}; cookie_rgno=${userid};cookie_account=${userid}; cookie_year=${year}; cookie_sem=${sem}; cookie_divcode=${dept}; cookie_programname=${es};`,
                Referer: "https://netinfo.takming.edu.tw/tip/stu_absrec.php",
            },
            body: bodyContent,
        })
        const buffer = await res.arrayBuffer()
        const html = new TextDecoder("big5").decode(buffer)
        const dom = new JSDOM(html)
        const document = dom.window.document
        leaveDate.start = formatDate(
            "TIPX",
            document.querySelector(
                "#AutoNumber4 > tbody > tr:nth-child(2) > td > div > select > option:nth-child(2)"
            )?.textContent ?? ""
        )

        leaveDate.end = formatDate(
            "TIPX",
            document.querySelector(
                "#AutoNumber4 > tbody > tr:nth-child(2) > td > div > select > option:last-child"
            )?.textContent ?? ""
        )

        leaveDate.type =
            (await (await getGender(userid ?? "")).gender) === "男"
                ? ["病假", "事假"]
                : ["病假", "事假", "生理假"]

        leaveDate.leave.date = req.nextUrl.searchParams.get("date") ?? ""

        // 第一節 ~ 第十四節
        for (let i = 1; i <= 14; i++) {
            const item = document.querySelector(
                `#AutoNumber4 > tbody > tr:nth-child(3) > td > div > p:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(${
                    i + 2
                }) > font > input[type=checkbox]`
            )
            // name = input name
            // value = input value
            leaveDate.leave.list.push({
                status: item?.getAttribute("checked") === null ? true : false,
                id: item?.getAttribute("name") ?? "",
                name: (await getCourse(
                    userid ?? "",
                    year ?? "",
                    sem ?? "",
                    dept ?? "",
                    es ?? "",
                    item?.getAttribute("value") ?? ""
                )) as string,
                value: item?.getAttribute("value") ?? "",
            })
        }

        // return NextResponse.json(html)
    }

    // console.log(leaveDate)

    // const rows = Array.from(
    //     document.querySelectorAll('table[bgcolor="#CCCCCC"] tbody tr:not(:first-child)')
    // )

    // rows.forEach((row) => {
    //     const cells = Array.from(row.querySelectorAll("td:not(:first-child)"))

    //     cells.forEach((cell, index) => {
    //         const day = Object.keys(timeTable)[index] as keyof TimeTable
    //         const daylist = cell.innerHTML.replace(/<font size="2">|<\/font>/g, "").split("<br>")
    //         if (daylist[0] === ".") {
    //             timeTable[day].push(["", "", "", ""])
    //         } else {
    //             timeTable[day].push(daylist)
    //         }
    //     })
    // })

    // console.log(weekList)
    return NextResponse.json(leaveDate)
    // }

    // fetchData()
}

export const POST = async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams
    const session = await getServerSession(authOptions)
    const year = searchParams.get("year") ?? cookies().get("cookie_year")?.value
    const sem = searchParams.get("sem") ?? cookies().get("cookie_sem")?.value
    const userid = searchParams.get("userid") ?? session?.user.studentID
    const dept = cookies().get("cookie_dept")?.value
    const es = cookies().get("cookie_es")?.value

    const TypeList: { [key: string]: string } = {
        病假: "2",
        事假: "3",
        生理假: "H",
    }

    const { type, date, leaveType, list } = await req.json()
    if (type === "leave") {
        const bodyContent = `TDate=${formatDate("TIP", date)}&AbsType=${TypeList[leaveType]}&${list
            .map((item: LeaveItem) => `${item.id}=${item.value}`)
            .join("&")}`
        console.log(bodyContent)
        // application/x-www-form-urlencoded
        // const bodyContent =

        const res = await fetch("https://netinfo.takming.edu.tw/tip/stu_absrec.php?mode=1", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                cookie: `cookie_userid=${userid}; cookie_rgno=${userid};cookie_account=${userid}; cookie_year=${year}; cookie_sem=${sem}; cookie_divcode=${dept}; cookie_programname=${es};`,
                Referer: "https://netinfo.takming.edu.tw/tip/stu_absrec.php",
            },
            body: bodyContent,
        })
        if (!res.ok) {
            return NextResponse.error()
        }
        return NextResponse.json({ status: "success" })
    }
    if (type === "del") {
        const res = await fetch("https://netinfo.takming.edu.tw/tip/stu_absrec.php", {
            headers: {
                cookie: `cookie_userid=${userid}; cookie_rgno=${userid};cookie_account=${userid}; cookie_year=${year}; cookie_sem=${sem}; cookie_divcode=${dept}; cookie_programname=${es};`,
                Referer: "https://netinfo.takming.edu.tw/tip/stu_absrec.php",
            },
        })
    }
}
