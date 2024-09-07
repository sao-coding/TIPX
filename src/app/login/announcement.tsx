'use client'

import React from 'react'
import Link from 'next/link'
import clsx from 'clsx'

import { Announcement as AnnouncementType } from '@/types'
import { IconCalendarTime, IconCategory, IconLoader2, IconPinFilled } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'

const Announcement = () => {
  const { isLoading, isError, data } = useQuery<AnnouncementType[]>({
    queryKey: ['announcement'],
    queryFn: async () => {
      const res = await fetch(`/api/post?type=all&page=1&limit=20&exclude=outside`)
      const json = await res.json()
      // error
      if (!res.ok) throw new Error('沒有這篇公告')
      return json
    }
  })

  return (
    <>
      {isLoading ? (
        <div className='flex h-full w-full items-center'>
          <IconLoader2 className='mx-auto h-10 w-10 animate-spin' />
        </div>
      ) : (
        <ul className='space-y-2 overflow-auto px-6 py-2'>
          {data?.map((item, i) => (
            <li key={item.id}>
              <Link href={`/post/${item.id}`} className='relative block p-2'>
                <h1 className='mr-8 line-clamp-1'>{item.title}</h1>
                <div
                  className={clsx(
                    'absolute right-0 top-0 rounded-full p-2 text-red-500',
                    item.sticky ? 'block' : 'hidden'
                  )}
                >
                  {item.sticky ? <IconPinFilled size={20} /> : ''}
                </div>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-1'>
                    <IconCategory size={20} />
                    {item.category}
                  </div>
                  <div className='flex items-center gap-1'>
                    <IconCalendarTime size={20} />
                    {item.date}
                  </div>
                </div>
              </Link>
              {i !== data.length - 1 && <hr />}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default Announcement
