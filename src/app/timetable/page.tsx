"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Row from "@/components/timetable/row"
import { OutTimeTable } from "@/types"
import Cookie from "js-cookie"

const TimeTablePage = () => {
    const [data, setData] = useState<OutTimeTable>()
    const router = useRouter()

    useEffect(() => {
        const cookie = Cookie.get("token")
        if (!cookie) {
            router.push("/login")
        }
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch("/api/timetable", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + Cookie.get("token"),
                },
            })
            const data = await res.json()

            if (data.error === "Unauthorized") {
                router.push("/login")
            }
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

            if (!data.error) {
                for (let i = 0; i < 7; i++) {
                    timeTable.week.push(Object.keys(data)[i])
                }

                for (let i = 0; i < 14; i++) {
                    timeTable.timetable.push([])
                    for (let j = 0; j < 7; j++) {
                        timeTable.timetable[i].push(data[timeTable.week[j]][i])
                    }
                }
            }

            setData(timeTable)
            console.log(timeTable)
        }
        fetchData()
    }, [])

    return (
        <>
            <div className='w-full rounded-md bg-white p-4 shadow-md'>
                {/* <iframe srcDoc={html} className='w-full h-screen'></iframe> */}
                <div className='overflow-x-auto rounded-md md:flex md:items-center md:justify-center'>
                    <div className='table overflow-hidden rounded-md'>
                        <div className='table-header-group'>
                            {/* <div className='table-cell bg-main-color-2 p-2 whitespace-nowrap text-center'>
                                節次
                            </div> */}
                            {data?.week.map((item, index) => (
                                <div
                                    className='table-cell whitespace-nowrap bg-main-color-2 p-2 text-center'
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
