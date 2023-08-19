"use client"

import { signOut } from "next-auth/react"
import Cookie from "js-cookie"
import { IconLogout } from "@tabler/icons-react"

const Logout = () => {
    return (
        <div
            className='mt-2 w-full cursor-pointer rounded-xl border bg-slate-50 p-2 shadow-md'
            onClick={() => {
                console.log("logout")
                // 刪除所有Cookie
                Object.keys(Cookie.get()).forEach((cookieName) => {
                    console.log(cookieName)
                    Cookie.remove(cookieName)
                })
                signOut()
                window.location.href = "/login"
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
