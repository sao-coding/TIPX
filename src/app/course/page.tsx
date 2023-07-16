"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Course } from "@/types"
import Cookie from "js-cookie"

const CourseListPage = () => {
    const [data, setData] = useState<Course[]>([])
    const router = useRouter()

    useEffect(() => {
        const cookie = Cookie.get("token")
        if (!cookie) {
            router.push("/login")
        }
    }, [])

    useEffect(() => {
        const fetchDate = async () => {
            const res = await fetch("/api/course", {
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
            <div className='flex w-full items-center justify-center'>
                <div className='rounded-md bg-main-color'>
                    {data?.map((course: Course) => (
                        <div className='p-1' key={course.id}>
                            <Link
                                className='flex justify-between rounded-md p-1 hover:bg-main-color-2'
                                href={`/course/${course.id}`}
                            >
                                <div className='p-1'>{course.item}</div>
                                <div className='p-1'>{course.id}</div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default CourseListPage
