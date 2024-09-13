'use client'

import Link from 'next/link'
import clsx from 'clsx'

import api from '@/lib/api'
import { Course } from '@/types'
import formatDatetime from '@/utils/format-datetime'
import { IconBook2, IconMapPin, IconUserStar } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'

const Location = ({ userid }: { userid: string }) => {
  const { isLoading, data } = useQuery<Course>({
    queryKey: ['nowLocation', userid],
    queryFn: async () => {
      const { data } = await api.get('/timetable', {
        params: {
          type: 'now',
          userid,
          time: formatDatetime('datetime', new Date())
        }
      })

      return data
    }
  })

  return (
    <div className='flex flex-col space-y-2 rounded-xl border p-2'>
      <div className='flex items-center space-x-1'>
        <IconMapPin />
        {/* <span>目前位置</span> */}
        {isLoading ? (
          <div className='m-1 h-4 w-16 animate-pulse rounded-full bg-gray-200 p-1' />
        ) : (
          <div
            className={clsx(
              data?.classroom === '行蹤不明' ? 'bg-red-500' : 'bg-orange-500',
              'rounded-sm px-2 text-white'
            )}
          >
            {data?.classroom}
          </div>
        )}
      </div>
      <div className='flex items-center space-x-1'>
        <IconBook2 />
        {/* <span>課程</span> */}
        {isLoading ? (
          <div className='m-1 h-4 w-24 animate-pulse rounded-full bg-gray-200 p-1' />
        ) : (
          <div className='hover:bg-main-color-2 rounded-md px-1'>
            <Link
              href={`/course/${data?.id}`}
              className='border-main-color-2 block border-b-2 text-blue-500'
            >
              <div>{data?.course}</div>
            </Link>
          </div>
        )}
      </div>
      <div className='flex items-center space-x-1'>
        <IconUserStar />
        {/* <span>教師</span> */}
        {isLoading ? (
          <div className='m-1 h-4 w-14 animate-pulse rounded-full bg-gray-200 p-1' />
        ) : (
          <div>{data?.teacher}</div>
        )}
      </div>
    </div>
  )
}

export default Location
