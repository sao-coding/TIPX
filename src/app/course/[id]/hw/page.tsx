"use client"

import { useQuery } from "@tanstack/react-query"
import Cookie from "js-cookie"
import Card from "@/components/hw/card"
import { HwList } from "@/types"
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

    const { data, isLoading } = useQuery({
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
                    {data && data.length > 0 && course && !data.status && (
                        <>
                            {data.map((item: HwList, index: number) => (
                                <BottomToUpTransitionView key={index} custom={index}>
                                    <Card
                                        course={course.name}
                                        data={item}
                                        studentID={Cookie.get("cookie_userid") ?? ""}
                                    />
                                </BottomToUpTransitionView>
                            ))}
                        </>
                    )}
                    {data && data.length === 0 && !data.status && (
                        <div className='text-center text-2xl'>沒有作業</div>
                    )}
                    {data.status && (
                        <>
                            <div className='text-center text-2xl whitespace-pre-line border-2 border-dashed border-main-color-2 rounded-xl p-2'>
                                {data.message}
                            </div>
                            <div className='w-full flex justify-center'>
                                <img src='/img/QQ.png' alt='' />
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    )
}

export default HwPage
