"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { query, collection, getDocs } from "firebase/firestore"
import Counter from "@/components/transition/Counter"

const Count = () => {
    const [count, setCount] = useState(0)

    useEffect(() => {
        const q = query(collection(db, "users"))
        const getData = async () => {
            const querySnapshot = await getDocs(q)
            setCount(querySnapshot.size)
        }
        getData()
    }, [])

    return (
        <div className='flex flex-col items-center justify-center p-10 w-full'>
            <div className='text-5xl font-bold'>
                {count !== 0 ? (
                    <Counter count={count} />
                ) : (
                    <div className='text-5xl font-bold'>--</div>
                )}
            </div>
            <div className='text-2xl'>已註冊人數</div>
        </div>
    )
}

export default Count
