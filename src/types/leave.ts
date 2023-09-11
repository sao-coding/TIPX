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
    id: string
    name: string
    value: string
}
