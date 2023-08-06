"use client"
import { useCallback, useRef } from "react"
import { IconShare2 } from "@tabler/icons-react"
import Cookie from "js-cookie"
import { OutTimeTable } from "@/types"
import { site } from "@/config/site"
import * as htmlToImage from "html-to-image"
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
    // const data = await getData()

    const { isLoading, isError, data } = useQuery<OutTimeTable>({
        queryKey: ["timetable"],
        queryFn: async () => {
            const res = await fetch(`${site.url}/api/timetable`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Cookie.get("token")}`,
                },
            })

            // if (!res.ok) {
            //     throw new Error("獲取資料失敗")
            // }

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
        },
    })

    const ref = useRef<HTMLDivElement>(null)

    const saveImage = useCallback(() => {
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
            <div className='w-full rounded-md bg-white p-2 shadow-md md:p-4'>
                <div className='relative mb-2 rounded-xl border bg-white shadow-md'>
                    <div className='text-center text-2xl font-bold'>課表</div>
                    <IconShare2
                        size={24}
                        className='absolute right-0 top-2/4 mr-2 -translate-y-2/4'
                        onClick={() => {
                            toast.loading("圖片生成中...")
                            saveImage()
                        }}
                    />
                </div>
                <div className='overflow-x-auto rounded-md md:flex md:items-center md:justify-center'>
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
                    )}
                </div>
            </div>
        </>
    )
}

export default TimeTablePage
