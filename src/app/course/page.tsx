"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Course } from "@/types"
import Cookie from "js-cookie"

const CourseListPage = () => {
    const [data, setData] = useState<Course[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch("/api/course", {
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
    }, [])

    return (
        <>
            <div className='flex w-full items-center justify-center'>
                <div className='rounded-md bg-main-color'>
                    {data.length > 0 ? (
                        data.map((course: Course) => (
                            <div className='p-1' key={course.id}>
                                <Link
                                    className='flex justify-between rounded-md p-1 hover:bg-main-color-2'
                                    href={`/course/${course.id}`}
                                >
                                    <div className='p-1'>{course.item}</div>
                                    <div className='p-1'>{course.id}</div>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className='p-1'>你沒有修任何課程</div>
                    )}
                </div>
            </div>
        </>
    )
}

export default CourseListPage
