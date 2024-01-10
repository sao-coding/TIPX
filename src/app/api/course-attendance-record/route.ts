// 缺曠請假紀錄
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import getCourseAttendanceRecord from "@/utils/course-attendance-record"
import { CourseAttendanceRecord, CourseAttendanceRecordTotal } from "@/types"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"

export const GET = async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams
    const session = await getServerSession(authOptions)
    const year = searchParams.get("year") ?? cookies().get("cookie_year")?.value
    const sem = searchParams.get("sem") ?? cookies().get("cookie_sem")?.value
    const userid = searchParams.get("userid") ?? session?.user.studentID
    const type = searchParams.get("type") ?? "normal"
    const course = searchParams.get("course") ?? ""

    const courseAttendanceRecordAll: CourseAttendanceRecord | CourseAttendanceRecordTotal =
        await getCourseAttendanceRecord(userid ?? "", year ?? "", sem ?? "", type ?? "")

    // 取得courseID的請假數
    if (req.nextUrl.searchParams.get("course")) {
        const courseAttendanceRecord: CourseAttendanceRecord = (await getCourseAttendanceRecord(
            userid ?? "",
            year ?? "",
            sem ?? "",
            type ?? "",
            course
        )) as CourseAttendanceRecord
        return NextResponse.json(courseAttendanceRecord)
    }

    return NextResponse.json(courseAttendanceRecordAll)
}
