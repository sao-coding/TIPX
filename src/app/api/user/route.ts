import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import getUser from "@/lib/user"
import { JSDOM } from "jsdom"
import { User } from "@/types"
export const GET = async (req: NextRequest) => {
    let userid
    if (req.nextUrl.searchParams.has("userid")) {
        userid = req.nextUrl.searchParams.get("userid")
    } else {
        userid = cookies().get("cookie_userid")?.value
    }
    const year = cookies().get("cookie_year")?.value
    const sem = cookies().get("cookie_sem")?.value
    const dept = cookies().get("cookie_dept")?.value
    const es = cookies().get("cookie_es")?.value

    const infolist = await getUser(userid ?? "", year ?? "", sem ?? "", dept ?? "", es ?? "")

    return NextResponse.json(infolist)
}
