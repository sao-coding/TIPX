import { cookies } from "next/headers"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
import getCourse from "@/utils/course"
import { Course } from "@/types"
import Tabs from "@/components/course/tabs"

const CoursePage = async ({ params }: { params: { id: string } }) => {
    const session = await getServerSession(authOptions)
    // userid: string,
    // year: string,
    // sem: string,
    // dept: string,
    // es: string,
    // course?: string
    const course = (await getCourse(
        session?.user.studentID ?? cookies().get("cookie_userid")?.value ?? "",
        cookies().get("cookie_year")?.value ?? "",
        cookies().get("cookie_sem")?.value ?? "",
        cookies().get("cookie_dept")?.value ?? "",
        cookies().get("cookie_es")?.value ?? "",
        params.id
    )) as Course

    return (
        <div className='h-full w-full md:rounded-md md:bg-white px-4 md:pt-4 md:shadow-md'>
            <div className='relative mb-2 md:rounded-xl md:border md:bg-white md:shadow-sm -mt-2'>
                <div className='text-center text-2xl font-bold'>{course.name}</div>
            </div>
            <Tabs id={params.id} />
        </div>
    )
}

export default CoursePage
