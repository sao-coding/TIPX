import Link from "next/link"
import { cookies } from "next/headers"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
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
    IconBrandGoogleAnalytics,
    IconNotes,
    IconInfoCircle,
} from "@tabler/icons-react"
import Info from "@/app/user/info"
import InfoBoard from "@/app/user/infoBoard"
import Switch from "@/app/user/switch"
import Notify from "@/app/user/notify"
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
    const session = await getServerSession(authOptions)

    return (
        <div className='mb-14 w-full p-2'>
            <Info userData={userData} />
            <InfoBoard />
            <Switch />
            <Link
                href='/user/about'
                className='mt-2 block w-full cursor-pointer rounded-xl border bg-slate-50 p-2 shadow-md'
            >
                <div className='flex items-center'>
                    <IconUser />
                    <div className='ml-2'>個人詳細資料</div>
                </div>
            </Link>
            <Link
                href='/user/leave'
                className='mt-2 block w-full cursor-pointer rounded-xl border bg-slate-50 p-2 shadow-md'
            >
                <div className='flex items-center'>
                    <IconClipboardPlus />
                    <div className='ml-2'>
                        線上請假 (開放測試)
                        <div className='text-xs'>工程獅討拍寫到快往生，有任何問題我不負責</div>
                    </div>
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
            {session?.user.studentID === process.env.ADMINSTUDENTID && (
                <>
                    <Link
                        href='/user/log'
                        className='mt-2 block w-full cursor-pointer rounded-xl border bg-slate-50 p-2 shadow-md'
                    >
                        <div className='flex items-center'>
                            <IconNotes />
                            <div className='ml-2'>日誌中心</div>
                        </div>
                    </Link>
                </>
            )}
            <Link
                href='https://umami.sao-x.com/share/yXMhXlD7ra7teJAM/TIP'
                className='mt-2 block w-full cursor-pointer rounded-xl border bg-slate-50 p-2 shadow-md'
            >
                <div className='flex items-center'>
                    <IconBrandGoogleAnalytics />
                    <div className='ml-2'>網站數據統計</div>
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
            <Notify />
            <Logout />
        </div>
    )
}

export default UserPage
