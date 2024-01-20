// 開課代碼	科目名稱	課程分類	課別	學分	期中成績	學期成績	開課班級

export type SemGrade = {
  id: string
  name: string
  category: string
  type: string
  credit: number
  midtermGrade: number
  finalGrade: number
  class: string
}
