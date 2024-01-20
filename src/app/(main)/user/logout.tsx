"use client"

import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import Cookie from "js-cookie"
import toast from "react-hot-toast"

import { IconLogout } from "@tabler/icons-react"

const Logout = () => {
  const router = useRouter()

  return (
    <div
      className='w-full cursor-pointer rounded-xl p-2 md:border'
      onClick={async () => {
        console.log("logout")
        // 刪除所有Cookie
        Object.keys(Cookie.get()).forEach((cookieName) => {
          console.log(cookieName)
          Cookie.remove(cookieName)
        })
        const status = await signOut({
          redirect: false
        })
        if (status) {
          toast.success("登出成功")
          router.push("/login")
        }
      }}
    >
      <div className='flex items-center'>
        <IconLogout className='stroke-red-500' />
        <div className='ml-2'>登出</div>
      </div>
    </div>
  )
}

export default Logout
