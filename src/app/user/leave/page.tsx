"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Listbox } from "@headlessui/react"
import { IconArrowsMoveVertical } from "@tabler/icons-react"
import toast from "react-hot-toast"
import ConfirmCard from "@/app/user/leave/confirmCard"
import { Leave } from "@/types"

const LeavePage = () => {
    // 目前台灣時間
    const now = new Date()
    const nowDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now
        .getDate()
        .toString()
        .padStart(2, "0")}`
    const [date, setDate] = useState(nowDate)
    const [selected, setSelected] = useState("病假")
    const [refresh, setRefresh] = useState(false)
    const { isLoading, isError, data } = useQuery<Leave>({
        queryKey: ["leave", date, refresh],
        queryFn: async () => {
            const res = await fetch(`/api/leave?date=${date}`)
            const data = await res.json()
            // error
            // if (!res.ok) throw new Error("沒有這篇公告")
            console.log({ data })
            return data
        },
    })

    const upload = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        // const formData = new FormData(event.currentTarget)
        // const res = await fetch(upload, {
        //     method: "POST",
        //     body: formData,
        // })
        // const data = await res.json()
        console.log({ date, selected })
        // 顯示 event 所有 checkbox 的 id 和 checked
        console.log(
            Array.from(event.currentTarget.querySelectorAll("input[type=checkbox]")).map(
                (input) => ({
                    id: input.id,
                    checked: (input as HTMLInputElement).checked
                        ? (input as HTMLInputElement).value
                        : null,
                })
            )
        )

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
            toast.success("請假成功")
            setRefresh(!refresh)
            return
        }
    }

    return (
        <div className='p-2 w-full' id='leave'>
            <form encType='multipart/form-data' onSubmit={(event) => upload(event)}>
                <div className='flex items-center mb-2 space-x-1'>
                    <input
                        type='date'
                        name=''
                        id=''
                        className='bg-white rounded-lg p-1 h-8'
                        min={data?.start}
                        max={data?.end}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    {/* 病假
                事假
                生理假 */}
                    <div className='relative'>
                        <Listbox value={selected} onChange={(e) => setSelected(e)}>
                            <Listbox.Button className='bg-white rounded-lg p-1 flex items-center justify-start w-28'>
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
                        className='bg-white rounded-lg p-1 flex-1 hover:bg-gray-200'
                    />
                </div>
                {data?.leave.list.map((leave, i) => (
                    <div key={i}>
                        {
                            leave.status && <ConfirmCard leave={leave} i={i} />
                            // <span style={{ color: "green" }}>✔</span>
                        }
                    </div>
                ))}
            </form>
        </div>
    )
}

export default LeavePage
