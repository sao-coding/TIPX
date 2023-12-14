"use client"

import { signOut } from "next-auth/react"
import Cookie from "js-cookie"
import { IconLogout } from "@tabler/icons-react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

const Logout = () => {
    const router = useRouter()

    return (
        <div
            className='w-full cursor-pointer rounded-xl md:border bg-slate-50 p-2'
            onClick={async () => {
                console.log("logout")
                // 刪除所有Cookie
                Object.keys(Cookie.get()).forEach((cookieName) => {
                    console.log(cookieName)
                    Cookie.remove(cookieName)
                })
                const status = await signOut({
                    redirect: false,
                })
                if (status) {
                    toast.success("登出成功")
                    router.push("/login")
                }
            }}
        >
            <div className='flex items-center'>
                <IconLogout />
                <div className='ml-2'>登出</div>
            </div>
        </div>
    )
}

export default Logout
