import { useState } from "react"
import Image from "next/image"
import clsx from "clsx"
import { IconCalendarTime } from "@tabler/icons-react"
import {
    CourseAttendanceRecord,
    CourseAttendanceRecordList,
    CourseAttendanceRecordTotal,
} from "@/types"

const Card = ({ data }: { data: CourseAttendanceRecordList }) => {
    const formatDate = (date: string) => {
        const year = date.slice(0, 3)
        const month = date.slice(3, 5)
        const day = date.slice(5, 7)
        return `${year}/${month}/${day}`
    }

    return (
        <>
            <div className='mb-2 w-full rounded-md bg-main-color-1 p-2 shadow-md'>
                <div className='flex items-center justify-around'>
                    <div className=''>{formatDate(data.date)}</div>
                    <div className='rounded-md bg-main-color-2 px-1'>{data.week}</div>
                    <div className=''>第{data.period}節</div>
                    <div className=''>{data.type}</div>
                    <div className=''>{data.courseID}</div>
                </div>
                <div className='mt-2 flex items-center justify-center'>
                    <div className='rounded-md bg-main-color-3 px-1 text-white/80'>
                        {data.course}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Card
