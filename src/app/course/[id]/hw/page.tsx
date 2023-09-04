"use client"

import { useQuery } from "@tanstack/react-query"
import Cookie from "js-cookie"
import Card from "@/components/hw/card"
import { HwList } from "@/types"
import "@/app/loaderCat.css"
import BottomToUpTransitionView from "@/components/transition/BottomToUpTransitionView"

const HwPage = ({ params }: { params: { id: string } }) => {
    const { data: course } = useQuery({
        queryKey: ["course", params.id],
        queryFn: async () => {
            const res = await fetch(`/api/course?course=${params.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            const data = await res.json()
            return data
        },
        refetchOnWindowFocus: false,
    })

    const { data, isLoading } = useQuery<HwList[]>({
        queryKey: ["hw", params.id],
        queryFn: async () => {
            const res = await fetch(`/api/hw?course=${params.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            const data = await res.json()
            return data
        },
        refetchOnWindowFocus: false,
    })

    return (
        <>
            {isLoading ? (
                <div className='absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2'>
                    <div className='flex h-full w-full items-center justify-center'>
                        <div className='cat'>
                            <div className='cat__body'></div>
                            <div className='cat__body'></div>
                            <div className='cat__tail'></div>
                            <div className='cat__head'></div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='w-full'>
                    {data && data.length > 0 && course ? (
                        <>
                            {data.map((item, index) => (
                                <BottomToUpTransitionView key={index} custom={index}>
                                    <Card
                                        course={course.name}
                                        data={item}
                                        studentID={Cookie.get("cookie_userid") ?? ""}
                                    />
                                </BottomToUpTransitionView>
                            ))}
                        </>
                    ) : (
                        <div className='text-center text-2xl'>沒有作業</div>
                    )}
                </div>
            )}
        </>
    )
}

export default HwPage
