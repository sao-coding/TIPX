export type Leave = {
    start: string
    end: string
    type: string[]
    leave: {
        date: string
        list: LeaveItem[]
    }
}

export type LeaveItem = {
    status: boolean
    id: number
    courseID: string
    name: string
    value: string
}

export type LeaveItemCheck = {
    id: string
    type: string
    date: string
    course: string
    teacher: string
    section: string
    status: string
}
