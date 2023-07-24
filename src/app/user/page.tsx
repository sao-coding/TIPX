import { Suspense } from "react"
import Link from "next/link"
import { cookies } from "next/headers"
import { User } from "@/types"
import {
    IconUser,
    IconClipboardPlus,
    IconClipboardList,
    IconCoins,
    IconAntennaBars5,
    IconLayoutDashboard,
    IconArrowBadgeDown,
    IconBadges,
    IconInfoCircle,
} from "@tabler/icons-react"
import Info from "@/app/user/info"
import InfoBoard from "@/app/user/infoBoard"
import Logout from "@/app/user/logout"
import { site } from "@/config/site"

const getUserData = async () => {
    const res = await fetch(`${site.url}/api/user`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + cookies().get("token")?.value,
            Cookie: cookies().toString(),
        },
    })
    return await res.json()
}
const UserPage = async () => {
    const userData: User = await getUserData()
    return (
        <div className='w-full p-2'>
            <Suspense fallback={<div>Loading...</div>}>
                <Info userData={userData} />
            </Suspense>
            <InfoBoard />
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
            <Logout />
        </div>
    )
}

export default UserPage
