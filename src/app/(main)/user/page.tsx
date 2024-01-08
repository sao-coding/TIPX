import Link from "next/link"
import { getServerSession } from "next-auth"
import clsx from "clsx"
import authOptions from "@/lib/auth"
import getUser from "@/utils/user"
import getLineID from "@/utils/lineid"
import getSearchAuth from "@/utils/search-auth"
import { User } from "@/types"
import Info from "./info"
import InfoBoard from "./infoBoard"
import Weather from "./weather"
import Switch from "./switch"
import Notify from "./notify"
import Logout from "./logout"
import Count from "./count"
import { USER_LINKS } from "@/config/links"
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
                {/* 要判斷查詢用戶 & 日誌中心 是否顯示 */}
                {USER_LINKS.map((link, index) =>
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
