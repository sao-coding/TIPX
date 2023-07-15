"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Cookie from "js-cookie"
import LoginSelect from "@/components/login/select"
import iconv from "iconv-lite"

const LoginPage = () => {
    const [deptValue, setDeptValue] = useState("1")
    const [esValue, setEsValue] = useState("日四技")
    const [cookie, setCookie] = useState([])
    const router = useRouter()

    // 部別資料
    const dept = [
        { name: "日間部", value: "1" },
        { name: "進修部", value: "2" },
        { name: "進修學院", value: "3" },
        { name: "研究所", value: "4" },
        { name: "碩士在職專班", value: "5" },
        { name: "碩士在職專班(週末)", value: "6" },
        { name: "碩士在職專班(網路)", value: "7" },
        { name: "碩士在職專班(高雄)", value: "8" },
        { name: "碩士在職專班(台中)", value: "9" },
        { name: "碩士在職專班(台南)", value: "10" },
        { name: "碩士在職專班(台北)", value: "11" },
        { name: "碩士在職專班(桃園)", value: "12" },
        { name: "碩士在職專班(新竹)", value: "13" },
        { name: "碩士在職專班(嘉義)", value: "14" },
        { name: "碩士在職專班(彰化)", value: "15" },
        { name: "碩士在職專班(屏東)", value: "16" },
        { name: "碩士在職專班(苗栗)", value: "17" },
        { name: "碩士在職專班(南投)", value: "18" },
        { name: "碩士在職專班(宜蘭)", value: "19" },
        { name: "碩士在職專班(花蓮)", value: "20" },
        { name: "碩士在職專班(金門)", value: "21" },
        { name: "碩士在職專班(澎湖)", value: "22" },
        { name: "碩士在職專班(馬祖)", value: "23" },
        { name: "碩士在職專班(雲林)", value: "24" },
        { name: "碩士在職專班(基隆)", value: "25" },
        { name: "碩士在職專班(新北)", value: "26" },
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
        if ((document.getElementById("username") as HTMLInputElement)?.value === "") {
            alert("請輸入學號")
            return
        }
        Cookie.set(
            "cookie_userid",
            (document.getElementById("username") as HTMLInputElement)?.value
        )
        Cookie.set("cookie_dept", deptValue)
        Cookie.set(
            "cookie_es",
            iconv
                .encode(esValue, "big5")
                .toString("hex")
                .replace(/(.{2})/g, "%$1")
        )
        router.push("/")
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
