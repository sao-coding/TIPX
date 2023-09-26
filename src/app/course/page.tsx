import { cookies } from "next/headers"
import Link from "next/link"
import getCourseTeacher from "@/utils/course-teacher"
import Title from "@/components/Title"
import Footer from "@/components/Footer"
import ScaleTransitionView from "@/components/transition/ScaleTransitionView"
import { Course } from "@/types"
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
    const data: Course[] = await getData()

    const title = {
        title: "課程",
        position: "text-center",
        close: false,
    }

    return (
        <>
            <div className='w-full rounded-md px-2 md:bg-white md:p-4 md:shadow-md'>
                {/* <div className='relative mb-2 md:rounded-xl md:border md:bg-white md:shadow-sm'>
                    <div className='text-center text-2xl font-bold'>課程</div>
                </div> */}
                <Title title={title} />
                <div className='grid grid-cols-2 gap-2 md:grid-cols-3'>
                    {/* {loading && <div className='p-1'>載入中</div>} */}
                    {data.length > 0 &&
                        data.map((course, index) => (
                            <ScaleTransitionView key={course.id} custom={index}>
                                <Link
                                    className='flex flex-col space-y-1 rounded-lg border p-2 shadow-sm'
                                    href={`/course/${course.id}`}
                                >
                                    <div className='overflow-ellipsis line-clamp-1'>
                                        {course.name}
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        <div className='p-1'>{course.id}</div>
                                        <div className='px-1 bg-main-color-1 rounded-lg'>
                                            {getCourseTeacher(
                                                cookies().get("cookie_userid")?.value ?? "",
                                                cookies().get("cookie_year")?.value ?? "",
                                                cookies().get("cookie_sem")?.value ?? "",
                                                cookies().get("cookie_dept")?.value ?? "",
                                                cookies().get("cookie_es")?.value ?? "",
                                                course.id
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </ScaleTransitionView>
                        ))}
                </div>
            </div>
            <Footer />
        </>
    )
}

export default CourseListPage
