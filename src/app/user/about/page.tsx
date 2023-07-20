"use client"
import Fancybox from "@/components/fancybox"
import { useState, useEffect } from "react"
import Image from "next/image"
import clsx from "clsx"
import { User, CourseAttendanceRecord } from "@/types"
import { IconUserCircle, IconListDetails, IconClock, IconUser } from "@tabler/icons-react"

export default function UserInfoPage() {
    const [userData, setUserData] = useState<User>()
    const [cookie, setCookie] = useState("")

    useEffect(() => {
        const fetchUserDate = async () => {
            const res = await fetch("/api/user")
            const data = await res.json()

            setUserData(data)
        }
        fetchUserDate()
    }, [])

    return (
        <>
            <div className=''>
                <Fancybox
                    options={{
                        Carousel: {
                            infinite: false,
                        },
                    }}
                >
                    <a href='/thumbnail-a.jpeg' data-fancybox data-caption='大頭貼'>
                        <img src='/thumbnail-a.jpeg' />
                    </a>
                </Fancybox>
                <div className=''>{userData?.userid}</div>
                <div className=''>{userData?.name}</div>
                <div className=''>{userData?.status}</div>
                <div className=''>{userData?.dept}</div>
                <div className=''>{userData?.es}</div>
                <div className=''>{userData?.major}</div>
                <div className=''>{userData?.enName}</div>
                <div className=''>{userData?.IDnumber}</div>
                <div className=''>{userData?.gender}</div>
                <div className=''>{userData?.birthday}</div>
                <div className=''>{userData?.birthplace}</div>
                <div className=''>{userData?.address}</div>
                <div className=''>{userData?.phone}</div>
                <div className=''>{userData?.homePhone}</div>
                <div className=''>{userData?.date}</div>
                <div className=''>{userData?.previousEducation}</div>
                <div className=''>{userData?.parentName}</div>
                <div className=''>{userData?.parentAddress}</div>
                <div className=''>{userData?.parentPhone}</div>
                <div className=''>{userData?.parentJob}</div>
                <div className=''>{userData?.desc}</div>
                <div className=''>{userData?.credit.title}</div>
                <div className=''>{userData?.credit.total}</div>
                <div className=''>{userData?.credit.get}</div>
            </div>
        </>
    )
}
