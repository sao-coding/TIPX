import { cookies } from "next/headers"
import Link from "next/link"
import { getServerSession } from "next-auth"

import Title from "@/components/Title"
import ScaleTransitionView from "@/components/transition/ScaleTransitionView"
import authOptions from "@/lib/auth"
import { Course } from "@/types"
import getCourse from "@/utils/course"

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
    close: false
  }

  return (
    <>
      <div className='mb-16 w-full rounded-md px-2 pb-2 md:bg-card-background md:p-4 md:shadow-md'>
        <Title title={title} />
        <div className='grid grid-cols-2 gap-2 md:grid-cols-3'>
          {data.length > 0 &&
            data.map((course, index) => (
              <ScaleTransitionView key={course.id} custom={index}>
                <Link
                  className='ripple flex h-20 flex-col justify-center space-y-2 rounded-lg border p-2 dark:border-none dark:bg-main-color-1'
                  href={`/course/${course.id}`}
                >
                  <div className='line-clamp-1 text-ellipsis'>{course.course}</div>
                  <div className='flex items-center justify-between'>
                    <div>{course.id}</div>
                    <div className='rounded-lg bg-main-color-1 px-1 dark:bg-main-color-2'>
                      {course.teacher}
                    </div>
                  </div>
                </Link>
                {session?.user.studentID === process.env.ADMINSTUDENTID && (
                  <RollCallVerify courseID={course.id} />
                )}
              </ScaleTransitionView>
            ))}
        </div>
      </div>
    </>
  )
}

export default CourseListPage
