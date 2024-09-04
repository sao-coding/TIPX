import Link from 'next/link'
import clsx from 'clsx'

import { CourseAttendanceRecordList } from '@/types'
import formatDatetime from '@/utils/format-datetime'

const Card = ({ data }: { data: CourseAttendanceRecordList }) => {
  // bg-red-500/50 bg-red-500/80
  const leaveTypeColor: { [key: string]: string } = {
    曠課: 'bg-red-500',
    病假: 'bg-blue-500',
    事假: 'bg-orange-500',
    生理假: 'bg-rose-400',
    公假: 'bg-slate-500',
    喪假: 'bg-stone-500'
  }

  return (
    <>
      <div className='relative h-20 rounded-sm border bg-background1 p-2'>
        <div className='flex gap-1'>
          <div>{formatDatetime('leave', data.date)}</div>
          <div className='rounded-md px-1'>星期{data.week}</div>
        </div>
        <div className='absolute bottom-0 left-0 m-2 flex gap-2'>
          <div className='rounded-sm bg-primary px-2 text-white'>第{data.period}節</div>
          <Link href={`/course/${data.courseID}?tab=規範`} className='border-b border-primary'>
            {data.course}
          </Link>
        </div>
        <div
          className={clsx(
            'absolute right-0 top-0 m-2 rounded-sm px-2 text-white',
            leaveTypeColor[data.type]
          )}
        >
          {data.type}
        </div>
        {/* 只有曠課才顯示去請假 */}
        {/* href={`/user/leave?date=${formatDate(data.date)}`} */}
        {data.type === '曠課' && (
          <Link
            href={`/user/leave?date=${formatDatetime('date', data.date)}`}
            className='absolute bottom-0 right-0 m-2 text-blue-500 after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-blue-500 after:transition-all after:duration-300 after:ease-in-out after:content-[""] hover:after:w-full'
          >
            去請假
          </Link>
        )}
        {/* {data.type === '曠課' && (
          <span className='absolute right-0 top-0 -m-1 flex h-3 w-3'>
            <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75'></span>
            <span className='relative inline-flex h-3 w-3 rounded-full bg-red-500'></span>
          </span>
        )} */}
      </div>
    </>
  )
}

export default Card
