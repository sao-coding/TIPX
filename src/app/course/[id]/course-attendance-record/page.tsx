"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Cookie from "js-cookie"
import Card from "@/components/course-attendance-record/card"
import { CourseAttendanceRecord } from "@/types"

// export default function Hw({ params }: { params: { id: string } }) {
const CourseAttendanceRecordPage = ({ params }: { params: { id: string } }) => {
    const [data, setData] = useState<CourseAttendanceRecord>()
    const router = useRouter()

    useEffect(() => {
        const cookie = Cookie.get("token")
        if (!cookie) {
            router.push("/login")
        }
    }, [])

    useEffect(() => {
        const fetchDate = async () => {
            const res = await fetch(`/api/course-attendance-record?course=${params.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + Cookie.get("token"),
                },
            })
            const data = await res.json()

            if (data.error === "Unauthorized") {
                setData(undefined)
            } else {
                setData(data)
            }
        }
        fetchDate()
    }, [])

    return (
        <>
            <div className='w-full'>
                {/* type CourseAttendanceRecordList */}
                {data?.list?.map((item, index) => (
                    <Card key={index} data={item} />
                ))}
                <div className='grid grid-cols-2 gap-2'>
                    <div className='rounded-md border p-2 shadow-md'>
                        <div className=''>曠課</div>
                        <div className='w-full text-right text-lg font-bold'>{data?.total[0]}</div>
                    </div>
                    <div className='rounded-md border p-2 shadow-md'>
                        <div className=''>事假</div>
                        <div className='w-full text-right text-lg font-bold'>{data?.total[2]}</div>
                    </div>
                    <div className='rounded-md border p-2 shadow-md'>
                        <div className=''>病假</div>
                        <div className='w-full text-right text-lg font-bold'>{data?.total[1]}</div>
                    </div>
                    <div className='rounded-md border p-2 shadow-md'>
                        <div className=''>生理假</div>
                        <div className='w-full text-right text-lg font-bold'>{data?.total[12]}</div>
                    </div>
                    <div className='rounded-md border p-2 shadow-md'>
                        <div className=''>公假</div>
                        <div className='w-full text-right text-lg font-bold'>{data?.total[3]}</div>
                    </div>
                    <div className='rounded-md border p-2 shadow-md'>
                        <div className=''>喪假</div>
                        <div className='w-full text-right text-lg font-bold'>{data?.total[7]}</div>
                    </div>
                    <div className='col-span-2 rounded-md border p-2 shadow-md'>
                        <div className=''>總計</div>
                        <div className='w-full text-right text-lg font-bold'>
                            {data?.total.reduce((a, b) => a + b, 0)}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CourseAttendanceRecordPage
