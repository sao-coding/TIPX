"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, query } from "firebase/firestore"

import Title from "@/components/Title"
import { db } from "@/lib/firebase"

import Card from "./card"

// email
// :
// "c11229134@gs.takming.edu.tw"
// emailVerified
// :
// null
// image
// :
// "https://lh3.googleusercontent.com/a/AAcHTtd4d27MiKmeCEbn_XH2ONOZ8xL8UTFXzhL1SFRl-Lc=s96-c"
// name
// :
// "高苡瑄"

const RegistrationPage = () => {
  const [data, setData] = useState<{ userId: string }[]>([])
  // const

  //   列出所有使用者

  useEffect(() => {
    const q = query(collection(db, "users"))
    const getData = async () => {
      const querySnapshot = await getDocs(q)
      setData(
        querySnapshot.docs.map((doc) => {
          return {
            userId: doc.data().email.split("@")[0]
          }
        })
      )
    }
    getData()
  }, [])

  useEffect(() => {
    console.log(data)
  }, [data])

  const title = {
    title: "註冊名單",
    position: "text-center",
    close: true
  }

  return (
    <div className='mb-2 w-full px-2'>
      <Title title={title} />
      <div className='flex flex-col gap-2'>
        {data.length !== 0 && data.map((user) => <Card userId={user.userId} key={user.userId} />)}
      </div>
    </div>
  )
}

export default RegistrationPage
