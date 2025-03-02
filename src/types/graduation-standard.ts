import { SemGrade } from './sem-grade'

// 學期學分統計
interface SemesterStat {
  year: string // 學年
  sem: string // 學期
  requiredCredits: number // 必修學分
  electiveCredits: number // 選修學分
  generalCredits: number // 通識學分
  totalCredits: number // 總學分
}

// 課程資料
interface Course {
  year: string // 學年
  sem: string // 學期
  grades: SemGrade[] // 科目成績
}

// 畢業標準資料
export interface GraduationStandard {
  // 畢業要求
  graduationRequirements: GraduationRequirements

  // 當前學分狀況
  currentCredits: CurrentCredits

  // 學期學分統計
  semesterStats: SemesterStat[]

  // 所有課程資料
  courses: Course[]
}

// 畢業要求：包含學分要求
interface GraduationRequirements {
  minimumRequiredCredits: number // 畢業應修最低學分總數
  minimumElectiveCredits: number // 選修應修最低學分總數
  minimumGeneralEducationCredits: number // 通識應修最低學分總數
}

// 當前學分狀況
interface CurrentCredits {
  totalCredits: number // 目前學分總數
  totalRequiredCredits: number // 目前必修學分總數
  totalElectiveCredits: number // 目前選修學分總數
  totalGeneralCredits: number // 目前通識學分總數
}
