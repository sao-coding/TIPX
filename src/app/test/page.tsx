"use client"
import { useEffect, useState } from "react"
import Cookie from "js-cookie"
import { IconHome, IconBook2, IconCalendarEvent, IconUser, Icon } from "@tabler/icons-react"

const Test: React.FC = () => {
    const [data, setData] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch("/api/test", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + Cookie.get("token"),
                },
            })
            const data = await res.text()
            setData(data)
        }
        fetchData()
    }, [])

    return (
        <>
            <div className='flex items-center space-x-4'>
                <div className='flex items-center justify-center rounded-full bg-black p-1'>
                    <IconHome size={184} className='stroke-white' />
                </div>
                <div className='flex items-center justify-center rounded-full bg-black p-1'>
                    <IconBook2 size={184} className='stroke-white' />
                </div>
                <div className='flex items-center justify-center rounded-full bg-black p-1'>
                    <IconCalendarEvent size={184} className='stroke-white' />
                </div>
                <div className='flex items-center justify-center rounded-full bg-black p-1'>
                    <IconUser size={184} className='stroke-white' />
                </div>
            </div>
            {/* <iframe srcDoc={data} className='h-screen w-full' /> */}
        </>
    )
}

export default Test
