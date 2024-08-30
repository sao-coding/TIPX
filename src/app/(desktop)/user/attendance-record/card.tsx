import Link from 'next/link'
import clsx from 'clsx'

import { CourseAttendanceRecordList } from '@/types'
import formatDatetime from '@/utils/format-datetime'

const Card = ({ data }: { data: CourseAttendanceRecordList }) => {
  // const formatDate = (date: string) => {
  //   // 1120912 -> 2021-09-12
  //   const year = date.slice(0, 3)
  //   const month = date.slice(3, 5)
  //   const day = date.slice(5, 7)
  //   // year = parseInt(year) + 1911 + ""
  //   return `${parseInt(year) + 1911}-${month}-${day}`
  // }

  const typeColor: { [key: string]: string } = {
    曠課: 'bg-red-500',
    病假: 'bg-blue-500',
    事假: 'bg-orange-500',
    生理假: 'bg-purple-500',
    公假: 'bg-gary-500',
    喪假: 'bg-black-500'
  }

  return (
    <>
      <div className='relative h-20 rounded-xl border bg-background1 p-2'>
        <div className='flex gap-2'>
          <div>{formatDatetime('leave', data.date)}</div>
          <div className='bg-main-color-2 rounded-md px-1'>{data.week}</div>
        </div>
        <div className='absolute bottom-0 left-0 m-2 flex gap-2'>
          <div>第{data.period}節</div>
          <Link href={`/course/${data.courseID}?tab=規範`}>{data.course}</Link>
        </div>
        <div
          className={clsx(
            'absolute right-0 top-0 m-2 rounded-sm px-2 text-white',
            typeColor[data.type]
          )}
        >
          {data.type}
        </div>
      </div>
    </>
  )
}

export default Card
