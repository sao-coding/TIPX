'use client'

import React from 'react'
import Link from 'next/link'

import { TimeTable } from '@/types'
import { IconLoader2 } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'

const MobileTimeTable = React.forwardRef<HTMLDivElement>((_, ref) => {
  const { isLoading, data } = useQuery<TimeTable[]>({
    queryKey: ['mobile-timetable'],
    queryFn: async () => {
      const res = await fetch(`/api/timetable?type=all&year=111&sem=2&userid=D11019247`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await res.json()

      return data
    }
  })

  const lesson = [
    '一',
    '二',
    '三',
    '四',
    '五',
    '六',
    '七',
    '八',
    '九',
    '十',
    '十一',
    '十二',
    '十三',
    '十四'
  ]

  return (
    <div className='relative w-full'>
      <div className='overflow-x-auto rounded-md'>
        {isLoading && (
          <div className='fixed left-0 top-0 flex h-full w-full items-center justify-center'>
            <IconLoader2 className='h-12 w-12 animate-spin' />
          </div>
        )}
        <div ref={ref} className='table w-[1500px]'>
          <div className='table-header-group'>
            <div className='table-row bg-background2 text-center'>
              <div className='sticky left-0 table-cell w-12 bg-background2 p-2'>星期</div>
              {lesson.map((item, index) => (
                <div key={index} className='table-cell w-20 p-2'>
                  第{item}節
                </div>
              ))}
            </div>
          </div>

          <div className='table-row-group'>
            {data?.map((item, index) => (
              <div key={index} className='table-row'>
                <div key={index} className='sticky left-0 table-cell bg-background2 text-center'>
                  {item.week}
                </div>
                {item.timetable.map((course, index) => (
                  <div
                    key={index}
                    className='table-cell border-r border-t bg-[hsl(0deg,_0%,_96.47%)] p-2 first:border-l-0 last:border-r-0 dark:bg-[hsl(0deg,_0%,_12.55%)]'
                  >
                    <div className='rounded text-center hover:bg-background3'>
                      <Link
                        href={`/course/${course.id}?tab=規範`}
                        className='border-b-2 border-background3 text-blue-500'
                      >
                        {course.course}
                      </Link>
                    </div>
                    <div className='text-center'>{course.classroom}</div>
                    <div className='text-center'>{course.teacher}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='h-16'></div>
    </div>
  )
})

MobileTimeTable.displayName = 'MobileTimeTable'

export default MobileTimeTable
