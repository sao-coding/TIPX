import { JSDOM } from "jsdom"
import getUser from "@/utils/user"
import getClassRank from "@/utils/class-rank"
import { FinalGradeRankClass } from "@/types"

const getDeptRank = async (userid: string, year: string, sem: string, classid: string) => {
    let finalGradeRankClass: FinalGradeRankClass[] = []

    const deptID = userid?.slice(0, 6)
    const { major: majorOwn } = await getUser(userid)
    // const majorOwn = "財務金融系"

    console.time("fetching-dept-rank")

    // for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 5; j++) {
        const userid = deptID + classid + j.toString().padStart(2, "0")
        const { major } = await getUser(userid)
        if (majorOwn === major) {
            // console.log({ majorOwn, major, userid })
            finalGradeRankClass = await getClassRank(userid, year, sem)
            break
        }
    }
    // }

    console.timeEnd("fetching-dept-rank")

    return finalGradeRankClass
}

export default getDeptRank
