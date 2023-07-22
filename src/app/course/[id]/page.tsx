"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Cookie from "js-cookie"
import Tabs from "@/components/course/tabs"
import { Course } from "@/types"

const CoursePage = ({ params }: { params: { id: string } }) => {
    const [data, setData] = useState<Course[]>([])
    const router = useRouter()

    useEffect(() => {
        const cookie = Cookie.get("token")
        if (!cookie) {
            router.push("/login")
        }
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`/api/course?course=${params.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Cookie.get("token")}`,
                },
            })

            const data = await res.json()

            if (data.error === "Unauthorized") {
                setData([])
            } else {
                setData(data)
            }
        }
        fetchData()
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
