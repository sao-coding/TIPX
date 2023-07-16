"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Cookie from "js-cookie"
import Card from "@/components/course-stu-list/card"
import { CourseStuList } from "@/types"

// export default function Hw({ params }: { params: { id: string } }) {
const CourseStuListPage = ({ params }: { params: { id: string } }) => {
    const [data, setData] = useState<CourseStuList[]>([])
    const router = useRouter()

    useEffect(() => {
        const cookie = Cookie.get("token")
        if (!cookie) {
            router.push("/login")
        }
    }, [])

    useEffect(() => {
        const fetchDate = async () => {
            const res = await fetch(`/api/course-stu-list?course=${params.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + Cookie.get("token"),
                },
            })
            const data = await res.json()
            if (data.error === "Unauthorized") {
                setData([])
            } else {
                setData(data)
            }
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

export default CourseStuListPage
