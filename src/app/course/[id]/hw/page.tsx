"use client"

import { useQuery } from "@tanstack/react-query"
import Cookie from "js-cookie"
import { motion } from "framer-motion"
import Card from "@/components/hw/card"
import { HwList } from "@/types"
import "@/app/loaderCat.css"

const HwPage = ({ params }: { params: { id: string } }) => {
    const { data: name } = useQuery({
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
    })

    const card = {
        visible: (custom: number) => ({
            opacity: [0, 1],
            y: [50, -10, 0],
            transition: { delay: custom * 0.1, duration: 0.5 },
        }),
    }

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
                    {data && data.length > 0 ? (
                        data.map((item, index) => (
                            <motion.div
                                key={item.id}
                                animate='visible'
                                variants={card}
                                custom={index}
                            >
                                <Card
                                    course={name}
                                    data={item}
                                    studentID={Cookie.get("cookie_userid") ?? ""}
                                />
                            </motion.div>
                        ))
                    ) : (
                        <div className='text-center text-2xl'>沒有作業</div>
                    )}
                </div>
            )}
        </>
    )
}

export default HwPage
