"use client"

import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { IconSelector } from "@tabler/icons-react"
import { Listbox } from "@headlessui/react"
import toast from "react-hot-toast"
import Title from "@/components/Title"
import CheckBox from "./checkbox"
import { RollCall } from "@/types"

const RollCall = ({ params }: { params: { id: string } }) => {
    const [date, setDate] = useState("")
    const queryClient = useQueryClient()
    const { isLoading, data } = useQuery<RollCall>({
        queryKey: ["roll-call", params.id, date],
        queryFn: async () => {
            const res = await fetch(`/api/roll-call?course=${params.id}&date=${date}`)
            const data = await res.json()
            // error
            if (!res.ok) {
                toast.error(data.message)
                return
            }
            return data
        },
        // refetchOnWindowFocus: false,
    })

    const save = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const toastId = toast.loading("點名中...")
        if (date === "") {
            toast.error("請選擇日期", { id: toastId })
            return
        }
        const res = await fetch("/api/roll-call", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                course: params.id,
                date,
                count: Array.from(e.currentTarget.querySelectorAll(".roll-call-student-id")).length,
                list: Array.from(e.currentTarget.querySelectorAll(".roll-call-student-id")).map(
                    (student) => {
                        const id = student.id
                        const stuID = student.textContent
                        const absence = Array.from(
                            e.currentTarget.querySelectorAll(`#${stuID} input[type=checkbox]`)
                        ).map((input) => ({
                            id: input.id,
                            status: (input as HTMLInputElement).checked,
                        }))
                        return { id, stuID, absence }
                    }
                ),
            }),
        })
        const data = await res.json()
        if (!res.ok) {
            toast.error(data.message)
            return
        }
        toast.success("點名成功", { id: toastId })
        queryClient.invalidateQueries({ queryKey: ["roll-call", params.id, date] })
    }

    const tilte = {
        title: "點名",
        position: "text-center",
        close: true,
    }

    return (
        <div className='w-full rounded-md px-2 md:bg-white md:p-4 md:shadow-md'>
            {isLoading ? (
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
            ) : (
                <>
                    <Title title={tilte} />
                    <div className='w-full text-center'>
                        <input
                            type='date'
                            className='bg-white rounded-lg p-1 h-8 md:w-1/3 md:border text-center'
                            min={data?.start}
                            max={data?.end}
                            step={7}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <form onSubmit={(e) => save(e)} className='overflow-x-auto'>
                        {data && (
                            <>
                                {data.students.map((student) => (
                                    <div
                                        key={student.stuID}
                                        className='flex items-center space-x-2'
                                    >
                                        <div
                                            id={student.id}
                                            className='font-mono roll-call-student-id'
                                        >
                                            {student.stuID}
                                        </div>
                                        <div className='w-16 whitespace-nowrap'>{student.name}</div>
                                        <div
                                            id={student.stuID}
                                            className='flex items-center space-x-2'
                                        >
                                            {student.absence.map((absence) => (
                                                <div key={absence.id}>
                                                    {/* <input
                                                        key={absence.id}
                                                        type='checkbox'
                                                        name={absence.id}
                                                        id={absence.id}
                                                        defaultChecked={absence.status}
                                                        disabled={absence.disabled}
                                                        className='h-4 w-4 text-main-color-1 focus:ring-main-color-1 border-gray-300 rounded'
                                                    /> */}
                                                    <CheckBox absence={absence} />
                                                    {/* {absence.status ? "缺席" : "出席"} */}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                        <button
                            type='submit'
                            className='bg-main-color-3 text-white md:rounded-lg px-2 py-3 rounded-full md:mt-2 fixed right-3 bottom-3 md:static md:w-full md:p-1'
                        >
                            儲存
                        </button>
                    </form>
                </>
            )}
        </div>
    )
}

export default RollCall
