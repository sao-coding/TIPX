import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import getSearchAuth from "@/utils/search-auth"
import { student } from "@prisma/client"

export const GET = async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams
    let search = searchParams.get("search") ?? ""
    const id = searchParams.get("id") ?? "0"
    const limit = searchParams.get("limit") ?? "10"
    const session = await getServerSession(authOptions)
    // prisma 尋找 user 資料表裡的 userid 若等於 session 裡的 user.studentID 則回傳 user 資料表裡的 id 若沒有則回傳 沒有權限
    // console.log(session?.user.studentID)
    const auth = await getSearchAuth(session?.user.studentID ?? "")
    // console.log(auth)
    // 判斷是否找到
    if (!auth) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // const res: { userid: string } = await req.json()
    // console.log({ search })
    // prisma 尋找 student 資料表裡的 userid 或 name 裡面包含 search 的資料

    const isLetters = (str: string) => {
        const reg = /^[A-Za-z]+$/
        return reg.test(str)
    }

    let student: student[] = []
    // 判斷 search 第一個字是否為英文
    if (isLetters(search[0]) && search.length > 2) {
        // 若是英文則將第一個字轉為大寫
        search = search[0].toUpperCase() + search.slice(1)
        search = `%${search}%`
        student =
            await prisma.$queryRaw`SELECT * FROM student WHERE userid LIKE ${search} OR name LIKE ${search} ORDER BY FIELD(SUBSTRING(userid, 1,1), 'D', 'C', 'M', 'N','K'), userid ASC LIMIT ${id}, ${limit}`
    } else if (!isLetters(search[0])) {
        search = `%${search}%`
        student =
            await prisma.$queryRaw`SELECT * FROM student WHERE userid LIKE ${search} OR name LIKE ${search} ORDER BY FIELD(SUBSTRING(userid, 1,1), 'D', 'C', 'M', 'N','K'), userid ASC LIMIT ${id}, ${limit}`
    }

    return NextResponse.json(student)
}
