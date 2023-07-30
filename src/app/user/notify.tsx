"use client"

import { useState, useEffect } from "react"
import { IconBell } from "@tabler/icons-react"
import { init } from "@/lib/firebase"

const Notify = () => {
    const [isNotify, setIsNotify] = useState(false)

    useEffect(() => {
        if (Notification.permission === "granted") {
            setIsNotify(true)
        }
    }, [])

    const requestPermission = async () => {
        init()
        const permission = await Notification.requestPermission()
        if (permission === "granted") {
            setIsNotify(true)
        }
    }

    return (
        <div
            className='mt-2 w-full cursor-pointer rounded-xl border bg-slate-50 p-2 shadow-md'
            onClick={() => {
                if (Notification.permission !== "granted") {
                    requestPermission()
                }
            }}
        >
            <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                    <IconBell />
                    <div className='ml-2'>訂閱系統通知</div>
                </div>
                <div className=''>
                    {/* 判斷是否允許通知 */}
                    {isNotify ? (
                        <div className='text-green-500'>已開啟</div>
                    ) : (
                        <div className='text-red-500'>未開啟</div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Notify
