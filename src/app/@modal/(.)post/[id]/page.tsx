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
} from "@tabler/icons-react"
import { Post } from "@/types"
import { useRouter } from "next/navigation"
import Link from "next/link"
import "@/app/loaderCat.css"

const PostModal = ({ params }: { params: { id: string } }) => {
    const id = params.id
    const router = useRouter()

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

    return (
        <Dialog.Root defaultOpen onOpenChange={(open) => !open && dismiss()}>
            <Dialog.Portal>
                <Dialog.Overlay className='fixed inset-0 z-10 bg-[rgba(0,0,0,.5)] backdrop-blur-sm data-[state=open]:animate-overlayShow' />
                <Dialog.Content className='fixed left-1/2 top-1/2 z-10 max-h-[85vh] w-[95vw] max-w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-4 shadow-lg focus:outline-none data-[state=open]:animate-contentShow'>
                    {data && (
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
                                <div className='flex items-center'>
                                    <div className='mr-1'>{data.unit}</div>
                                    <div className='ml-1 text-blue-500'>
                                        <a href={`mailto:${data.publisher.email}`}>
                                            {data.publisher.name}
                                        </a>
                                    </div>
                                </div>
                                <div className='rounded-md px-1 shadow-md'>{data.category}</div>
                            </div>
                            <div className='my-1 flex items-center justify-between'>
                                <div className='flex items-center'>
                                    <IconCalendarTime size={20} />
                                    {data.date}
                                </div>
                                <div className='flex items-center'>
                                    <IconCalendarOff size={20} />
                                    {data.deadline}
                                </div>
                                <Link href={`/post/${id}`} target='_parent'>
                                    <IconExternalLink />
                                </Link>
                            </div>
                            <div className='h-[50vh] w-full overflow-y-auto rounded-xl border'>
                                <div className='whitespace-pre-line break-words p-1'>
                                    {data.content}
                                </div>
                            </div>
                            <div className='mt-1 h-[10vh] overflow-y-auto rounded-xl border p-1'>
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
                                                    <IconDownload className='rounded-md bg-main-color-1 p-1' />
                                                </a>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <div className='flex items-center'>
                                        <IconPaperclip size={20} />
                                        <div className='text-gray-500'>沒有附件</div>
                                    </div>
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
                                    <div className='flex items-center'>
                                        <IconLink size={20} />
                                        <div className='text-gray-500'>沒有連結</div>
                                    </div>
                                )}
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
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

export default PostModal
