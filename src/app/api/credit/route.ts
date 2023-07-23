import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import getCredit from "@/lib/credit"

export const GET = async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams
    const year = searchParams.get("year") ?? cookies().get("cookie_year")?.value
    const sem = searchParams.get("sem") ?? cookies().get("cookie_sem")?.value
    const userid = searchParams.get("userid") ?? cookies().get("cookie_userid")?.value
    const dept = cookies().get("cookie_dept")?.value
    const es = cookies().get("cookie_es")?.value

    const credit = await getCredit(userid ?? "", year ?? "", sem ?? "", dept ?? "", es ?? "")

    return NextResponse.json(credit)
}
