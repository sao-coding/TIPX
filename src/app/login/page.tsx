"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Cookie from "js-cookie"
import LoginSelect from "@/components/login/select"
import iconv from "iconv-lite"

const LoginPage = () => {
    const [deptValue, setDeptValue] = useState("1")
    const [esValue, setEsValue] = useState("日四技")
    const router = useRouter()
    const searchParams = useSearchParams()

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
            Cookie.set("cookie_year", (year - 1911).toString())
            console.log("cookie_year", year - 1911)
        } else {
            Cookie.set("cookie_year", (year - 1912).toString())
            console.log("cookie_year", year - 1912)
        }
        // 判斷上下學期
        // year 8 ~ 12 || year+1 1 ~ 2
        // year 2 ~ 7
        if (month >= 8 || month <= 2) {
            Cookie.set("cookie_sem", "1")
            console.log("cookie_sem", 1)
        } else {
            Cookie.set("cookie_sem", "2")
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
        const res = await fetch("/api/authorize", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: (document.getElementById("authcode") as HTMLInputElement)?.value,
            }),
        })

        const data = await res.json()

        if ((document.getElementById("username") as HTMLInputElement)?.value === "") {
            alert("請輸入學號")
            return
        }

        if ((document.getElementById("authcode") as HTMLInputElement)?.value === "") {
            alert("請輸入授權碼")
            return
        }

        Cookie.set(
            "cookie_userid",
            (document.getElementById("username") as HTMLInputElement)?.value
        )

        Cookie.set("token", data.token)

        Cookie.set("cookie_dept", deptValue)

        Cookie.set(
            "cookie_es",
            iconv
                .encode(esValue, "big5")
                .toString("hex")
                .replace(/(.{2})/g, "%$1")
        )

        console.log("url", searchParams.get("redirect") ?? "/")
        // 跳轉頁面

        // window.location.href = searchParams.get("redirect") ?? "/"
    }

    return (
        <>
            <div className='absolute left-0 top-0 h-full w-full p-4'>
                <div className='flex h-full items-center justify-center'>
                    <div className='rounded-md bg-white p-4 shadow-md'>
                        <div className='pb-4 text-center text-lg font-bold'>TIP-X</div>
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
                                className='w-full rounded-md bg-orange-300 py-2 hover:bg-orange-400'
                                onClick={fetchLogin}
                            >
                                登入
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoginPage
