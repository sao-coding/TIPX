import { cookies } from "next/headers"
import { OutTimeTable } from "@/types"
import { site } from "@/config/site"

const getData = async () => {
    const res = await fetch(`${site.url}/api/timetable`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies().get("token")?.value}`,
            Cookie: cookies().toString(),
        },
    })

    if (!res.ok) {
        throw new Error("獲取資料失敗")
    }

    const data = await res.json()

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

    return timeTable
}

const TimeTablePage = async () => {
    const data = await getData()

    return (
        <>
            <div className='w-full rounded-md bg-white p-2 shadow-md md:p-4'>
                <div className='overflow-x-auto rounded-md md:flex md:items-center md:justify-center'>
                    <div className='table overflow-hidden rounded-md'>
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
                                                className='relative table-cell border-r border-t border-main-color-3 bg-main-color-1 p-2 pb-6 first:border-l-0 last:border-r-0'
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
                    </div>
                </div>
            </div>
        </>
    )
}

export default TimeTablePage
