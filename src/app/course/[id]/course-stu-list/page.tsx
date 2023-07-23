"use client"

import { useState, useEffect } from "react"
import Cookie from "js-cookie"
import Card from "@/components/course-stu-list/card"
import { CourseStuList } from "@/types"

// export default function Hw({ params }: { params: { id: string } }) {
const CourseStuListPage = ({ params }: { params: { id: string } }) => {
    const [data, setData] = useState<CourseStuList[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`/api/course-stu-list?course=${params.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + Cookie.get("token"),
                },
            })
            const data = await res.json()
            setData(data)
        }
        fetchData()
    }, [params.id])

    return (
        <>
            <div className='w-full'>
                {data.length > 0 ? (
                    data.map((item) => <Card key={item.id} data={item} />)
                ) : (
                    <div className='text-center text-2xl'>沒有學生</div>
                )}
            </div>
        </>
    )
}

export default CourseStuListPage
