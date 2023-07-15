import { NextRequest, NextResponse } from "next/server"
import { JSDOM } from "jsdom"

export const dynamic = "force-dynamic"

export const GET = async (req: NextRequest) => {
    const year = req.cookies.get("cookie_year")?.value
    const sem = req.cookies.get("cookie_sem")?.value
    const userid = req.cookies.get("cookie_userid")?.value
    const dept = req.cookies.get("cookie_dept")?.value
    const es = req.cookies.get("cookie_es")?.value

    const res = await fetch("https://netinfo.takming.edu.tw/tip/stu_data_new.php", {
        headers: {
            cookie: `cookie_account=D11019139;cookie_sex=1;cookie_enyear=110;cookie_classname=%A4%E9%A5%7C%A7%DE%AC%EC%A4G%A5%D2;cookie_logintimes=2;cookie_classno=D1921;cookie_grade=3;cookie_dept=19;PHPSESSID=5i6hof7hpt28irg9rf4o2tkbcv;cookie_programname=%A4%E9%A5%7C%A7%DE;cookie_level=2;cookie_program=D;cookie_type=2;cookie_name=%25F7%25E1%25A4%25E5%25B5q;cookie_class=1;cookie_rgno=D11019139;cookie_sem=2;cookie_rand=r7p4tVQKwRGCkB;cookie_userid=D11019139;cookie_divcode=1;cookie_year=111`,
            Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php",
        },
    })

    const buffer = await res.arrayBuffer()
    let html = new TextDecoder("big5").decode(buffer)
    const dom = new JSDOM(html)
    const document = dom.window.document
    const verify = Array.from(document.querySelectorAll("script"))
    // console.log(verify[0].innerHTML)
    // 去除 所有 \r, \n, \t
    // const cap = verify[0].innerHTML.replace(/\r|\n|\t/g, "")
    html = html.replace(/\r|\n|\t/g, "")
    // html = html.replace(cap, "")

    return NextResponse.json(html)
}
