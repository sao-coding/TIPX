"use client"

import React from "react"
import clsx from "clsx"

import { Announcement as AnnouncementType } from "@/types"
import { IconCalendarTime, IconCategory, IconLoader2, IconPinFilled } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"

const Announcement = () => {
  const { isLoading, isError, data } = useQuery<AnnouncementType[]>({
    queryKey: ["announcement"],
    queryFn: async () => {
      const res = await fetch(`/api/post?type=all&page=1&limit=20`)
      const json = await res.json()
      // error
      if (!res.ok) throw new Error("沒有這篇公告")
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
        <div className='space-y-2 overflow-auto px-6 py-2'>
          {data?.map((item, i) => (
            <React.Fragment key={item.id}>
              <div className='relative p-2'>
                <h1 className='mr-8 line-clamp-1'>{item.title}</h1>
                <div
                  className={clsx(
                    "absolute right-0 top-0 rounded-full p-2 text-red-500",
                    item.sticky ? "block" : "hidden"
                  )}
                >
                  {item.sticky ? <IconPinFilled size={20} /> : ""}
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
              </div>
              {i !== data.length - 1 && <hr />}
            </React.Fragment>
          ))}
        </div>
      )}
    </>
  )
}

export default Announcement
