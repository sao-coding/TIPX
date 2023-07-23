"use client"

import { useState, useEffect } from "react"
import Cookie from "js-cookie"
import Card from "@/components/hw/card"
import { HwList } from "@/types"

const HwPage = ({ params }: { params: { id: string } }) => {
    const [data, setData] = useState<HwList[]>([])

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
        }
        fetchData()
    }, [params.id])

    return (
        <>
            <div className='w-full'>
                {/* {data.map((item) => (
                    <Card key={item.id} data={item} />
                ))} */}
                {data.length > 0 ? (
                    data.map((item) => <Card key={item.id} data={item} />)
                ) : (
                    <div className='text-center text-2xl'>沒有作業</div>
                )}
            </div>
        </>
    )
}

export default HwPage
