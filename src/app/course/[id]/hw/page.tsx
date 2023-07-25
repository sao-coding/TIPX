"use client"

import { useState, useEffect } from "react"
import Cookie from "js-cookie"
import Card from "@/components/hw/card"
import { HwList } from "@/types"
import "@/app/loaderCat.css"

const HwPage = ({ params }: { params: { id: string } }) => {
    const [data, setData] = useState<HwList[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`/api/hw?course=${params.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + Cookie.get("token"),
                },
            })
            const data = await res.json()
            setData(data)
            setLoading(false)
        }
        fetchData()
    }, [params.id])

    return (
        <>
            {loading ? (
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
                    {data.length > 0 ? (
                        data.map((item) => <Card key={item.id} data={item} />)
                    ) : (
                        <div className='text-center text-2xl'>沒有作業</div>
                    )}
                </div>
            )}
        </>
    )
}

export default HwPage
