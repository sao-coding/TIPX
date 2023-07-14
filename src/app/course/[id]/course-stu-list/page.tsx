"use client"

import { useState, useEffect } from "react"
import Card from "@/components/course-stu-list/card"
import { CourseStuList } from "@/types"

export default function Hw({ params }: { params: { id: string } }) {
    const [data, setData] = useState<CourseStuList[]>([])
    const [cookie, setCookie] = useState("")

    useEffect(() => {
        const fetchDate = async () => {
            const res = await fetch(`/api/course-stu-list?id=${params.id}`)
            const data = await res.json()

            setData(data)
        }
        fetchDate()
    }, [])

    return (
        <>
            <div className='w-full'>
                {data.map((item) => (
                    <Card key={item.id} data={item} />
                ))}
            </div>
        </>
    )
}
