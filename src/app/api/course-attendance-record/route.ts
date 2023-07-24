// 缺曠請假紀錄
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import getCourseAttendanceRecord from "@/lib/course-attendance-record"
import { JSDOM } from "jsdom"
import { CourseAttendanceRecord } from "@/types"

export const GET = async (req: NextRequest) => {
    const year = cookies().get("cookie_year")?.value
    const sem = cookies().get("cookie_sem")?.value
    const userid = cookies().get("cookie_userid")?.value
    const dept = cookies().get("cookie_dept")?.value
    const es = cookies().get("cookie_es")?.value

    const courseAttendanceRecordAll: CourseAttendanceRecord = await getCourseAttendanceRecord(
        userid ?? "",
        year ?? "",
        sem ?? "",
        dept ?? "",
        es ?? ""
    )

    // 取得courseID的請假數
    // req.nextUrl.searchParams.get("course")

    if (req.nextUrl.searchParams.get("course")) {
        const courseAttendanceRecord: CourseAttendanceRecord = await getCourseAttendanceRecord(
            userid ?? "",
            year ?? "",
            sem ?? "",
            dept ?? "",
            es ?? "",
            req.nextUrl.searchParams.get("course") ?? ""
        )
        return NextResponse.json(courseAttendanceRecord)
    }

    return NextResponse.json(courseAttendanceRecordAll)
}
