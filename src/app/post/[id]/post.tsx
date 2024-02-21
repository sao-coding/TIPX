"use client"

import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import toast from "react-hot-toast"

import Close from "@/components/Close"
import { Post as PostType } from "@/types"
import {
  IconCalendarOff,
  IconCalendarTime,
  IconDownload,
  IconLink,
  IconPaperclip,
  IconShare
} from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"

const Post = ({ params }: { params: { id: string } }) => {
  const id = params.id
  const router = useRouter()
  const path = usePathname()

  const { isLoading, isError, data } = useQuery<PostType>({
    queryKey: ["post", id],
    queryFn: async () => {
      const res = await fetch(`/api/post?type=one&id=${id}`)
      const json = await res.json()
      // error
      if (!res.ok) throw new Error("沒有這篇公告")
      return json
    }
  })

  // itle: 一組字串，分享訊息的標題
  // text: 一組字串，分享訊息的描述
  // url: 一組字串，分享訊息要帶上的連結
  const Share = (title: string, text: string, url: string) => {
    if (navigator.share) {
      navigator
        .share({
          title: title,
          text: title + "\n",
          url: url
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
    <>
      {data && (
        <motion.div
          className='flex w-full items-center rounded-2xl px-4 pb-4 md:bg-card-background'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className='flex w-full flex-col items-center justify-center'>
            <div className='sticky left-0 top-0 flex w-full items-center justify-between border-b bg-background py-3 md:top-[68px] md:bg-card-background md:text-xl'>
              <Close className='static p-0' />
              <div className='line-clamp-1 w-full pr-4 text-center font-bold'>{data.title}</div>
              <button
                className='flex items-center rounded-md px-1'
                onClick={() => {
                  Share(data.title, data.content, path)
                }}
              >
                <IconShare />
                {/* 分享 */}
              </button>
            </div>
            <div className='flex w-full flex-col space-y-1 pt-2 md:px-24'>
              <div className='w-full pr-4 text-lg font-bold md:hidden'>{data.title}</div>
              <div className='flex w-full items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div>{data.unit}</div>
                  <div className='text-blue-500'>
                    <a href={`mailto:${data.publisher.email}`}>{data.publisher.name}</a>
                  </div>
                </div>
                <div>{data.category}</div>
              </div>
              <div className='flex w-full items-center justify-between'>
                <div className='flex items-center gap-1'>
                  <IconCalendarTime size={20} />
                  <div>{data.date}</div>
                </div>
                <div className='flex items-center gap-1'>
                  <IconCalendarOff size={20} />
                  <div>{data.deadline}</div>
                </div>
              </div>
            </div>
            <div className='flex w-full items-center justify-center md:px-24'>
              <div className='whitespace-pre-line break-all'>{data.content}</div>
            </div>
            <div className='mt-1 w-full rounded-md border-2 border-dashed p-1 md:px-24'>
              {data.file.length > 0 ? (
                <>
                  {data.file.map((item) => (
                    <div key={item.title} className='flex items-center'>
                      <IconPaperclip size={20} />
                      <div className='pl-1'>{item.title}</div>
                      <a href={item.link} target='_blank' rel='noreferrer' className='p-1'>
                        <IconDownload className='rounded-md bg-main-color-1 p-1' />
                      </a>
                    </div>
                  ))}
                </>
              ) : (
                <div className='flex items-center'>
                  <IconPaperclip size={20} />
                  <div className='pl-1 text-gray-500'>沒有附件</div>
                </div>
              )}
              {data.link ? (
                <div className='flex items-center'>
                  <IconLink size={20} />
                  <a
                    href={data.link}
                    target='_blank'
                    rel='noreferrer'
                    className='pr-1 text-blue-500'
                  >
                    點及此處前往
                  </a>
                </div>
              ) : (
                <div className='flex items-center'>
                  <IconLink size={20} />
                  <div className='pl-1 text-gray-500'>沒有連結</div>
                </div>
              )}
            </div>
            {/* <div className='mt-2 w-full border-t pt-2'>
              <div className='flex items-center justify-end'>
                <button
                  className='flex items-center rounded-md bg-main-color-1 px-1'
                  onClick={() => {
                    Share(data.title, data.content, path)
                  }}
                >
                  <IconShare />
                  分享
                </button>
              </div>
            </div> */}
          </div>
        </motion.div>
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

export default Post
