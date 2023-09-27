"use client"

import { useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import * as Dialog from "@radix-ui/react-dialog"
import {
    IconCalendarTime,
    IconCalendarOff,
    IconDownload,
    IconPaperclip,
    IconLink,
    IconX,
    IconExternalLink,
    IconShare2,
} from "@tabler/icons-react"
import { Post } from "@/types"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"
import { motion } from "framer-motion"

const PostModal = ({ params }: { params: { id: string } }) => {
    const id = params.id
    const router = useRouter()
    const path = usePathname()

    const { isLoading, isError, data } = useQuery<Post>({
        queryKey: ["post", id],
        queryFn: async () => {
            const res = await fetch(`/api/post?type=one&id=${id}`)
            const json = await res.json()
            if (!res.ok) throw new Error("沒有這篇公告")
            return json
        },
    })

    const dismiss = useCallback(() => {
        router.back()
    }, [router])

    const Share = (title: string, text: string, url: string) => {
        if (navigator.share) {
            navigator
                .share({
                    title: title,
                    text: title + "\n",
                    url: url,
                })
                .then(() => {
                    toast.success("分享成功")
                })
                .catch((error) => {
                    toast.error("分享失敗")
                    console.log(error)
                })
        } else {
            toast.error("Web Share API 不支援")
        }
    }

    return (
        <Dialog.Root defaultOpen onOpenChange={(open) => !open && dismiss()}>
            <Dialog.Portal>
                <Dialog.Overlay className='fixed inset-0 z-10 bg-[rgba(0,0,0,.5)] backdrop-blur-sm data-[state=open]:animate-overlayShow' />
                <Dialog.Content asChild>
                    <motion.div
                        className='md:overflow-hidden overflow-y-auto fixed left-1/2 top-1/2 z-10 md:max-h-[85vh] md:w-[95vw] md:max-w-[800px] -translate-x-1/2 -translate-y-1/2 md:rounded-lg md:bg-white md:p-4 px-4 pb-4 shadow-lg focus:outline-none data-[state=open]:animate-contentShow h-full w-full bg-slate-50'
                        initial={{ opacity: 0, scale: 0.9, y: "-50%", x: "-50%" }}
                        animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
                    >
                        {data && (
                            <>
                                <div className='flex items-center justify-between sticky left-0 top-0 md:static w-full md:bg-white bg-slate-50 py-3 md:border-b-0 border-b mb-2'>
                                    <Dialog.Title asChild>
                                        <div className='flex items-center justify-center'>
                                            <div className='text-center pr-4 font-bold md:text-xl'>
                                                {data.title}
                                            </div>
                                        </div>
                                    </Dialog.Title>
                                    <Dialog.Close className='self-start outline-none'>
                                        <IconX />
                                    </Dialog.Close>
                                </div>
                                <div className='flex flex-col space-y-1'>
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center'>
                                            <div className='mr-1'>{data.unit}</div>
                                            <div className='ml-1 text-blue-500'>
                                                <a href={`mailto:${data.publisher.email}`}>
                                                    {data.publisher.name}
                                                </a>
                                            </div>
                                        </div>
                                        <div className='rounded-md md:px-1 md:bg-main-color-1'>
                                            {data.category}
                                        </div>
                                    </div>
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center'>
                                            <IconCalendarTime size={20} />
                                            <div className='pl-1'>{data.date}</div>
                                        </div>
                                        <div className='flex items-center'>
                                            <IconCalendarOff size={20} />
                                            <div className='pl-1'>{data.deadline}</div>
                                        </div>
                                        <Link
                                            href={`/post/${id}`}
                                            target='_parent'
                                            className='hidden md:block'
                                        >
                                            <IconExternalLink />
                                        </Link>
                                    </div>
                                </div>
                                <div className='md:h-[50vh] w-full md:overflow-y-auto  rounded-xl md:border'>
                                    <div className='whitespace-pre-line break-words md:p-1'>
                                        {data.content}
                                    </div>
                                </div>
                                <div className='mt-1 md:h-[10vh] md:overflow-y-auto rounded-xl md:border p-1 border-2 md:border-solid border-dashed'>
                                    {data.file.length > 0 ? (
                                        <>
                                            {data.file.map((item) => (
                                                <div key={item.title} className='flex items-center'>
                                                    <IconPaperclip size={20} />
                                                    <div className='pl-1'>{item.title}</div>
                                                    <a
                                                        href={item.link}
                                                        target='_blank'
                                                        rel='noreferrer'
                                                        className='p-1'
                                                    >
                                                        <IconDownload className='rounded-md bg-main-color-1 p-1' />
                                                    </a>
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <div className='flex items-center'>
                                            <IconPaperclip size={20} />
                                            <div className='text-gray-500 pl-1'>沒有附件</div>
                                        </div>
                                    )}
                                    {data.link ? (
                                        <div className='flex items-center'>
                                            <IconLink size={20} />
                                            <a
                                                href={data.link}
                                                target='_blank'
                                                rel='noreferrer'
                                                className='text-blue-500 pl-1'
                                            >
                                                點及此處前往
                                            </a>
                                        </div>
                                    ) : (
                                        <div className='flex items-center'>
                                            <IconLink size={20} />
                                            <div className='text-gray-500 pl-1'>沒有連結</div>
                                        </div>
                                    )}
                                </div>
                                <div className='mt-2 w-full border-t pt-2'>
                                    <div className='flex items-center justify-end'>
                                        <button
                                            className='flex items-center rounded-md bg-main-color-1 px-1'
                                            onClick={() => {
                                                Share(data.title, data.content, path)
                                            }}
                                        >
                                            <IconShare2 />
                                            分享
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                        {isLoading && (
                            <div className='flex items-center justify-center'>
                                <div className='cat'>
                                    <div className='cat__body'></div>
                                    <div className='cat__body'></div>
                                    <div className='cat__tail'></div>
                                    <div className='cat__head'></div>
                                </div>
                            </div>
                        )}
                        {isError && (
                            <div className='flex items-center justify-center'>
                                <div className='text-red-500'>沒有這篇公告</div>
                            </div>
                        )}
                    </motion.div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

export default PostModal
