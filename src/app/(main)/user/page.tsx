import Link from "next/link"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
import getUser from "@/utils/user"
import getLineID from "@/utils/lineid"
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
    console.log(session)

    return (
        <>
            <div className='mb-14 w-full p-2 md:-mb-20'>
                <Info userData={userData} lineID={lineID.lineid} />
                <InfoBoard />
                <Switch />
                {/* {session?.user.provider === "credentials" && (
                    <Link
                        href='/user/search'
                        className='mt-2 block w-full cursor-pointer rounded-xl border bg-slate-50 p-2 shadow-md ripple'
                    >
                        <div className='flex items-center'>
                            <IconUserSearch />
                            <div className='ml-2'>查詢用戶</div>
                        </div>
                    </Link>
                )} */}
                {/* <Link
                    href='/user/about'
                    className='mt-2 block w-full cursor-pointer rounded-xl border bg-slate-50 p-2 shadow-md ripple'
                >
                    <div className='flex items-center'>
                        <IconUser />
                        <div className='ml-2'>個人資料</div>
                    </div>
                </Link> */}
                <Link
                    href='/user/leave'
                    className='mt-2 block w-full cursor-pointer rounded-xl border bg-slate-50 p-2 shadow-md ripple'
                >
                    <div className='flex items-center'>
                        <IconClipboardPlus />
                        <div className='ml-2'>線上請假</div>
                    </div>
                </Link>
                <Link
                    href='/user/attendance-record'
                    className='mt-2 block w-full cursor-pointer rounded-xl border bg-slate-50 p-2 shadow-md ripple'
                >
                    <div className='flex items-center'>
                        <IconClipboardList />
                        <div className='ml-2'>請假缺曠記錄</div>
                    </div>
                </Link>
                <Link
                    href='/user/credit'
                    className='mt-2 block w-full cursor-pointer rounded-xl border bg-slate-50 p-2 shadow-md ripple'
                >
                    <div className='flex items-center'>
                        <IconCoins />
                        <div className='ml-2'>學分資訊</div>
                    </div>
                </Link>
                <Link
                    href='/user/sem-grade'
                    className='mt-2 block w-full cursor-pointer rounded-xl border bg-slate-50 p-2 shadow-md ripple'
                >
                    <div className='flex items-center'>
                        <IconAntennaBars5 />
                        <div className='ml-2'>科目成績</div>
                    </div>
                </Link>
                <Link
                    href='/user/final-grade'
                    className='mt-2 block w-full cursor-pointer rounded-xl border bg-slate-50 p-2 shadow-md ripple'
                >
                    <div className='flex items-center'>
                        <IconLayoutDashboard />
                        <div className='ml-2'>學期-操行 成績</div>
                    </div>
                </Link>
                <Link
                    href='/user/class-list'
                    className='mt-2 block w-full cursor-pointer rounded-xl border bg-slate-50 p-2 shadow-md ripple'
                >
                    <div className='flex items-center'>
                        <IconList />
                        <div className='ml-2'>班級名單</div>
                    </div>
                </Link>
                <Link
                    href='/user/class-rank'
                    className='mt-2 block w-full cursor-pointer rounded-xl border bg-slate-50 p-2 shadow-md ripple'
                >
                    <div className='flex items-center'>
                        <IconArrowBadgeDown />
                        <div className='ml-2'>班級排名</div>
                    </div>
                </Link>
                <Link
                    href='/user/dept-rank'
                    className='mt-2 block w-full cursor-pointer rounded-xl border bg-slate-50 p-2 shadow-md ripple'
                >
                    <div className='flex items-center'>
                        <IconBadges />
                        <div className='ml-2'>系排名</div>
                    </div>
                </Link>
                <Link
                    href='/forum'
                    className='mt-2 block w-full cursor-pointer rounded-xl border bg-slate-50 p-2 shadow-md ripple'
                >
                    <div className='flex items-center'>
                        <IconMessageCircle />
                        <div className='ml-2'>聊天</div>
                    </div>
                </Link>
                {/* 更新日誌 */}
                {/* <Link
                    href='/user/git-log'
                    className='mt-2 block w-full cursor-pointer rounded-xl border bg-slate-50 p-2 shadow-md ripple'
                >
                    <div className='flex items-center space-x-2'>
                        <IconHistory />
                        <div className='ml-2'>更新日誌</div>
                    </div>
                </Link> */}
                {session?.user.studentID === process.env.ADMINSTUDENTID && (
                    <>
                        <Link
                            href='/user/log'
                            className='mt-2 block w-full cursor-pointer rounded-xl border bg-slate-50 p-2 shadow-md ripple'
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
                    className='mt-2 block w-full cursor-pointer rounded-xl border bg-slate-50 p-2 shadow-md ripple'
                >
                    <div className='flex items-center'>
                        <IconBrandGoogleAnalytics />
                        <div className='ml-2'>網站數據統計</div>
                    </div>
                </Link>
                <Link
                    href='https://tk-tipx.github.io/upptime'
                    className='mt-2 block w-full cursor-pointer rounded-xl border bg-slate-50 p-2 shadow-md ripple'
                >
                    <div className='flex items-center'>
                        <IconActivity />
                        <div className='ml-2'>系統狀態</div>
                    </div>
                </Link>
                <Link
                    href='/user/info'
                    className='mt-2 block w-full cursor-pointer rounded-xl border bg-slate-50 p-2 shadow-md ripple'
                >
                    <div className='flex items-center'>
                        <IconInfoCircle />
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
