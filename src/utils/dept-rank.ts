import { JSDOM } from "jsdom"
import getUser from "@/utils/user"
import getClassRank from "@/utils/class-rank"
import { FinalGradeRankClass, FinalGradeRank, Conduct } from "@/types"

const getDeptRank = async (userid: string, year: string, sem: string) => {
    const finalGradeRankClass: FinalGradeRankClass[] = []

    const deptID = userid?.slice(0, 6)
    console.log({ deptID })
    // for (let i = Number(start); i < Number(end); i++) {
    //     const userid = classId + (Number(classid) + 1).toString() + i.toString().padStart(2, "0")
    //     fetchPromises.push(fetchData(userid))
    // }
    const { major: majorOwn } = await getUser(userid)
    for (let i = 1; i <= 3; i++) {
        for (let j = 1; j <= 5; j++) {
            const { major } = await getUser(deptID + i + j.toString().padStart(2, "0"))
            if (majorOwn === major) {
                console.log({ majorOwn, major, deptID: deptID + i + j.toString().padStart(2, "0") })
                const classRankList: FinalGradeRankClass[] = await getClassRank(
                    deptID + i + j.toString().padStart(2, "0"),
                    year,
                    sem
                )
                finalGradeRankClass.push(...classRankList)
                break
            }
        }
    }

    return finalGradeRankClass
}

export default getDeptRank
