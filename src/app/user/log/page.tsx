"use client"

import { useEffect } from "react"
import { Log } from "@/types"
import { useInView } from "react-intersection-observer"
import { useInfiniteQuery } from "@tanstack/react-query"
import Fancybox from "@/components/fancybox"
import Avatar from "@/components/ui/avatar"
import { IconUserCircle } from "@tabler/icons-react"

const AnnouncementCP = () => {
    const { ref, inView } = useInView()
    const { data, isSuccess, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery<
        Log[]
    >({
        queryKey: ["log"],
        queryFn: async ({ pageParam = 0 }) => {
            const res = await fetch(`/api/log?id=${pageParam}&limit=10`)
            return res.json()
        },
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === 10 ? lastPage[lastPage.length - 1].time : undefined
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
                                        className='mb-2 rounded-xl border p-2 flex items-center relative'
                                        ref={ref}
                                        key={data.id}
                                    >
                                        {/* <div>{data.id}</div> */}
                                        <Fancybox
                                            options={{
                                                Carousel: {
                                                    infinite: false,
                                                },
                                            }}
                                        >
                                            <a
                                                href={data.img}
                                                data-fancybox
                                                data-caption={data?.name}
                                            >
                                                <Avatar
                                                    src={data.img}
                                                    width={75}
                                                    height={100}
                                                    alt={data.name}
                                                    fallback={
                                                        <div className='flex h-[100px] w-[75px] items-center justify-center rounded-md shadow-md'>
                                                            <IconUserCircle size={75} />
                                                        </div>
                                                    }
                                                />
                                            </a>
                                        </Fancybox>
                                        <div className='p-2'>
                                            <div>{data.stuID}</div>
                                            <div>{data.name}</div>
                                            <div>{data.ip}</div>
                                            <div className='col-span-2  justify-self-end'>
                                                {new Date(data.time).toLocaleString("zh-TW", {
                                                    timeZone: "Asia/Taipei",
                                                })}
                                            </div>
                                        </div>
                                        <div className='absolute top-1 right-1 px-1 bg-main-color-2 rounded-lg font-mono'>
                                            <div className='justify-self-end whitespace-nowrap'>
                                                {data.path}
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            return (
                                <div
                                    className='mb-2 rounded-xl border p-2 flex items-center relative'
                                    ref={ref}
                                    key={data.id}
                                >
                                    {/* <div>{data.id}</div> */}
                                    <Fancybox
                                        options={{
                                            Carousel: {
                                                infinite: false,
                                            },
                                        }}
                                    >
                                        <a href={data.img} data-fancybox data-caption={data?.name}>
                                            <Avatar
                                                src={data.img}
                                                width={75}
                                                height={100}
                                                alt={data.name}
                                                fallback={
                                                    <div className='flex h-[100px] w-[75px] items-center justify-center rounded-md shadow-md'>
                                                        <IconUserCircle size={75} />
                                                    </div>
                                                }
                                            />
                                        </a>
                                    </Fancybox>
                                    <div className='p-2'>
                                        <div>{data.stuID}</div>
                                        <div>{data.name}</div>
                                        <div>{data.ip}</div>
                                        <div className='col-span-2  justify-self-end'>
                                            {new Date(data.time).toLocaleString("zh-TW", {
                                                timeZone: "Asia/Taipei",
                                            })}
                                        </div>
                                    </div>
                                    <div className='absolute top-2 right-2 px-1 bg-main-color-2 rounded-lg font-mono'>
                                        <div className='justify-self-end whitespace-nowrap'>
                                            {data.path}
                                        </div>
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
