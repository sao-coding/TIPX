import { prisma } from '@/lib/prisma'
import redis from '@/lib/redis'
const getSearchAuth = async (userid: string) => {
  // 查詢是否有快取
  const cache = await redis.get(`searchAuth_${userid}`)
  // console.log(cache)
  if (!cache) {
    console.log('no cache')
    // 若無快取，則查詢資料庫
    const auth = await prisma.user.findUnique({
      where: {
        userid: userid
      }
    })
    console.log('auth', auth)
    // 快取 bool 用 1 0 來表示 設定快取時間為 1 天
    await redis.set(`searchAuth_${userid}`, auth?.userid ? '1' : '0', 'EX', 86400)
    // 判斷是否找到
    return !!auth
  } else {
    console.log('use cache')
    // 若有快取，則直接回傳快取
    return cache === '1' ? true : false
  }
}

export default getSearchAuth
