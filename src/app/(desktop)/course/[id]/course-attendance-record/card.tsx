import Link from 'next/link'

import { CourseAttendanceRecordList } from '@/types'

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
      <div className='w-full rounded-md bg-background1 p-2 shadow-sm'>
        <div className='flex items-center justify-around'>
          <div>{formatDate(data.date)}</div>
          <div className='rounded-full bg-background3 px-1'>{data.week}</div>
          <div>第{data.period}節</div>
          <div>{data.type}</div>
          <div>{data.courseID}</div>
        </div>
        <div className='mt-2 flex items-center justify-center'>
          <Link
            href={`/user/leave?date=${formatDate(data.date)}`}
            className='block border-b-2 border-primary px-2 text-primary hover:rounded-sm hover:bg-primary hover:text-white'
          >
            {data.course}
          </Link>
        </div>
      </div>
    </>
  )
}

export default Card
