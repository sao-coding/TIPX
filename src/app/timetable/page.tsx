"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Row from "@/components/timetable/row"
import { TimeTable, OutTimeTable } from "@/types"
import Cookie from "js-cookie"
import { Cookies } from "@/types/cookies"
import { cookies } from "next/dist/client/components/headers"

const TimeTablePage = () => {
    const [data, setData] = useState<OutTimeTable>()
    const [cookie, setCookie] = useState("")
    const router = useRouter()

    useEffect(() => {
        const cookie = Cookie.get()
        console.log(cookie)
        // cookie = {} 跳轉到登入頁面
        if (Object.keys(cookie).length === 0 && cookie.constructor === Object) {
            router.push("/login")
        }
    } ,[])

    const cookiesConvert = (cookie: Cookies) => {
        let res = ""
        res += "cookie_userid=" + cookie.cookie_userid + ";"
        res += "cookie_year=" + cookie.cookie_year + ";"
        res += "cookie_sem=" + cookie.cookie_sem + ";"
        return res
    }
    

    useEffect(() => {
        const fetchDate = async () => {
            const res = await fetch("/api/timetable", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "cookie": cookiesConvert(Cookie.get() as Cookies)
                }
            })
            const data = await res.json()
            // const s = {
            //     "星期一": [
            //         [
            //             "D932103",
            //             "體育-羽球",
            //             "一12A600",
            //             "李文娟"
            //         ],
            //         [
            //             "D932103",
            //             "體育-羽球",
            //             "一12A600",
            //             "李文娟"
            //         ]
            //     ]
            // }
            // const d = {
            //     week: ["星期一", "星期二", "星期三", "星期四", "星期五"],
            //     timetable: [[
            //         ["D932103", "體育-羽球", "一12A600", "李文娟"],
            //         ["D932103", "體育-羽球", "一12A600", "李文娟"]]
            //     ],
            // }
            // const week = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"]
            let timeTable: OutTimeTable = {
                week: [],
                timetable: [],
            }
            for (let i = 0; i < 7; i++) {
                timeTable.week.push(Object.keys(data)[i])
            }

            for (let i = 0; i < 14; i++) {
                timeTable.timetable.push([])
                for (let j = 0; j < 7; j++) {
                    timeTable.timetable[i].push(data[timeTable.week[j]][i])
                }
            }

            setData(timeTable)
            console.log(timeTable)
        }
        fetchDate()
    }, [])

    return (
        <>
            <div className='bg-white shadow-md rounded-md p-4 w-full'>
                {/* <iframe srcDoc={html} className='w-full h-screen'></iframe> */}
                <div className='md:flex md:justify-center md:items-center overflow-x-auto rounded-md'>
                    <div className='table rounded-md overflow-hidden'>
                        <div className='table-header-group'>
                            {/* <div className='table-cell bg-main-color-2 p-2 whitespace-nowrap text-center'>
                                節次
                            </div> */}
                            {data?.week.map((item, index) => (
                                <div
                                    className='table-cell bg-main-color-2 p-2 whitespace-nowrap text-center'
                                    key={index}
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                        <div className='table-row-group'>
                            <Row data={data as OutTimeTable} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TimeTablePage
