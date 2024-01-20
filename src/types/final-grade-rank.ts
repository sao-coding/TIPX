// 學年	學期	平均成績	班級排名
import { Conduct } from "@/types"

export type FinalGradeRankClass = {
  userid: string
  img: string
  name: string
  data: FinalGradeRank
}

export type FinalGradeRank = {
  year: string
  sem: string
  conduct: Conduct
  avg: number
  rank: number
}
