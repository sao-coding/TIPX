"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Tabs from "@/components/course/tabs"

import { Course } from "@/types"

const CoursePage = ({ params }: { params: { id: string } }) => {
    const [data, setData] = useState<Course[]>([])
    const [cookie, setCookie] = useState("")

    useEffect(() => {
        const fetchDate = async () => {
            const res = await fetch(`/api/course?id=${params.id}`)
            const data = await res.json()

            setData(data)
        }
        fetchDate()
    }, [])

    return (
        <>
            <div className='h-full w-full rounded-md bg-white p-4 shadow-md'>
                <Tabs data={data} id={params.id} />
            </div>
        </>
    )
}

export default CoursePage
