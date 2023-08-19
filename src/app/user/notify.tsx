"use client"

import { useState, useEffect } from "react"
import { IconBell } from "@tabler/icons-react"
import toast from "react-hot-toast"
import { init } from "@/lib/firebase"

const Notify = () => {
    const [isNotify, setIsNotify] = useState(false)

    useEffect(() => {
        if ("Notification" in window) {
            if (Notification.permission === "granted") {
                setIsNotify(true)
            }
        }
    }, [])

    const isIOS = () => {
        const userAgent = window.navigator.userAgent.toLowerCase()
        return /iphone|ipad|ipod/.test(userAgent)
    }

    const requestPermission = async () => {
        // 判斷是否是 apple 裝置
        if (isIOS()) {
            toast.error("Apple 裝置請加入主畫面使用")
            return
        }
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
                if ("Notification" in window) {
                    if (Notification.permission !== "granted") {
                        requestPermission()
                    }
                } else {
                    toast.error("Apple 裝置請加入主畫面使用")
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
