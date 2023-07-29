"use client"

import { IconBell } from "@tabler/icons-react"
import { init } from "@/lib/firebase"

const Notify = () => {
    return (
        <div
            className='mt-2 w-full cursor-pointer rounded-xl border bg-slate-50 p-2 shadow-md'
            onClick={() => {
                init()
            }}
        >
            <div className='flex items-center'>
                <IconBell />
                <div className='ml-2'>訂閱系統通知</div>
            </div>
        </div>
    )
}

export default Notify
