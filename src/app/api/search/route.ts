import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { student } from "@prisma/client"

export const GET = async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams
    let search = searchParams.get("search") ?? ""
    const session = await getServerSession(authOptions)
    // prisma 尋找 user 資料表裡的 userid 若等於 session 裡的 user.studentID 則回傳 user 資料表裡的 id 若沒有則回傳 沒有權限
    // console.log(session?.user.studentID)
    const auth = await prisma.user.findUnique({
        where: {
            userid: session?.user.studentID,
        },
    })
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
    if (isLetters(search[0]) && search.length > 5) {
        // 若是英文則將第一個字轉為大寫
        search = search[0].toUpperCase() + search.slice(1)
        student = await prisma.student.findMany({
            where: {
                OR: [
                    {
                        userid: {
                            contains: search,
                        },
                    },
                    {
                        name: {
                            contains: search,
                        },
                    },
                ],
            },
        })
    } else if (!isLetters(search[0])) {
        student = await prisma.student.findMany({
            where: {
                OR: [
                    {
                        userid: {
                            contains: search,
                        },
                    },
                    {
                        name: {
                            contains: search,
                        },
                    },
                ],
            },
        })
    }

    return NextResponse.json(student)
}
