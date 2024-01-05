"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { IconBrandGoogle } from "@tabler/icons-react"
import { signIn } from "next-auth/react"
import toast, { useToasterStore } from "react-hot-toast"
import Cookie from "js-cookie"
// import iconv from "iconv-lite"
import Logo from "@/components/logo"

const Form = () => {
    const searchParams = useSearchParams()

    const { toasts } = useToasterStore()
    const TOAST_LIMIT = 2
    // Enforce Limit
    useEffect(() => {
        toasts
            .filter((t) => t.visible) // Only consider visible toasts
            .filter((_, i) => i >= TOAST_LIMIT) // Is toast index over limit
            .forEach((t) => toast.dismiss(t.id)) // Dismiss – Use toast.remove(t.id) removal without animation
    }, [toasts])

    // 判斷學年度
    useEffect(() => {
        Object.keys(Cookie.get()).forEach((cookieName) => {
            Cookie.remove(cookieName)
        })
        const year = new Date().getFullYear()
        const month = new Date().getMonth() + 1
        console.log("year", year)
        console.log("month", month)
        if (month >= 8) {
            Cookie.set("cookie_year", (year - 1911).toString(), { expires: 7 })
            console.log("cookie_year", year - 1911)
        } else {
            Cookie.set("cookie_year", (year - 1912).toString(), { expires: 7 })
            console.log("cookie_year", year - 1912)
        }
        // 判斷上下學期
        // year 8 ~ 12 || year+1 1 ~ 2
        // year 2 ~ 7
        if (month >= 8 || month <= 2) {
            Cookie.set("cookie_sem", "1", { expires: 7 })
            console.log("cookie_sem", 1)
        } else {
            Cookie.set("cookie_sem", "2", { expires: 7 })
            console.log("cookie_sem", 2)
        }
    }, [])

    const fetchLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if ((document.querySelector("#studentID") as HTMLInputElement)?.value === "") {
            toast.error("請輸入學號")
            return
        }

        if ((document.getElementById("authcode") as HTMLInputElement)?.value === "") {
            toast.error("請輸入授權碼")
            return
        }

        const toastId = toast.loading("登入中...")
        const status = await signIn("credentials", {
            redirect: false,
            studentID: (document.getElementById("studentID") as HTMLInputElement)?.value,
            password: (document.getElementById("authcode") as HTMLInputElement)?.value,
        })

        if (status?.error) {
            toast.error("授權碼錯誤", { id: toastId })
        } else {
            toast.success("登入成功", { id: toastId })
            // 延遲1秒跳轉
            setTimeout(() => {
                window.location.href = searchParams.get("callbackUrl") ?? "/user"
            }, 1000)
        }
    }

    return (
        <div className='absolute left-0 top-0 w-full p-4 flex h-full items-center justify-center'>
            <div className='rounded-xl bg-white/30 backdrop-blur-md saturate-100 transition-colors duration-500 p-4 shadow-md'>
                <div className='pb-2 text-center'>
                    <Logo className='h-10 w-full md:hidden' />
                </div>
                <form onSubmit={(e) => fetchLogin(e)}>
                    <div className='p-2'>
                        <div className='p-2'>學號</div>
                        <input
                            type='text'
                            id='studentID'
                            className='box-border w-full rounded-full border border-gray-400 bg-white p-1 px-4 text-xl hover:border-gray-600 focus-visible:outline-none'
                        />
                    </div>
                    <div className='p-2'>
                        <div className='p-2'>
                            授權碼
                            <span className='text-xs text-gray-400 ml-2'>
                                一般人請使用 Google 登入
                            </span>
                        </div>
                        <input
                            type='text'
                            id='authcode'
                            className='box-border w-full rounded-full border border-gray-400 bg-white p-1 px-4 text-xl hover:border-gray-600 focus-visible:outline-none'
                        />
                    </div>
                    <div className='p-2'>
                        <input
                            type='submit'
                            className='w-full cursor-pointer rounded-md bg-orange-300 py-2 hover:bg-orange-400'
                            value='登入'
                        />
                    </div>
                </form>
                <div className='p-2'>
                    <button
                        onClick={() => signIn("google")}
                        className='flex w-full cursor-pointer items-center justify-center rounded-md bg-orange-300 py-2 hover:bg-orange-400'
                    >
                        <IconBrandGoogle size={20} className='mx-1' />
                        使用 Google 登入
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Form
