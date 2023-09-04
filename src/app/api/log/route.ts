import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/firebase-admin"
import getUser from "@/utils/user"
import getClassName from "@/utils/class-name"
import { Log } from "@/types"

export const GET = async (req: NextRequest) => {
    if (req.nextUrl.searchParams.has("id") && req.nextUrl.searchParams.has("limit")) {
        const id = req.nextUrl.searchParams.get("id")
        const limits = req.nextUrl.searchParams.get("limit") ?? "10"

        // const log =
        //     await prisma.$queryRaw`SELECT * FROM log ORDER BY time DESC LIMIT ${id}, ${limit}`

        // return NextResponse.json(log)

        if (id === "0") {
            const log = await db
                .collection("log")
                .orderBy("time", "desc")
                .limit(parseInt(limits))
                .get()

            // return NextResponse.json(
            //     log.docs.map((doc) => {
            //         return { id: doc.id, ...doc.data() }
            //     })
            // )

            const logData = []

            for (const doc of log.docs) {
                const data = doc.data()
                data.class = await (await getClassName(data.stuID)).class
                data.id = doc.id
                logData.push(data)
            }

            return NextResponse.json(logData)
        } else {
            const log = await db
                .collection("log")
                .orderBy("time", "desc")
                .startAfter(id)
                .limit(parseInt(limits))
                .get()

            // log.docs.map((doc) => {
            //     console.log(doc.id, doc.data())
            // })

            // return NextResponse.json(
            //     log.docs.map(async (doc) => {
            //         return { id: doc.id, class: await getClassName(doc.data().stuID), ...doc.data() }
            //     })
            // )
            const logData = []
            for (const doc of log.docs) {
                const data = doc.data()
                data.class = await (await getClassName(data.stuID)).class
                data.id = doc.id
                logData.push(data)
            }

            return NextResponse.json(logData)
        }
    }
}

export const POST = async (req: NextRequest) => {
    const res: Log = await req.json()

    // await prisma.$queryRaw` INSERT INTO log (ip, stuID,name, path) VALUES (${await getIP()}, ${
    //     res.stuID
    // }, ${res.name ?? "管理員"},${res.path})`

    // await prisma.log.create({
    //     data: {
    //         ip: await getIP(),
    //         stuID: res.stuID,
    //         name: res.name ?? "管理員",
    //         path: res.path,
    //     },
    // })

    // 如果是開發環境就不要寫入資料庫
    if (process.env.NODE_ENV === "production" && res.stuID !== process.env.ADMINSTUDENTID) {
        const { img } = await getUser(res.stuID, "", "", "", "")
        await db.collection("log").add({
            ip: res.ip,
            img: img,
            stuID: res.stuID,
            name: res.name,
            path: res.path,
            time: new Date().toISOString(),
        })
    }

    return NextResponse.json({ status: "success", stuID: res.stuID })
}
