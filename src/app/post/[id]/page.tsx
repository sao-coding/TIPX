"use client"
import { useQuery } from "@tanstack/react-query"
import {
    IconCalendarTime,
    IconCalendarOff,
    IconDownload,
    IconPaperclip,
    IconLink,
    IconShare2,
} from "@tabler/icons-react"
import { useRouter, usePathname } from "next/navigation"
import { Post } from "@/types"
import "@/app/loaderCat.css"

const PostPage = ({ params }: { params: { id: string } }) => {
    const id = params.id
    const router = useRouter()
    const path = usePathname()

    const { isLoading, isError, data } = useQuery<Post>({
        queryKey: ["post", id],
        queryFn: async () => {
            const res = await fetch(`/api/post?type=one&id=${id}`)
            const json = await res.json()
            // error
            if (!res.ok) throw new Error("沒有這篇公告")
            return json
        },
    })

    // itle: 一組字串，分享訊息的標題
    // text: 一組字串，分享訊息的描述
    // url: 一組字串，分享訊息要帶上的連結
    const Share = (title: string, text: string, url: string) => {
        if (navigator.share) {
            navigator
                .share({
                    title: title,
                    text: text,
                    url: url,
                })
                .then(() => {
                    console.log("Thanks for sharing!")
                })
                .catch(console.error)
        } else {
            console.log("Web Share API not supported in your browser")
        }
    }

    return (
        <>
            {data && (
                <div className='flex w-full items-center rounded-2xl px-4 pb-4 md:bg-main-color'>
                    <div className='flex flex-col items-center justify-center'>
                        <div className='sticky left-0 top-0 w-full border-b bg-slate-50 py-3 text-center font-bold md:bg-main-color md:text-xl'>
                            {data.title}
                        </div>
                        <div className='w-full pt-2 md:px-24'>
                            <div className='flex w-full items-center justify-between'>
                                <div className='flex items-center'>
                                    <div className='mr-1'>{data.unit}</div>
                                    <div className='ml-1 text-blue-500'>
                                        <a href={`mailto:${data.publisher.email}`}>
                                            {data.publisher.name}
                                        </a>
                                    </div>
                                </div>
                                <div className=''>{data.category}</div>
                            </div>
                            <div className='flex w-full items-center justify-between'>
                                <div className='flex items-center'>
                                    <IconCalendarTime size={20} />
                                    {data.date}
                                </div>
                                <div className='flex items-center'>
                                    <IconCalendarOff size={20} />
                                    {data.deadline}
                                </div>
                            </div>
                        </div>
                        <div className='flex w-full items-center justify-center md:px-24'>
                            <div className='whitespace-pre-line break-all'>{data?.content}</div>
                        </div>
                        <div className='mt-1 w-full rounded-md border-2 border-dashed md:px-24'>
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
                        <div className='mt-2 w-full border-t pt-2'>
                            <div className='flex items-center justify-end'>
                                <div
                                    className='flex items-center rounded-md bg-main-color px-1'
                                    onClick={() => {
                                        Share(data.title, data.content, path)
                                    }}
                                >
                                    <IconShare2 />
                                    分享
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {isLoading && (
                <div className='absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2'>
                    <div className='flex h-full w-full items-center justify-center'>
                        <div className='cat'>
                            <div className='cat__body'></div>
                            <div className='cat__body'></div>
                            <div className='cat__tail'></div>
                            <div className='cat__head'></div>
                        </div>
                    </div>
                </div>
            )}
            {isError && (
                <div className='flex h-full w-full items-center justify-center'>
                    <div className='text-red-500'>沒有這篇公告</div>
                </div>
            )}
        </>
    )
}

export default PostPage
