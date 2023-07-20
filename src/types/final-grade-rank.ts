// 學年	學期	平均成績	班級排名
export type FinalGradeRankClass = {
    userid: string
    img: string
    name: string
    data: FinalGradeRank
}

export type FinalGradeRank = {
    year: string
    sem: string
    avg: number
    rank: number
}
