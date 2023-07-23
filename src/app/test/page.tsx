"use client"
import { useEffect, useState } from "react"
import Cookie from "js-cookie"

const Test: React.FC = () => {
    const [data, setData] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch("/api/test", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + Cookie.get("token"),
                },
            })
            const data = await res.text()
            setData(data)
        }
        fetchData()
    }, [])

    return (
        <>
            <iframe srcDoc={data} className='h-screen w-full' />
        </>
    )
}

export default Test
