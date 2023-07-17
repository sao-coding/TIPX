import Timetable from "@/components/timetable/timetable"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const TimeTablePage = () => {
    // 判斷是否登入
    // const token = cookies().get("token")

    // if (token === process.env.AUTHORIZATION) {
    //     redirect("/login")
    // }

    return (
        <>
            <div className='w-full rounded-md bg-white p-2 shadow-md md:p-4'>
                <div className='overflow-x-auto rounded-md md:flex md:items-center md:justify-center'>
                    <div className='table overflow-hidden rounded-md'>
                        <Timetable />
                    </div>
                </div>
            </div>
        </>
    )
}

export default TimeTablePage
