import Link from "next/link"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
import getUser from "@/utils/user"
import getLineID from "@/utils/lineid"
import getSearchAuth from "@/utils/search-auth"
import { User } from "@/types"
import {
    IconUserSearch,
    IconUser,
    IconClipboardPlus,
    IconClipboardList,
    IconCoins,
    IconAntennaBars5,
    IconLayoutDashboard,
    IconList,
    IconArrowBadgeDown,
    IconBadges,
    IconBrandGoogleAnalytics,
    IconActivity,
    IconNotes,
    IconInfoCircle,
    IconMessageCircle,
    IconHistory,
} from "@tabler/icons-react"
import Info from "./info"
import InfoBoard from "./infoBoard"
import Weather from "./weather"
import Switch from "./switch"
import Notify from "./notify"
import Logout from "./logout"
import Count from "./count"
import { site } from "@/config/site"

// const getUserData = async () => {
//     const res = await fetch(`${site.url}/api/user`, {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: "Bearer " + cookies().get("token")?.value,
//             Cookie: cookies().toString(),
//         },
//     })
//     return await res.json()
// }
const UserPage = async () => {
    const session = await getServerSession(authOptions)
    const userData: User = await getUser(session?.user.studentID as string)
    const lineID = await getLineID(session?.user.studentID as string)
    const searchAuth = await getSearchAuth(session?.user.studentID as string)
    console.log(session)

    return (
        <>
            <div className='mb-14 w-full p-2 md:-mb-20 flex flex-col gap-2'>
                <Info userData={userData} lineID={lineID.lineid} />
                <InfoBoard />
                <Weather />
                <Switch />
                {searchAuth && (
                    <Link
                        href='/user/search'
                        className='block w-full cursor-pointer rounded-xl md:border bg-slate-50 p-2 ripple'
                    >
                        <div className='flex items-center'>
                            <IconUserSearch className='stroke-red-500' />
                            <div className='ml-2'>查詢用戶</div>
                        </div>
                    </Link>
                )}
                <Link
                    href='/user/about'
                    className='block w-full cursor-pointer rounded-xl md:border bg-slate-50 p-2 ripple'
                >
                    <div className='flex items-center'>
                        <IconUser className='stroke-orange-500' />
                        <div className='ml-2'>個人資料</div>
                    </div>
                </Link>
                <Link
                    href='/user/leave'
                    className='block w-full cursor-pointer rounded-xl md:border bg-slate-50 p-2 ripple'
                >
                    <div className='flex items-center'>
                        <IconClipboardPlus className='stroke-blue-500' />
                        <div className='ml-2'>線上請假</div>
                    </div>
                </Link>
                <Link
                    href='/user/attendance-record'
                    className='block w-full cursor-pointer rounded-xl md:border bg-slate-50 p-2 ripple'
                >
                    <div className='flex items-center'>
                        <IconClipboardList className='stroke-red-500' />
                        <div className='ml-2'>請假缺曠記錄</div>
                    </div>
                </Link>
                <Link
                    href='/user/credit'
                    className='block w-full cursor-pointer rounded-xl md:border bg-slate-50 p-2 ripple'
                >
                    <div className='flex items-center'>
                        <IconCoins className='stroke-yellow-500' />
                        <div className='ml-2'>學分資訊</div>
                    </div>
                </Link>
                <Link
                    href='/user/sem-grade'
                    className='block w-full cursor-pointer rounded-xl md:border bg-slate-50 p-2 ripple'
                >
                    <div className='flex items-center'>
                        <IconAntennaBars5 className='stroke-rose-500' />
                        <div className='ml-2'>科目成績</div>
                    </div>
                </Link>
                <Link
                    href='/user/final-grade'
                    className='block w-full cursor-pointer rounded-xl md:border bg-slate-50 p-2 ripple'
                >
                    <div className='flex items-center'>
                        <IconLayoutDashboard className='stroke-purple-500' />
                        <div className='ml-2'>學期-操行 成績</div>
                    </div>
                </Link>
                <Link
                    href='/user/class-list'
                    className='block w-full cursor-pointer rounded-xl md:border bg-slate-50 p-2 ripple'
                >
                    <div className='flex items-center'>
                        <IconList className='stroke-pink-500' />
                        <div className='ml-2'>班級名單</div>
                    </div>
                </Link>
                <Link
                    href='/user/class-rank'
                    className='block w-full cursor-pointer rounded-xl md:border bg-slate-50 p-2 ripple'
                >
                    <div className='flex items-center'>
                        <IconArrowBadgeDown className='stroke-emerald-500' />
                        <div className='ml-2'>班級排名</div>
                    </div>
                </Link>
                <Link
                    href='/user/dept-rank'
                    className='block w-full cursor-pointer rounded-xl md:border bg-slate-50 p-2 ripple'
                >
                    <div className='flex items-center'>
                        <IconBadges className='stroke-teal-500' />
                        <div className='ml-2'>系排名</div>
                    </div>
                </Link>
                <Link
                    href='/forum'
                    className='block w-full cursor-pointer rounded-xl md:border bg-slate-50 p-2 ripple'
                >
                    <div className='flex items-center'>
                        <IconMessageCircle className='stroke-blue-500' />
                        <div className='ml-2'>聊天</div>
                    </div>
                </Link>
                {/* 更新日誌 */}
                <Link
                    href='/user/git-log'
                    className='block w-full cursor-pointer rounded-xl md:border bg-slate-50 p-2 ripple'
                >
                    <div className='flex items-center space-x-2'>
                        <IconHistory className='stroke-indigo-500' />
                        <div className='ml-2'>更新日誌</div>
                    </div>
                </Link>
                {session?.user.studentID === process.env.ADMINSTUDENTID && (
                    <>
                        <Link
                            href='/user/log'
                            className='block w-full cursor-pointer rounded-xl md:border bg-slate-50 p-2 ripple'
                        >
                            <div className='flex items-center'>
                                <IconNotes className='stroke-orange-500' />
                                <div className='ml-2'>日誌中心</div>
                            </div>
                        </Link>
                    </>
                )}
                <Link
                    href='https://umami.sao-x.com/share/yXMhXlD7ra7teJAM/TIP'
                    className='block w-full cursor-pointer rounded-xl md:border bg-slate-50 p-2 ripple'
                >
                    <div className='flex items-center'>
                        <IconBrandGoogleAnalytics className='stroke-sky-400' />
                        <div className='ml-2'>網站數據統計</div>
                    </div>
                </Link>
                <Link
                    href='https://tk-tipx.github.io/upptime'
                    className='block w-full cursor-pointer rounded-xl md:border bg-slate-50 p-2 ripple'
                >
                    <div className='flex items-center'>
                        <IconActivity className='stroke-red-500' />
                        <div className='ml-2'>系統狀態</div>
                    </div>
                </Link>
                <Link
                    href='/user/info'
                    className='block w-full cursor-pointer rounded-xl md:border bg-slate-50 p-2 ripple'
                >
                    <div className='flex items-center'>
                        <IconInfoCircle className='stroke-blue-500' />
                        <div className='ml-2'>關於</div>
                    </div>
                </Link>
                <Notify />
                <Logout />
                <Count />
            </div>
        </>
    )
}

export default UserPage
