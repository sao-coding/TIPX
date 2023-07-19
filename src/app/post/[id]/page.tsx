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

const PostPage = ({ params }: { params: { id: string } }) => {
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

    return (
        <>
            <div className='flex w-full items-center rounded-2xl p-4 md:bg-main-color'>
                <div className='flex flex-col items-center justify-center'>
                    <div className='sticky left-0 top-0 w-full bg-slate-50 py-3 text-center text-xl md:bg-main-color'>
                        {data?.title}
                    </div>
                    <div className='flex items-center justify-center md:px-24'>
                        <div className='whitespace-pre-line'>{data?.content}</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PostPage
