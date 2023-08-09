"use client"
import { useEffect } from "react"
import Card from "@/components/home/card"
import Loading from "@/components/home/loading"
import { Log } from "@/types"
import { useInView } from "react-intersection-observer"
import { useInfiniteQuery } from "@tanstack/react-query"

const AnnouncementCP = () => {
    const { ref, inView } = useInView()
    const { data, isSuccess, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery<
        Log[]
    >({
        queryKey: ["log"],
        queryFn: async ({ pageParam = 0 }) => {
            const res = await fetch(`/api/log?type=all&id=${pageParam}&limit=10`)
            return res.json()
        },
        getNextPageParam: (lastPage, allPages) => {
            console.log({
                lastPage,
                allPages,
            })

            return lastPage.length === 10 ? allPages.length * 10 : undefined
        },
    })

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage()
        }
    }, [inView, fetchNextPage, hasNextPage])

    return (
        <>
            <div className='mb-14 w-full p-2'>
                {isSuccess &&
                    data.pages.map((page: Log[]) =>
                        page.map((data, i) => {
                            if (page.length === i + 1) {
                                return (
                                    <div
                                        className='mb-2 grid grid-cols-3 gap-1 rounded-xl border p-2'
                                        ref={ref}
                                    >
                                        {/* <div className=''>{data.id}</div> */}
                                        <div className=''>{data.stuID}</div>
                                        <div className=''>{data.name}</div>
                                        <div className=' justify-self-end'>{data.path}</div>
                                        <div className=''>{data.ip}</div>
                                        <div className='col-span-2  justify-self-end'>
                                            {new Date(data.time).toLocaleString("zh-TW", {
                                                timeZone: "Asia/Taipei",
                                            })}
                                        </div>
                                    </div>
                                )
                            }
                            return (
                                <div
                                    className='mb-1 grid grid-cols-3 gap-1 rounded-xl border p-2'
                                    key={data.id}
                                >
                                    {/* <div className=''>{data.id}</div> */}
                                    <div className=''>{data.stuID}</div>
                                    <div className=''>{data.name}</div>
                                    <div className='justify-self-end'>{data.path}</div>
                                    <div className=''>{data.ip}</div>
                                    <div className='col-span-2  justify-self-end'>
                                        {new Date(data.time).toLocaleString("zh-TW", {
                                            timeZone: "Asia/Taipei",
                                        })}
                                    </div>
                                </div>
                            )
                        })
                    )}
                {(isFetchingNextPage || !data) &&
                    Array.from(Array(10).keys()).map((index) => (
                        <div className='mb-1 h-[70px] rounded-xl border p-2' key={index}>
                            <div className='grid h-full animate-pulse grid-cols-3 place-items-center gap-1'>
                                <div className='h-3 w-20 justify-self-start rounded-full  bg-neutral-500'></div>
                                <div className='h-3 w-20 rounded-full bg-neutral-500'></div>
                                <div className='h-3 w-20 justify-self-end rounded-full bg-neutral-500'></div>
                                <div className='h-3 w-20 justify-self-start rounded-full  bg-neutral-500'></div>
                                <div className='col-span-2 h-3 w-44 justify-self-end rounded-full bg-neutral-500'></div>
                            </div>
                        </div>
                    ))}
            </div>
        </>
    )
}

export default AnnouncementCP
