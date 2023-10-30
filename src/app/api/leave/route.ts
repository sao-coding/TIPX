// 請假
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
import { JSDOM } from "jsdom"
import getCourse from "@/utils/course"
import getGender from "@/utils/gender"
import { Course, Leave, LeaveItem, LeaveItemCheck } from "@/types"

const formatDate = (type: string, date: string) => {
    // 112.09.11(一) to 2023-09-11
    if (type === "TIPX") {
        let [year, month, day] = date.split(".")
        // 去除 (X)
        try {
            day = day.replace(/\(.+\)/, "")
        } catch (error) {
            return ""
        }
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

    // const res = await fetch("https://netinfo.takming.edu.tw/tip/stu_absrec.php", {
    //     headers: {
    //         cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${year}; cookie_sem=${sem}; `,
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

    const leaveItemCheck: LeaveItemCheck[] = []

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
        // 判斷當前學期
        let currentYear, currentSem
        const checkYear = new Date().getFullYear()
        const checkMonth = new Date().getMonth() + 1

        if (checkMonth >= 8) {
            currentYear = checkYear - 1911
        } else {
            currentYear = checkYear - 1912
        }
        // 判斷上下學期
        // year 8 ~ 12 || year+1 1 ~ 2
        // year 2 ~ 7
        if (checkMonth >= 8 || checkMonth <= 2) {
            currentSem = 1
        } else {
            currentSem = 2
        }

        if (currentYear !== Number(year) || currentSem !== Number(sem)) {
            // 過往學期無法請假
            return NextResponse.json(
                {
                    status: "error",
                    message: "過往學期無法請假",
                },
                {
                    status: 400,
                }
            )
        }
        let bodyContent = `TDate=${formatDate("TIP", req.nextUrl.searchParams.get("date") ?? "")}`
        const res = await fetch("https://netinfo.takming.edu.tw/tip/stu_absrec.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                cookie: `cookie_userid=${userid}; cookie_rgno=${userid};cookie_account=${userid}; cookie_year=${year}; cookie_sem=${sem}; `,
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
            const course = (await getCourse(
                userid ?? "",
                year ?? "",
                sem ?? "",
                item?.getAttribute("value") ?? ""
            )) as Course

            leaveDate.leave.list.push({
                status: item?.getAttribute("checked") === null ? true : false,
                id: i,
                courseID: item?.getAttribute("value") ?? "",
                // name: (await getCourse(
                //     userid ?? "",
                //     year ?? "",
                //     sem ?? "",
                //     item?.getAttribute("value") ?? ""
                // ))?.name as string,
                name: course?.name ?? "",
                value: item?.getAttribute("name") ?? "",
            })
        }

        // return NextResponse.json(html)
    }

    if (req.nextUrl.searchParams.has("month")) {
        const getMonthLeave = async (month: string) => {
            const res = await fetch("https://netinfo.takming.edu.tw/tip/stu_absrec.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    cookie: `cookie_userid=${userid}; cookie_rgno=${userid};cookie_account=${userid}; cookie_year=${year}; cookie_sem=${sem}; `,
                    Referer: "https://netinfo.takming.edu.tw/tip/stu_absrec.php",
                },
                body: "StuDate=" + month,
                // body: `StuDate=${i.toString().padStart(2, "0")}`,
            })
            const buffer = await res.arrayBuffer()
            const html = new TextDecoder("big5").decode(buffer)
            const dom = new JSDOM(html)
            const document = dom.window.document
            const leaveLength = document.querySelectorAll(
                "#AutoNumber4 > tbody > tr:nth-child(4) > td > table > tbody tr"
            ).length
            // if (leaveLength <= 2) {
            //     return NextResponse.json([])
            // }
            for (let i = 2; i <= leaveLength; i++) {
                // console.log(
                //     i,
                //     document.querySelector(
                //         `#AutoNumber4 > tbody > tr:nth-child(4) > td > table > tbody > tr:nth-child(${i})`
                //     )?.textContent
                // )
                const item = document.querySelector(
                    `#AutoNumber4 > tbody > tr:nth-child(4) > td > table > tbody > tr:nth-child(${i})`
                )

                const status = ["已核可", "審核中", "請來談", "退件"]

                if (item?.querySelector("td:nth-child(2)") !== null) {
                    leaveItemCheck.push({
                        id:
                            item?.querySelector("a")?.getAttribute("href")?.split("rowid=")[1] ??
                            "",
                        type: item?.querySelector("td:nth-child(2)")?.textContent ?? "",
                        date: item?.querySelector("td:nth-child(3)")?.textContent ?? "",
                        course: item?.querySelector("td:nth-child(4)")?.textContent ?? "",
                        teacher: item?.querySelector("td:nth-child(5)")?.textContent ?? "",
                        section: item?.querySelector("td:nth-child(6)")?.textContent ?? "",
                        status:
                            item?.querySelector("td:nth-child(7)")?.textContent === "已核可"
                                ? "已核可"
                                : item?.querySelector("td:nth-child(7)")?.textContent === "審核中"
                                ? "審核中"
                                : item?.querySelector("td:nth-child(7)")?.textContent === "請來談"
                                ? "請來談"
                                : item?.querySelector("td:nth-child(7)")?.textContent === "退件"
                                ? "退件"
                                : "",
                    })
                }
            }
        }
        if (req.nextUrl.searchParams.get("month") === "all") {
            for (let i = 1; i <= 12; i++) {
                await getMonthLeave(i.toString().padStart(2, "0"))
            }
        } else {
            await getMonthLeave(req.nextUrl.searchParams.get("month") ?? "")
        }
        return NextResponse.json(leaveItemCheck)
    }
    return NextResponse.json(leaveDate)
}

