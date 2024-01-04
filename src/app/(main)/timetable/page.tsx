"use client"
import { useCallback, useRef } from "react"
import Link from "next/link"
import { IconShare2 } from "@tabler/icons-react"
import Cookie from "js-cookie"
import { TimeTable, OutTimeTable } from "@/types"
import { site } from "@/config/site"
import { toPng } from "html-to-image"
import { useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"

// const getData = async () => {
//     const res = await fetch(`${site.url}/api/timetable`, {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${Cookie.get("token")}`,
//         },
//     })

//     if (!res.ok) {
//         throw new Error("獲取資料失敗")
//     }

//     const data = await res.json()

//     let timeTable: OutTimeTable = {
//         week: [],
//         timetable: [],
//     }

//     if (!data.error) {
//         for (let i = 0; i < 7; i++) {
//             timeTable.week.push(Object.keys(data)[i])
//         }

//         for (let i = 0; i < 14; i++) {
//             timeTable.timetable.push([])
//             for (let j = 0; j < 7; j++) {
//                 timeTable.timetable[i].push(data[timeTable.week[j]][i])
//             }
//         }
//     }

//     return timeTable
// }

const TimeTablePage = () => {
    const week = ["一", "二", "三", "四", "五", "六", "日"]

    const trackShareTimeTable = () => {
        const studentId = Cookie.get("cookie_userid") ?? ""
        const data = studentId
        return data
    }

    const { isLoading, data } = useQuery<OutTimeTable>({
        queryKey: ["timetable"],
        queryFn: async () => {
            const res = await fetch(`${site.url}/api/timetable?type=all`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            const data: TimeTable[] = await res.json()

            let timeTable: OutTimeTable = {
                week: [],
                timetable: [],
            }

            for (let i = 0; i < 7; i++) {
                timeTable.week.push(data[i].week)
            }

            for (let i = 0; i < 14; i++) {
                timeTable.timetable.push([])
                for (let j = 0; j < 7; j++) {
                    timeTable.timetable[i].push(data[j].timetable[i])
                }
            }

            console.log("timetable", timeTable)

            return timeTable
        },
    })

    const ref = useRef<HTMLDivElement>(null)

    const saveImage = useCallback(() => {
        toast.loading("圖片生成中...")
        if (ref.current === null) {
            return
        }

        toPng(ref.current, { cacheBust: true })
            .then((dataUrl) => {
                const file = dataUrlToFile(dataUrl, "課表.png")
                toast.remove()
                toast.success("圖片生成成功")
                Share("課表", "課表", file as File)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [ref])

    const dataUrlToFile = (dataUrl: string, filename: string) => {
        const arr = dataUrl.split(",")
        if (arr) {
            const mime = arr[0].match(/:(.*?);/)![1]
            const bstr = atob(arr[1])
            let n = bstr.length
            const u8arr = new Uint8Array(n)
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n)
            }
            return new File([u8arr], filename, { type: mime })
        }
    }

    const Share = (title: string, text: string, file: File) => {
        if (navigator.share) {
            navigator
                .share({
                    title: title,
                    text: text,
                    files: [file],
                })
                .then(() => {
                    console.log("已分享")
                })
                .catch(console.error)
        } else {
            console.log("Web Share API 不支援")
        }
    }

    return (
        <>
            <div className='w-full rounded-md px-2 pb-2 md:bg-white md:p-4 md:shadow-md mb-16 md:mb-0'>
                <div className='relative py-2 my-0.5 md:py-1 md:mb-2 md:rounded-xl md:border md:bg-white md:shadow-sm'>
                    <div className='text-center text-2xl font-bold'>課表</div>
                    <IconShare2
                        className='absolute right-0 top-2/4 mr-2 -translate-y-2/4'
                        onClick={() => {
                            saveImage()
                            umami.track("課表分享", {
                                data: trackShareTimeTable(),
                            })
                        }}
                    />
                </div>
                <div className='overflow-x-auto rounded-md md:flex md:items-center md:justify-center'>
                    {isLoading && (
                        <div
                            ref={ref}
                            className='table w-[960px] table-fixed overflow-hidden rounded-md'
                        >
                            <div className='table-header-group'>
                                {Array.from(Array(7).keys()).map((index) => (
                                    <div
                                        className='table-cell whitespace-nowrap bg-main-color-2 p-2 text-center'
                                        key={index}
                                    >
                                        星期{week[index]}
                                    </div>
                                ))}
                            </div>
                            <div className='table-row-group'>
                                {Array.from(Array(14).keys()).map((i) => (
                                    <div className='table-row' key={i}>
                                        {Array.from(Array(7).keys()).map((item, index) => (
                                            <div
                                                className='relative table-cell border-r border-t border-main-color-3 bg-main-color-1 p-2 pb-6 first:border-l-0 last:border-r-0'
                                                key={index}
                                            >
                                                <div className='absolute bottom-1 right-1 table-cell whitespace-nowrap rounded-md bg-[#ffffff6c] px-1 text-center'>
                                                    <div>{i + 1}</div>
                                                </div>

                                                <div className='h-24 text-center' key={index}>
                                                    載入中...
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {data && (
                        <div
                            ref={ref}
                            className='table w-[960px] table-fixed overflow-hidden rounded-md'
                        >
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
                                                        <div>{i + 1}</div>
                                                    </div>
                                                    <div className='text-center rounded-lg hover:bg-main-color-2'>
                                                        <Link
                                                            href={`/course/${item.id}?tab=規範`}
                                                            className='text-blue-500 border-b-2 border-main-color-2'
                                                        >
                                                            {item.course}
                                                        </Link>
                                                    </div>
                                                    <div className='text-center'>
                                                        {item.classroom}
                                                    </div>
                                                    <div className='text-center'>
                                                        {item.teacher}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default TimeTablePage
