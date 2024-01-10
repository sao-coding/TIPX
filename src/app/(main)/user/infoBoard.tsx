"use client"

import { useQuery } from "@tanstack/react-query"
import { IconListDetails, IconClock, IconUserStar, IconLoader2 } from "@tabler/icons-react"
import Cookie from "js-cookie"
import Counter from "@/components/transition/Counter"
import { CourseAttendanceRecordTotal, Conduct } from "@/types"

const InfoBoard = () => {
    const { data: courseAttendanceRecordData, isLoading: LeaveLoading } =
        useQuery<CourseAttendanceRecordTotal>({
            queryKey: [
                "course-attendance-record-total",
                Cookie.get("cookie_year"),
                Cookie.get("cookie_sem"),
            ],
            queryFn: async () => {
                const res = await fetch("/api/course-attendance-record?type=total", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + Cookie.get("token"),
                    },
                })
                const data = await res.json()
                return data
            },
        })

    const { data: conductData, isLoading: conductLoading } = useQuery<Conduct>({
        queryKey: ["conduct-total", Cookie.get("cookie_year"), Cookie.get("cookie_sem")],
        queryFn: async () => {
            const res = await fetch(
                `/api/conduct?year=${Cookie.get("cookie_year")}&sem=${Cookie.get("cookie_sem")}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + Cookie.get("token"),
                    },
                }
            )
            const data = await res.json()
            return data
        },
    })

    return (
        <div className='flex items-center justify-between space-x-1'>
            <div className='w-full rounded-xl p-2 bg-main-color-1 md:border md:bg-transparent'>
                <div className='flex items-center justify-between'>
                    <div>缺曠次數</div>
                    <div>
                        <IconListDetails size={20} className='stroke-blue-500' />
                    </div>
                </div>
                <div className='flex items-center text-2xl'>
                    {LeaveLoading ? (
                        <IconLoader2 className='mx-1 animate-spin' />
                    ) : (
                        <Counter count={courseAttendanceRecordData?.count || 0} />
                    )}
                    <div className='ml-0.5'>次</div>
                </div>
            </div>
            <div className='w-full rounded-xl p-2 bg-main-color-1 md:border md:bg-transparent'>
                <div className='flex items-center justify-between'>
                    <div>缺曠時數</div>
                    <div>
                        <IconClock size={20} className='stroke-green-500' />
                    </div>
                </div>
                <div className='flex items-center text-2xl'>
                    {LeaveLoading ? (
                        <IconLoader2 className='mx-1 animate-spin' />
                    ) : (
                        <>
                            {courseAttendanceRecordData?.time &&
                                ((
                                    Math.round((courseAttendanceRecordData.time / 60) * 10) / 10
                                ).toFixed(1).length >= 4 ? (
                                    <Counter
                                        count={Math.round(courseAttendanceRecordData.time / 60)}
                                    />
                                ) : (
                                    <Counter
                                        count={
                                            Math.round(
                                                (courseAttendanceRecordData.time / 60) * 100
                                            ) / 100
                                        }
                                        decimals={1}
                                    />
                                ))}
                        </>
                    )}
                    <div className='ml-0.5'>小時</div>
                </div>
            </div>
            <div className='w-full rounded-xl p-2 bg-main-color-1 md:border md:bg-transparent'>
                <div className='flex items-center justify-between'>
                    <div>目前操行</div>
                    <div>
                        <IconUserStar size={20} className='stroke-yellow-500' />
                    </div>
                </div>
                <div className='flex items-center text-2xl'>
                    {conductLoading ? (
                        <IconLoader2 className='mx-1 animate-spin' />
                    ) : (
                        <Counter count={conductData?.score || 0} decimals={1} />
                    )}
                    <div className='ml-0.5'>分</div>
                </div>
            </div>
        </div>
    )
}

export default InfoBoard
