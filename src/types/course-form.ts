interface Option {
  value: string
  label: string
}

export interface Question {
  id: string
  text: string
  options: Option[]
}

export interface CourseFormSection {
  id: string
  title: string
  questions: Question[]
  suggestion: string
}

// <input type="hidden" name="CLASS_NO" value="D1231">*
// <input type="hidden" name="STAFF_ID" value="0003059">*
// <input type="hidden" name="OP_NO" value="D123114">*
// <input type="hidden" name="RGNO" value="D11150104">
// <input type="hidden" name="DIVCODE" value="1">
// <input type="hidden" name="S_YEAR" value="113">
// <input type="hidden" name="S_SEM" value="2">
// <input type="hidden" name="rowid" value="3065086">*

export interface CourseForm {
  id: string
  courseId: string
  courseName: string
  classId: string
  className: string
  teacherId: string
  teacherName: string
  form: CourseFormSection[]
}

export interface CourseFormList {
  id: string
  courseId: string
  courseName: string
  className: string
  teacherName: string
  status: boolean
}
