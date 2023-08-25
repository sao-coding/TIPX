"use client"

import { useQuery } from "@tanstack/react-query"
import Card from "@/components/course-attendance-record/card"
import { CourseAttendanceRecord } from "@/types"
import "@/app/loaderCat.css"

const CourseAttendanceRecordPage = ({ params }: { params: { id: string } }) => {
    const { data, isLoading } = useQuery<CourseAttendanceRecord>({
        queryKey: ["course-attendance-record", params.id],
        queryFn: async () => {
            const res = await fetch(`/api/course-attendance-record?course=${params.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            const data = await res.json()
            return data
        },
    })

    return (
        <>
            {isLoading ? (
                <div className='absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2'>
                    <div className='flex h-full w-full items-center justify-center'>
                        <div className='cat'>
                            <div className='cat__body'></div>
                            <div className='cat__body'></div>
                            <div className='cat__tail'></div>
                            <div className='cat__head'></div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='h-full w-full'>
                    {data && (
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
                            <div className='sticky left-0 top-0 mb-2 rounded-md border md:bg-white p-2 shadow-sm bg-slate-50 md:top-14'>
                                <div className=''>總計</div>
                                <div className='w-full text-right text-lg font-bold'>
                                    {data?.total.reduce((a, b) => a + b, 0)}
                                </div>
                            </div>
                            {data?.list?.map((item, index) => <Card key={index} data={item} />)}
                        </>
                    )}
                </div>
            )}
        </>
    )
}

export default CourseAttendanceRecordPage
