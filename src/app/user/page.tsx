"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import Cookie from "js-cookie"
import clsx from "clsx"
import { User, CourseAttendanceRecord, Conduct } from "@/types"
import {
    IconUserCircle,
    IconGenderBigender,
    IconCake,
    IconBuildingSkyscraper,
    IconDeviceMobile,
    IconListDetails,
    IconClock,
    IconUserStar,
    IconLoader2,
    IconUser,
    IconClipboardPlus,
    IconClipboardList,
    IconCoins,
    IconAntennaBars5,
    IconLayoutDashboard,
    IconArrowBadgeDown,
    IconBadges,
    IconInfoCircle,
    IconLogout,
} from "@tabler/icons-react"

export const dynamic = "force-dynamic"

const UserPage = () => {
    const [userData, setUserData] = useState<User>()
    const [courseAttendanceRecordData, setCourseAttendanceRecordData] =
        useState<CourseAttendanceRecord>()
    const [conductData, setConductData] = useState<Conduct>({
        year: "",
        sem: "",
        score: 0,
    })
    const [isImgError, setIsImgError] = useState(false)
    const [userInfo, setUserInfo] = useState("")
    const [LeaveLoading, setLeaveLoading] = useState(false)

    useEffect(() => {
        const fetchUserData = async () => {
            const res = await fetch("/api/user", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + Cookie.get("token"),
                },
            })
            const data = await res.json()

            setUserData(data)
        }
        fetchUserData()

        const fetchCourseAttendanceRecord = async () => {
            setLeaveLoading(true)
            const res = await fetch("/api/course-attendance-record", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + Cookie.get("token"),
                },
            })
            const data = await res.json()

            setCourseAttendanceRecordData(data)
            setLeaveLoading(false)
        }
        fetchCourseAttendanceRecord()

        const fetchConduct = async () => {
            // const res = await fetch("/api/conduct?year=111&sem=2")
            const res = await fetch(
                `/api/conduct?year=${Cookie.get("cookie_year")}&sem=${Cookie.get("cookie_sem")}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + Cookie.get("token"),
                    },
                }
            )
            const data = await res.json()

            setConductData(data)
        }
        fetchConduct()
    }, [])

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

    return (
        <>
            {userData && (
                <>
                    <div className='w-full p-2'>
                        <div
                            className={clsx("user-info", userInfo)}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
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
                                        <div className=''>{userData.IDnumber}</div>
                                        <div className=''>{userData.major}</div>
                                        <div className='flex items-center'>
                                            <div className='pr-1'>{userData.dept}</div>
                                            <div className='pl-1'>{userData.es}</div>
                                        </div>
                                    </div>
                                    <div className='absolute right-0 top-0 rounded-md bg-amber-500 px-1 font-bold text-neutral-200'>
                                        {userData.status}
                                    </div>
                                    <div className='absolute bottom-0 right-0 rounded-md bg-amber-500 px-1 text-neutral-200'>
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
                                        {userData.birthday
                                            ? formatDate(userData.birthday)
                                            : "未填寫"}
                                    </div>
                                    <div className='flex items-center'>
                                        <IconBuildingSkyscraper />
                                        {userData.birthplace}
                                    </div>
                                    <div className='flex items-center'>
                                        <IconDeviceMobile />
                                        {userData.phone}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='mt-2 flex items-center justify-between'>
                            <div className='w-full rounded-xl border p-2 shadow-md'>
                                <div className='flex items-center justify-between'>
                                    <div className=''>請假次數</div>
                                    <div className=''>
                                        <IconListDetails size={20} />
                                    </div>
                                </div>
                                <div className='flex items-center text-2xl'>
                                    {/* {courseAttendanceRecordData?.total?.reduce(
                                        (total, item) => total + item
                                    )} */}
                                    {LeaveLoading ? (
                                        <IconLoader2 size={24} className='mx-1 animate-spin' />
                                    ) : (
                                        courseAttendanceRecordData?.total?.reduce(
                                            (total, item) => total + item
                                        )
                                    )}
                                    <div className='ml-0.5'>次</div>
                                </div>
                            </div>
                            <div className='mx-1 w-full rounded-xl border p-2 shadow-md'>
                                <div className='flex items-center justify-between'>
                                    <div className=''>請假時數</div>
                                    <div className=''>
                                        <IconClock size={20} />
                                    </div>
                                </div>
                                <div className='flex items-center text-2xl'>
                                    {LeaveLoading ? (
                                        <IconLoader2 size={24} className='mx-1 animate-spin' />
                                    ) : (
                                        courseAttendanceRecordData?.total
                                            ?.reduce((total, item) => {
                                                return (
                                                    total + Math.round(((item * 50) / 60) * 10) / 10
                                                )
                                            }, 0)
                                            .toFixed(1)
                                    )}
                                    <div className='ml-0.5'>小時</div>
                                </div>
                            </div>
                            <div className='w-full rounded-xl border p-2 shadow-md'>
                                <div className='flex items-center justify-between'>
                                    <div className=''>目前操行</div>
                                    <div className=''>
                                        <IconUserStar size={20} />
                                    </div>
                                </div>
                                <div className='text-2xl'>{conductData.score}分</div>
                            </div>
                        </div>
                        <Link
                            href='/user/about'
                            className='mt-2 block w-full cursor-pointer rounded-xl border bg-slate-50 p-2 shadow-md'
                        >
                            <div className='flex items-center'>
                                <IconUser />
                                <div className='ml-2'>個人詳細資料 (尚未推出)</div>
                            </div>
                        </Link>
                        <Link
                            href=''
                            className='mt-2 block w-full cursor-pointer rounded-xl border bg-slate-50 p-2 shadow-md'
                        >
                            <div className='flex items-center'>
                                <IconClipboardPlus />
                                <div className='ml-2'>線上請假 (尚未推出)</div>
                            </div>
                        </Link>
                        <Link
                            href='/user/attendance-record'
                            className='mt-2 block w-full cursor-pointer rounded-xl border bg-slate-50 p-2 shadow-md'
                        >
                            <div className='flex items-center'>
                                <IconClipboardList />
                                <div className='ml-2'>請假缺曠記錄</div>
                            </div>
                        </Link>
                        <Link
                            href='/user/credit'
                            className='mt-2 block w-full cursor-pointer rounded-xl border bg-slate-50 p-2 shadow-md'
                        >
                            <div className='flex items-center'>
                                <IconCoins />
                                <div className='ml-2'>學分資訊</div>
                            </div>
                        </Link>
                        <Link
                            href='/user/sem-grade'
                            className='mt-2 block w-full cursor-pointer rounded-xl border bg-slate-50 p-2 shadow-md'
                        >
                            <div className='flex items-center'>
                                <IconAntennaBars5 />
                                <div className='ml-2'>科目成績</div>
                            </div>
                        </Link>
                        <Link
                            href='/user/final-grade'
                            className='mt-2 block w-full cursor-pointer rounded-xl border bg-slate-50 p-2 shadow-md'
                        >
                            <div className='flex items-center'>
                                <IconLayoutDashboard />
                                <div className='ml-2'>學期-操行 成績</div>
                            </div>
                        </Link>
                        <Link
                            href='/user/class-rank'
                            className='mt-2 block w-full cursor-pointer rounded-xl border bg-slate-50 p-2 shadow-md'
                        >
                            <div className='flex items-center'>
                                <IconArrowBadgeDown />
                                <div className='ml-2'>班級排名 (beta)</div>
                            </div>
                        </Link>
                        <Link
                            href='/user/dept-rank'
                            className='mt-2 block w-full cursor-pointer rounded-xl border bg-slate-50 p-2 shadow-md'
                        >
                            <div className='flex items-center'>
                                <IconBadges />
                                <div className='ml-2'>系排名 (beta)</div>
                            </div>
                        </Link>
                        <Link
                            href='/user/info'
                            className='mt-2 block w-full cursor-pointer rounded-xl border bg-slate-50 p-2 shadow-md'
                        >
                            <div className='flex items-center'>
                                <IconInfoCircle />
                                <div className='ml-2'>關於</div>
                            </div>
                        </Link>
                        <div
                            className='mt-2 w-full cursor-pointer rounded-xl border bg-slate-50 p-2 shadow-md'
                            onClick={() => {
                                Cookie.remove("token")
                                window.location.href = "/login"
                            }}
                        >
                            <div className='flex items-center'>
                                <IconLogout />
                                <div className='ml-2'>登出</div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default UserPage
