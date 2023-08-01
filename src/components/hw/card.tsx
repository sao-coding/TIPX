import clsx from "clsx"
import {
    IconCalendarTime,
    IconCalendarOff,
    IconPaperclip,
    IconUpload,
    IconDownload,
    IconDownloadOff,
} from "@tabler/icons-react"
import { HwList } from "@/types"

const Card = ({ course, data }: { course: string; data: HwList }) => {
    const formatTime = (time: string) => {
        // 202306151300
        const year = time.slice(0, 4)
        const month = time.slice(4, 6)
        const day = time.slice(6, 8)
        const hour = time.slice(8, 10)
        const min = time.slice(10, 12)
        return `${year}/${month}/${day} ${hour}:${min}`
    }

    const download = (id: string) => {
        const hw = `https://netinfo.takming.edu.tw/tip/download_file_2.php?filename=${id}`
        window.location.href = hw
    }

    return (
        <>
            <div className='relative mb-2 w-full rounded-md bg-main-color-1 shadow-md'>
                <div
                    className={clsx(
                        "absolute right-2 top-2 rounded-md p-1 text-white",
                        data.status === "已繳交" ? "bg-green-600" : "bg-red-600"
                    )}
                >
                    {data.status}
                </div>
                <div className='flex justify-between p-2'>
                    <div className=''>
                        <div className='text-lg font-bold'>{data.title}</div>
                        <div className='flex items-center text-sm text-neutral-500'>
                            <IconCalendarTime size={20} />
                            <div className=''>{formatTime(data.start)}</div>
                        </div>
                        <div className='flex items-center text-sm text-neutral-500'>
                            <IconCalendarOff size={20} />
                            <div className=''>{formatTime(data.end)}</div>
                        </div>
                        <div className='flex items-center text-neutral-500'>
                            <IconPaperclip size={20} />
                            附件
                            <button
                                className='ml-1 rounded-md bg-main-color-3 p-1 text-white hover:bg-white hover:text-main-color-3'
                                onClick={() => download(data.file)}
                            >
                                <IconDownload size={20} />
                            </button>
                        </div>
                    </div>
                    <div className='flex items-end'>
                        <button
                            className='mr-2 rounded-md bg-main-color-3 p-1 text-white hover:bg-white hover:text-main-color-3'
                            disabled={data.upload_status}
                        >
                            <IconUpload />
                        </button>
                        {/* 如果未繳交 cursor-not-allowed */}
                        <button
                            className={clsx(
                                "rounded-md bg-main-color-3 p-1 text-white hover:bg-white hover:text-main-color-3",
                                data.download === "" ? "cursor-not-allowed" : ""
                            )}
                            disabled={data.download === ""}
                            onClick={() => {
                                if (data.download !== "") {
                                    umami.track("作業下載", {
                                        course: course,
                                        hw: data.title,
                                        url: data.download,
                                    })
                                    download(data.download)
                                }
                            }}
                        >
                            {data.download === "" ? <IconDownloadOff /> : <IconDownload />}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Card
