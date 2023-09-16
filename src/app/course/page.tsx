import { cookies } from "next/headers"
import Link from "next/link"
import { Course } from "@/types"
import { site } from "@/config/site"
import ScaleTransitionView from "@/components/transition/ScaleTransitionView"

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
    const data: Course[] = await getData()

    return (
        <>
            <div className='w-full rounded-md px-2 md:bg-white md:p-4 md:shadow-md'>
                <div className='relative mb-2 md:rounded-xl md:border md:bg-white md:shadow-sm'>
                    <div className='text-center text-2xl font-bold'>課程</div>
                </div>
                <div className='grid grid-cols-2 gap-2 md:grid-cols-3'>
                    {/* {loading && <div className='p-1'>載入中</div>} */}
                    {data.length > 0 &&
                        data.map((course, index) => (
                            <ScaleTransitionView key={course.id} custom={index}>
                                <Link
                                    className='block rounded-lg border p-1 shadow-sm'
                                    href={`/course/${course.id}`}
                                >
                                    <div className='p-1 overflow-ellipsis line-clamp-1'>
                                        {course.name}
                                    </div>
                                    <div className='p-1'>{course.id}</div>
                                </Link>
                            </ScaleTransitionView>
                        ))}
                </div>
            </div>
        </>
    )
}

export default CourseListPage
