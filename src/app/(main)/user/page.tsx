import Link from "next/link"
import { getServerSession } from "next-auth"
import clsx from "clsx"
import authOptions from "@/lib/auth"
import getUser from "@/utils/user"
import getLineID from "@/utils/lineid"
import getSearchAuth from "@/utils/search-auth"
import { User } from "@/types"
import {
    Icon,
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

type LinkList = {
    icon: Icon
    color: string
    className?: string
    href: string
    text: string
}[]

const LinkList: LinkList = [
    {
        icon: IconUserSearch,
        color: "stroke-red-500",
        href: "/user/search",
        text: "查詢用戶",
    },
    {
        icon: IconUser,
        color: "stroke-orange-500",
        href: "/user/about",
        text: "個人資料",
    },
    {
        icon: IconClipboardPlus,
        color: "stroke-blue-500",
        href: "/user/leave",
        text: "線上請假",
    },
    {
        icon: IconClipboardList,
        color: "stroke-red-500",
        href: "/user/attendance-record",
        text: "請假缺曠記錄",
    },
    {
        icon: IconCoins,
        color: "stroke-yellow-500",
        href: "/user/credit",
        text: "學分資訊",
    },
    {
        icon: IconAntennaBars5,
        color: "stroke-rose-500",
        href: "/user/sem-grade",
        text: "科目成績",
    },
    {
        icon: IconLayoutDashboard,
        color: "stroke-purple-500",
        href: "/user/final-grade",
        text: "學期-操行 成績",
    },
    {
        icon: IconList,
        color: "stroke-pink-500",
        href: "/user/class-list",
        text: "班級名單",
    },
    {
        icon: IconArrowBadgeDown,
        color: "stroke-emerald-500",
        className: "transform rotate-180",
        href: "/user/class-rank",
        text: "班級排名",
    },
    {
        icon: IconBadges,
        color: "stroke-teal-500",
        className: "transform rotate-180",
        href: "/user/dept-rank",
        text: "系排名",
    },
    {
        icon: IconMessageCircle,
        color: "stroke-blue-500",
        href: "/forum",
        text: "聊天",
    },
    {
        icon: IconHistory,
        color: "stroke-indigo-500",
        href: "/user/git-log",
        text: "更新日誌",
    },
    {
        icon: IconNotes,
        color: "stroke-orange-500",
        href: "/user/log",
        text: "日誌中心",
    },
    {
        icon: IconBrandGoogleAnalytics,
        color: "stroke-sky-400",
        href: "https://umami.sao-x.com/share/yXMhXlD7ra7teJAM/TIP",
        text: "網站數據統計",
    },
    {
        icon: IconActivity,
        color: "stroke-red-500",
        href: "https://tk-tipx.github.io/upptime",
        text: "系統狀態",
    },
    {
        icon: IconInfoCircle,
        color: "stroke-blue-500",
        href: "/user/info",
        text: "關於",
    },
]

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
                {/* 要判斷查詢用戶 & 日誌中心 是否顯示 */}
                {LinkList.map((link, index) =>
                    // 若為查詢用戶 && 日誌中心，則要判斷是否顯示
                    (link.text === "查詢用戶" && !searchAuth) ||
                    (link.text === "日誌中心" &&
                        session?.user.studentID !== process.env.ADMINSTUDENTID) ? null : (
                        <Link
                            key={index}
                            href={link.href}
                            className='block w-full cursor-pointer rounded-xl md:border p-2 ripple'
                        >
                            <div className='flex items-center'>
                                <link.icon className={clsx(link.color, link.className)} />
                                <div className='ml-2'>{link.text}</div>
                            </div>
                        </Link>
                    )
                )}
                <Notify />
                <Logout />
                <Count />
            </div>
        </>
    )
}

export default UserPage
