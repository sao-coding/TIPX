"use client"

import { useState, useEffect } from "react"
import Card from "@/components/course-attendance-record/card"
import {
    CourseAttendanceRecord,
    CourseAttendanceRecordList,
    CourseAttendanceRecordTotal,
} from "@/types"
export default function Hw({ params }: { params: { id: string } }) {
    const [data, setData] = useState<CourseAttendanceRecord>()
    const [cookie, setCookie] = useState("")

    useEffect(() => {
        const fetchDate = async () => {
            const res = await fetch(`/api/course-attendance-record?id=${params.id}`)
            const data = await res.json()

            setData(data)
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
                    <div className='rounded-md p-2 shadow-md'>
                        <div className=''>曠課</div>
                        <div className='w-full text-right text-lg font-bold'>{data?.total[0]}</div>
                    </div>
                    <div className='rounded-md p-2 shadow-md'>
                        <div className=''>病假</div>
                        <div className='w-full text-right text-lg font-bold'>{data?.total[1]}</div>
                    </div>
                    <div className='rounded-md p-2 shadow-md'>
                        <div className=''>事假</div>
                        <div className='w-full text-right text-lg font-bold'>{data?.total[2]}</div>
                    </div>
                    <div className='rounded-md p-2 shadow-md'>
                        <div className=''>公假</div>
                        <div className='w-full text-right text-lg font-bold'>{data?.total[3]}</div>
                    </div>
                </div>
            </div>
        </>
    )
}
