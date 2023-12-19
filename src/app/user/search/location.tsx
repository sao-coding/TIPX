"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { IconMapPin, IconBook2, IconUserStar } from "@tabler/icons-react"
import formatDatetime from "@/utils/format-datetime"
import { Course } from "@/types"

const Location = ({ userid }: { userid: string }) => {
    const { isLoading, data } = useQuery<Course>({
        queryKey: ["nowLocation", userid],
        queryFn: async () => {
            const res = await fetch(
                `/api/timetable?type=now&userid=${userid}&time=${formatDatetime(
                    new Date(),
                    "datetime"
                )}`
            )
            // const data = await res.json()
            // console.log(userid, data)
            return await res.json()
        },
    })

    return (
        <div className='flex flex-col space-y-2 border rounded-xl p-1'>
            <div className='flex items-center space-x-1'>
                <IconMapPin />
                <span>目前位置</span>
                {/* <div>{data?.classroom}</div> */}
                {isLoading ? (
                    <div className='animate-pulse rounded-full bg-gray-200 m-1 p-1 h-4 w-16' />
                ) : (
                    <div>{data?.classroom}</div>
                )}
            </div>
            <div className='flex items-center space-x-1'>
                <IconBook2 />
                <span>課程</span>
                {isLoading ? (
                    <div className='animate-pulse rounded-full bg-gray-200 m-1 p-1 h-4 w-24' />
                ) : (
                    <div className='rounded-md hover:bg-main-color-2 px-1'>
                        <Link
                            href={`/course/${data?.id}`}
                            className='block text-blue-500 border-b-2 border-main-color-2'
                        >
                            <div>{data?.course}</div>
                        </Link>
                    </div>
                )}
            </div>
            <div className='flex items-center space-x-1'>
                <IconUserStar />
                <span>教師</span>
                {isLoading ? (
                    <div className='animate-pulse rounded-full bg-gray-200 m-1 p-1 h-4 w-14' />
                ) : (
                    <div>{data?.teacher}</div>
                )}
            </div>
        </div>
    )
}

export default Location
