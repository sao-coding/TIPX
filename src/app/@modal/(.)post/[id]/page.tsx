'use client'

import { useCallback } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

import api from '@/lib/api'
import { Post } from '@/types'
import * as Dialog from '@radix-ui/react-dialog'
import {
  IconArrowLeft,
  IconCalendarOff,
  IconCalendarTime,
  IconDownload,
  IconExternalLink,
  IconLink,
  IconPaperclip,
  IconShare
} from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'

const PostModal = ({ params }: { params: { id: string } }) => {
  const id = params.id
  console.log('post id:', id)
  const router = useRouter()
  const path = usePathname()

  const { isLoading, isError, data } = useQuery<Post>({
    queryKey: ['post', id],
    queryFn: async () => {
      const { data } = await api.get(`/post?type=one&id=${id}`)
      return data
    }
  })

  const dismiss = useCallback(() => {
    router.back()
  }, [router])

  const Share = (title: string, text: string, url: string) => {
    if (navigator.share) {
      navigator
        .share({
          title: title,
          text: title + '\n',
          url: url
        })
        .then(() => {
          toast.success('分享成功')
        })
        .catch((error) => {
          toast.error('分享失敗')
          console.log(error)
        })
    } else {
      toast.error('Web Share API 不支援')
    }
  }

  return (
    <>
      {data && (
        <Dialog.Root defaultOpen onOpenChange={(open) => !open && dismiss()}>
          <Dialog.Portal>
            <Dialog.Overlay className='data-[state=open]:animate-overlayShow fixed inset-0 z-10 bg-[rgba(0,0,0,.5)] backdrop-blur-sm' />
            <Dialog.Content asChild>
              <motion.div
                className='data-[state=open]:animate-contentShow md:bg-card-background fixed left-1/2 top-1/2 z-10 h-full w-full -translate-x-1/2 -translate-y-1/2 overflow-y-auto bg-background px-4 pb-4 shadow-lg focus:outline-none md:max-h-[85vh] md:w-[95vw] md:max-w-[800px] md:overflow-hidden md:rounded-2xl md:p-4'
                initial={{ opacity: 0, scale: 0.9, y: '-50%', x: '-50%' }}
                animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
              >
                <div className='md:bg-card-background sticky left-0 top-0 mb-2 flex w-full items-center justify-between border-b bg-background py-3 md:static md:border-b-0'>
                  <Dialog.Title asChild>
                    <div className='flex w-full items-center justify-between'>
                      <div className='flex items-center gap-1'>
                        <Dialog.Close className='self-start outline-none'>
                          <IconArrowLeft size={26} />
                        </Dialog.Close>
                        <div className='line-clamp-1 pr-4 text-center font-bold md:text-xl'>
                          {data?.title}
                        </div>
                      </div>
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
                  </Dialog.Title>
                </div>

                <div className='flex flex-col space-y-1'>
                  <div className='w-full pr-4 text-lg font-bold md:hidden'>{data.title}</div>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <div>{data.unit}</div>
                      <div className='text-blue-500'>
                        <a href={`mailto:${data.publisher.email}`}>{data.publisher.name}</a>
                      </div>
                    </div>
                    <div className='md:bg-main-color-1 rounded-md md:px-1'>{data.category}</div>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-1'>
                      <IconCalendarTime size={20} />
                      <div>{data.date}</div>
                    </div>
                    <div className='flex items-center gap-1'>
                      <IconCalendarOff size={20} />
                      <div>{data.deadline}</div>
                    </div>
                    <Link href={`/post/${id}`} target='_parent' className='hidden md:block'>
                      <IconExternalLink />
                    </Link>
                  </div>
                </div>
                <div className='w-full rounded-xl md:h-[50vh] md:overflow-y-auto md:border'>
                  <div className='whitespace-pre-line break-words md:p-1'>{data.content}</div>
                </div>
                <div className='mt-1 rounded-xl border-2 border-dashed p-1 md:h-[10vh] md:overflow-y-auto md:border md:border-solid'>
                  {data.file.length > 0 ? (
                    <>
                      {data.file.map((item) => (
                        <div key={item.title} className='flex items-center'>
                          <IconPaperclip size={20} />
                          <div className='pl-1'>{item.title}</div>
                          <a href={item.link} target='_blank' rel='noreferrer' className='p-1'>
                            <IconDownload className='bg-main-color-1 rounded-md p-1' />
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
                        className='pl-1 text-blue-500'
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
                      <IconShare2 />
                      分享
                    </button>
                  </div>
                </div> */}

                {isLoading && (
                  <div className='flex h-full items-center justify-center'>
                    <div className='cat'>
                      <div className='cat__body'></div>
                      <div className='cat__body'></div>
                      <div className='cat__tail'></div>
                      <div className='cat__head'></div>
                    </div>
                  </div>
                )}
                {isError && (
                  <div className='flex h-full items-center justify-center'>
                    <div className='text-red-500'>沒有這篇公告</div>
                  </div>
                )}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </>
  )
}

export default PostModal
