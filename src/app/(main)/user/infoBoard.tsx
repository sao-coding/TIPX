"use client"

import { useState, useEffect } from "react"
import { IconListDetails, IconClock, IconUserStar, IconLoader2 } from "@tabler/icons-react"
import Cookie from "js-cookie"
import { CourseAttendanceRecord, Conduct } from "@/types"
const InfoBoard = () => {
    const [courseAttendanceRecordData, setCourseAttendanceRecordData] =
        useState<CourseAttendanceRecord>({ list: [], total: [] })
    const [conductData, setConductData] = useState<Conduct>({
        year: "",
        sem: "",
        score: 0,
    })
    const [LeaveLoading, setLeaveLoading] = useState(false)

    useEffect(() => {
        const fetchCourseAttendanceRecord = async () => {
            setLeaveLoading(true)
            const res = await fetch("/api/course-attendance-record", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + Cookie.get("token"),
                },
            })
            const data = await res.json()

            setCourseAttendanceRecordData(data)
            setLeaveLoading(false)
        }
        fetchCourseAttendanceRecord()

        const fetchConduct = async () => {
            // const res = await fetch("/api/conduct?year=111&sem=2")
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

            setConductData(data)
        }
        fetchConduct()
    }, [Cookie.get("cookie_year"), Cookie.get("cookie_sem")])

    return (
        <div className='mt-2 flex items-center justify-between space-x-1'>
            <div className='w-full rounded-xl border p-2 shadow-md'>
                <div className='flex items-center justify-between'>
                    <div>請假次數</div>
                    <div>
                        <IconListDetails size={20} />
                    </div>
                </div>
                <div className='flex items-center text-2xl'>
                    {LeaveLoading ? (
                        <IconLoader2 className='mx-1 animate-spin' />
                    ) : (
                        <>
                            {courseAttendanceRecordData?.total.length > 0 &&
                                courseAttendanceRecordData?.total?.reduce(
                                    (total, item) => total + item
                                )}
                        </>
                    )}
                    <div className='ml-0.5'>次</div>
                </div>
            </div>
            <div className='w-full rounded-xl border p-2 shadow-md'>
                <div className='flex items-center justify-between'>
                    <div>請假時數</div>
                    <div>
                        <IconClock size={20} />
                    </div>
                </div>
                <div className='flex items-center text-2xl'>
                    {LeaveLoading ? (
                        <IconLoader2 className='mx-1 animate-spin' />
                    ) : (
                        <>
                            {courseAttendanceRecordData?.total.length > 0 &&
                            document.body.clientWidth >= 380
                                ? courseAttendanceRecordData?.total
                                      ?.reduce((total, item) => {
                                          return total + Math.round(((item * 50) / 60) * 10) / 10
                                      }, 0)
                                      .toFixed(1)
                                : courseAttendanceRecordData?.total
                                      ?.reduce((total, item) => {
                                          return total + Math.round(((item * 50) / 60) * 10) / 10
                                      }, 0)
                                      .toFixed(0)}
                        </>
                    )}
                    <div className='ml-0.5'>小時</div>
                </div>
            </div>
            <div className='w-full rounded-xl border p-2 shadow-md'>
                <div className='flex items-center justify-between'>
                    <div>目前操行</div>
                    <div>
                        <IconUserStar size={20} />
                    </div>
                </div>
                <div className='text-2xl'>{conductData.score}分</div>
            </div>
        </div>
    )
}

export default InfoBoard
