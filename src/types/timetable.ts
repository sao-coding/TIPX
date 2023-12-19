import { Course } from "./course"

export type TimeTable = {
    week: string
    timetable: Course[]
}

export type OutTimeTable = {
    week: string[]
    timetable: Course[][]
}
