"use client"
import { useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { Post } from "@/types"

const Test: React.FC = () => {
    const [data, setData] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch("/api/test")
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
