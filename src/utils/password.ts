import { JSDOM } from "jsdom"

const getPassword = async (userid: string) => {
    // 如果userid不是0開頭，就是學生

    type Body = {
        IDtype: string
        id_s1?: string
        id_t1?: string
    }

    let password = ""

    const fetchURL = async (body: Body) => {
        const res = await fetch("https://netinfo.takming.edu.tw/tip/manage/Account_query.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Cookie: "cookie_type=8; cookie_level=1; cookie_userid=.",
                Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php",
            },
            body: new URLSearchParams(body),
        })
        const buffer = await res.arrayBuffer()
        const html = new TextDecoder("big5").decode(buffer)
        const dom = new JSDOM(html)
        const document = dom.window.document
        const password =
            document.querySelector(
                "body > center > form > table > tbody > tr:nth-child(8) > td > font"
            )?.textContent ?? ""
        return password
    }

    if (!userid.startsWith("0")) {
        password = await fetchURL({
            IDtype: "s",
            id_s1: userid,
        })
    } else if (userid.startsWith("0")) {
        password = await fetchURL({
            IDtype: "t1",
            id_t1: userid,
        })
    } else {
        password = ""
    }
    return password
}

export default getPassword
