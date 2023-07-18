"use client"
import { useEffect, useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import {
    IconCalendarTime,
    IconCalendarOff,
    IconDownload,
    IconPaperclip,
    IconLink,
    IconX,
} from "@tabler/icons-react"
import { Post } from "@/types"

const PostCP = ({ id, trigger }: { id: string; trigger: React.ReactNode }) => {
    const [data, setData] = useState<Post>()
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            if (!open) return
            const res = await fetch(`/api/post?type=one&id=${id}`)
            const json = await res.json()
            setData(json)
        }
        fetchData()
    }, [open])

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger className='w-full'>{trigger}</Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className='fixed inset-0 bg-[rgba(0,0,0,.5)] backdrop-blur-sm data-[state=open]:animate-overlayShow' />
                <Dialog.Content className='fixed left-1/2 top-1/2 max-h-[85vh] w-[95vw] max-w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-4 shadow-lg focus:outline-none data-[state=open]:animate-contentShow'>
                    {data ? (
                        <>
                            <Dialog.Close className='absolute right-0 flex items-center justify-end pr-4'>
                                <IconX size={24} />
                            </Dialog.Close>
                            <Dialog.Title asChild>
                                <div className='mb-1 flex items-center justify-center'>
                                    <div className='pr-5 font-bold md:text-xl'>{data.title}</div>
                                </div>
                            </Dialog.Title>
                            <div className='flex items-center justify-between'>
                                <div className=''>{data.unit}</div>
                                <div className='rounded-md px-1 shadow-md'>{data.category}</div>
                            </div>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center'>
                                    <IconCalendarTime size={20} />
                                    {data.date}
                                </div>
                                <div className='flex items-center'>
                                    <IconCalendarOff size={20} />
                                    {data.deadline}
                                </div>
                            </div>
                            <div className='h-[50vh] w-full overflow-y-auto rounded-l-xl border'>
                                <div className='whitespace-pre-line break-words p-1'>
                                    {data.content}
                                </div>
                            </div>
                            <div className=''>
                                {data.file.length > 0 ? (
                                    <>
                                        {data.file.map((item) => (
                                            <div key={item.title} className='flex items-center'>
                                                <IconPaperclip size={20} />
                                                {item.title}
                                                <a
                                                    href={item.link}
                                                    target='_blank'
                                                    rel='noreferrer'
                                                    className='p-1'
                                                >
                                                    <IconDownload className='rounded-md bg-main-color p-1' />
                                                </a>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <div className=''>沒有附件</div>
                                )}
                                {data.link ? (
                                    <div className='flex items-center'>
                                        <IconLink size={20} />
                                        <a
                                            href={data.link}
                                            target='_blank'
                                            rel='noreferrer'
                                            className='text-blue-500'
                                        >
                                            點及此處前往
                                        </a>
                                    </div>
                                ) : (
                                    <div className=''>沒有連結</div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className=''>沒有公告</div>
                        </>
                    )}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

export default PostCP
