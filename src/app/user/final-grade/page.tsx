"use client"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { IconStar, IconStarFilled, IconCrown } from "@tabler/icons-react"
import clsx from "clsx"
import Cookie from "js-cookie"
import Image from "next/image"
import { FinalGradeRank } from "@/types"
import "@/app/loaderCat.css"

const FinalGradePage = () => {
    const [errorMsg, setErrorMsg] = useState("")

    // 班排前三名顏色
    const rankColor: { [key: number]: string } = {
        1: "text-amber-500",
        2: "text-red-500",
        3: "text-blue-500",
    }

    const { isLoading, isError, data } = useQuery<FinalGradeRank[]>({
        queryKey: ["class-rank"],
        queryFn: async () => {
            const res = await fetch(`/api/final-grade-rank?type=all`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + Cookie.get("token"),
                },
            })
            if (!res.ok) {
                setErrorMsg("發生了錯誤：" + res.status)
                throw new Error()
            }

            const json = await res.json()

            return json
        },
    })

    return (
        <div className='w-full p-2'>
            <div className='grid w-full grid-cols-2 gap-2'>
                {data &&
                    data.map((item, index) => (
                        <div
                            className='relative h-20 w-full rounded-xl border p-1 shadow-md'
                            key={index}
                        >
                            <div className='absolute left-0 top-0 p-1 text-5xl text-neutral-300'>
                                {item.year}
                            </div>
                            <div className='absolute bottom-0 right-0 pr-2 text-2xl text-neutral-300'>
                                {item.sem}
                            </div>
                            <div
                                className={clsx(
                                    "absolute right-0 top-0 p-1 text-4xl font-bold",
                                    rankColor[item.rank]
                                )}
                            >
                                {item.rank === 0 ? "?" : <>{item.rank}</>}
                            </div>
                            <div className='absolute right-0 top-0'>
                                {item.rank <= 3 && item.rank !== 0 && (
                                    <IconCrown className='origin-top-right translate-x-3 translate-y-2 rotate-45 animate-pulse fill-amber-500 stroke-amber-500' />
                                )}
                            </div>
                            <div className='absolute bottom-0 left-0 flex items-center p-1'>
                                <div className='flex items-center pr-1'>
                                    <IconStar className='animate-pulse stroke-yellow-500' />
                                    87.78
                                </div>
                                <div className='flex items-center pl-1'>
                                    <IconStar className='animate-pulse fill-yellow-500 stroke-yellow-500' />
                                    {item.avg === 0 ? "?" : item.avg}
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default FinalGradePage
