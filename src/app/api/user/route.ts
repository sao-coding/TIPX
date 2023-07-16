import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { JSDOM } from "jsdom"
import { User } from "@/types"

export const GET = async (req: NextRequest) => {
    const year = cookies().get("cookie_year")?.value
    const sem = cookies().get("cookie_sem")?.value
    const userid = cookies().get("cookie_userid")?.value
    const dept = cookies().get("cookie_dept")?.value
    const es = cookies().get("cookie_es")?.value
    const authToken = req.headers.get("Authorization")?.startsWith("Bearer ")

    if (
        authToken === false ||
        req.headers.get("Authorization")?.split(" ")[1] !== process.env.AUTHORIZATION
    ) {
        // Unauthorized
        return NextResponse.json(
            {
                error: "Unauthorized",
            },
            {
                status: 401,
            }
        )
    }

    const info: string[] = []
    const credit: string[] = []
    const title: string[] = []
    const total: number[] = []
    const get: number[] = []

    const infolist: User = {
        id: "",
        img: "",
        name: "",
        status: "",
        dept: "",
        es: "",
        major: "",
        enName: "",
        IDnumber: "",
        gender: "",
        birthday: "",
        birthplace: "",
        address: "",
        phone: "",
        homePhone: "",
        date: "",
        previousEducation: "",
        parentName: "",
        parentAddress: "",
        parentPhone: "",
        parentJob: "",
        desc: "",
        credit: {
            title: [],
            total: [],
            get: [],
        },
    }

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
        document.querySelectorAll("form > table tr td table:first-child tr td font")
    )
    const img = document.querySelector("form > table tr td table:first-child tr td img")
    // console.log("img", img?.getAttribute("src"))
    const textarea = document.querySelector("form > table tr td table:first-child tr td textarea")
    // console.log("textarea", textarea?.textContent)

    // 移除陣列第一個元素
    rows.shift()

    const filter = (index: number, list: string) => {
        list = list.replace("&nbsp;&nbsp;&nbsp;", "")
        // index 0 ~ 20
        if (![0, 1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20].includes(index)) {
            list = list.replace(/\s/g, "")
        } else {
            list = list === "" ? "無" : list
        }
        return list
    }
    // let count = 0
    // let count2 = 0
    rows.forEach((row, index) => {
        let list = row.textContent
        list = filter(index, list as string)
        if (list !== "") {
            if (
                ![
                    21,
                    22,
                    23,
                    24,
                    25,
                    26,
                    27,
                    28,
                    29,
                    30,
                    31,
                    32,
                    33,
                    34,
                    35,
                    36,
                    37,
                    38,
                    39,
                    40,
                    41,
                    42,
                    43,
                    44,
                    45,
                    46,
                    47,
                    48,
                    49,
                    50,
                    rows.length - 4,
                    rows.length - 2,
                    rows.length - 1,
                ].includes(index)
            ) {
                if (index > 51 && list !== "已修學分數" && list !== "實得學分數") {
                    // count++
                    credit.push(list)
                } else if (list !== "教務資訊" && list !== "已修學分數" && list !== "實得學分數") {
                    if (index === 8 && list === "　") {
                        list = "無"
                    }
                    // console.log("index", index, "list", list)
                    // 0972490452  0226608116
                    if (index === 13) {
                        const phone = list.split("  ")[0]
                        const homePhone = list.split("  ")[1]
                        if (phone === "" || homePhone === "") {
                            info.push("無")
                        } else {
                            info.push(phone)
                            info.push(homePhone)
                        }
                    } else {
                        info.push(list)
                    }
                }
                // if (list === "已修學分數") {
                //     count2 = count
                // }
            }
        }
    })

    // console.log("info", info)

    const count = credit.length / 3
    for (let i = 0; i < credit.length; i++) {
        if (i < count) {
            title.push(credit[i])
        }
        if (i >= count && i < count * 2) {
            // console.log("total", credit[i])
            total.push(parseInt(credit[i]))
        }
        if (i >= count * 2) {
            // console.log("get", credit[i])
            get.push(parseInt(credit[i]))
        }
    }

    infolist.id = info[0]
    infolist.img = img?.getAttribute("src") ?? ""
    infolist.name = info[1]
    infolist.status = info[2]
    infolist.dept = info[3]
    infolist.es = info[4]
    infolist.major = info[5]
    infolist.enName = info[6]
    infolist.IDnumber = info[7]
    infolist.gender = info[8]
    infolist.birthday = info[9]
    infolist.birthplace = info[10]
    infolist.address = info[11]
    infolist.phone = info[12]
    infolist.homePhone = info[13]
    infolist.date = info[14]
    infolist.previousEducation = info[15]
    infolist.parentName = info[16]
    infolist.parentAddress = info[17]
    infolist.parentPhone = info[18]
    infolist.parentJob = info[19]
    infolist.desc = info[20]
    infolist.credit.title = title
    infolist.credit.total = total
    infolist.credit.get = get

    return NextResponse.json(infolist)
}
