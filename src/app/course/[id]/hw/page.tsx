"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Cookie from "js-cookie"
import Card from "@/components/hw/card"
import { HwList } from "@/types"

// export default function Hw({ params }: { params: { id: string } }) {
const HwPage = ({ params }: { params: { id: string } }) => {
    const [data, setData] = useState<HwList[]>([])
    const router = useRouter()

    useEffect(() => {
        const cookie = Cookie.get()
        console.log(cookie)
        // cookie = {} 跳轉到登入頁面
        if (Object.keys(cookie).length <= 3 && cookie.constructor === Object) {
            router.push("/login")
        }
    }, [])

    useEffect(() => {
        const fetchDate = async () => {
            const res = await fetch(`/api/hw?course=${params.id}`)
            const data = await res.json()

            setData(data)
        }
        fetchDate()
    }, [])

    return (
        <>
            <div className='w-full'>
                {data.map((item) => (
                    <Card key={item.id} data={item} />
                ))}
            </div>
        </>
    )
}

export default HwPage
