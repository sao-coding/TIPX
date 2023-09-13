"use client"

import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { IconArrowsMoveVertical } from "@tabler/icons-react"
import { Listbox } from "@headlessui/react"
import toast from "react-hot-toast"
import ConfirmCard from "@/app/user/leave/confirmCard"
import { Leave } from "@/types"

const Leave = () => {
    // 目前台灣時間
    const now = new Date()
    const nowDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now
        .getDate()
        .toString()
        .padStart(2, "0")}`
    const [date, setDate] = useState(nowDate)
    const [selected, setSelected] = useState("病假")
    const queryClient = useQueryClient()
    const { isLoading, data } = useQuery<Leave>({
        queryKey: ["leave", date],
        queryFn: async () => {
            const res = await fetch(`/api/leave?date=${date}`)
            const data = await res.json()
            // error
            if (!res.ok) {
                toast.error(data.message)
                return
            }
            console.log({ data })
            return data
        },
        // refetchOnWindowFocus: false,
    })

    const upload = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!date) {
            toast.error("請選擇日期")
            return
        }

        if (!selected) {
            toast.error("請選擇假別")
            return
        }
        const ckeck = Array.from(event.currentTarget.querySelectorAll("input[type=checkbox]"))
        // 至少要有一個勾選
        if (ckeck.every((input) => !(input as HTMLInputElement).checked)) {
            toast.error("請選擇至少一節課")
            return
        }
        const toastId = toast.loading("請假中...")
        const res = await fetch("/api/leave", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type: "leave",
                date,
                leaveType: selected,
                // 只要有勾選就請假
                list: Array.from(event.currentTarget.querySelectorAll("input[type=checkbox]"))
                    .map((input) => ({
                        id: input.id,
                        value: (input as HTMLInputElement).checked
                            ? (input as HTMLInputElement).value
                            : "",
                    }))
                    .filter((item) => item.value !== ""),
            }),
        })

        if (!res.ok) {
            toast.error("請假失敗")
            return
        } else {
            toast.success("請假成功", { id: toastId })
            queryClient.invalidateQueries({ queryKey: ["leave", date] })
            return
        }
    }

    return (
        <form encType='multipart/form-data' onSubmit={(event) => upload(event)}>
            <div className='flex items-center mb-2 space-x-1'>
                <input
                    type='date'
                    name=''
                    id=''
                    className='bg-white rounded-lg p-1 h-8 md:w-1/3 md:border'
                    min={data?.start}
                    max={data?.end}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                {/* 病假
                事假
                生理假 */}
                <div className='relative md:w-1/3 w-28'>
                    <Listbox value={selected} onChange={(e) => setSelected(e)}>
                        <Listbox.Button className='bg-white rounded-lg p-1 flex items-center justify-start w-full md:border h-8'>
                            <IconArrowsMoveVertical />
                            {selected}
                        </Listbox.Button>
                        <Listbox.Options className='bg-white shadow-md p-2 rounded-lg w-full absolute top-10 left-0 z-10'>
                            {data?.type.map((type, i) => (
                                <Listbox.Option key={i} value={type}>
                                    {type}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Listbox>
                </div>
                <input
                    type='submit'
                    value='送出'
                    className='bg-white rounded-lg p-1 flex-1 hover:bg-gray-200 md:w-1/3 md:border'
                />
            </div>
            {isLoading && (
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
            )}
            {!isLoading &&
                data?.leave.list.map((leave) => (
                    <div key={leave.id}>
                        {
                            leave.status && <ConfirmCard leave={leave} />
                            // <span style={{ color: "green" }}>✔</span>
                        }
                    </div>
                ))}
        </form>
    )
}

export default Leave
