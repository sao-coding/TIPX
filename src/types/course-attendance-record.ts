// 曠課	病假	事假	公假	朝會不到	朝會遲到	遲到	喪假	婚假	產假	育嬰假	哺育幼兒假	生理假	懷孕假 新生定向
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
//     "total": [
//         {
//             {
//                 "name": "曠課",
//                 "count": 0
//               },
//         }
//     ]
// }

export type CourseAttendanceRecord = {
    list: CourseAttendanceRecordList[]
    total: CourseAttendanceRecordCount[]
}

export type CourseAttendanceRecordList = {
    date: string
    week: string
    period: string
    type: string
    course: string
    courseID: string
}

export type CourseAttendanceRecordCount = {
    name: string
    count: number
}

export type CourseAttendanceRecordTotal = {
    count: number
    time: number
}
