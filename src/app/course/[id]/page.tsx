import { cookies } from "next/headers"
import { getServerSession } from "next-auth"

import Tabs from "@/components/course/tabs"
import Title from "@/components/Title"
import authOptions from "@/lib/auth"
import { Course } from "@/types"
import getCourse from "@/utils/course"

const CoursePage = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession(authOptions)
  const course = (await getCourse(
    session?.user.studentID ?? "",
    cookies().get("cookie_year")?.value ?? "",
    cookies().get("cookie_sem")?.value ?? "",
    params.id
  )) as Course

  const title = {
    title: course.course,
    position: "text-center",
    close: true
  }

  return (
    <div className='h-full w-full px-2 md:rounded-md md:bg-card-background md:pt-4 md:shadow-md'>
      <Title title={title} />
      <Tabs id={params.id} />
    </div>
  )
}

export default CoursePage
