export type Absence = {
  id: string
  status: boolean
  disabled: boolean
}

type Student = {
  id: string
  stuID: string
  name: string
  gender: string
  absence: Absence[]
}

export type RollCall = {
  start: string
  end: string
  students: Student[]
}

export type PostRollCall = {
  course: string
  date: string
  count: number
  list: {
    id: string
    stuID: string
    absence: Absence[]
  }[]
}
