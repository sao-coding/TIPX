"use client"
import { useState, useEffect } from "react"
import { IconUserCircle, IconUserStar, IconStar, IconCrown } from "@tabler/icons-react"
import Cookie from "js-cookie"
import Avatar from "@/components/ui/avatar"
import Fancybox from "@/components/fancybox"
import { FinalGradeRankClass } from "@/types"

const ClassRankPage = () => {
    const [data, setData] = useState<FinalGradeRankClass[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    useEffect(() => {
        const fetchDate = async (i: number, j: number) => {
            // 20為範圍

            const res = await fetch(
                `/api/class-rank?year=111&sem=2&classid=${i}&start=${j}&end=${j + 10}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${Cookie.get("token")}`,
                    },
                }
            )
            if (!res.ok) {
                setIsError(true)
                setErrorMsg("獲取資料失敗")
                setIsLoading(false)
                return
            }
            return await res.json()
        }

        const theard = async () => {
            let promises = []
            setIsLoading(true)
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 60; j += 10) {
                    promises.push(fetchDate(i, j))
                }
                // 延遲 0.5 秒
                await new Promise((resolve) => setTimeout(resolve, 1500))
            }
            const data = await Promise.all(promises)
            setData(data.flat())
            setIsLoading(false)
        }
        theard()
    }, [])

    return (
        <>
            <div className='flex w-full flex-col items-center justify-center p-2'>
                {isError && (
                    <div className='absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2'>
                        <div className='flex h-full w-full flex-col items-center justify-center'>
                            <div className='text-2xl'>{errorMsg}</div>
                            <button
                                className='rounded-md bg-main-color p-2 text-xl'
                                onClick={
                                    // 重新整理
                                    () => location.reload()
                                }
                            >
                                重新整理
                            </button>
                        </div>
                    </div>
                )}
                {isLoading && (
                    <>
                        {Array.from(Array(7).keys()).map((index) => (
                            <div
                                className='mb-2 flex h-[116px] w-full animate-pulse items-center justify-between rounded-md bg-white p-2 shadow-md'
                                key={index}
                            >
                                <div className='flex items-center'>
                                    <div className='flex h-[100px] w-[75px] items-center justify-center rounded-md shadow-md'>
                                        <IconUserCircle size={75} />
                                    </div>
                                    <div className=''>
                                        <div className='m-2 mb-5 h-3 w-20 rounded-full bg-slate-200'></div>
                                        <div className='m-2 h-3 w-20 rounded-full bg-slate-200'></div>
                                    </div>
                                </div>
                                <div className='h-full flex-1 md:mr-8 md:flex-none'>
                                    <div className='mt-4 flex h-full items-center justify-center'>
                                        <div className='m-1 h-3 w-11 rounded bg-slate-200 md:m-4'></div>
                                        <div className='m-1 h-3 w-11 rounded bg-slate-200 md:m-4'></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {/* 依排名排序 如果是 0 就排在最後 */}
                {data.length > 0 &&
                    !isError &&
                    data
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
                                    {/* <Image
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
                                    /> */}
                                    <Fancybox
                                        options={{
                                            Carousel: {
                                                infinite: false,
                                            },
                                        }}
                                    >
                                        <a
                                            href={item.img}
                                            data-fancybox='images'
                                            data-caption={item.name}
                                        >
                                            <Avatar
                                                src={item.img}
                                                width={75}
                                                height={100}
                                                alt='大頭貼'
                                                fallback={
                                                    <div className='flex h-[100px] w-[75px] items-center justify-center rounded-md shadow-md'>
                                                        <IconUserCircle size={75} />
                                                    </div>
                                                }
                                            />
                                        </a>
                                    </Fancybox>
                                    <div className='p-2'>
                                        <div className='p-1'>{item.userid}</div>
                                        <div className='p-1'>{item.name}</div>
                                    </div>
                                </div>
                                <div className='flex items-center font-mono'>
                                    {/* <div className='p-1'>{item.data.year}</div>
                                <div className='p-1'>{item.data.sem}</div> */}
                                    <div className='mr-1 flex flex-col items-center rounded-md px-1 md:flex-row'>
                                        <IconUserStar className='animate-pulse stroke-yellow-500' />
                                        {/* 我想要格式長這樣 00.00 */}
                                        <div className=''>
                                            {item.data.conduct.score
                                                .toFixed(2)
                                                .toString()
                                                .padStart(5, "0")}
                                        </div>
                                    </div>
                                    <div className='mr-1 flex flex-col items-center rounded-md px-1 md:flex-row'>
                                        <IconStar className='animate-pulse fill-yellow-500 stroke-yellow-500' />
                                        <div className=''>
                                            {item.data.avg.toFixed(2).toString().padStart(5, "0")}
                                        </div>
                                    </div>
                                    <div className='ml-1 rounded-md px-1 text-lg font-bold'>
                                        {item.data.rank.toString().padStart(2, "0")}
                                    </div>
                                </div>
                            </div>
                        ))}
            </div>

            {/* {isLoading && (
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
            {isError && (
                <div className='absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2'>
                    <div className='flex h-full w-full items-center justify-center'>
                        <div className='text-2xl'>{errorMsg}</div>
                    </div>
                </div>
            )} */}
        </>
    )
}

export default ClassRankPage
