import { cookies } from "next/headers"
import Link from "next/link"
import getCourse from "@/utils/course"
import Title from "@/components/Title"
import ScaleTransitionView from "@/components/transition/ScaleTransitionView"
import { Course } from "@/types"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
import RollCallVerify from "./roll-call-verify"

const CourseListPage = async () => {
    const session = await getServerSession(authOptions)

    const data = (await getCourse(
        session?.user.studentID ?? "",
        cookies().get("cookie_year")?.value ?? "",
        cookies().get("cookie_sem")?.value ?? ""
    )) as Course[]

    const title = {
        title: "課程",
        position: "text-center",
        close: false,
    }

    return (
        <>
            <div className='w-full rounded-md px-2 pb-2 mb-14 md:bg-white md:p-4 md:shadow-md'>
                <Title title={title} />
                <div className='grid grid-cols-2 gap-2 md:grid-cols-3'>
                    {data.length > 0 &&
                        data.map((course, index) => (
                            <ScaleTransitionView key={course.id} custom={index}>
                                <Link
                                    className='flex flex-col space-y-2 rounded-lg border p-2 ripple h-20 justify-center'
                                    href={`/course/${course.id}`}
                                >
                                    <div className='overflow-ellipsis line-clamp-1'>
                                        {course.course}
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        <div>{course.id}</div>
                                        <div className='px-1 bg-main-color-1 rounded-lg'>
                                            {course.teacher}
                                        </div>
                                    </div>
                                </Link>
                                {/* <RollCallVerify courseID={course.id} /> */}
                            </ScaleTransitionView>
                        ))}
                </div>
            </div>
        </>
    )
}

export default CourseListPage
