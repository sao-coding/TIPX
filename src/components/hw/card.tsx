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
const Card = ({ data }: { data: HwList }) => {
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
            <div className='bg-main-color shadow-md w-full rounded-md relative mb-2'>
                <div
                    className={clsx(
                        "absolute top-2 right-2 p-1 rounded-md text-white",
                        data.status === "已繳交" ? "bg-green-600" : "bg-red-600"
                    )}
                >
                    {data.status}
                </div>
                <div className='flex p-2 justify-between'>
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
                                className='bg-main-color-3 p-1 rounded-md ml-1 hover:bg-main-color-4 text-white'
                                onClick={() => download(data.file)}
                            >
                                <IconDownload size={20} />
                            </button>
                        </div>
                    </div>
                    <div className='flex items-end'>
                        <button
                            className='bg-main-color-3 p-1 rounded-md mr-2 hover:bg-main-color-4 text-white'
                            disabled={data.upload_status}
                        >
                            <IconUpload />
                        </button>
                        {/* 如果未繳交 cursor-not-allowed */}
                        <button
                            className={clsx(
                                "bg-main-color-3 p-1 rounded-md hover:bg-main-color-4 text-white",
                                data.download === "" ? "cursor-not-allowed" : ""
                            )}
                            disabled={data.download === ""}
                            onClick={() => {
                                if (data.download !== "") {
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
