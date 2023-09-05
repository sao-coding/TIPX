import React, { useState, useEffect } from "react"
import clsx from "clsx"
import {
    IconCalendarTime,
    IconCalendarOff,
    IconPaperclip,
    IconUpload,
    IconSlash,
    IconDownload,
    IconDownloadOff,
    IconX,
} from "@tabler/icons-react"
import * as Dialog from "@radix-ui/react-dialog"
import toast, { useToasterStore } from "react-hot-toast"
import { FileUploader } from "react-drag-drop-files"
import { motion } from "framer-motion"
import { HwList } from "@/types"

const Card = ({ course, data, studentID }: { course: string; data: HwList; studentID: string }) => {
    const [file, setFile] = useState<File | null>(null)
    const [onDrop, setOnDrop] = useState(false)
    const { toasts } = useToasterStore()

    const TOAST_LIMIT = 2
    // Enforce Limit
    useEffect(() => {
        toasts
            .filter((t) => t.visible) // Only consider visible toasts
            .filter((_, i) => i >= TOAST_LIMIT) // Is toast index over limit
            .forEach((t) => toast.dismiss(t.id)) // Dismiss – Use toast.remove(t.id) removal without animation
    }, [toasts])

    const trackDownloadFile = (course: string, title: string) => {
        return `${studentID} - ${course} - ${title}`
    }

    const trackDownloadHw = (course: string, title: string) => {
        return `${studentID} - ${course} - ${title}`
    }

    const trackUploadHw = (course: string, title: string) => {
        return `${studentID} - ${course} - ${title}`
    }

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

    const upload = async (event: React.FormEvent<HTMLFormElement>, id: string) => {
        event.preventDefault()
        const toastId = toast.loading("上傳中...")
        const bodyContent = new FormData()
        bodyContent.append("id", id)
        bodyContent.append("userfile", file as Blob)

        const res = await fetch("/api/hw", {
            method: "POST",
            body: bodyContent,
        })

        const json = await res.json()
        if (json.status === "success") {
            toast.success("上傳成功", { id: toastId })
            umami.track("作業上傳", {
                data: trackUploadHw(course, data.title),
            })
        } else if (json.status === "error") {
            toast.error(json.message, { id: toastId })
        } else {
            toast.error("上傳失敗", { id: toastId })
        }
    }

    const handleFileChange = (file: File) => {
        setFile(file)
    }

    return (
        <div className='relative mb-2 w-full border-b'>
            <div
                className={clsx(
                    "absolute right-2 top-2 rounded-md p-1 text-white",
                    data.status === "已繳交" ? "bg-green-600" : "bg-red-600"
                )}
            >
                {data.status}
            </div>
            <div className='flex justify-between p-2'>
                <div>
                    <div className='text-lg font-bold'>{data.title}</div>
                    <div className='flex items-center text-sm text-neutral-500 space-x-1'>
                        <IconCalendarTime size={20} />
                        <div>{formatTime(data.start)}</div>
                    </div>
                    <div className='flex items-center text-sm text-neutral-500 space-x-1'>
                        <IconCalendarOff size={20} />
                        <div>{formatTime(data.end)}</div>
                    </div>
                    <div className='flex items-center text-neutral-500 space-x-1'>
                        <IconPaperclip size={20} />
                        <div>附件</div>
                        <button
                            className={clsx(
                                "rounded-md bg-main-color-3 p-1 text-white hover:bg-white hover:text-main-color-3",
                                data.file === "" ? "cursor-not-allowed" : ""
                            )}
                            disabled={data.file === ""}
                            onClick={() => {
                                if (data.file !== "") {
                                    umami.track("附件下載", {
                                        data: trackDownloadFile(course, data.title),
                                    })
                                    download(data.file)
                                }
                            }}
                        >
                            {data.file === "" ? (
                                <IconDownloadOff size={20} />
                            ) : (
                                <IconDownload size={20} />
                            )}
                        </button>
                    </div>
                </div>
                <div className='flex items-end space-x-2 sm'>
                    <Dialog.Root>
                        <Dialog.Trigger
                            className={clsx(
                                "rounded-md bg-main-color-3 p-1 text-white hover:bg-white hover:text-main-color-3 relative",
                                data.upload === "" ? "cursor-not-allowed" : ""
                            )}
                            disabled={data.upload === ""}
                        >
                            <IconUpload />
                            {data.upload === "" && (
                                <IconSlash
                                    className='absolute top-0 left-0 w-full h-full rotate-[100deg] stroke-[1.4]'
                                    size={20}
                                />
                            )}
                        </Dialog.Trigger>
                        <Dialog.Portal>
                            <Dialog.Overlay className='fixed inset-0 z-10 bg-[rgba(0,0,0,.5)] backdrop-blur-sm data-[state=open]:animate-overlayShow' />
                            <Dialog.Content asChild>
                                <motion.div
                                    className='fixed left-1/2 top-1/2 z-10 max-h-[85vh] w-[85vw] max-w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-4 shadow-lg focus:outline-none data-[state=open]:animate-contentShow'
                                    initial={{ opacity: 0, scale: 0.9, y: "-50%", x: "-50%" }}
                                    animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
                                >
                                    <Dialog.Close className='absolute right-4 top-4 text-gray-400 hover:text-gray-500'>
                                        <IconX />
                                    </Dialog.Close>
                                    <form
                                        name='作業上傳'
                                        encType='multipart/form-data'
                                        className='h-full p-4 flex flex-col space-y-2 items-center'
                                        onSubmit={(event) => upload(event, data.upload)}
                                    >
                                        <h1 className='text-xl self-start'>作業上傳</h1>
                                        <h2 className='text-lg font-bold'>{data.title}</h2>
                                        <FileUploader
                                            handleChange={(file: File) => handleFileChange(file)}
                                            onDraggingStateChange={(dragging: boolean) =>
                                                setOnDrop(dragging)
                                            }
                                            onTypeError={() => toast.error("不支援的檔案類型")}
                                            name='userfile'
                                            types={[
                                                "doc",
                                                "xls",
                                                "txt",
                                                "ppt",
                                                "docx",
                                                "xlsx",
                                                "pptx",
                                                "accdb",
                                                "pdf",
                                                "xlsm",
                                                "zip",
                                                "rar",
                                            ]}
                                            hoverTitle='拖曳檔案至此'
                                            classes='w-full h-full block focus:outline-none focus-within:!outline-none'
                                        >
                                            <div className='w-full h-20 border-2 border-dashed rounded-lg focus:outline-none'>
                                                <div className='flex flex-col h-full w-full items-center justify-center space-y-1'>
                                                    {onDrop ? null : (
                                                        <>
                                                            <IconUpload size={40} />
                                                            <div className='flex items-center'>
                                                                <IconPaperclip size={20} />
                                                                {file ? (
                                                                    <div>
                                                                        {file.name.length > 11
                                                                            ? file.name.slice(
                                                                                  0,
                                                                                  11
                                                                              ) +
                                                                              "..." +
                                                                              file.name.slice(
                                                                                  file.name.lastIndexOf(
                                                                                      "."
                                                                                  )
                                                                              )
                                                                            : file.name}
                                                                    </div>
                                                                ) : (
                                                                    <div>上傳 或 拖曳檔案至此</div>
                                                                )}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </FileUploader>
                                        <input
                                            type='submit'
                                            value='上傳檔案'
                                            className='bg-main-color-3 p-1 rounded-md text-white hover:bg-[#82453a] w-full'
                                        />
                                    </form>
                                </motion.div>
                            </Dialog.Content>
                        </Dialog.Portal>
                    </Dialog.Root>
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
                                    data: trackDownloadHw(course, data.title),
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
    )
}

export default Card
