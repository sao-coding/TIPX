"use client"

import { useState, useEffect } from "react"

const TestPage = () => {
    const [data, setData] = useState<string>("")

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch("/api/test", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            const data = await res.json()
            setData(data)
        }
        fetchData()
    }, [])

    return (
        <div>
            <h1>{data.error}</h1>
        </div>
    )
}

export default TestPage
