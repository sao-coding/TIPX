import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { JSDOM } from "jsdom"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"

export const GET = async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams
    const session = await getServerSession(authOptions)
    const year = searchParams.get("year") ?? cookies().get("cookie_year")?.value
    const sem = searchParams.get("sem") ?? cookies().get("cookie_sem")?.value
    const userid = searchParams.get("userid") ?? session?.user.studentID

    const res = await fetch("https://netinfo.takming.edu.tw/tip/stu_setmail.php", {
        headers: {
            cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${year}; cookie_sem=${sem}; `,
            // cookie: Object.entries(cookie)
            //     .map((e) => `${e[0]}=${e[1]}`)
            //     .join("; "),
            Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php",
        },
    })

    const buffer = await res.arrayBuffer()
    let html = new TextDecoder("big5").decode(buffer)
    const dom = new JSDOM(html)
    const document = dom.window.document

    const email = {
        userid: "",
        email: "",
        lineid: "",
    }

    email.userid =
        document.querySelector(
            "body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td:nth-child(2) > font > font"
        )?.textContent ?? ""

    email.email =
        document
            .querySelector(
                "body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > input[type=text]"
            )
            ?.getAttribute("value") ?? ""

    email.lineid =
        document
            .querySelector(
                "body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table > tbody > tr:nth-child(3) > td:nth-child(2) > input[type=text]"
            )
            ?.getAttribute("value") ?? ""
    // console.log(html)
    return NextResponse.json(email)
}

export const POST = async (req: NextRequest) => {
    const formData = await req.formData()
    const email = formData.get("Mail")
    const lineid = formData.get("LineID")
    // const submit = formData.get("Submit")

    let bodyContent = new FormData()
    if (email) {
        bodyContent.append("Mail", email)
    } else {
        return NextResponse.json({ status: "error", message: "未填寫Email" })
    }
    if (lineid) {
        bodyContent.append("LineID", lineid)
    } else {
        return NextResponse.json({ status: "error", message: "未填寫LineID" })
    }

    const res = await fetch("https://netinfo.takming.edu.tw/tip/stu_setmail_x.php", {
        method: "POST",
        headers: {
            cookie: cookies().toString(),
        },
        body: bodyContent,
    })
    console.log(res)
    if (!res.ok) {
        return NextResponse.json({ status: "error", message: "存檔失敗" })
    }

    const data = await res.text()
    console.log(data)
    return NextResponse.json(data)
    if (data.includes("File Upload Successful")) {
        return NextResponse.json({ status: "success" })
    } else {
        return NextResponse.json({ status: "fail" })
    }
}
