"use client"
import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { IconUserCircle, IconCrown } from "@tabler/icons-react"
import Cookie from "js-cookie"
import Image from "next/image"
import { FinalGradeRankClass } from "@/types"
import "@/app/loaderCat.css"

const ClassRankPage = () => {
    const { isLoading, isError, data } = useQuery<FinalGradeRankClass[]>({
        queryKey: ["class-rank"],
        queryFn: async () => {
            const res = await fetch(`/api/final-grade-rank?type=class&year=111&sem=2`)
            const json = await res.json()

            return json
        },
    })

    const errorImg = (userid: string) => {
        const img = document.querySelector(`#${userid}`)
        if (img) {
            img.setAttribute(
                "src",
                "https://tabler-icons.io/static/tabler-icons/icons-png/user-circle.png"
            )
            img.classList.remove("object-cover")
            img.classList.add("object-contain")
        }
    }

    return (
        <>
            {data && (
                <div className='flex w-full flex-col items-center justify-center p-4'>
                    {/* 依排名排序 如果是 0 就排在最後 */}
                    {data
                        .sort((a, b) => {
                            if (a.data.rank === 0) {
                                return 1
                            } else if (b.data.rank === 0) {
                                return -1
                            } else {
                                return a.data.rank - b.data.rank
                            }
                        })
                        .map((item, index) => (
                            <div
                                className='relative mb-2 flex w-full items-center justify-between rounded-md bg-white p-2 shadow-md'
                                key={item.userid}
                            >
                                {/* <div className='flex h-[100px] w-[75px] items-center justify-center rounded-md shadow-md'>
                                    <IconUserCircle size={75} />
                                </div> */}
                                {/* 如果是前三名，就顯示皇冠 */}
                                {index < 3 && (
                                    <div className='absolute right-0 top-0 p-2'>
                                        <IconCrown size={25} className='fill-amber-500' />
                                    </div>
                                )}
                                <div className='flex items-center'>
                                    <img
                                        src={item.img}
                                        alt='大頭貼'
                                        width='0'
                                        height='0'
                                        sizes='fill'
                                        loading='lazy'
                                        placeholder='blur'
                                        // blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAABLCAYAAABJNhZ0AAAAKklEQVR42u3KMQ0AMAgAsKF8NvCCOLDATdq70ZX/LYQoiqIoiqIoigfiANYf04f83WXIAAAAAElFTkSuQmCC'
                                        className='h-[100px] w-[75px] rounded-md object-cover shadow-md'
                                        id={item.userid}
                                        onError={() => errorImg(item.userid)}
                                    />
                                    <div className='p-2'>
                                        <div className='p-1'>{item.userid}</div>
                                        <div className='p-1'>{item.name}</div>
                                    </div>
                                </div>
                                <div className='flex items-center font-mono'>
                                    {/* <div className='p-1'>{item.data.year}</div>
                                <div className='p-1'>{item.data.sem}</div> */}
                                    <div className='mr-1 flex flex-col items-center rounded-md bg-main-color px-1 md:flex-row'>
                                        <div className=''>操行</div>
                                        <div className=''>{item.data.conduct.score.toFixed(2)}</div>
                                    </div>
                                    <div className='mr-1 flex flex-col items-center rounded-md bg-main-color px-1 md:flex-row'>
                                        <div className=''>成績</div>
                                        <div className=''>{item.data.avg.toFixed(2)}</div>
                                    </div>
                                    <div className='ml-1 rounded-md bg-main-color px-1'>
                                        {item.data.rank.toString().padStart(2, "0")}
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            )}
            {isLoading && (
                <div className='absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2'>
                    <div className='flex h-full w-full items-center justify-center'>
                        <div className='cat'>
                            <div className='cat__body'></div>
                            <div className='cat__body'></div>
                            <div className='cat__tail'></div>
                            <div className='cat__head'></div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ClassRankPage
