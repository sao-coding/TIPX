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
        const cookie = Cookie.get()
        console.log(cookie)
        // cookie = {} 跳轉到登入頁面
        if (Object.keys(cookie).length <= 3 && cookie.constructor === Object) {
            router.push("/login")
        }
    }, [])

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
