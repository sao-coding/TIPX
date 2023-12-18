import { prisma } from "@/lib/prisma"

const getSearchAuth = async (userid: string) => {
    const auth = await prisma.user.findUnique({
        where: {
            userid: userid,
        },
    })
    // console.log(auth)
    // 判斷是否找到
    return !!auth
}

export default getSearchAuth
