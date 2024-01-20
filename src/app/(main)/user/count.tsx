"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, query } from "firebase/firestore"

import Counter from "@/components/transition/Counter"
import { db } from "@/lib/firebase"

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
    <div className='flex w-full flex-col items-center justify-center p-10'>
      <div className='text-5xl font-bold'>
        {count !== 0 ? <Counter count={count} /> : <div className='text-5xl font-bold'>--</div>}
      </div>
      <div className='text-2xl'>已註冊人數</div>
    </div>
  )
}

export default Count
