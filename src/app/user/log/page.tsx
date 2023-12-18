"use client"

import Link from "next/link"
import { useEffect } from "react"
import { IconUserCircle } from "@tabler/icons-react"
import { Log } from "@/types"
import { useInView } from "react-intersection-observer"
import { useInfiniteQuery } from "@tanstack/react-query"
import Fancybox from "@/components/fancybox"
import Avatar from "@/components/ui/avatar"
import Title from "@/components/Title"

const LogPage = () => {
    const { ref, inView } = useInView()
    const { data, isSuccess, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery<
        Log[]
    >({
        queryKey: ["log"],
        queryFn: async ({ pageParam = 0 }) => {
            const res = await fetch(`/api/log?id=${pageParam}&limit=10`)
            return res.json()
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === 10 ? lastPage[lastPage.length - 1].time : undefined
        },
    })

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage()
        }
    }, [inView, fetchNextPage, hasNextPage])

    const title = {
        title: "登入記錄",
        position: "text-center",
        close: true,
    }

    return (
        <>
            <div className='w-full px-2 mb-2'>
                <Title title={title} />
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
                                        <div className='px-2'>
                                            <div className='flex items-center space-x-2'>
                                                <div>{data.stuID}</div>
                                                <div>{data.name}</div>
                                            </div>
                                            <Link
                                                href={data.path}
                                                className='px-1 bg-main-color-2 rounded-lg font-mono whitespace-nowrap'
                                            >
                                                {data.path}
                                            </Link>
                                            <div>{data.class}</div>
                                            <div className='col-span-2  justify-self-end'>
                                                {new Date(data.time).toLocaleString("zh-TW", {
                                                    timeZone: "Asia/Taipei",
                                                })}
                                            </div>
                                        </div>
                                        {/* <div className='absolute top-2 right-2 bg-main-color-2 rounded-lg font-mono px-1 my-7'>
                                            {data.ip}
                                        </div> */}
                                    </div>
                                )
                            }
                            return (
                                <div
                                    className='mb-2 rounded-xl border p-2 flex items-center relative'
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
                                    <div className='px-2'>
                                        <div className='flex items-center space-x-2'>
                                            <div>{data.stuID}</div>
                                            <div>{data.name}</div>
                                        </div>
                                        <Link
                                            href={data.path}
                                            className='px-1 bg-main-color-2 rounded-lg font-mono whitespace-nowrap'
                                        >
                                            {data.path}
                                        </Link>
                                        <div>{data.class}</div>
                                        <div className='col-span-2  justify-self-end'>
                                            {new Date(data.time).toLocaleString("zh-TW", {
                                                timeZone: "Asia/Taipei",
                                            })}
                                        </div>
                                    </div>
                                    {/* <div className='absolute top-2 right-2 bg-main-color-2 rounded-lg font-mono px-1 my-7'>
                                        {data.ip}
                                    </div> */}
                                </div>
                            )
                        })
                    )}
                {/* {(isFetchingNextPage || !data) && */}
                {Array.from(Array(10).keys()).map((index) => (
                    <div
                        className='mb-2 h-[118px] rounded-xl border p-2 flex items-center relative'
                        key={index}
                    >
                        <div className='flex h-[100px] w-[75px] items-center justify-center rounded-md shadow-md'>
                            <IconUserCircle size={75} />
                        </div>
                        <div className='px-2 space-y-3'>
                            <div className='h-3 w-20 rounded-full bg-neutral-500'></div>
                            <div className='h-3 w-20 rounded-full bg-neutral-500'></div>
                            <div className='h-3 w-28 rounded-full bg-neutral-500'></div>
                            <div className='h-3 w-44 rounded-full bg-neutral-500'></div>
                        </div>
                        {/* <div className='absolute top-2 right-2 px-1 bg-neutral-500 rounded-lg font-mono w-20 h-6'></div> */}
                    </div>
                ))}
            </div>
        </>
    )
}

export default LogPage
