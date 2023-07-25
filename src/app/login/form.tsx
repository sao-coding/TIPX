"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { IconBrandGoogle } from "@tabler/icons-react"
import { signIn } from "next-auth/react"
import toast, { useToasterStore } from "react-hot-toast"
import Cookie from "js-cookie"
import LoginSelect from "@/components/login/select"
import iconv from "iconv-lite"
import Logo from "@/components/logo"

const Form = () => {
    const [deptValue, setDeptValue] = useState("1")
    const [esValue, setEsValue] = useState("日四技")
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

    // 部別資料
    const dept = [
        { name: "日間部", value: "1" },
        { name: "進修部", value: "2" },
        { name: "進修學院", value: "3" },
    ]

    // 學制資料 eductional system
    const es = [
        { name: "日四技", value: "日四技" },
        { name: "進四技", value: "進四技" },
        { name: "日二技", value: "日二技" },
        { name: "進二技", value: "進二技" },
    ]

    // 判斷學年度
    useEffect(() => {
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

    const deptValueChange = (value: string) => {
        setDeptValue(value)
    }

    const esValueChange = (value: string) => {
        setEsValue(value)
    }

    const fetchLogin = async () => {
        if ((document.getElementById("username") as HTMLInputElement)?.value === "") {
            console.log(
                "username",
                (document.getElementById("username") as HTMLInputElement)?.value
            )
            toast.error("請輸入學號")
            return
        }

        if ((document.getElementById("authcode") as HTMLInputElement)?.value === "") {
            toast.error("請輸入授權碼")
            return
        }

        Cookie.set(
            "cookie_userid",
            (document.getElementById("username") as HTMLInputElement)?.value,
            { expires: 7 }
        )

        Cookie.set("cookie_dept", deptValue, { expires: 7 })

        Cookie.set(
            "cookie_es",
            iconv
                .encode(esValue, "big5")
                .toString("hex")
                .replace(/(.{2})/g, "%$1"),
            { expires: 7 }
        )

        const res = await fetch("/api/authorize", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: (document.getElementById("authcode") as HTMLInputElement)?.value,
            }),
        })

        // 跳轉頁面
        if (!res.ok) {
            toast.error("授權碼錯誤")
        } else {
            toast.success("登入成功")
            const data = await res.json()
            Cookie.set("token", data.token, { expires: 7 })
            // 延遲1秒跳轉
            setTimeout(() => {
                window.location.href = searchParams.get("callbackUrl") ?? "/"
            }, 1000)
        }
    }

    return (
        <>
            <div className='absolute left-0 top-0 h-full w-full p-4'>
                <div className='flex h-full items-center justify-center'>
                    <div className='rounded-md bg-white p-4 shadow-md'>
                        <div className='pb-4 text-center'>
                            <Logo className='h-10 w-full' />
                        </div>
                        <div className='p-2'>
                            <div className='p-2'>學號</div>
                            <input
                                type='text'
                                id='username'
                                className='box-border w-full rounded-full border border-gray-400 bg-white p-1 px-4 text-xl hover:border-gray-600 focus-visible:outline-none'
                            />
                        </div>
                        <div className='p-2'>
                            <div className='p-2'>授權碼</div>
                            <input
                                type='text'
                                id='authcode'
                                className='box-border w-full rounded-full border border-gray-400 bg-white p-1 px-4 text-xl hover:border-gray-600 focus-visible:outline-none'
                            />
                        </div>
                        <div className='p-2'>
                            <div className='p-2'>部別</div>
                            <LoginSelect data={dept} setValue={deptValueChange} />
                        </div>
                        <div className='p-2'>
                            <div className='p-2'>學制</div>
                            <LoginSelect data={es} setValue={esValueChange} />
                        </div>
                        <div className='p-2'>
                            <button
                                className='w-full cursor-pointer rounded-md bg-orange-300 py-2 hover:bg-orange-400'
                                onClick={fetchLogin}
                            >
                                登入
                            </button>
                        </div>
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
            </div>
        </>
    )
}

export default Form
