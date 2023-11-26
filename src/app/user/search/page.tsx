"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { IconUserCircle, IconBrandLine } from "@tabler/icons-react"
import clsx from "clsx"
import ClassName from "./class-name"
import Fancybox from "@/components/fancybox"
import Avatar from "@/components/ui/avatar"
import Title from "@/components/Title"
import Copy from "@/components/Copy"
import { student } from "@prisma/client"

const SearchPage = () => {
    const [search, setSearch] = useState("")
    const { isLoading, data } = useQuery<student[]>({
        queryKey: ["search", search],
        queryFn: async () => {
            const res = await fetch(`/api/search?search=${search}`)

            const data = await res.json()

            if (data.error) {
                return []
            }
            return data
        },
    })

    const title = {
        title: "查詢用戶",
        position: "text-center",
        close: true,
    }

    const status: { [key: string]: string } = {
        新生未註冊: "bg-gray-500",
        在學: "bg-green-500",
        休學: "bg-yellow-500",
        退學: "bg-red-500",
        畢業: "bg-blue-500",
    }

    return (
        <div className='w-full px-2 mb-2'>
            <Title title={title} />
            <div className='px-2 md:px-0'>
                <input
                    type='search'
                    name=''
                    id=''
                    className='w-full rounded-xl border px-2 py-1 focus:outline-none focus:ring-2 focus:ring-main-color-2 text-lg mb-4'
                    placeholder='輸入學號或姓名'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className=''>{isLoading ? "載入中" : ""}</div>
                <div className='flex flex-col gap-2'>
                    {data?.map((item) => (
                        <div
                            key={item.userid}
                            className='relative flex items-center border rounded-xl p-2'
                        >
                            <div
                                className={clsx(
                                    "absolute top-2 right-2 px-1 rounded-md text-neutral-200 font-bold",
                                    status[item.status]
                                )}
                            >
                                {item.status}
                            </div>
                            <Fancybox
                                options={{
                                    Carousel: {
                                        infinite: false,
                                    },
                                }}
                            >
                                <a href={item.img} data-fancybox='images' data-caption={item.name}>
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
                            <div className='px-2 flex-grow'>
                                <div className='flex items-center space-x-1'>
                                    <div>{item.userid}</div>
                                    <Copy />
                                </div>
                                <div className='flex items-center space-x-1'>
                                    <div>{item.name}</div>
                                    <Copy />
                                </div>
                                {/* <ClassName userid={item.userid} /> */}
                                {item.major}
                                <div className='flex items-center space-x-1'>
                                    <IconBrandLine />
                                    <div>{item.lineid === "" ? "未填寫 Line ID" : item.lineid}</div>
                                    <Copy />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SearchPage
