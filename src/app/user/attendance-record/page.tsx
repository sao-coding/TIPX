import { cookies } from "next/headers"
// import { useState, useEffect } from "react"
import Card from "@/components/course-attendance-record/card"
import { CourseAttendanceRecord } from "@/types"
import { site } from "@/config/site"

const getData = async () => {
    const res = await fetch(`${site.url}/api/course-attendance-record`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookies().toString(),
        },
    })

    if (!res.ok) {
        throw new Error("獲取資料失敗")
    }

    return await res.json()
}

const CourseAttendanceRecordPage = async () => {
    const data: CourseAttendanceRecord = await getData()

    return (
        <>
            <div className='mb-14 w-full p-2'>
                {data?.list?.length > 0 ? (
                    <>
                        <div className='mb-2 grid grid-cols-2 gap-2'>
                            <div className='rounded-md border p-2 shadow-sm'>
                                <div className=''>曠課</div>
                                <div className='w-full text-right text-lg font-bold'>
                                    {data?.total[0]}
                                </div>
                            </div>
                            <div className='rounded-md border p-2 shadow-sm'>
                                <div className=''>事假</div>
                                <div className='w-full text-right text-lg font-bold'>
                                    {data?.total[2]}
                                </div>
                            </div>
                            <div className='rounded-md border p-2 shadow-sm'>
                                <div className=''>病假</div>
                                <div className='w-full text-right text-lg font-bold'>
                                    {data?.total[1]}
                                </div>
                            </div>
                            <div className='rounded-md border p-2 shadow-sm'>
                                <div className=''>生理假</div>
                                <div className='w-full text-right text-lg font-bold'>
                                    {data?.total[12]}
                                </div>
                            </div>
                            <div className='rounded-md border p-2 shadow-sm'>
                                <div className=''>公假</div>
                                <div className='w-full text-right text-lg font-bold'>
                                    {data?.total[3]}
                                </div>
                            </div>
                            <div className='rounded-md border p-2 shadow-sm'>
                                <div className=''>喪假</div>
                                <div className='w-full text-right text-lg font-bold'>
                                    {data?.total[7]}
                                </div>
                            </div>
                        </div>
                        <div className='sticky left-0 top-0 mb-2 rounded-md border bg-slate-50 p-2 shadow-sm md:top-14'>
                            <div className=''>總計</div>
                            <div className='w-full text-right text-lg font-bold'>
                                {data?.total.reduce((a, b) => a + b, 0)}
                            </div>
                        </div>
                        {data?.list?.map((item, index) => <Card key={index} data={item} />)}
                    </>
                ) : (
                    <div className='text-center text-2xl'>沒有請假</div>
                )}
            </div>
        </>
    )
}

export default CourseAttendanceRecordPage
