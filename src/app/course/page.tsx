"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Course } from "@/types"

const CourseListPage = () => {
    const [data, setData] = useState<Course[]>([])

    useEffect(() => {
        const fetchDate = async () => {
            const res = await fetch("/api/course")
            const data = await res.json()

            setData(data)
        }
        fetchDate()
    }, [])

    return (
        <>
            <div className='flex justify-center items-center w-full'>
                <div className='bg-main-color rounded-md'>
                    {data?.map((course: Course) => (
                        <div className='p-1' key={course.id}>
                            <Link
                                className='flex justify-between hover:bg-main-color-2 rounded-md p-1'
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
