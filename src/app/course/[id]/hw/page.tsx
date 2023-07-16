"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Cookie from "js-cookie"
import Card from "@/components/hw/card"
import { HwList } from "@/types"

const HwPage = ({ params }: { params: { id: string } }) => {
    const [data, setData] = useState<HwList[]>([])
    const router = useRouter()

    useEffect(() => {
        const cookie = Cookie.get("token")
        if (!cookie) {
            router.push("/login")
        }
    }, [])

    useEffect(() => {
        const fetchDate = async () => {
            const res = await fetch(`/api/hw?course=${params.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + Cookie.get("token"),
                },
            })
            const data = await res.json()

            if (data.error === "Unauthorized") {
                setData([])
            } else {
                setData(data)
            }
        }
        fetchDate()
        console.log(data)
    }, [])

    return (
        <>
            <div className='w-full'>
                {/* {data.map((item) => (
                    <Card key={item.id} data={item} />
                ))} */}
                {data.length === 0 ? (
                    <div className='text-center text-2xl'>沒有作業</div>
                ) : (
                    data.map((item) => <Card key={item.id} data={item} />)
                )}
            </div>
        </>
    )
}

export default HwPage
