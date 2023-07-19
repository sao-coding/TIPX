"use client"
import { useCallback, useEffect, useState } from "react"
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
import { useRouter } from "next/navigation"

const PostModal = ({ params }: { params: { id: string } }) => {
    const id = params.id
    const [data, setData] = useState<Post>()
    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            if (!open) return
            const res = await fetch(`/api/post?type=one&id=${id}`)
            const json = await res.json()
            setData(json)
        }
        fetchData()
    }, [id])

    const dismiss = useCallback(() => {
        router.back()
    }, [router])

    return (
        <Dialog.Root defaultOpen onOpenChange={(open) => !open && dismiss()}>
            <Dialog.Portal>
                <Dialog.Overlay className='fixed inset-0 z-10 bg-[rgba(0,0,0,.5)] backdrop-blur-sm data-[state=open]:animate-overlayShow' />
                <Dialog.Content className='fixed left-1/2 top-1/2 z-10 max-h-[100vh] w-[95vw] max-w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-4 shadow-lg focus:outline-none data-[state=open]:animate-contentShow'>
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
                            <div className='h-[50vh] w-full overflow-y-auto rounded-xl border'>
                                <div className='whitespace-pre-line break-words p-1'>
                                    {data.content}
                                </div>
                            </div>
                            <div className='mt-1 h-[10vh] overflow-y-auto rounded-xl border'>
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

export default PostModal
