import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import getIP from "@/lib/ip"

type logType = {
    stuID: string
    name: string
    path: string
}

export const POST = async (req: NextRequest) => {
    const res: logType = await req.json()

    await prisma.$queryRaw` INSERT INTO log (ip, stuID,name, path) VALUES (${await getIP()}, ${
        res.stuID
    }, ${res.name ?? "管理員"},${res.path})`

    // await prisma.log.create({
    //     data: {
    //         ip: await getIP(),
    //         stuID: res.stuID,
    //         name: res.name ?? "管理員",
    //         path: res.path,
    //     },
    // })

    return NextResponse.json({ status: "success", stuID: res.stuID })
}
