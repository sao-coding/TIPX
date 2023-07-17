"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { OutTimeTable } from "@/types"
import Cookie from "js-cookie"

const Timetable = () => {
    const [data, setData] = useState<OutTimeTable>({
        week: [],
        timetable: [],
    })
    const router = useRouter()

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
            <div className='table-header-group'>
                {data.week.length > 0 &&
                    data.week.map((item, index) => (
                        <div
                            className='table-cell whitespace-nowrap bg-main-color-2 p-2 text-center'
                            key={index}
                        >
                            {item}
                        </div>
                    ))}
            </div>
            <div className='table-row-group'>
                {Array.from(Array(14).keys()).map((i) => (
                    <div className='table-row' key={i}>
                        {data.timetable.length > 0 &&
                            data.timetable[i].map((item, index) => (
                                <div
                                    className='relative table-cell border-r border-t border-main-color-3 bg-main-color p-2 pb-6 first:border-l-0 last:border-r-0'
                                    key={index}
                                >
                                    <div className='absolute bottom-1 right-1 table-cell whitespace-nowrap rounded-md bg-[#ffffff6c] px-1 text-center'>
                                        <div className=''>{i + 1}</div>
                                    </div>

                                    {item.map((item, index) => (
                                        <div className='text-center' key={index}>
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            ))}
                    </div>
                ))}
            </div>
        </>
    )
}
export default Timetable
