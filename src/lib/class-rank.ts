// import { JSDOM } from "jsdom"
// import { FinalGradeRankClass, FinalGradeRank, Conduct, ClassName } from "@/types"

// const getFinalGradeRank = async (
//     userid: string,
//     year: string,
//     sem: string,
//     dept: string,
//     es: string
// ) => {
//     let finalGradeRankClass: FinalGradeRankClass[] = []

//     const finalGradeRankList: FinalGradeRank[] = []

//     let finalGradeRank: FinalGradeRank = {
//         year: "",
//         sem: "",
//         conduct: {
//             year: "",
//             sem: "",
//             score: 0,
//         },
//         avg: 0,
//         rank: 0,
//     }

//     const url =
//         process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://tip.sao-x.com"
