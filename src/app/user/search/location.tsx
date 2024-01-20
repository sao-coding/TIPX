"use client"

import Link from "next/link"
import clsx from "clsx"

import { Course } from "@/types"
import formatDatetime from "@/utils/format-datetime"
import { IconBook2, IconMapPin, IconUserStar } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"

const Location = ({ userid }: { userid: string }) => {
  const { isLoading, data } = useQuery<Course>({
    queryKey: ["nowLocation", userid],
    queryFn: async () => {
      const res = await fetch(
        `/api/timetable?type=now&userid=${userid}&time=${formatDatetime(new Date(), "datetime")}`
      )
      // const data = await res.json()
      // console.log(userid, data)
      return await res.json()
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
              data?.classroom === "行蹤不明" ? "bg-red-500" : "bg-orange-500",
              "rounded-md px-1 text-white"
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
          <div className='rounded-md px-1 hover:bg-main-color-2'>
            <Link
              href={`/course/${data?.id}`}
              className='block border-b-2 border-main-color-2 text-blue-500'
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
