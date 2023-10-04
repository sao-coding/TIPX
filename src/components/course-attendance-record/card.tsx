import Link from "next/link"
import {
    CourseAttendanceRecord,
    CourseAttendanceRecordList,
    CourseAttendanceRecordTotal,
} from "@/types"

const Card = ({ data }: { data: CourseAttendanceRecordList }) => {
    const formatDate = (date: string) => {
        // 1120912 -> 2021-09-12
        const year = date.slice(0, 3)
        const month = date.slice(3, 5)
        const day = date.slice(5, 7)
        // year = parseInt(year) + 1911 + ""
        return `${parseInt(year) + 1911}-${month}-${day}`
    }

    return (
        <>
            <div className='mb-2 w-full rounded-md bg-main-color-1 p-2 shadow-sm'>
                <div className='flex items-center justify-around'>
                    <div>{formatDate(data.date)}</div>
                    <div className='rounded-md bg-main-color-2 px-1'>{data.week}</div>
                    <div>第{data.period}節</div>
                    <div>{data.type}</div>
                    <div>{data.courseID}</div>
                </div>
                <div className='mt-2 flex items-center justify-center'>
                    <Link
                        href={`/user/leave?date=${formatDate(data.date)}`}
                        className='block px-1 border-b-2 border-main-color-3 text-main-color-3 hover:text-white/80 hover:rounded-md  hover:bg-main-color-3'
                    >
                        {data.course}
                    </Link>
                </div>
            </div>
        </>
    )
}

export default Card
