import { FinalGradeRankClass } from '@/types'
import getClassName from '@/utils/class-name'
import getClassRank from '@/utils/class-rank'
import getUser from '@/utils/user'

const getDeptRank = async (userid: string, year: string, sem: string, classid: string) => {
  let finalGradeRankClass: FinalGradeRankClass[] = []

  const deptID = userid?.slice(0, 6)
  const { major: majorOwn } = await getUser(userid)
  const { class: classNameOwn } = await getClassName(userid ?? '')
  // const majorOwn = "財務金融系"

  console.time('fetching-dept-rank')

  // 先取得目前使用者的系所與班級
  // 再去獲取別的班級的成績
  // 取前五個學號 比對目前使用者的系所與班級是否一致
  // for (let i = 1; i <= 3; i++) {
  for (let j = 1; j <= 5; j++) {
    const userid = deptID + classid + j.toString().padStart(2, '0')
    const { major } = await getUser(userid)
    const { class: className } = await getClassName(userid ?? '')
    // console.log({ majorOwn, major, userid, className })
    if (majorOwn === major && classNameOwn === className) {
      finalGradeRankClass = await getClassRank(userid, year, sem)
      break
    }
  }
  // }

  console.timeEnd('fetching-dept-rank')

  return finalGradeRankClass
}

export default getDeptRank
