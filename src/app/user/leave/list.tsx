"use client"

import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import Cookie from "js-cookie"
import clsx from "clsx"
import toast from "react-hot-toast"
import { IconArrowsMoveVertical } from "@tabler/icons-react"
import { Listbox } from "@headlessui/react"
import { LeaveItemCheck } from "@/types"

const List = () => {
    // 目前台灣月份 new Date().getMonth() + 1補0
    const [month, setMonth] = useState(`${new Date().getMonth() + 1}`.padStart(2, "0"))
    const queryClient = useQueryClient()
    const { isLoading, isError, data } = useQuery<LeaveItemCheck[]>({
        queryKey: ["leaveList", month],
        queryFn: async () => {
            const res = await fetch(`/api/leave?month=${month}`)
            const data = await res.json()
            // error
            // if (!res.ok) throw new Error("沒有這篇公告")
            return data
        },
        // refetchOnWindowFocus: false,
    })

    const typeColor: { [key: string]: string } = {
        病假: "bg-blue-500",
        事假: "bg-green-500",
        生理假: "bg-yellow-500",
    }

    const statusColor: { [key: string]: string } = {
        已核可: "bg-green-500",
        審核中: "bg-yellow-500",
        請來談: "bg-yellow-500",
        退件: "bg-red-500",
    }

    const formatDate = (date: string) => {
        // 1120915(五) -> 2023/09/15(五)

        const year = date.slice(0, 3)
        const month = date.slice(3, 5)
        const day = date.slice(5, 7)
        const week = date.slice(8, 9)

        return `${year}/${month}/${day} (${week})`
    }

    const deleteLeave = async (id: string) => {
        const toastId = toast.loading("刪除中...")
        const res = await fetch(`/api/leave`, {
            method: "DELETE",
            body: JSON.stringify({ id }),
        })
        const data = await res.json()
        if (!res.ok) {
            toast.error(data.message)
            return
        }
        toast.success(data.message, { id: toastId })
        queryClient.invalidateQueries({ queryKey: ["leaveList", month] })
    }

    return (
        <>
            <div className='relative mb-2'>
                <Listbox value={month} onChange={(e) => setMonth(e)}>
                    <Listbox.Button className='bg-white rounded-lg p-1 flex items-center justify-start w-full'>
                        <IconArrowsMoveVertical />
                        {month !== "all" ? `${month} 月` : "全部"}
                    </Listbox.Button>
                    <Listbox.Options className='bg-white shadow-md p-2 rounded-lg w-full absolute top-10 left-0 z-10 font-mono cursor-pointer'>
                        {/* {data?.type.map((type, i) => (
                                            <Listbox.Option key={i} value={type}>
                                                {type}
                                            </Listbox.Option>
                                        ))} */}
                        {/* 上學期 09~01 */}
                        {/* 下學期 02~06 */}
                        {Cookie.get("cookie_sem") === "1" ? (
                            <>
                                <Listbox.Option value='all'>全部</Listbox.Option>
                                <Listbox.Option value='09'>09 月</Listbox.Option>
                                <Listbox.Option value='10'>10 月</Listbox.Option>
                                <Listbox.Option value='11'>11 月</Listbox.Option>
                                <Listbox.Option value='12'>12 月</Listbox.Option>
                                <Listbox.Option value='01'>01 月</Listbox.Option>
                            </>
                        ) : (
                            <>
                                <Listbox.Option value='all'>全部</Listbox.Option>
                                <Listbox.Option value='02'>02 月</Listbox.Option>
                                <Listbox.Option value='03'>03 月</Listbox.Option>
                                <Listbox.Option value='04'>04 月</Listbox.Option>
                                <Listbox.Option value='05'>05 月</Listbox.Option>
                                <Listbox.Option value='06'>06 月</Listbox.Option>
                            </>
                        )}
                    </Listbox.Options>
                </Listbox>
            </div>
            {isLoading ? (
                <div className='absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 md:static md:translate-x-0 md:translate-y-0'>
                    <div className='flex h-full w-full items-center justify-center'>
                        <div className='cat'>
                            <div className='cat__body'></div>
                            <div className='cat__body'></div>
                            <div className='cat__tail'></div>
                            <div className='cat__head'></div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {data?.length === 0 && <div className='text-center text-2xl'>沒有請假紀錄</div>}
                    {data?.map((item, index) => (
                        <div className='relative p-2 border mb-2 rounded-xl' key={index}>
                            <div className='flex'>
                                <div
                                    className={clsx(
                                        "rounded-lg px-1 text-white",
                                        typeColor[item.type]
                                    )}
                                >
                                    {item.type}
                                </div>
                            </div>
                            <div className=''>{formatDate(item.date)}</div>
                            <div className=''>{item.course}</div>
                            <div className=''>{item.teacher}</div>

                            <div className='absolute top-2 right-2 flex flex-col items-end space-y-1'>
                                <div className='bg-main-color-3 text-white rounded-lg px-1'>{`第${item.section}節`}</div>
                                <div
                                    className={clsx(
                                        "text-white rounded-lg px-1",
                                        statusColor[item.status]
                                    )}
                                >
                                    {item.status}
                                </div>
                            </div>
                            <div className='absolute bottom-2 right-2'>
                                {item.id !== "" && (
                                    <button
                                        type='submit'
                                        value={item.id}
                                        className='bg-red-500 text-white px-2 py-0.5 rounded-lg'
                                        onClick={(e) => {
                                            deleteLeave(e.currentTarget.value)
                                        }}
                                    >
                                        刪除
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </>
            )}
        </>
    )
}

export default List