export const POST = async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams
    const session = await getServerSession(authOptions)
    const year = searchParams.get("year") ?? cookies().get("cookie_year")?.value
    const sem = searchParams.get("sem") ?? cookies().get("cookie_sem")?.value
    const userid = searchParams.get("userid") ?? session?.user.studentID

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
                cookie: `cookie_userid=${userid}; cookie_rgno=${userid};cookie_account=${userid}; cookie_year=${year}; cookie_sem=${sem}; `,
                Referer: "https://netinfo.takming.edu.tw/tip/stu_absrec.php",
            },
            body: bodyContent,
        })
        if (!res.ok) {
            return NextResponse.error()
        }
        return NextResponse.json({ status: "success" })
    }
    // if (type === "del") {
    //     const res = await fetch("https://netinfo.takming.edu.tw/tip/stu_absrec.php", {
    //         headers: {
    //             cookie: `cookie_userid=${userid}; cookie_rgno=${userid};cookie_account=${userid}; cookie_year=${year}; cookie_sem=${sem}; `,
    //             Referer: "https://netinfo.takming.edu.tw/tip/stu_absrec.php",
    //         },
    //     })
    // }
}

export const DELETE = async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams
    const session = await getServerSession(authOptions)
    const year = searchParams.get("year") ?? cookies().get("cookie_year")?.value
    const sem = searchParams.get("sem") ?? cookies().get("cookie_sem")?.value
    const userid = searchParams.get("userid") ?? session?.user.studentID

    const { id } = await req.json()
    const res = await fetch(
        `https://netinfo.takming.edu.tw/tip/stu_absrec.php?type=3&rgno=${userid}&rowid=${id}`,
        {
            headers: {
                cookie: `cookie_userid=${userid}; cookie_rgno=${userid};cookie_account=${userid}; cookie_year=${year}; cookie_sem=${sem}; `,
                Referer: "https://netinfo.takming.edu.tw/tip/stu_absrec.php",
            },
        }
    )
    if (!res.ok) {
        return NextResponse.error()
    }
    return NextResponse.json({ status: "success", message: "刪除成功" })
}
