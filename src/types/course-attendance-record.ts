// {
//     "list": [
//         {
//             "date":"1120609",
//             "week":"二",
//             "period":"1",
//             "type":"事假",
//             "course":"資料結構",
//             "courseCode":"D11019139",
//         }
//     ],
//     "total": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// }

export type CourseAttendanceRecord = {
    list: CourseAttendanceRecordList[]
    total: number[]
}

export type CourseAttendanceRecordList = {
    date: string
    week: string
    period: string
    type: string
    course: string
    courseID: string
}

export type CourseAttendanceRecordTotal = CourseAttendanceRecord["total"]
