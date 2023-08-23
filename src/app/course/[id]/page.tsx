"use client"

import Tabs from "@/components/course/tabs"

const CoursePage = ({ params }: { params: { id: string } }) => {
    return (
        <>
            <div className='h-full w-full md:rounded-md md:bg-white px-4 md:pt-4 md:shadow-md'>
                <Tabs id={params.id} />
            </div>
        </>
    )
}

export default CoursePage
