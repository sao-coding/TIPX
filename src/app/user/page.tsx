"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Row from "@/components/timetable/row"
import { TimeTable, OutTimeTable } from "@/types"

export default function UserPage() {
    const [data, setData] = useState("")
    const [cookie, setCookie] = useState("")

    useEffect(() => {
        const fetchDate = async () => {
            const res = await fetch("/api/user")
            const data = await res.json()

            setData(data)
        }
        fetchDate()
    }, [])

    return (
        <>
            <div className='bg-slate-50 flex items-center justify-center h-screen w-full'>
                <div className='bg-white shadow-md rounded-md p-4 h-screen w-full'>
                    {/* <iframe srcDoc={html} className='w-full h-screen'></iframe> */}
                    <iframe srcDoc={data} className='w-full h-screen'></iframe>
                </div>
            </div>
        </>
    )
}
