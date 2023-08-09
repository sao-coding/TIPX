import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import getIP from "@/lib/ip"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"

type logType = {
    stuID: string
    name: string
    path: string
}

export const GET = async (req: NextRequest) => {
    if (req.nextUrl.searchParams.has("id") && req.nextUrl.searchParams.has("limit")) {
        const id = req.nextUrl.searchParams.get("id")
        const limit = req.nextUrl.searchParams.get("limit")

        // 從 id 開始往前取 limit 筆資料

        const log =
            await prisma.$queryRaw`SELECT * FROM log ORDER BY time DESC LIMIT ${id}, ${limit}`

        return NextResponse.json(log)
    }
}

export const POST = async (req: NextRequest) => {
    const res: logType = await req.json()

    // await prisma.$queryRaw` INSERT INTO log (ip, stuID,name, path) VALUES (${await getIP()}, ${
    //     res.stuID
    // }, ${res.name ?? "管理員"},${res.path})`

    await prisma.log.create({
        data: {
            ip: await getIP(),
            stuID: res.stuID,
            name: res.name ?? "管理員",
            path: res.path,
        },
    })

    return NextResponse.json({ status: "success", stuID: res.stuID })
}
