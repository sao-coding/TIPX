"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import {
    IconUserCircle,
    IconGenderBigender,
    IconCake,
    IconBuildingSkyscraper,
    IconDeviceMobile,
} from "@tabler/icons-react"
import clsx from "clsx"
import { User } from "@/types"
const Info = ({ userData }: { userData: User }) => {
    const [isImgError, setIsImgError] = useState(false)
    const [userInfo, setUserInfo] = useState("")

    const handleMouseEnter = () => {
        console.log("handleMouseEnter")
        setUserInfo("active")
    }

    const handleMouseLeave = () => {
        console.log("handleMouseLeave")
        setUserInfo("")
    }

    const formatDate = (date: string) => {
        // 0900928 -> 90/09/28
        // 若年份開頭為 0，則刪除 0

        let year = date.slice(0, 3)
        if (year[0] === "0") {
            year = year.slice(1)
        }
        const month = date.slice(3, 5)
        const day = date.slice(5, 7)

        return `${year}/${month}/${day}`
    }
    // 延長 10秒 return

    return (
        <>
            <div
                className={clsx("user-info", userInfo)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <>
                    <div className='user-info-front rounded-xl border bg-slate-50 p-2 shadow-md'>
                        <div className='relative flex items-center'>
                            <div className='flex items-center'>
                                {isImgError ? (
                                    <div className='flex h-[100px] w-[75px] items-center justify-center rounded-md shadow-md'>
                                        <IconUserCircle size={75} />
                                    </div>
                                ) : (
                                    <Image
                                        src={userData.img}
                                        alt='大頭貼'
                                        width='0'
                                        height='0'
                                        sizes='fill'
                                        loading='lazy'
                                        placeholder='blur'
                                        blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAABLCAYAAABJNhZ0AAAAKklEQVR42u3KMQ0AMAgAsKF8NvCCOLDATdq70ZX/LYQoiqIoiqIoigfiANYf04f83WXIAAAAAElFTkSuQmCC'
                                        className='h-[100px] w-[75px] rounded-md object-cover shadow-md'
                                        onError={() => setIsImgError(true)}
                                    />
                                )}
                            </div>
                            <div className='py-[3px] pl-4'>
                                <div className='flex items-center'>
                                    <div className='pr-1'>{userData.name}</div>
                                    <div className='pl-1'>{userData.enName}</div>
                                </div>
                                <div>{userData.IDnumber}</div>
                                <div>{userData.major}</div>
                                <div className='flex items-center'>
                                    <div className='pr-1'>{userData.dept}</div>
                                    <div className='pl-1'>{userData.es}</div>
                                </div>
                            </div>
                            <div className='absolute right-0 top-0 rounded-md bg-main-color-3 px-1 font-bold text-neutral-200'>
                                {userData.status}
                            </div>
                            <div className='absolute bottom-0 right-0 rounded-md bg-main-color-3 px-1 text-neutral-200'>
                                {userData.userid}
                            </div>
                        </div>
                    </div>
                    <div className='user-info-back rounded-xl border bg-slate-50 p-2 shadow-md'>
                        <div className='py-[3px] pl-4'>
                            <div className='flex items-center'>
                                <IconGenderBigender />
                                {userData.gender}
                            </div>
                            <div className='flex items-center'>
                                <IconCake />
                                {userData.birthday ? formatDate(userData.birthday) : "未填寫"}
                            </div>
                            <div className='flex items-center'>
                                <IconBuildingSkyscraper />
                                {userData.birthplace}
                            </div>
                            <div className='flex items-center'>
                                <IconDeviceMobile />
                                <div>{userData.phone}</div>
                            </div>
                        </div>
                    </div>
                </>
            </div>
        </>
    )
}

export default Info
