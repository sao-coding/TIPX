// "use client"

import { useEffect, useState } from "react"
import { cookies } from "next/headers"
import Link from "next/link"
import { Course } from "@/types"
import Cookie from "js-cookie"
import { site } from "@/config/site"

const getData = async () => {
    const res = await fetch(`${site.url}/api/course`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies().get("token")?.value}`,
            Cookie: cookies().toString(),
        },
    })

    if (!res.ok) {
        throw new Error("獲取資料失敗")
    }

    return res.json()
}

const CourseListPage = async () => {
    const data = await getData()

    return (
        <>
            <div className='w-full p-2'>
                <div className='grid grid-cols-2 gap-2 md:grid-cols-3'>
                    {/* {loading && <div className='p-1'>載入中</div>} */}
                    {data.length > 0 &&
                        data.map((course: Course) => (
                            <Link
                                className='block rounded-md border p-1 shadow-md'
                                href={`/course/${course.id}`}
                                key={course.id}
                            >
                                <div className='p-1'>{course.item}</div>
                                <div className='p-1'>{course.id}</div>
                            </Link>
                        ))}
                </div>
            </div>
        </>
    )
}

export default CourseListPage
