"use client"

import { signOut } from "next-auth/react"
import Cookie from "js-cookie"
import { IconLogout } from "@tabler/icons-react"

const Logout = () => {
    return (
        <div
            className='mt-2 w-full cursor-pointer rounded-xl border bg-slate-50 p-2 shadow-md'
            onClick={() => {
                signOut()
                Cookie.remove("token")
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
