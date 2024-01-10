"use client"

import { useEffect, useState } from "react"
import Counter from "@/components/transition/Counter"

const CreateTime = () => {
    // 網站已運行時間 2023/7/14 下午3:05:56
    const [nowTime, setNowTime] = useState(Date.now())
    const [day, setDay] = useState(0)
    const [hour, setHour] = useState(0)
    const [minute, setMinute] = useState(0)
    const [second, setSecond] = useState(0)
    const dateTime = new Date("2023-07-14T15:05:56").getTime()
    useEffect(() => {
        const interval = setInterval(() => {
            setNowTime(Date.now())
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const distance = nowTime - dateTime
        setDay(Math.floor(distance / (1000 * 60 * 60 * 24)))
        setHour(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
        setMinute(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)))
        setSecond(Math.floor((distance % (1000 * 60)) / 1000))
        // console.log({ day, hour, minute, second })
    }, [nowTime, dateTime])

    return (
        <div className='flex flex-col items-center justify-center p-10 w-full'>
            <div className='flex items-center space-x-1 text-xl font-bold md:text-5xl'>
                {/* {day} 天 {hour} 時 {minute} 分 {second} 秒 */}
                {day !== 0 ? <Counter count={day} /> : <>--</>}
                <span>天</span>
                {hour !== 0 ? <Counter count={hour} /> : <>--</>}
                <span>時</span>
                {minute !== 0 ? <Counter count={minute} /> : <>--</>}
                <span>分</span>
                {second !== 0 ? <Counter count={second} /> : <>--</>}
                <span>秒</span>
            </div>
            <div className='text-2xl'>已運行時間</div>
        </div>
    )
}

export default CreateTime
