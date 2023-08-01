"use client"

import Tabs from "@/components/course/tabs"

const CoursePage = ({ params }: { params: { id: string } }) => {
    return (
        <>
            <div className='h-full w-full rounded-md bg-white p-4 shadow-md'>
                <Tabs id={params.id} />
            </div>
        </>
    )
}

export default CoursePage
