type CourseContent = {
  week: string
  content: string
  remark: string
}

export type CourseInfo = {
  teacher: string
  required: string
  class: string
  credit: string
  foreign: string
  distance: string
  method: string
  assessment: string
  content: CourseContent[]
}
